from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).parent
DATA_PATH = ROOT / 'article-seeds.json'

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="container article card">
    <p><a href="index.html">← トップへ戻る</a></p>
    <h1>{headline}</h1>
    <p class="notice">{lead}</p>
    <h2>注目ポイント</h2>
    <ul class="bullet-list">
      <li>{point1}</li>
      <li>{point2}</li>
      <li>{point3}</li>
    </ul>
    <h2>抽選・予約・再販の確認先</h2>
    <p>{body}</p>
  </main>
</body>
</html>
'''

def main() -> None:
    if not DATA_PATH.exists():
        print('article-seeds.json がありません。')
        return
    seeds = json.loads(DATA_PATH.read_text(encoding='utf-8'))
    for seed in seeds:
        out = ROOT / seed['filename']
        out.write_text(HTML_TEMPLATE.format(**seed), encoding='utf-8')
        print(f'generated: {out.name}')

if __name__ == '__main__':
    main()
