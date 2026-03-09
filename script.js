const SETTINGS_KEY = 'pcm_alert_settings_v2';
const POLL_INTERVAL_MS = 60 * 1000;
const AMAZON_TAG = 'YOUR_AMAZON_ASSOCIATE_ID';
const RAKUTEN_AFFILIATE_URL = 'https://hb.afl.rakuten.co.jp/';
const YAHOO_AFFILIATE_URL = 'https://shopping.yahoo.co.jp/';

let lastDataSignature = '';

async function loadData() {
  const response = await fetch(`data.json?ts=${Date.now()}`);
  return response.json();
}

function parseDate(value) {
  if (!value || value === '未定' || value === '未発表') return null;
  const normalized = value.replace(' ', 'T');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sortByPublishedAt(items) {
  return [...items].sort((a, b) => {
    const da = parseDate(a.publishedAt)?.getTime() || 0;
    const db = parseDate(b.publishedAt)?.getTime() || 0;
    return db - da;
  });
}

function formatDateText(value) {
  const date = parseDate(value);
  return date ? date.toLocaleString('ja-JP') : (value || '未定');
}

function buildLatestItems(data) {
  const lotteryItems = (data.lottery || []).map(item => ({...item, category: '抽選販売', kind: 'lottery'}));
  const commerceItems = (data.commerce || []).map(item => ({...item, category: item.type || '販売情報', kind: 'commerce'}));
  const twitterItems = (data.twitter || []).map(item => ({...item, category: 'X情報', kind: 'twitter'}));
  return sortByPublishedAt([...lotteryItems, ...commerceItems, ...twitterItems]);
}

function getStatusClass(status) {
  if (!status) return '';
  if (status.includes('受付中') || status.includes('販売中') || status.includes('招待受付中')) return 'status-open';
  if (status.includes('まもなく') || status.includes('予告')) return 'status-soon';
  if (status.includes('終了')) return 'status-closed';
  return '';
}

function renderLottery(items) {
  const tbody = document.querySelector('#lotteryTable tbody');
  tbody.innerHTML = '';
  sortByPublishedAt(items).forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.shop}</td>
      <td>${item.product || '-'}</td>
      <td class="${getStatusClass(item.status)}">${item.status || '-'}</td>
      <td>${formatDateText(item.start)} ～ ${formatDateText(item.end)}</td>
      <td><a href="${item.url}" target="_blank" rel="noopener noreferrer">開く</a></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderFeed(targetId, items, tagClass) {
  const container = document.getElementById(targetId);
  container.innerHTML = '';
  sortByPublishedAt(items).forEach(item => {
    const el = document.createElement('article');
    el.className = 'feed-item';
    el.innerHTML = `
      <div class="meta">
        <span class="tag ${tagClass}">${item.category || item.type || '情報'}</span>
        <span>${item.shop || item.source || '不明'}</span>
        <span>${formatDateText(item.publishedAt)}</span>
      </div>
      <h3>${item.title || item.product || item.shop}</h3>
      ${item.status ? `<p class="${getStatusClass(item.status)}">${item.status}</p>` : ''}
      ${item.summary ? `<p>${item.summary}</p>` : ''}
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">リンクを開く</a>
    `;
    container.appendChild(el);
  });
}

function renderLatest(items) {
  const container = document.getElementById('latestFeed');
  container.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('article');
    el.className = 'feed-item';
    const title = item.title || item.product || `${item.shop} 情報`;
    const source = item.shop || item.source || '不明';
    const summary = item.summary || item.status || '';
    el.innerHTML = `
      <div class="meta">
        <span class="tag ${item.kind}">${item.category}</span>
        <span>${source}</span>
        <span>${formatDateText(item.publishedAt)}</span>
      </div>
      <h3>${title}</h3>
      ${summary ? `<p>${summary}</p>` : ''}
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">リンクを開く</a>
    `;
    container.appendChild(el);
  });
}

function collectShops(data) {
  const set = new Set();
  (data.lottery || []).forEach(item => set.add(item.shop));
  (data.commerce || []).forEach(item => set.add(item.shop));
  return [...set].sort();
}

function defaultSettings(shops) {
  return {
    enableStartAlert: true,
    enableDeadlineAlert: true,
    deadlineLead: '24',
    shops: Object.fromEntries(shops.map(shop => [shop, true])),
    seenStarts: {},
    seenDeadlines: {}
  };
}

