// フォルダの中のPNG/JPGを全部読んで、1つのMarkdownにまとめて標準出力へ吐く。
// macOS標準の文字認識(Vision)を使う。ネット接続なし。
// Visionが読めなかったページ(縦書きなど)は、Tesseract(jpn_vert)で読み直す。
//
// 使い方:  ocr-folder <フォルダのパス>

import AppKit
import Vision

// ============ Tesseract フォールバック(縦書き用) ============
// Visionは日本語の縦書き(1文字ずつ正立したまま縦に並ぶ組み方)を認識できない。
// そのページだけ、Homebrewで入れたTesseractのjpn_vertモデルに読み直させる。

func findTesseractBinary() -> String? {
    let candidates = ["/opt/homebrew/bin/tesseract", "/usr/local/bin/tesseract", "/usr/bin/tesseract"]
    for c in candidates where FileManager.default.isExecutableFile(atPath: c) { return c }
    return nil
}

func runTesseractVertical(imagePath: String) -> String? {
    guard let bin = findTesseractBinary() else { return nil }
    let proc = Process()
    proc.executableURL = URL(fileURLWithPath: bin)
    proc.arguments = [imagePath, "-", "-l", "jpn_vert", "--psm", "5"]
    let outPipe = Pipe()
    proc.standardOutput = outPipe
    proc.standardError = Pipe()  // tesseractの進捗ログは捨てる
    do {
        try proc.run()
        let data = outPipe.fileHandleForReading.readDataToEndOfFile()
        proc.waitUntilExit()
        guard proc.terminationStatus == 0 else { return nil }
        return String(data: data, encoding: .utf8)
    } catch {
        return nil
    }
}

// Tesseractは日本語でも単語間に半角スペースを挟んでくることが多いので、
// 「日本語の文字」どうしの間にあるスペースだけを取り除く。
// (英単語・数字の前後のスペースはそのまま残す)
func isJapaneseChar(_ c: Character) -> Bool {
    guard let u = c.unicodeScalars.first else { return false }
    switch u.value {
    case 0x3000...0x303F, 0x3040...0x30FF, 0x3400...0x9FFF, 0xFF00...0xFFEF:
        return true
    default:
        return false
    }
}

func cleanJapaneseSpacing(_ s: String) -> String {
    let chars = Array(s)
    var out = ""
    out.reserveCapacity(chars.count)
    var i = 0
    while i < chars.count {
        let c = chars[i]
        if c == " ", i > 0, i + 1 < chars.count,
           isJapaneseChar(chars[i - 1]), isJapaneseChar(chars[i + 1]) {
            i += 1
            continue
        }
        out.append(c)
        i += 1
    }
    return out
}

// Tesseractの生テキストを、段落ごとの文字列の配列にする
func tesseractTextToParagraphs(_ raw: String) -> [String] {
    return raw.components(separatedBy: "\n\n").compactMap { block in
        let joined = block.components(separatedBy: "\n").joined(separator: "")
        let cleaned = cleanJapaneseSpacing(joined).trimmingCharacters(in: .whitespacesAndNewlines)
        return cleaned.isEmpty ? nil : cleaned
    }
}

// ============ ユーティリティ ============

func eprint(_ s: String) {
    FileHandle.standardError.write((s + "\n").data(using: .utf8)!)
}

// "page2.png" < "page10.png" になるよう、数字のかたまりは数値として比べる
func naturalLess(_ a: String, _ b: String) -> Bool {
    func chunks(_ s: String) -> [String] {
        var out: [String] = []
        var cur = ""
        var curIsDigit: Bool? = nil
        for ch in s {
            let isDigit = ch.isNumber
            if curIsDigit == nil || curIsDigit == isDigit {
                cur.append(ch)
            } else {
                out.append(cur)
                cur = String(ch)
            }
            curIsDigit = isDigit
        }
        if !cur.isEmpty { out.append(cur) }
        return out
    }
    let ca = chunks(a), cb = chunks(b)
    for i in 0..<min(ca.count, cb.count) {
        let x = ca[i], y = cb[i]
        if x == y { continue }
        if let nx = Int(x), let ny = Int(y) { return nx < ny }
        return x < y
    }
    return ca.count < cb.count
}

func hasCJK(_ s: String) -> Bool {
    for u in s.unicodeScalars {
        switch u.value {
        case 0x3040...0x30FF, 0x3400...0x9FFF, 0xF900...0xFAFF, 0xFF66...0xFF9F:
            return true
        default: continue
        }
    }
    return false
}

func endsSentence(_ t: String) -> Bool {
    guard let last = t.unicodeScalars.last else { return true }
    return "。．.!?!？：:；;」』】）)".unicodeScalars.contains(last)
}

