// BusFaceBlur.swift
// Selektives Face-Tracking + Blur für Zeitraffer-Videos
// Nutzt Apple Vision Framework (DNN-basiert, M-Chip-beschleunigt)
//
// Verwendung (Terminal):
//   swift BusFaceBlur.swift <input.mp4> <output.mp4>
//
// Beispiel:
//   swift BusFaceBlur.swift ~/Desktop/zeitraffer.mp4 ~/Desktop/zeitraffer-blurred.mp4
//
// Funktioniert mit Auflösungen bis 4K. Optimal für Apple Silicon (M1/M2/M3/M4).

import Foundation
import AVFoundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import CoreVideo

// MARK: - Konfiguration

let BLUR_RADIUS: Double = 28.0          // Wie stark der Blur ist (höher = stärker)
let BOX_EXPAND: CGFloat = 1.20          // Wie viel größer als die erkannte Box (1.0 = exakt, 1.2 = eng aber sicher)
let TEMPORAL_WINDOW: Int = 8            // Wie viele Frames vor/nach für Smoothing übernommen werden
let MIN_FACE_CONFIDENCE: Float = 0.5    // Mindest-Konfidenz fürs Vision Modell (0..1)

// MARK: - Argumente prüfen

guard CommandLine.arguments.count >= 3 else {
    print("Verwendung: swift BusFaceBlur.swift <input.mp4> <output.mp4>")
    exit(1)
}
let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

// Output-File löschen falls existiert
try? FileManager.default.removeItem(at: outputURL)

print("🎬 Input:  \(inputURL.lastPathComponent)")
print("📤 Output: \(outputURL.lastPathComponent)")
print("⚙️  Blur Radius: \(BLUR_RADIUS) · Box Expand: \(BOX_EXPAND)x · Temporal Window: ±\(TEMPORAL_WINDOW) frames")
print("")

// MARK: - Video laden

let asset = AVAsset(url: inputURL)
let semaphore = DispatchSemaphore(value: 0)
var videoTrack: AVAssetTrack?

asset.loadValuesAsynchronously(forKeys: ["tracks"]) {
    videoTrack = asset.tracks(withMediaType: .video).first
    semaphore.signal()
}
semaphore.wait()

guard let track = videoTrack else {
    print("❌ Keine Video-Spur gefunden")
    exit(1)
}

let naturalSize = track.naturalSize
let nominalFrameRate = track.nominalFrameRate
let transform = track.preferredTransform

print("📐 Video: \(Int(naturalSize.width))×\(Int(naturalSize.height)) @ \(nominalFrameRate)fps")
print("")

// MARK: - Reader Setup

let reader = try AVAssetReader(asset: asset)
let readerSettings: [String: Any] = [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA
]
let readerOutput = AVAssetReaderTrackOutput(track: track, outputSettings: readerSettings)
reader.add(readerOutput)
reader.startReading()

// MARK: - Pass 1: Face Detection alle Frames

print("🔍 Pass 1/2: Gesichtserkennung...")

struct FrameBoxes {
    let presentationTime: CMTime
    var boxes: [CGRect]  // Normalisiert (Vision-Format, 0..1)
}

var frames: [FrameBoxes] = []
var frameIndex = 0
let startTime = Date()

while reader.status == .reading {
    guard let sampleBuffer = readerOutput.copyNextSampleBuffer(),
          let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { break }

    let time = CMSampleBufferGetPresentationTimeStamp(sampleBuffer)
    var detectedBoxes: [CGRect] = []

    let request = VNDetectFaceRectanglesRequest { request, _ in
        if let observations = request.results as? [VNFaceObservation] {
            for obs in observations where obs.confidence >= MIN_FACE_CONFIDENCE {
                detectedBoxes.append(obs.boundingBox)
            }
        }
    }
    request.revision = VNDetectFaceRectanglesRequestRevision3

    let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up, options: [:])
    try? handler.perform([request])

    frames.append(FrameBoxes(presentationTime: time, boxes: detectedBoxes))
    frameIndex += 1

    if frameIndex % 30 == 0 {
        print("  Frame \(frameIndex): \(detectedBoxes.count) Gesichter")
    }
}

let detectionTime = Date().timeIntervalSince(startTime)
let totalDetected = frames.reduce(0) { $0 + $1.boxes.count }
print("✓ Detection: \(frameIndex) Frames, \(totalDetected) Gesichter gesamt, \(String(format: "%.1f", detectionTime))s\n")

// MARK: - Pass 2: Temporal Smoothing + Render

print("🎨 Pass 2/2: Selektiver Blur + Encoding...")