function loadSettings(shops) {
  const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
  const defaults = defaultSettings(shops);
  if (!saved) return defaults;
  return {
    ...defaults,
    ...saved,
    shops: {
      ...defaults.shops,
      ...(saved.shops || {})
    },
    seenStarts: saved.seenStarts || {},
    seenDeadlines: saved.seenDeadlines || {}
  };
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function renderShopToggles(shops, settings) {
  const box = document.getElementById('shopToggles');
  box.innerHTML = '';
  shops.forEach(shop => {
    const label = document.createElement('label');
    label.className = 'toggle-card';
    label.innerHTML = `<input type="checkbox" data-shop="${shop}" ${settings.shops[shop] ? 'checked' : ''}> ${shop}`;
    box.appendChild(label);
  });
}

function syncSettingsUI(settings) {
  document.getElementById('enableStartAlert').checked = settings.enableStartAlert;
  document.getElementById('enableDeadlineAlert').checked = settings.enableDeadlineAlert;
  document.getElementById('deadlineLead').value = settings.deadlineLead;
}

function readSettingsFromUI(current) {
  const updated = structuredClone(current);
  updated.enableStartAlert = document.getElementById('enableStartAlert').checked;
  updated.enableDeadlineAlert = document.getElementById('enableDeadlineAlert').checked;
  updated.deadlineLead = document.getElementById('deadlineLead').value;
  document.querySelectorAll('#shopToggles input[type="checkbox"]').forEach(input => {
    updated.shops[input.dataset.shop] = input.checked;
  });
  return updated;
}

function notificationAvailable() {
  return 'Notification' in window;
}

async function askNotificationPermission() {
  if (!notificationAvailable()) {
    alert('このブラウザは通知に対応していません。');
    return;
  }
  const result = await Notification.requestPermission();
  if (result === 'granted') alert('通知を許可しました。');
}

function notify(title, body) {
  if (!notificationAvailable() || Notification.permission !== 'granted') return;
  new Notification(title, { body });
}

function makeSignature(data) {
  return JSON.stringify(data);
}

function updateAffiliateLinks() {
  const query = encodeURIComponent('ポケモンカード');
  const amazonHref = `https://www.amazon.co.jp/s?k=${query}&tag=${encodeURIComponent(AMAZON_TAG)}`;
  document.getElementById('cta-amazon').href = amazonHref;
  document.getElementById('cta-rakuten').href = RAKUTEN_AFFILIATE_URL;
  document.getElementById('cta-yahoo').href = YAHOO_AFFILIATE_URL;
}

function evaluateAlerts(data, settings) {
  const now = new Date();
  const leadHours = Number(settings.deadlineLead || '24');

  (data.lottery || []).forEach(item => {
    if (!settings.shops[item.shop]) return;

    const start = parseDate(item.start);
    const end = parseDate(item.end);

    if (settings.enableStartAlert && start && now >= start) {
      const startKey = `${item.shop}__${item.product || ''}__${item.start}`;
      if (!settings.seenStarts[startKey]) {
        settings.seenStarts[startKey] = true;
        notify(`抽選開始: ${item.shop}`, `${item.product || 'ポケモンカード'} の受付が始まりました。`);
      }
    }

    if (settings.enableDeadlineAlert && end) {
      const diffHours = (end.getTime() - now.getTime()) / (1000 * 60 * 60);
      const deadlineKey = `${item.shop}__${item.product || ''}__${item.end}__${leadHours}`;
      if (diffHours <= leadHours && diffHours > 0 && !settings.seenDeadlines[deadlineKey]) {
        settings.seenDeadlines[deadlineKey] = true;
        notify(`締切前: ${item.shop}`, `${item.product || 'ポケモンカード'} の締切が ${leadHours}時間以内です。`);
      }
    }
  });

  saveSettings(settings);
}

async function renderAll() {
  const data = await loadData();
  updateAffiliateLinks();

  renderLottery(data.lottery || []);
  renderFeed('commerceList', (data.commerce || []).map(item => ({...item, category: item.type || '販売情報'})), 'commerce');
  renderFeed('twitterList', (data.twitter || []).map(item => ({...item, category: 'X情報'})), 'twitter');
  renderLatest(buildLatestItems(data));
  renderCalendarPage(data);

  const shops = collectShops(data);
  let settings = loadSettings(shops);
  renderShopToggles(shops, settings);
  syncSettingsUI(settings);
  evaluateAlerts(data, settings);

  lastDataSignature = makeSignature(data);

  document.getElementById('notifyPermissionBtn').onclick = askNotificationPermission;
  document.getElementById('saveSettingsBtn').onclick = () => {
    settings = readSettingsFromUI(settings);
    saveSettings(settings);
    alert('設定を保存しました。');
  };
}

async function pollUpdates() {
  try {
    const data = await loadData();
    const signature = makeSignature(data);
    if (signature !== lastDataSignature) {
      const shops = collectShops(data);
      const settings = loadSettings(shops);
      evaluateAlerts(data, settings);
      renderLottery(data.lottery || []);
      renderFeed('commerceList', (data.commerce || []).map(item => ({...item, category: item.type || '販売情報'})), 'commerce');
      renderFeed('twitterList', (data.twitter || []).map(item => ({...item, category: 'X情報'})), 'twitter');
      renderLatest(buildLatestItems(data));
      renderCalendarPage(data);
  renderCalendarPage(data);
      lastDataSignature = signature;
    }
  } catch (error) {
    console.error('poll error', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderAll();
  setInterval(pollUpdates, POLL_INTERVAL_MS);
});


function buildCalendarEvents(data) {
  const events = [];
  (data.lottery || []).forEach(item => {
    if (item.start && item.start !== '未定' && item.start !== '未発表') {
      events.push({ date: item.start, label: '抽選開始', shop: item.shop, product: item.product, url: item.url });
    }
    if (item.end && item.end !== '未定' && item.end !== '未発表') {
      events.push({ date: item.end, label: '応募締切', shop: item.shop, product: item.product, url: item.url });
    }
    if (item.result && item.result !== '未定' && item.result !== '未発表') {
      events.push({ date: item.result, label: '結果発表', shop: item.shop, product: item.product, url: item.url });
    }
  });
  return events.sort((a, b) => (parseDate(a.date)?.getTime() || 0) - (parseDate(b.date)?.getTime() || 0));
}

function renderCalendarPage(data) {
  const container = document.getElementById('calendarList');
  if (!container) return;
  container.innerHTML = '';
  const events = buildCalendarEvents(data);
  events.forEach(item => {
    const el = document.createElement('article');
    el.className = 'feed-item';
    el.innerHTML = `
      <div class="meta">
        <span class="tag lottery">${item.label}</span>
        <span>${item.shop}</span>
        <span>${formatDateText(item.date)}</span>
      </div>
      <h3>${item.product || 'ポケモンカード'}</h3>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">公式ページを開く</a>
    `;
    container.appendChild(el);
  });
}