// ページ番号だけの行(「1」「- 3 -」「12/40」など)
func isPageNumberOnly(_ t: String) -> Bool {
    let s = t.trimmingCharacters(in: .whitespaces)
    if s.isEmpty { return false }
    let allowed = CharacterSet(charactersIn: "0123456789-–—[]() 　/")
    if s.unicodeScalars.allSatisfy({ allowed.contains($0) }) &&
        s.contains(where: { $0.isNumber }) {
        return true
    }
    return false
}

// 数字だけを "#" に置き換え、空白も削った形(繰り返し検出のキー用)。
// OCRは同じ見た目の行でも、間隔の読み取りが1文字ずれることがあるため、
// 空白の有無では別物と判定しないようにする。
func digitsMasked(_ t: String) -> String {
    var out = ""
    for ch in t {
        if ch.isWhitespace { continue }
        out.append(ch.isNumber ? "#" : ch)
    }
    return out
}

let bulletMarks: Set<Character> = ["・", "•", "◦", "▪", "▫", "‣", "·", "◆", "■", "□", "●", "○", "☆", "★"]
let circled = Array("①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳")
let numTerminators = CharacterSet(charactersIn: ".)、．）")

func matchBullet(_ t: String) -> (marker: String, rest: String)? {
    guard let first = t.first else { return nil }
    if bulletMarks.contains(first) {
        let rest = t.dropFirst().trimmingCharacters(in: .whitespaces)
        return rest.isEmpty ? nil : ("-", rest)
    }
    if first == "-" || first == "–" || first == "—" || first == "*" {
        let rest = t.dropFirst().trimmingCharacters(in: .whitespaces)
        return rest.isEmpty ? nil : ("-", rest)
    }
    if let idx = circled.firstIndex(of: first) {
        let rest = t.dropFirst().trimmingCharacters(in: CharacterSet(charactersIn: " .、)"))
        return rest.isEmpty ? nil : ("\(idx + 1).", String(rest))
    }
    // "1. " "1) " "1、" のような番号付き箇条書き。
    // ただし "2.1" や "2. 1"(見出し番号)はここでは扱わない。
    var digits = ""
    var i = t.startIndex
    while i < t.endIndex, t[i].isNumber { digits.append(t[i]); i = t.index(after: i) }
    if !digits.isEmpty, digits.count <= 3, i < t.endIndex,
       t[i].unicodeScalars.allSatisfy({ numTerminators.contains($0) }) {
        let afterRaw = t[t.index(after: i)...]
        let peeked = afterRaw.drop(while: { $0 == " " || $0 == "　" })
        if let nextChar = peeked.first, nextChar.isNumber {
            return nil   // "2.1 〜" のような見出し番号なので、箇条書きとはみなさない
        }
        let rest = afterRaw.trimmingCharacters(in: .whitespaces)
        if !rest.isEmpty { return ("\(digits).", rest) }
    }
    return nil
}

// ============ 1行ぶんのデータ ============

struct Line {
    var text: String
    var top: CGFloat     // 画像の上からの距離(ピクセル)
    var height: CGFloat  // 文字の高さ(ピクセル)
    var left: CGFloat
    var right: CGFloat
}

func resizeCGImage(_ image: CGImage, width: Int, height: Int) -> CGImage? {
    guard width > 0, height > 0 else { return nil }
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    guard let ctx = CGContext(
        data: nil, width: width, height: height,
        bitsPerComponent: 8, bytesPerRow: 0, space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    ) else { return nil }
    ctx.interpolationQuality = .high
    ctx.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
    return ctx.makeImage()
}

func runVision(_ cg: CGImage) -> [VNRecognizedTextObservation] {
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = true
    req.recognitionLanguages = ["ja-JP", "en-US"]
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    do { try handler.perform([req]) } catch {
        return []
    }
    return req.results ?? []
}

// 画像を、そのまま読める1枚として扱ってよい大きさか
let maxTileHeight: CGFloat = 4000
let tileOverlap: CGFloat = 150