// Reader neu öffnen für 2. Durchlauf
let reader2 = try AVAssetReader(asset: asset)
let readerOutput2 = AVAssetReaderTrackOutput(track: track, outputSettings: readerSettings)
reader2.add(readerOutput2)
reader2.startReading()

// Writer Setup
let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let writerSettings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: naturalSize.width,
    AVVideoHeightKey: naturalSize.height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 4_000_000,   // 4 Mbps — gute Web-Qualität
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: 60
    ]
]
let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: writerSettings)
writerInput.expectsMediaDataInRealTime = false
writerInput.transform = transform

let pixelBufferAdaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: writerInput,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: naturalSize.width,
        kCVPixelBufferHeightKey as String: naturalSize.height
    ]
)
writer.add(writerInput)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let ciContext = CIContext()
let blurFilter = CIFilter.gaussianBlur()
blurFilter.radius = Float(BLUR_RADIUS)

frameIndex = 0
let renderStart = Date()

while reader2.status == .reading {
    guard let sampleBuffer = readerOutput2.copyNextSampleBuffer(),
          let inputPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { break }

    let time = CMSampleBufferGetPresentationTimeStamp(sampleBuffer)

    // Temporal Smoothing: sammle Boxen aus Window
    var allBoxes: [CGRect] = []
    let start = max(0, frameIndex - TEMPORAL_WINDOW)
    let end = min(frames.count - 1, frameIndex + TEMPORAL_WINDOW)
    for j in start...end {
        allBoxes.append(contentsOf: frames[j].boxes)
    }

    // CIImage erstellen
    let ciImage = CIImage(cvPixelBuffer: inputPixelBuffer)
    let imageExtent = ciImage.extent

    var resultImage = ciImage

    // Für jede Face-Box: Region cropen, blurren, zurück composieren
    for normalizedBox in allBoxes {
        // Vision liefert normalisierte Koordinaten (0..1) im Vision-Koordinatensystem
        // Vision Y ist BOTTOM-UP, CIImage Y ist auch BOTTOM-UP, also direkt nutzbar
        let pixelBox = CGRect(
            x: normalizedBox.origin.x * imageExtent.width,
            y: normalizedBox.origin.y * imageExtent.height,
            width: normalizedBox.size.width * imageExtent.width,
            height: normalizedBox.size.height * imageExtent.height
        )

        // Box vergrößern um Haare/Hals zu erfassen
        let expandedBox = CGRect(
            x: pixelBox.midX - pixelBox.width * BOX_EXPAND / 2,
            y: pixelBox.midY - pixelBox.height * BOX_EXPAND / 2,
            width: pixelBox.width * BOX_EXPAND,
            height: pixelBox.height * BOX_EXPAND
        ).intersection(imageExtent)

        if expandedBox.isEmpty { continue }

        // Region croppen
        let cropped = ciImage.cropped(to: expandedBox)

        // Blur anwenden
        blurFilter.inputImage = cropped.clampedToExtent()  // clamp = ohne Border-Artefakte
        guard let blurredFull = blurFilter.outputImage else { continue }
        let blurred = blurredFull.cropped(to: expandedBox)

        // Über Original composieren
        resultImage = blurred.composited(over: resultImage)
    }

    // resultImage zu PixelBuffer rendern und in Writer schreiben
    var outputPixelBuffer: CVPixelBuffer?
    let attrs: CFDictionary = [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferIOSurfacePropertiesKey as String: [:]
    ] as CFDictionary

    CVPixelBufferCreate(
        kCFAllocatorDefault,
        Int(naturalSize.width),
        Int(naturalSize.height),
        kCVPixelFormatType_32BGRA,
        attrs,
        &outputPixelBuffer
    )

    if let outPB = outputPixelBuffer {
        ciContext.render(resultImage, to: outPB)
        while !writerInput.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.001) }
        pixelBufferAdaptor.append(outPB, withPresentationTime: time)
    }

    frameIndex += 1
    if frameIndex % 30 == 0 {
        print("  Frame \(frameIndex)/\(frames.count) gerendert")
    }
}

// Finalize
writerInput.markAsFinished()
let writerSemaphore = DispatchSemaphore(value: 0)
writer.finishWriting { writerSemaphore.signal() }
writerSemaphore.wait()

let renderTime = Date().timeIntervalSince(renderStart)
print("✓ Render: \(frameIndex) Frames, \(String(format: "%.1f", renderTime))s\n")

// Stats
if let attrs = try? FileManager.default.attributesOfItem(atPath: outputURL.path),
   let size = attrs[.size] as? NSNumber {
    let mb = Double(truncating: size) / 1024.0 / 1024.0
    print("📊 Fertig! Output: \(String(format: "%.1f", mb)) MB")
    print("📂 Gespeichert unter: \(outputURL.path)")
}
