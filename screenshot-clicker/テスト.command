#!/bin/zsh
# main.py の「掃除」と「ファイル名づくり」が正しいかを確かめる。ダブルクリックで実行。
cd "$(dirname "$0")"
python3 - <<'PY'
# -*- coding: utf-8 -*-
import importlib.util, shutil, tempfile
from pathlib import Path

spec = importlib.util.spec_from_file_location("m", "main.py")
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

ng = 0
def eq(name, got, want):
    global ng
    ok = got == want
    if not ok: ng += 1
    print(("  OK  " if ok else "  NG  ") + name + ("" if ok else "\n        → %r\n        期待 %r" % (got, want)))

print("======================================")
print(" スクショ自動記録 テスト")
print("======================================")
print()

print("【OCRのゴミ掃除】")
eq("「第 1 章」の空白を詰める", m.tidy_markdown("第 1 章 はじめに").strip(), "第1章 はじめに")
eq("「2019 年」の空白を詰める", m.tidy_markdown("2019 年のこと").strip(), "2019年のこと")
eq("「5 年生」の空白を詰める", m.tidy_markdown("小学 5 年生").strip(), "小学5年生")
# 数字のうしろの日本語はくっつける（和文としてはこちらが自然）。英単語の空白は残す
eq("英単語と数字のあいだは触らない", m.tidy_markdown("Windows 10 mode").strip(), "Windows 10 mode")
eq("数字のうしろの日本語はくっつける", m.tidy_markdown("Windows 10 と Mac").strip(), "Windows 10と Mac")
eq("ページ番号だけの行は落とす", m.tidy_markdown("本文A\n123\n本文B").strip(), "本文A\n本文B")
eq("本文中の数字は落とさない", m.tidy_markdown("値段は 1200 円だった").strip(), "値段は1200円だった")
eq("罫線のかすは落とす", m.tidy_markdown("本文A\n|\n本文B").strip(), "本文A\n本文B")
eq("見出しの記号は残す", m.tidy_markdown("# 第 3 章").strip(), "# 第3章")
eq("空行3つ以上は2つに", m.tidy_markdown("A\n\n\n\n\nB").strip(), "A\n\nB")
eq("行末の空白は取る", m.tidy_markdown("本文です   \n次の行").strip(), "本文です\n次の行")
eq("空っぽでも落ちない", m.tidy_markdown(""), "\n")
eq("本文の文字は減らさない",
   len(m.tidy_markdown("あいうえお。かきくけこ。").replace("\n","")), 12)

print()
print("【ファイル名づくり】")
eq("ふつうの題名", m.safe_filename("イシキカイカク"), "イシキカイカク")
eq("スラッシュは消す", m.safe_filename("A/B:C"), "ABC")
eq("前後の空白は取る", m.safe_filename("  本の名前  "), "本の名前")
eq("空っぽなら空文字", m.safe_filename("   "), "")
eq("長すぎる名前は切る", len(m.safe_filename("あ"*200)), 80)
eq("改行が混ざっても平気", m.safe_filename("題名\nの続き"), "題名の続き")

print()
print("【できあがるMarkdownの形】")
md = m.build_markdown("本文です。", "テスト本", 42)
eq("題名が先頭のh1になる", md.split("\n")[0], "# テスト本")
eq("ページ数が入る", "- ページ数: 42" in md, True)
eq("本文が残っている", md.rstrip().endswith("本文です。"), True)

print()
print("【同じ名前が来たときの枝番】")
tmp = Path(tempfile.mkdtemp())
try:
    eq("1つ目はそのまま", m.unique_path(tmp, "本").name, "本.md")
    (tmp / "本.md").write_text("x", encoding="utf-8")
    eq("2つ目は (2)", m.unique_path(tmp, "本").name, "本 (2).md")
    (tmp / "本 (2).md").write_text("x", encoding="utf-8")
    eq("3つ目は (3)", m.unique_path(tmp, "本").name, "本 (3).md")
finally:
    shutil.rmtree(tmp)

print()
print("======================================")
print(" すべて合っています" if ng == 0 else " %d件ずれています。直してください" % ng)
print("======================================")
raise SystemExit(0 if ng == 0 else 1)
PY
echo ""
read "?Enterキーで閉じます"
