#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
スクショ自動記録ツール

やること：
  0. 出力フォルダを新しく作る
  1. 「何回やるか」を入力してもらう
  2. Mac本体のスクリーンショット（全画面 or 指定した範囲）を撮って、0のフォルダに保存
  3. ブラウザの決まった座標をクリック
  2と3を、入力した回数ぶん繰り返す
  4. 終わったら、隣の pdf2md アプリの「PNGフォルダ→Markdown.command」に
     そのフォルダをかけて、自動でMarkdown化する

必要な許可（初回だけ）：
  システム設定 → プライバシーとセキュリティ →
    「画面収録」と「アクセシビリティ」の両方で、このスクリプトを実行する
    アプリ（ふつうは Terminal）にチェックが入っていること。
"""

import json
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent
CONFIG_PATH = APP_DIR / "config.json"
OUTPUT_ROOT = APP_DIR / "出力"
MARKDOWN_DIR = OUTPUT_ROOT / "Markdown"   # できたMarkdownはここに集める（NotebookLMに渡す用）
PNG2MD_SCRIPT = APP_DIR.parent / "pdf2md" / "PNGフォルダ→Markdown.command"

WAIT_BEFORE_CLICK = 0.1   # スクショの後、クリックの前に待つ秒数
WAIT_AFTER_CLICK = 0.1    # クリックの後、次のスクショの前に待つ秒数
START_DELAY = 5           # 回数入力後、1回目のスクショが始まるまで待つ秒数


def load_config():
    if CONFIG_PATH.exists():
        try:
            return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        except Exception:
            return None
    return None


def save_config(x, y, region):
    CONFIG_PATH.write_text(
        json.dumps({"x": x, "y": y, "region": region}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def get_mouse_position():
    """今のマウス位置を、画面の左上を(0,0)とする座標(x, y)で返す"""
    script = """
    ObjC.import("AppKit");
    var mouse = $.NSEvent.mouseLocation;
    var screen = $.NSScreen.mainScreen.frame;
    var topLeftY = screen.size.height - mouse.y;
    Math.round(mouse.x) + "," + Math.round(topLeftY);
    """
    result = subprocess.run(
        ["osascript", "-l", "JavaScript", "-e", script],
        capture_output=True, text=True,
    )
    if result.returncode != 0 or "," not in result.stdout:
        raise RuntimeError(f"マウス位置の取得に失敗しました: {result.stderr.strip()}")
    x_str, y_str = result.stdout.strip().split(",")
    return int(x_str), int(y_str)


def wait_and_get_position(prompt):
    print(prompt)
    input("準備ができたら Enter キーを押してください → ")
    for i in (3, 2, 1):
        print(f"  {i}...")
        time.sleep(1)
    return get_mouse_position()


def record_position():
    print()
    x, y = wait_and_get_position(
        "これからクリック位置を記録します。\n"
        "クリックしたい場所（ブラウザの中の押したいボタンなど）に、\n"
        "マウスカーソルを動かして置いてください。"
    )
    print(f"記録しました: x={x}, y={y}")
    return x, y


def record_region():
    print()
    ans = input(
        "スクショの範囲を指定しますか？ [Enter]=画面全体 / r=範囲を指定する → "
    ).strip().lower()
    if ans != "r":
        print("画面全体を保存します。")
        return None

    x1, y1 = wait_and_get_position(
        "\n保存したい範囲の【左上】の角に、マウスカーソルを置いてください。"
    )
    print(f"左上を記録しました: x={x1}, y={y1}")

    x2, y2 = wait_and_get_position(
        "\n保存したい範囲の【右下】の角に、マウスカーソルを置いてください。"
    )
    print(f"右下を記録しました: x={x2}, y={y2}")

    x = min(x1, x2)
    y = min(y1, y2)
    w = abs(x2 - x1)
    h = abs(y2 - y1)

    if w < 5 or h < 5:
        print("範囲が小さすぎるようです。画面全体を保存します。")
        return None

    print(f"範囲を記録しました: x={x}, y={y}, 幅={w}, 高さ={h}")
    return {"x": x, "y": y, "width": w, "height": h}


def take_screenshot(path: Path, region):
    cmd = ["screencapture", "-x"]
    if region:
        cmd += ["-R", f"{region['x']},{region['y']},{region['width']},{region['height']}"]
    cmd.append(str(path))
    subprocess.run(cmd, check=True)


def click_at(x, y):
    script = f'tell application "System Events" to click at {{{x}, {y}}}'
    subprocess.run(["osascript", "-e", script], check=True)


def convert_to_markdown(folder: Path):
    """スクショフォルダを pdf2md の OCR スクリプトにかけて Markdown 化する"""
    if not PNG2MD_SCRIPT.exists():
        print(f"(変換スクリプトが見つからないので、Markdown化はスキップしました: {PNG2MD_SCRIPT})")
        return None

    print()
    print("=== 続けて、スクショをMarkdownに変換します ===")
    # スクリプトの最後にある「Enterで閉じる」待ちで止まらないよう、
    # 標準入力は /dev/null にしておく（正常終了でも exit code が 1 になることがあるため、
    # 戻り値ではなく実際にできた .md ファイルの有無で成否を判定する）
    subprocess.run(
        ["bash", str(PNG2MD_SCRIPT), str(folder)],
        stdin=subprocess.DEVNULL,
    )
    md_files = sorted(folder.glob("*.md"))
    return md_files[-1] if md_files else None


def ask_title():
    """NotebookLMのソース名になるので、何を取り込むのか名前を聞いておく"""
    print()
    print("取り込むものの名前を入れてください（本のタイトルなど）。")
    print("これがMarkdownのファイル名になります。NotebookLMに入れたときに")
    print("何の資料か分かるようにするためです。")
    raw = input("名前（そのままEnterで日時の名前） → ").strip()
    return safe_filename(raw)


def safe_filename(name: str) -> str:
    """ファイル名に使えない文字を取り除く。空になったら空文字を返す"""
    name = name.strip()
    if not name:
        return ""
    name = re.sub(r'[/:\\*?"<>|\n\r\t]', "", name)
    name = re.sub(r"\s+", " ", name).strip(" .")
    return name[:80]


def tidy_markdown(text: str) -> str:
    """OCRの読み取り結果を、NotebookLMが扱いやすい形に軽く掃除する。
    やることは控えめに留める（消しすぎて本文を壊さないため）"""
    kept = []
    for raw in text.split("\n"):
        line = raw.rstrip()
        core = line.strip()
        # ページ番号だけの行は落とす
        if re.fullmatch(r"[0-9０-９]{1,4}", core):
            continue
        # 記号だけの短い行は落とす（罫線や読み取りかすの残り）
        if core and len(core) <= 2 and re.fullmatch(r"[-—–ー・.。、,･|\[\]()【】「」*_=~^]+", core):
            continue
        kept.append(line)
    text = "\n".join(kept)

    # 「第 1 章」「5 年生」のような、日本語と数字のあいだの余計な空白を詰める
    text = re.sub(r"(?<=[ぁ-んァ-ヶ一-龥々])[ \u3000]+(?=[0-9])", "", text)
    text = re.sub(r"(?<=[0-9])[ \u3000]+(?=[ぁ-んァ-ヶ一-龥々])", "", text)
    # 全角スペースの連続は1つに
    text = re.sub(r"\u3000{2,}", "\u3000", text)
    # 空行が3つ以上続いたら2つに
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def build_markdown(body: str, title: str, pages: int) -> str:
    """先頭に、何の資料か分かる短い見出しを付ける"""
    today = datetime.now().strftime("%Y-%m-%d")
    head = f"# {title}\n\n- 取り込み: {today}\n- ページ数: {pages}\n- 取り込み方法: 画面のスクリーンショットを文字認識（macOSのVision）\n\n---\n\n"
    return head + tidy_markdown(body)


def unique_path(folder: Path, stem: str) -> Path:
    """同じ名前があったら (2), (3) を付ける"""
    path = folder / f"{stem}.md"
    n = 2
    while path.exists():
        path = folder / f"{stem} ({n}).md"
        n += 1
    return path


def finalize(folder: Path, md_path: Path, title: str, pages: int):
    """Markdownを整えて Markdown/ に移し、PNGと元フォルダを片付ける。
    片付けた結果を (できたmdのパス, 消したPNGの枚数) で返す"""
    stem = title or folder.name
    MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)
    out_path = unique_path(MARKDOWN_DIR, stem)
    out_path.write_text(
        build_markdown(md_path.read_text(encoding="utf-8"), stem, pages),
        encoding="utf-8",
    )

    # ここから片付け。Markdownを確かに書き出せていることを確認してからにする
    if not out_path.exists() or out_path.stat().st_size == 0:
        print("!! Markdownの書き出しに失敗したので、画像はそのまま残します。")
        return None, 0

    print()
    print(f"Markdownができました: {out_path}")
    print(f"このあと {folder.name} フォルダのPNG（{pages}枚）を消します。")
    ans = input("消してよければそのままEnter（残したいときは n + Enter） → ").strip().lower()
    if ans == "n":
        print("画像はそのまま残します。")
        return out_path, 0

    pngs = sorted(list(folder.glob("*.png")) + list(folder.glob("*.jpg")))
    for f in pngs:
        f.unlink()
    # 画像とmdだけのフォルダなら、フォルダごと片付ける
    leftover = [f for f in folder.iterdir() if f.suffix.lower() != ".md"]
    if not leftover:
        shutil.rmtree(folder)
    return out_path, len(pngs)


def ask_count():
    while True:
        raw = input("スクリーンショットを何回撮りますか？（数字を入力） → ").strip()
        if raw.isdigit() and int(raw) > 0:
            return int(raw)
        print("1以上の数字を入力してください。")


def describe_region(region):
    if region:
        return f"x={region['x']}, y={region['y']}, 幅={region['width']}, 高さ={region['height']}"
    return "画面全体"


def main():
    print("=== スクショ自動記録ツール ===")

    config = load_config()
    if config:
        print(f"前回記録した内容:")
        print(f"  クリック位置: x={config['x']}, y={config['y']}")
        print(f"  撮影範囲: {describe_region(config.get('region'))}")
        ans = input(
            "[Enter]=このまま使う / c=クリック位置を記録し直す / "
            "s=撮影範囲を記録し直す / 両方=b → "
        ).strip().lower()
        if ans == "c":
            x, y = record_position()
            region = config.get("region")
        elif ans == "s":
            x, y = config["x"], config["y"]
            region = record_region()
        elif ans == "b":
            x, y = record_position()
            region = record_region()
        else:
            x, y = config["x"], config["y"]
            region = config.get("region")
    else:
        x, y = record_position()
        region = record_region()

    save_config(x, y, region)

    count = ask_count()
    title = ask_title()

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    out_dir = OUTPUT_ROOT / timestamp
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"保存先フォルダを作りました: {out_dir}")

    print()
    print(f"{count}回、「スクショ → 待つ → クリック → 待つ」を繰り返します。")
    print(f"撮影範囲: {describe_region(region)}")
    print("途中で止めたいときは Ctrl+C を押してください。")
    print()
    print(f"{START_DELAY}秒後に始めます。ブラウザの画面に切り替えてください。")
    for i in range(START_DELAY, 0, -1):
        print(f"  {i}...")
        time.sleep(1)
    print()

    for i in range(1, count + 1):
        img_path = out_dir / f"{i:03d}.png"
        take_screenshot(img_path, region)
        print(f"[{i}/{count}] スクショ保存: {img_path.name}")

        time.sleep(WAIT_BEFORE_CLICK)
        click_at(x, y)
        print(f"[{i}/{count}] クリックしました: ({x}, {y})")

        if i < count:
            time.sleep(WAIT_AFTER_CLICK)

    print()
    print(f"終了しました。{count}枚、{out_dir} に保存しました。")

    md_path = convert_to_markdown(out_dir)
    if md_path:
        out_path, removed = finalize(out_dir, md_path, title, count)
        if out_path:
            print()
            print("=" * 38)
            print(f" できました: {out_path.name}")
            if removed:
                print(f" PNG {removed}枚を消しました（Markdownだけ残しています）")
            print(f" 置き場所: {MARKDOWN_DIR}")
            print(" このフォルダのファイルを、そのままNotebookLMに入れられます。")
            print("=" * 38)
            subprocess.run(["open", str(MARKDOWN_DIR)])
            return
    else:
        print("Markdownへの変換はできませんでした（画像だけ残っています）。")

    subprocess.run(["open", str(out_dir)])


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n中断しました。")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"\nエラーが発生しました: {e}")
        print("「システム設定 → プライバシーとセキュリティ」で、Terminal に")
        print("「画面収録」と「アクセシビリティ」の許可が出ているか確認してください。")
        sys.exit(1)
