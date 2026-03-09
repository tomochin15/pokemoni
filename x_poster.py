from __future__ import annotations

import json
from pathlib import Path

# 実運用時はX APIの認証情報を環境変数で渡してください。
# ここでは投稿文を組み立てる雛形のみ用意しています。

DATA_PATH = Path(__file__).with_name('data.json')

def build_post_text() -> str:
    data = json.loads(DATA_PATH.read_text(encoding='utf-8'))
    latest = []
    for item in data.get('lottery', [])[:2]:
        latest.append(f"【抽選】{item['shop']} {item.get('product', 'ポケモンカード')} {item.get('status', '')}")
    for item in data.get('commerce', [])[:1]:
        latest.append(f"【販売】{item['shop']} {item.get('title', '')}")
    latest.append('詳しくはサイトで確認')
    latest.append('https://YOUR-DOMAIN/')
    return "\n".join(latest)

if __name__ == '__main__':
    print(build_post_text())