// すごく縦長の画像(スクロール画面をつなげたスクリーンショット等)は、
// 幅はそのまま・高さだけを分割して1枚ずつ読む。
// (幅も一緒に縮めると文字そのものが小さくなり、読めなくなってしまう)
func recognizeLines(imagePath: String) -> (lines: [Line], imageHeight: CGFloat, fallbackParagraphs: [String]?)? {
    guard let img = NSImage(contentsOfFile: imagePath),
          let full = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return nil
    }
    let fullW = CGFloat(full.width), fullH = CGFloat(full.height)
    let name = (imagePath as NSString).lastPathComponent

    if fullH <= maxTileHeight {
        let results = runVision(full)
        if results.isEmpty {
            if let raw = runTesseractVertical(imagePath: imagePath) {
                let paras = tesseractTextToParagraphs(raw)
                if !paras.isEmpty {
                    eprint("  縦書きとして読み直しました(Tesseract): \(name)")
                    return (lines: [], imageHeight: fullH, fallbackParagraphs: paras)
                }
            }
            eprint("  !! 文字が読み取れませんでした: \(name)")
        }
        return (lines: toLines(results, w: fullW, h: fullH, topOffset: 0), imageHeight: fullH, fallbackParagraphs: nil)
    }

    eprint("  縦に長い画像なので、分けて読みます…")
    var lines: [Line] = []
    var y: CGFloat = 0
    var tileNo = 0
    while y < fullH {
        tileNo += 1
        let top = max(0, y - (tileNo == 1 ? 0 : tileOverlap))
        let bottom = min(fullH, top + maxTileHeight)
        // CGImageの原点は左下。上からtop〜bottomの帯を切り出す。
        let cropRect = CGRect(x: 0, y: fullH - bottom, width: fullW, height: bottom - top)
        guard let tile = full.cropping(to: cropRect) else { y += maxTileHeight; continue }
        let results = runVision(tile)
        lines.append(contentsOf: toLines(results, w: CGFloat(tile.width), h: CGFloat(tile.height), topOffset: top))
        y = bottom
        if bottom >= fullH { break }
    }
    if lines.isEmpty { eprint("  !! 文字が読み取れませんでした: \(name)") }

    // タイルの継ぎ目で同じ行が2回読まれることがあるので、ほぼ同じ位置・同じ文字は1つにまとめる
    lines.sort { $0.top < $1.top }
    var deduped: [Line] = []
    for l in lines {
        if let last = deduped.last, last.text == l.text, abs(last.top - l.top) < max(last.height, l.height) {
            continue
        }
        deduped.append(l)
    }
    return (lines: deduped, imageHeight: fullH, fallbackParagraphs: nil)
}

func toLines(_ results: [VNRecognizedTextObservation], w: CGFloat, h: CGFloat, topOffset: CGFloat) -> [Line] {
    var lines: [Line] = []
    for obs in results {
        guard let top = obs.topCandidates(1).first else { continue }
        let text = top.string.trimmingCharacters(in: .whitespaces)
        if text.isEmpty { continue }
        let box = obs.boundingBox   // 正規化座標、原点は左下
        lines.append(Line(
            text: text,
            top: topOffset + (1 - box.origin.y - box.height) * h,
            height: box.height * h,
            left: box.origin.x * w,
            right: (box.origin.x + box.width) * w
        ))
    }
    lines.sort { $0.top < $1.top }
    return lines
}

// ============ ヘッダー・フッターの検出 ============

func zone(_ l: Line, imageHeight: CGFloat) -> String {
    if l.top < imageHeight * 0.12 { return "top" }
    if l.top + l.height > imageHeight * 0.88 { return "bottom" }
    return "mid"
}

// 半分以上の画像で、同じ位置に同じ文字が出てくるものはヘッダー/フッターとみなす
func findRepeated(_ perImage: [(lines: [Line], imageHeight: CGFloat, fallbackParagraphs: [String]?)]) -> Set<String> {
    guard perImage.count >= 3 else { return [] }
    var tally: [String: Int] = [:]
    for img in perImage {
        var seen = Set<String>()
        for l in img.lines {
            let z = zone(l, imageHeight: img.imageHeight)
            if z == "mid" { continue }
            let key = z + " " + digitsMasked(l.text)
            seen.insert(key)
        }
        for k in seen { tally[k, default: 0] += 1 }
    }
    let need = max(2, Int(ceil(Double(perImage.count) * 0.5)))
    return Set(tally.filter { $0.value >= need }.map { $0.key })
}

func cleanLines(_ lines: [Line], imageHeight: CGFloat, junk: Set<String>) -> [Line] {
    var out = lines.filter { l in
        let z = zone(l, imageHeight: imageHeight)
        if z == "mid" { return true }
        if isPageNumberOnly(l.text) { return false }
        return !junk.contains(z + " " + digitsMasked(l.text))
    }
    // ページ番号は、余白に押し出されて "mid" 判定になっていることがあるので、
    // ゾーンに関係なく、その画像でいちばん上/いちばん下の行はあらためて見る。
    if let f = out.first, isPageNumberOnly(f.text) { out.removeFirst() }
    if let l = out.last, isPageNumberOnly(l.text) { out.removeLast() }
    return out
}

// ============ 行 → かたまり(見出し/箇条書き/段落) ============

enum ChunkType { case heading1, heading2, bullet, para }
struct Chunk { var type: ChunkType; var text: String }

func joinText(_ a: String, _ b: String) -> String {
    if a.isEmpty { return b }
    if a.hasSuffix("-") { return a + b }
    let aLast = a.last!, bFirst = b.first!
    let aAlnum = aLast.isLetter || aLast.isNumber
    let bAlnum = bFirst.isLetter || bFirst.isNumber
    if aAlnum && bAlnum && (aLast.isASCII || bFirst.isASCII) { return a + " " + b }
    return a + b
}

