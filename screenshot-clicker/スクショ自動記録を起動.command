#!/bin/bash
cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif [ -x /opt/homebrew/bin/python3 ]; then
  PYTHON=/opt/homebrew/bin/python3
elif [ -x /usr/bin/python3 ]; then
  PYTHON=/usr/bin/python3
else
  echo "python3 が見つかりませんでした。むすびに相談してください。"
  read -n 1 -s
  exit 1
fi

"$PYTHON" main.py

echo
echo "何かキーを押すとこのウィンドウを閉じられます..."
read -n 1 -s
