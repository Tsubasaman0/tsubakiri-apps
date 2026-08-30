#!/usr/bin/env python3
"""app.html に pdf.js を埋め込んで、1枚で完結する index.html を作る。

使い方:  python3 src/build.py
"""

import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
OUT = ROOT / "index.html"


def read(path):
    return path.read_text(encoding="utf-8")


def main():
    app = read(HERE / "app.html")
    worker = read(HERE / "vendor" / "pdf.worker.min.js")
    lib = read(HERE / "vendor" / "pdf.min.js")

    # 生の </script> が混ざっていると HTML が壊れるので、念のため確認する
    for name, src in (("pdf.worker.min.js", worker), ("pdf.min.js", lib)):
        if "</script" in src.lower():
            sys.exit("!! %s に </script> が含まれています。埋め込めません。" % name)

    for mark in ("<!--PDFJS_WORKER-->", "<!--PDFJS_LIB-->"):
        if mark not in app:
            sys.exit("!! app.html に %s がありません。" % mark)

    # worker を先に読ませると globalThis.pdfjsWorker が立ち、
    # pdf.js は別ファイルを探しにいかず、そのまま本体側で処理してくれる。
    # (file:// で開いても動くのはこのため)
    app = app.replace("<!--PDFJS_WORKER-->", "<script>\n" + worker + "\n</script>")
    app = app.replace("<!--PDFJS_LIB-->", "<script>\n" + lib + "\n</script>")

    OUT.write_text(app, encoding="utf-8")
    kb = OUT.stat().st_size / 1024
    print("できました: %s (%.0f KB)" % (OUT, kb))


if __name__ == "__main__":
    main()