func imageToChunks(_ lines: [Line], bodyHeight: CGFloat) -> [Chunk] {
    guard !lines.isEmpty else { return [] }

    var gaps: [CGFloat] = []
    for i in 1..<lines.count {
        let g = lines[i].top - (lines[i-1].top + lines[i-1].height)
        if g > 0.5 { gaps.append(g) }
    }
    gaps.sort()
    let leading = gaps.isEmpty ? bodyHeight * 0.6 : gaps[gaps.count / 2]

    var out: [Chunk] = []
    var para = ""

    func flush() {
        let t = para.trimmingCharacters(in: .whitespaces)
        if !t.isEmpty { out.append(Chunk(type: .para, text: t)) }
        para = ""
    }

    for (i, l) in lines.enumerated() {
        let t = l.text

        if l.height > bodyHeight * 1.55, t.count <= 60 {
            flush(); out.append(Chunk(type: .heading1, text: t)); continue
        }
        if l.height > bodyHeight * 1.18, t.count <= 80 {
            flush(); out.append(Chunk(type: .heading2, text: t)); continue
        }
        if let b = matchBullet(t) {
            flush(); out.append(Chunk(type: .bullet, text: b.marker + " " + b.rest)); continue
        }

        var gapBig = false
        if i > 0 {
            let g = l.top - (lines[i-1].top + lines[i-1].height)
            gapBig = g > leading * 1.6
        }
        let prevEnded = i == 0 || endsSentence(lines[i-1].text)

        if !para.isEmpty, !gapBig, !prevEnded {
            para = joinText(para, t)
        } else {
            flush()
            para = t
        }
    }
    flush()
    return out
}

// 見出し→空行、箇条書きの連続→空行を挟まず1行ずつ、段落→空行区切り
func chunksToText(_ chunks: [Chunk]) -> String {
    var lines: [String] = []
    var prevType: ChunkType? = nil
    for c in chunks {
        switch c.type {
        case .heading1, .heading2:
            if !lines.isEmpty { lines.append("") }
            lines.append((c.type == .heading1 ? "# " : "## ") + c.text)
            lines.append("")
        case .bullet:
            if prevType != .bullet, !lines.isEmpty { lines.append("") }
            lines.append(c.text)
        case .para:
            if !lines.isEmpty, prevType != .heading1, prevType != .heading2 { lines.append("") }
            lines.append(c.text)
        }
        prevType = c.type
    }
    return lines.joined(separator: "\n")
}

// ============ メイン ============

let args = CommandLine.arguments
guard args.count > 1 else {
    eprint("使い方: ocr-folder <フォルダのパス>")
    exit(1)
}
let folder = args[1]
let fm = FileManager.default

guard let items = try? fm.contentsOfDirectory(atPath: folder) else {
    eprint("フォルダを開けませんでした: \(folder)")
    exit(1)
}

let exts: Set<String> = ["png", "jpg", "jpeg"]
let images = items
    .filter { exts.contains(($0 as NSString).pathExtension.lowercased()) }
    .sorted { naturalLess($0, $1) }

guard !images.isEmpty else {
    eprint("このフォルダにPNG/JPG画像が見つかりませんでした。")
    exit(1)
}

eprint("\(images.count)枚の画像を読んでいます…")

var perImage: [(lines: [Line], imageHeight: CGFloat, fallbackParagraphs: [String]?)] = []
for name in images {
    let path = (folder as NSString).appendingPathComponent(name)
    eprint("  読み取り中: \(name)")
    if let result = recognizeLines(imagePath: path) {
        perImage.append(result)
    } else {
        eprint("  !! スキップ: \(name)")
    }
}

let junk = findRepeated(perImage)

// 本文の文字高さ = 全画像をならして一番多い高さ
var tally: [Int: Int] = [:]
for img in perImage {
    for l in img.lines {
        let k = Int((l.height * 2).rounded())
        tally[k, default: 0] += l.text.count
    }
}
let bodyHeight: CGFloat = {
    guard let best = tally.max(by: { $0.value < $1.value }) else { return 14 }
    return CGFloat(best.key) / 2
}()

var chunks: [Chunk] = []
for img in perImage {
    if let paras = img.fallbackParagraphs {
        // Tesseract(縦書き)で読んだページは、見出し判定などのVision前提の
        // 位置情報を持たないので、そのまま段落として積む。
        for p in paras { chunks.append(Chunk(type: .para, text: p)) }
        continue
    }
    let lines = cleanLines(img.lines, imageHeight: img.imageHeight, junk: junk)
    chunks.append(contentsOf: imageToChunks(lines, bodyHeight: bodyHeight))
}

print(chunksToText(chunks))
