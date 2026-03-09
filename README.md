<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ポケモンカード抽選・再販・予約速報</title>
  <meta name="description" content="ポケモンカードの抽選販売、予約、再販、Amazon招待リクエスト、楽天・Yahoo・主要ショップの情報を一覧で確認できる監視サイト。" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="site-header">
    <div class="container">
      <p class="eyebrow">自動更新モニター</p>
      <h1>ポケモンカード 抽選・予約・再販 速報</h1>
      <p class="lead">抽選受付、締切前、Amazon招待リクエスト、楽天・Yahooの予約/再販、X情報をまとめて確認できます。</p>
      <div class="header-actions">
        <a class="btn primary" href="#latest">新着を見る</a>
        <a class="btn" href="#settings">通知設定</a>
        <a class="btn" href="articles.html">記事一覧</a>
      </div>
    </div>
  </header>

  <nav class="top-nav container">
    <a href="index.html">トップ</a>
    <a href="resale.html">再販速報</a>
    <a href="calendar.html">抽選カレンダー</a>
    <a href="articles.html">記事一覧</a>
    <a href="article-new-release.html">新弾記事例</a>
    <a href="about.html">運営情報</a>
    <a href="privacy.html">プライバシーポリシー</a>
    <a href="contact.html">お問い合わせ</a>
  </nav>

  <main class="container">
    <section class="card monetization">
      <h2>おすすめ購入リンク</h2>
      <p>下のボタンはプレースホルダーです。AmazonアソシエイトID、楽天アフィリエイトID、YahooアフィリエイトURLに差し替えて使ってください。</p>
      <div class="cta-grid">
        <a id="cta-amazon" class="shop-link amazon" href="#" rel="nofollow sponsored" target="_blank">Amazonで探す</a>
        <a id="cta-rakuten" class="shop-link rakuten" href="#" rel="nofollow sponsored" target="_blank">楽天で探す</a>
        <a id="cta-yahoo" class="shop-link yahoo" href="#" rel="nofollow sponsored" target="_blank">Yahooで探す</a>
      </div>
      <div class="ad-box">広告エリア（AdSense審査通過後にコード差し替え）</div>
    </section>

    <section id="settings" class="card">
      <h2>通知設定</h2>
      <div class="settings-grid">
        <label><input type="checkbox" id="enableStartAlert" checked> 抽選開始アラート</label>
        <label><input type="checkbox" id="enableDeadlineAlert" checked> 締切前アラート</label>
        <label>
          締切前通知タイミング
          <select id="deadlineLead">
            <option value="24">24時間前</option>
            <option value="3">3時間前</option>
            <option value="1">1時間前</option>
          </select>
        </label>
      </div>
      <div class="shop-selector">
        <p class="small-title">通知対象ショップ</p>
        <div id="shopToggles" class="toggle-grid"></div>
      </div>
      <div class="settings-actions">
        <button id="notifyPermissionBtn" class="btn">通知を許可</button>
        <button id="saveSettingsBtn" class="btn primary">設定を保存</button>
      </div>
      <p class="helper">ブラウザ通知は、このページを開いている間のデータ更新をもとに表示します。</p>
    </section>

    <section id="latest" class="card">
      <h2>新着情報</h2>
      <div id="latestFeed" class="feed-list"></div>
    </section>

    <section class="grid-two">
      <section class="card">
        <h2>抽選販売</h2>
        <table id="lotteryTable">
          <thead>
            <tr>
              <th>ショップ</th>
              <th>商品</th>
              <th>状態</th>
              <th>受付期間</th>
              <th>リンク</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </section>

      <section class="card">
        <h2>Amazon招待予約 / 再販・予約</h2>
        <div id="commerceList" class="feed-list"></div>
      </section>
    </section>

    <section class="grid-two">
      <section class="card">
        <h2>X情報（ポケポケ除外）</h2>
        <div id="twitterList" class="feed-list"></div>
      </section>

      <section class="card">
        <h2>速報まとめ</h2>
        <ul class="bullet-list">
          <li>Amazonは招待リクエストのみ対象</li>
          <li>抽選カレンダーページを追加</li>
          <li>X自動投稿スクリプト雛形を追加</li>
          <li>Discover向けの構成ファイルを追加</li>
          <li>楽天・Yahooの再販/予約ページを掲載可能</li>
          <li>抽選開始・締切前アラートをショップ別に設定可能</li>
          <li>新着情報が自動で一番上に表示</li>
        </ul>
      </section>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>© Pokémon Card Monitor</p>
      <p class="muted">本サイトは公式運営ではありません。掲載内容は必ず各公式ページで確認してください。</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
