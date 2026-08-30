#!/usr/bin/env python3
"""ツーブロックゴリラのドット絵スプライトをPNG出力(標準ライブラリのみ)"""
import zlib, struct

PAL = {
    'K': (27, 22, 19, 255),      # 黒髪(トップ)
    'S': (109, 97, 87, 255),     # 刈り上げサイド
    'F': (69, 74, 82, 255),      # 毛(体・輪郭)
    'L': (201, 204, 210, 255),   # 顔(ライトグレー)
    'E': (228, 230, 233, 255),   # マズル(明るめ)
    'W': (255, 255, 255, 255),   # 白目ハイライト
    'B': (36, 28, 18, 255),      # 瞳
    'N': (85, 90, 98, 255),      # 鼻の穴
    'M': (60, 51, 44, 255),      # 口
    '.': (0, 0, 0, 0),           # 透明
}

SPRITE = [
    "........KKKKKKKK........",
    "......KKKKKKKKKKK.......",
    ".....KKKKKKKKKKKKK......",
    "....KKKKKKKKKKKKKKK.....",
    "...KKKKKKKKKKKKKKKKK....",
    "...SKKKKKKKKKKKKKKKS....",
    "..SSKKKKKKKKKKKKKKSS....",
    "..SSLLLLLLLLLLLLLLSS....",
    ".SSLLLLLLLLLLLLLLLLSS...",
    ".SSLLBBLLLLLLLLBBLLSS...",
    ".SSLLBWLLLLLLLLBWLLSS...",
    ".FFLLLLLLLLLLLLLLLLFF...",
    ".FFLLLEEEEEEEEEELLLFF...",
    "..FLLEENNEEEENNEELLF....",
    "..FLLEEEEEEEEEEEELLF....",
    "..FLLEEMEEEEEEMEELLF....",
    "..FLLEEEMMMMMMEEELLF....",
    "...FLLLEEEEEEEELLLF.....",
    "....FFLLLLLLLLLLFF......",
    ".....FFFFFFFFFFFF.......",
    "....FFFFFFFFFFFFFF......",
    "...FFFFFFFFFFFFFFFF.....",
    "...FLFFFFFFFFFFFFLF.....",
    "...FLLFFFFFFFFFFLLF.....",
    "....FFFFFFFFFFFFFF......",
    ".....FFFF....FFFF.......",
    ".....FFFF....FFFF.......",
    "....LLLLL....LLLLL......",
]

def write_png(path, w, h, rgba_rows):
    raw = b''.join(b'\x00' + row for row in rgba_rows)
    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw, 9))
    png += chunk(b'IEND', b'')
    open(path, 'wb').write(png)

def render(scale, bg=None, pad=2):
    gw = len(SPRITE[0]); gh = len(SPRITE)
    w = (gw + pad*2) * scale; h = (gh + pad*2) * scale
    rows = []
    for py in range(h):
        gy = py // scale - pad
        row = bytearray()
        for px in range(w):
            gx = px // scale - pad
            if 0 <= gy < gh and 0 <= gx < gw:
                c = PAL[SPRITE[gy][gx]]
            else:
                c = (0, 0, 0, 0)
            if c[3] == 0 and bg:
                c = bg
            row += bytes(c)
        rows.append(bytes(row))
    write_png_path = None
    return w, h, rows

w, h, rows = render(14, bg=(232, 185, 62, 255))
write_png('gorilla_draft_bg.png', w, h, rows)
w, h, rows = render(14, bg=None)
write_png('gorilla_sprite_transparent.png', w, h, rows)
print("done", w, h)
