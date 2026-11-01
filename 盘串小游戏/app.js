import { CATALOG, TOOLS, STAGES, createState, normalizeState, advance, selectItem, setRunning, setSpeed, setCare, performCare, unlockProduct, claimReward, deriveItem, getCareAdvice, setInteraction, manualStroke } from './src/engine.js';
import { renderPhotographicItem, renderHeldScene } from './src/visuals.js';

const STORE_KEY = 'panwu-state-v1';
const ORDERS_KEY = 'panwu-orders-v1';
const PREFS_KEY = 'panwu-preferences-v1';
const desktop = window.panchuanDesktop;
const companion = new URLSearchParams(location.search).get('view') === 'companion';
const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');
const paths = {
  bead: '<ellipse cx="12" cy="12" rx="8" ry="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M4 12h16"/>',
  home: '<path d="m4 10 8-6 8 6v10H4z"/><path d="M9 20v-7h6v7"/>',
  collection: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  leaf: '<path d="M19 4C8 3 3 9 6 15c5 6 14 0 13-11Z"/><path d="M4 21 15 10m-5 5v-4m0 4h4"/>',
  gift: '<rect x="4" y="9" width="16" height="4" rx="1"/><path d="M5 13v7h14v-7M12 9v11"/><path d="M12 9C4 9 5 1 9 4c2 1 3 5 3 5Zm0 0c8 0 7-8 3-5-2 1-3 5-3 5Z"/>',
  settings: '<path d="m10 3-1 3-3 1-3 4 2 3 1 4 4 3 3-2 4-1 3-4-2-3-1-4-4-3z"/><circle cx="12" cy="12" r="3"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  expand: '<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  user: '<circle cx="12" cy="9" r="3"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>',
  swap: '<path d="M4 8h15m-4-4 4 4-4 4M20 16H5m4-4-4 4 4 4"/>',
  play: '<path d="m9 5 10 7-10 7z"/>',
  pause: '<path d="M8 5h3v14H8zm6 0h3v14h-3z"/>',
  hand: '<path d="M8 11V5a1.5 1.5 0 0 1 3 0v6-7a1.5 1.5 0 0 1 3 0v7-6a1.5 1.5 0 0 1 3 0v7-4a1.5 1.5 0 0 1 3 0v7c0 5-3 7-7 7-3 0-5-2-7-5l-3-4a1.5 1.5 0 0 1 2-2l3 2"/>',
  glove: '<path d="M7 12V5a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-6a1.5 1.5 0 0 1 3 0v7-4a1.5 1.5 0 0 1 3 0v8l-3 5H8l-5-7a1.5 1.5 0 0 1 2-2l2 2Z"/><path d="M8 20h8v3H8z"/>',
  brush: '<path d="m14 3 7 3-9 12-5-3z"/><path d="m7 15-4 5 6 2 3-4M5 18l5 3"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  cloth: '<path d="m5 4 15 3-3 14L3 18z"/><path d="m8 5-3 11 12 3M10 8l5 1"/>',
  drop: '<path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/><path d="M8 15c0 2 1 3 3 3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sparkle: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8 14-2 8 6-3 6 3-2-8"/>',
  seed: '<path d="M5 19C3 10 8 4 19 4c0 11-5 16-14 15Z"/><path d="m5 19 9-9"/>',
  check: '<path d="m5 12 5 5L20 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  moon: '<path d="M20 14a9 9 0 0 1-10-11 9 9 0 1 0 10 11Z"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 8h18m-5 4h5v5h-5z"/>',
  wechat: '<path d="M15 13c3-1 6 0 6 3 0 1-1 2-2 3v2l-3-1c-3 0-5-2-5-4 0-1 1-2 2-3Z"/><path d="M13 13c-2 3-6 3-8 2l-3 1 1-3C-1 5 11 0 15 7c1 2 0 4-2 6ZM6 8h.1M10 8h.1m4 8h.1m3 0h.1"/>',
  alipay: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 8h10M12 5v6m-4 0h8c-1 5-7 9-10 6-2-3 2-5 5-3l9 4"/>',
  volume: '<path d="m11 4-6 5H2v6h3l6 5zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  pin: '<path d="m9 3 9 3-3 3v5l-3 3-3-5-5-3 3-3zM10 14l-6 7"/>',
  box: '<path d="m3 7 9-4 9 4v13H3zM3 10h18m-9-7v7m-4 4h8"/>',
};
const icon = (name, extra = '') => `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.leaf}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]);
const stageIcons = ['seed', 'leaf', 'sun', 'sparkle', 'award'];
const readJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const writeJSON = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
let state = setRunning(normalizeState(readJSON(STORE_KEY, null)), true);
let preferences = { goal: 25, pinned: true, ...readJSON(PREFS_KEY, {}) };
preferences.goal = [15, 25, 45].includes(preferences.goal) ? preferences.goal : 25;
let page = 'dashboard';
let shopTab = 'all';
let modal = null;
let previousFocus = null;
let toastTimeout;
let lastArtKey = '';
let queue = Promise.resolve();
let goalNotified = (state.stats.realTodaySeconds ?? 0) >= preferences.goal * 60;
const seenNotifications = new Set(state.notifications.map(n => n.id));
const interactionOwner = `${companion?'widget':'dashboard'}-${crypto.randomUUID()}`;
let hoveredSurface = null;
let lastStroke = 0;
let pointerPosition = { x:0, y:0 };
let lastPointerCoordinates = null;
document.body.classList.toggle('companion-mode', companion);

function timeLabel(seconds, compact = false) {
  seconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
  if (compact) return h ? `${h}小时${m ? `${m}分` : ''}` : m ? `${m}分钟` : `${s}秒`;
  return h ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function thresholdLabel(seconds) {
  const days=Math.round(seconds/86400);
  return seconds===0?'初次相遇':days>=365&&days%365===0?`${days/365} 年`:days>=30&&days%30===0?`${days/30} 个月`:days>=7&&days<30&&days%7===0?`${days/7} 周`:`${days} 天`;
}
function growthLabel(seconds) {
  const days=Math.floor(seconds/86400);
  return days>=365?`${Math.floor(days/365)} 年 ${days%365} 天`:days?`${days} 天 ${Math.floor(seconds%86400/3600)} 时`:timeLabel(seconds);
}
function speedLabel() { return state.speed===2592000?'岁月预览 · 30天/秒':state.speed===86400?'岁月预览 · 1天/秒':state.speed===60?'60× 成长体验':'自然成长'; }
function manualMode() { return Boolean(state.interaction?.owner && state.interaction.leaseUntil>Date.now()); }
function art(id, stage = 0, unique = id) { return renderPhotographicItem(id, { stage, unique }); }
function owned(product) { return (CATALOG.some(i => i.id === product.id) ? state.inventory : state.tools).includes(product.id); }
function productById(id) { return [...CATALOG, ...TOOLS].find(p => p.id === id); }
function savePrefs() { writeJSON(PREFS_KEY, preferences); }
function showToast(message, name = 'check') {
  document.querySelector('#toast-root').innerHTML = `<div class="toast" role="status">${icon(name)}<span>${esc(message)}</span></div>`;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { document.querySelector('#toast-root').innerHTML = ''; }, 4400);
}
function notifyNew() {
  const unseen = state.notifications.filter(n => !seenNotifications.has(n.id));
  unseen.forEach(n => seenNotifications.add(n.id));
  const n = unseen.at(-1);
  if (n) {
    showToast(`${n.title} · ${n.message}`, n.type === 'warning' ? 'info' : n.title.includes('阶段') ? 'gift' : 'check');
    if (n.title.includes('阶段') || n.title.includes('一刻钟')) desktop?.notify({ title: n.title, body: n.message });
  }
  const realToday = state.stats.realTodaySeconds ?? state.stats.todaySeconds;
  if (realToday >= preferences.goal * 60 && !goalNotified) {
    goalNotified = true;
    showToast(`今日已经相伴 ${preferences.goal} 分钟，伸个懒腰，也让它静置一会儿。`, 'leaf');
    desktop?.notify({ title: '今天的陪伴，刚刚好', body: `已经相伴 ${preferences.goal} 分钟，起来活动一下吧。` });
  }
}
function currentStored() {
  const raw = readJSON(STORE_KEY, state);
  const now = Date.now();
  const clean = normalizeState(raw, now);
  clean.lastTick = Number.isFinite(raw?.lastTick) ? Math.min(raw.lastTick, now) : now;
  return clean;
}
function mutate(fn, full = true) {
  const work = async () => {
    const perform = () => {
      const previous = state;
      state = fn(currentStored(), Date.now());
      if (!writeJSON(STORE_KEY, state)) showToast('暂时无法保存进度，请检查本机可用空间。', 'info');
      const structureChanged = previous.selectedId !== state.selectedId || deriveItem(previous).progress.stageIndex !== deriveItem(state).progress.stageIndex || previous.rewards.length !== state.rewards.length || previous.stats.date !== state.stats.date;
      if (full || structureChanged) render(); else updateLive();
      if (previous.stats.date !== state.stats.date) goalNotified = false;
      notifyNew();
    };
    if (navigator.locks) await navigator.locks.request('panwu-state-update', perform);
    else perform();
  };
  queue = queue.then(work).catch(() => showToast('这次操作未能保存，请重试。', 'info'));
  return queue;
}

function sidebar() {
  const pending = state.rewards.filter(r => !r.claimed).length;
  return `<aside class="sidebar">
    <div class="brand"><svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="19" cy="21" rx="12" ry="14"/><ellipse cx="19" cy="21" rx="6" ry="14"/><path d="M7 21h24"/></g><circle cx="29" cy="7" r="3" fill="#c3a16b"/></svg><div><div class="brand-name">盘物</div><div class="brand-en">P A N W U</div></div></div>
    <div class="nav-section-label">一隅 · 慢生活</div>
    <nav class="nav" aria-label="主导航">${[['dashboard','bead','我的盘玩'],['collection','collection','藏品阁'],['guide','leaf','养护手册'],['journal','gift','成长记录']].map(([id,i,label]) => `<button class="nav-button ${page === id ? 'active' : ''}" data-action="nav" data-page="${id}" ${page === id ? 'aria-current="page"' : ''}>${icon(i)}<span>${label}</span>${id === 'journal' && pending ? `<span class="count">${pending}</span>` : ''}</button>`).join('')}</nav>
    <div class="side-quote"><div class="tiny-leaf">${icon('leaf')}</div>器物有温度，<br>时光有回声。</div>
    <div class="companion-entry"><div class="top"><span>让陪伴，留在桌面</span>${icon('monitor')}</div><p>一枚小物，陪你专注与放空。</p><button data-action="companion">开启桌面陪伴 ${icon('arrow')}</button></div>
    <button class="side-footer" data-action="settings" aria-label="打开偏好设置">PANWU · v0.1.0 ${icon('settings')}</button>
  </aside>`;
}
function heading(title, subtitle, en = 'A LITTLE OBJECT, A SLOWER LIFE') {
  return `<div class="page-heading"><div><div class="eyebrow">${en}</div><h1>${title}</h1><p>${subtitle}</p></div><div class="date-label"><span>农闲无事，盘物有时</span></div></div>`;
}
function render() {
  const item = deriveItem(state);
  if (companion) { renderCompanion(item); return; }
  const date = new Intl.DateTimeFormat('zh-CN', { month:'long',day:'numeric',weekday:'long',timeZone:'Asia/Shanghai' }).format(new Date());
  app.innerHTML = `<div class="app-shell">${sidebar()}<main class="workspace"><header class="topbar"><div class="topbar-left">${icon('leaf')}<span>慢一点，也很好。</span></div><div class="topbar-right"><span>${date}</span><span class="top-divider"></span><button class="weather" data-action="nav" data-page="guide" title="调整游戏模拟环境">${icon('sun')}<span data-live="climate">${state.care.temperature}°C · ${state.care.humidity}% RH</span></button><button class="profile-dot" data-action="settings" aria-label="设置">${icon('user')}</button></div></header><div id="page-content">${page === 'dashboard' ? dashboardPage(item) : page === 'collection' ? collectionPage() : page === 'guide' ? guidePage(item) : journalPage()}</div><div class="footer-note">把日子过慢一点，把喜欢的东西养好一点。</div></main></div>`;
  lastArtKey = `${item.id}-${item.progress.stageIndex}`;
  updateLive();
}
function dashboardPage(item) {
  const progress = item.progress;
  const care = getCareAdvice(state), warning = care.find(c => c.type === 'warning');
  return `${heading('把时光，盘成温润。','不必急着抵达，每一份光泽，都来自日常的陪伴。')}
    <div class="dashboard-grid"><div class="main-column">
    <section class="card hero-card" aria-label="当前盘玩物件"><div class="hero-top"><div><span class="tag">${esc(item.category)} · 桌面小伴</span><div class="hero-title"><h2>${esc(item.name)}</h2><span class="stage-small" data-live="stage-label">${progress.stage.name} · Lv.0${progress.stageIndex + 1}</span></div><p class="hero-subtitle">${esc(item.subtitle)}</p><p class="timeline-reference">参考养成 · ${esc(item.maturationNote || '依材质慢慢生光')}</p></div><button class="text-button" data-action="choose">更换藏品 ${icon('swap')}</button></div>
      <div class="hero-art-wrap"><div class="art-aura"></div><div class="hero-annotation">一物一世界 · 一盘一光阴</div>${renderHeldScene(item.id,progress.stageIndex,state.care.method,{running:state.running})}<span class="interaction-badge" data-live="interaction-badge">自动盘玩 · 移入手动</span><button class="preview-bubble" data-action="preview">${icon('sparkle')}看看以后的模样</button></div>
      <div class="hero-info"><div><div class="elapsed-label">这枚小物，已积攒的时光</div><div class="elapsed-number"><span data-live="item-time">${growthLabel(progress.seconds)}</span><small data-live="item-time-unit">${state.speed > 1 ? '模拟时光' : '养成时光'}</small></div></div><div class="hero-controls"><button class="icon-button" data-action="care" data-care="rest" title="静置休息" aria-label="静置休息">${icon('moon')}</button><button class="icon-button" data-action="companion" title="开启桌面挂件" aria-label="开启桌面挂件">${icon('expand')}</button><button class="primary-button" data-action="toggle" data-live="toggle">${icon(state.running ? 'pause' : 'play')}<span>${state.running ? '暂停盘玩' : '开始盘玩'}</span></button></div></div>
      <div class="session-footnote ${state.speed > 1 ? 'fast' : ''}" data-live="session-status"><span class="dot"></span>${state.speed > 1 ? `${speedLabel()} · 阶段时间为模拟值` : state.running ? '正在轻轻盘玩，忙自己的事就好。' : '点击开始，让喜欢的物件陪你一会儿。'}</div>
    </section>
    <section class="card progress-card"><div class="section-line"><h3>${icon('seed')}温润的旅程</h3><button class="subtle-link" data-action="nav" data-page="journal">每一步，都值得纪念 ${icon('arrow')}</button></div><div class="journey">${progress.stages.map((s,i) => {
      const reward = state.rewards.find(r => r.id === `${item.id}:${s.id}`);
      return `<button class="journey-stage ${i === progress.stageIndex ? 'current' : i < progress.stageIndex ? 'passed' : ''} ${reward && !reward.claimed ? 'reward-ready' : ''}" data-action="stage" data-stage="${i}" title="${s.name}：养成时光${thresholdLabel(s.seconds)}"><span class="stage-seal">${icon(stageIcons[i])}</span><div class="journey-name">${s.name}</div><div class="journey-time">${thresholdLabel(s.seconds)}</div></button>`;
    }).join('')}</div><div class="journey-progress" role="progressbar" aria-label="到下一阶段的进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.floor(progress.percent)}"><span data-live="stage-bar" style="width:${progress.percent}%"></span></div><div class="journey-caption"><span data-live="next-stage">${progress.nextStage ? `距离「${progress.nextStage.name}」，还需 ${growthLabel(progress.remainingSeconds)}养成时光` : '已养成传世光泽，陪伴还会继续。'}</span><strong data-live="stage-percent">${Math.floor(progress.percent)}%</strong></div></section>
    <div class="thought-card">${icon('leaf')}<div><p>盘的是手中物，养的是心中闲。</p><p class="source">不必时刻照看，它会安静地陪着你。</p></div></div>
    </div><aside class="right-column">
    <section class="card care-card"><div class="care-heading">${icon('hand')}今天，轻轻盘就好</div><p class="care-desc" data-live="advice">${esc(warning ? warning.message : item.rules.slice(0,2).join('，')+'。')}</p><div class="care-options">${[['bare','hand','净手轻盘'],['glove','glove','戴手套盘'],['brush','brush','软刷慢盘']].map(([id,i,label]) => `<button class="care-option ${state.care.method === id ? 'active' : ''}" data-action="method" data-method="${id}" aria-pressed="${state.care.method === id}">${icon(i)}${label}${id !== 'bare' && !state.tools.includes(id) ? icon('lock','lock') : ''}</button>`).join('')}</div><p class="care-method-note" data-live="method-note">${methodNote(item)}</p><div class="care-divider"></div><div class="care-metric"><div class="metric-top"><span>表面洁净</span><strong data-live="clean-label">${Math.round(item.cleanliness)}% · ${item.cleanliness > 70 ? '清爽' : '待清洁'}</strong></div><div class="metric-bar"><span data-live="clean-bar" style="width:${item.cleanliness}%"></span></div></div><div class="care-metric"><div class="metric-top"><span>养护状态</span><strong data-live="moisture-label">${Math.round(item.moisture)}% · ${item.moisture >= 30 && item.moisture <= 65 ? '均衡' : '需留意'}</strong></div><div class="metric-bar moisture"><span data-live="moisture-bar" style="width:${item.moisture}%"></span></div></div><div class="care-actions"><button class="care-action" data-action="care" data-care="clean">${icon('cloth')}轻轻擦拭</button><button class="care-action" data-action="care" data-care="hydrate">${icon('drop')}温柔养护</button></div></section>
    <section class="card daily-card"><div class="section-line"><h3>今日相伴</h3><button class="subtle-link" data-action="settings" title="调整每日目标">${icon('settings')}</button></div><div class="daily-time"><span data-live="today-time" style="font:inherit;color:inherit;margin:0">${timeLabel(state.stats.realTodaySeconds ?? state.stats.todaySeconds)}</span><span>/ ${preferences.goal} 分钟</span></div><div class="daily-progress"><span data-live="daily-bar" style="width:0%"></span></div><div class="daily-target-line"><span>留一小段时间，给自己</span><span data-live="daily-percent">0%</span></div><div class="daily-message">${icon('gift')}<span>每养成一个新阶段，<br>都能收下一份时光奖励。</span></div></section>
    <div class="tiny-card"><div class="seal-icon">${icon('award')}</div><div><h4 data-live="points">${state.points} 枚时光籽</h4><p>一点点陪伴，一点点收藏。</p></div><button class="subtle-link" data-action="nav" data-page="journal" aria-label="查看奖励">${icon('arrow')}</button></div>
    </aside></div>`;
}
function methodNote(item) {
  const warning = getCareAdvice(state).find(a => a.type === 'warning');
  return esc(warning ? `${warning.title} · ${warning.message}` : `${state.care.method === 'glove' ? '手套隔绝汗水，温柔照顾每一寸纹理。' : state.care.method === 'brush' ? '刷走纹路里的浮尘，细节慢慢生光。' : '保持双手干净，让盘玩变成一个小仪式。'}`);
}
function collectionPage() {
  const products = shopTab === 'tools' ? TOOLS : CATALOG.filter(i => shopTab !== 'owned' || owned(i));
  return `${heading('总有一物，与你投缘。','从一枚朴素小物开始，慢慢拥有自己的收藏。','THE OBJECTS WE KEEP')}
    <div class="segmented" role="tablist" aria-label="藏品分类">${[['all','全部藏品'],['owned',`我的藏架 · ${state.inventory.length}`],['tools','盘玩好物'],['orders','体验订单']].map(([id,name])=>`<button role="tab" aria-selected="${id === shopTab}" class="${id === shopTab ? 'active' : ''}" data-action="shop-tab" data-tab="${id}">${name}</button>`).join('')}</div>
    ${shopTab === 'orders' ? ordersPage() : `<div class="store-intro"><div><h2>${shopTab === 'tools' ? '好物相伴，温柔养护。' : shopTab === 'owned' ? '把喜欢的，留在身边。' : '从小葫芦开始，慢慢盘。'}</h2><p>${shopTab === 'tools' ? '清洁布已为你备好。手套、软刷，让照料更顺手。' : '玉米、葫芦、核桃，三份简单的快乐，免费留给你。'}</p></div>${icon(shopTab === 'tools' ? 'glove' : 'seed')}</div><div class="info-banner">${icon('info')}体验版商店 · 标价仅用于演示。微信 / 支付宝均为模拟流程，不会真实扣款。</div><div class="collection-grid">${products.map(product => productCard(product)).join('')}</div>`}`;
}
function productCard(product) {
  const isTool = TOOLS.some(t => t.id === product.id);
  const has = owned(product), selected = !isTool && state.selectedId === product.id;
  return `<article class="card item-card"><div class="item-meta"><span class="tag ${product.price ? 'gold' : ''}">${esc(product.category)}</span>${has ? `<span class="subtle-link">${icon('check')}${selected ? '正在相伴' : '已收藏'}</span>` : `<span class="subtle-link">${icon('lock')}待结缘</span>`}</div>${isTool ? `<div class="tool-art">${icon(product.id === 'humidity-box' ? 'box' : product.id)}</div>` : `<div class="mini-art">${art(product.id, deriveItem(state,product.id).progress.stageIndex, `card-${product.id}`)}</div>`}<h3>${esc(product.name)}</h3><p class="item-description">${esc(product.subtitle)}</p><div class="tags">${product.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="item-bottom"><span class="price ${!product.price || has ? 'free' : ''}">${has ? (isTool ? '已在工具箱' : `${deriveItem(state,product.id).progress.stage.name} · 已收藏`) : product.price ? `<small>¥</small>${product.price.toFixed(2)}` : '免费结缘'}</span><button class="primary-button ${has ? 'outline' : ''}" data-action="${has ? isTool ? 'use-tool' : 'select-item' : 'buy'}" data-id="${product.id}" ${selected ? 'disabled' : ''}>${has ? selected ? '当前藏品' : isTool ? '使用' : '盘一会儿' : '解锁体验'}</button></div></article>`;
}
function ordersPage() {
  const orders = readJSON(ORDERS_KEY, []);
  if (!Array.isArray(orders) || !orders.length) return `<div class="card empty-state">${icon('wallet')}<h2>还没有结缘记录</h2><p>解锁喜欢的物件后，模拟订单会记录在这里。<br>当前版本不提供真实交易。</p></div>`;
  return `<div class="info-banner">${icon('info')}以下均为本机模拟订单，不具有支付凭证效力；删除本地数据后不会保留。</div><div class="order-list">${orders.slice().reverse().map(order=>`<div class="card order-row"><div>${esc(productById(order.productId)?.name || '体验商品')}<p>${esc(order.id)}<br>${new Intl.DateTimeFormat('zh-CN',{dateStyle:'short',timeStyle:'short',timeZone:'Asia/Shanghai'}).format(new Date(Number(order.createdAt)||Date.now()))} · ${order.method === 'alipay' ? '支付宝' : '微信支付'} · 模拟标价 ¥${Number(order.amount||0).toFixed(2)}</p></div><span class="order-status">${order.status === 'completed' ? '模拟完成 · 未扣款' : '未完成 · 未扣款'}</span></div>`).join('')}</div>`;
}
function guidePage(item) {
  const advice = getCareAdvice(state);
  return `${heading('物有所宜，养有所道。','每一件小物，都有自己的脾气。照顾它，也给自己一个放慢的理由。','CARE IS A QUIET RITUAL')}
  <div class="info-banner">${icon('info')}温湿度与手部状态由你设定，属于游戏模拟；应用不会读取环境传感器。数值与阶段曲线为玩法设定。</div>
  <div class="care-guide-grid"><section class="card guide-panel"><span class="tag">当前藏品 · ${esc(item.name)}</span><h2 style="margin-top:16px">温柔地，照顾它。</h2><p class="intro">${esc(item.description)}</p><div class="timeline-guide"><p>${esc(item.maturationNote)}</p><button class="subtle-link" data-action="references">查看周期依据与边界 ${icon('arrow')}</button></div><div class="guide-rows">${item.rules.map((rule,i)=>`<div class="guide-row">${icon(['hand','drop','leaf'][i%3])}<div><h3>${esc(rule)}</h3><p>${esc(ruleCopy(item,rule))}</p></div></div>`).join('')}<div class="guide-row">${icon('clock')}<div><h3>静置，也是一种陪伴</h3><p>喜欢干燥环境的木质和葫芦，连续盘玩后记得静置。低洁净度、不合适的环境或手法会降低阶段成长效率。</p></div></div></div><button class="primary-button outline" data-action="care" data-care="rest" style="margin-top:18px">${icon('moon')}让它静置一会儿</button></section>
  <div class="main-column"><section class="card guide-panel"><h2 style="font-size:21px">一方舒适的小环境</h2><p class="intro">调节模拟条件，观察养护提醒与盘玩效率的变化。</p><div class="control-row"><div class="control-label">手部状态<span>${state.care.hand === 'dry' ? '干净干燥' : '微微出汗'}</span></div><div class="switch-pair">${[['dry','干净干燥'],['sweaty','微微出汗']].map(([id,label])=>`<button class="${state.care.hand === id ? 'active' : ''}" data-action="hand" data-value="${id}">${label}</button>`).join('')}</div></div><div class="control-row"><label class="control-label" for="temperature-range">模拟温度<span data-range-label="temperature">${state.care.temperature}°C</span></label><input id="temperature-range" type="range" min="5" max="40" value="${state.care.temperature}" data-care-range="temperature" aria-label="模拟温度" /></div><div class="control-row"><label class="control-label" for="humidity-range">模拟湿度<span data-range-label="humidity">${state.tools.includes('humidity-box') ? '50% · 恒湿盒已启用' : `${state.care.humidity}% RH`}</span></label><input id="humidity-range" type="range" min="15" max="90" value="${state.care.humidity}" data-care-range="humidity" aria-label="模拟湿度" ${state.tools.includes('humidity-box') ? 'disabled' : ''}/></div></section>
  <section class="card guide-panel"><div class="section-line"><h3>${icon('leaf')}此刻的养护建议</h3><span class="tag" data-live="guide-efficiency">效率 ${Math.round(item.progress.efficiency*100)}%</span></div><div class="guide-rows" data-live="guide-advice">${advice.map(a=>`<div class="guide-row">${icon(a.type === 'warning' ? 'info' : 'check')}<div><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p></div></div>`).join('')}</div><button class="text-button" data-action="nav" data-page="dashboard" style="padding-left:0;margin-top:8px">回去看看它 ${icon('arrow')}</button></section></div></div>`;
}
function ruleCopy(item,rule) {
  if (/汗|手套|干手/.test(rule)) return '保持双手干净、干燥；手套可以隔开汗水，让怕汗的物件安心生光。';
  if (/刷|清洁/.test(rule)) return '纹路里的浮尘需要定期清理。免费清洁布可用于日常擦拭，软毛刷适合深纹物件。';
  if (/湿|裂|温|燥/.test(rule)) return '避免过于干燥或湿热，保持环境平稳。模拟环境不适时，物件会提醒你。';
  if (/静|放|猛/.test(rule)) return '盘与放之间留一点余地。连续盘玩半小时后，木质物件和葫芦会提醒你休息。';
  return '轻拿轻放，净手轻盘，远离水、暴晒与化学品。细水长流，才能留下温润。';
}
function journalPage() {
  const unlocked = state.rewards.filter(r=>r.itemId).length;
  return `${heading('每一份光泽，都有回声。','把小小的变化记下来，让那些安静的时刻有迹可循。','A RECORD OF SLOW MOMENTS')}
  <div class="card summary-strip"><div class="summary-block"><strong data-live="journal-real">${timeLabel(state.stats.realTotalSeconds ?? state.stats.totalSeconds,true)}</strong><p>真实陪伴时光</p></div><div class="summary-block"><strong data-live="journal-stages">${unlocked}</strong><p>点亮成长阶段</p></div><div class="summary-block"><strong data-live="journal-points">${state.points}</strong><p>已收藏的时光籽</p></div></div><div class="info-banner">${icon('seed')}时光籽是成长纪念积分，本版用于记录陪伴成果，不参与交易或兑换。${state.speed > 1 ? '正在使用岁月预览；真实陪伴时间照常记录。' : ''}</div>
  <div class="rewards-grid">${state.rewards.length ? state.rewards.slice().reverse().map(r=>`<article class="card reward-card"><div class="reward-emblem">${icon(r.itemId ? stageIcons[STAGES.findIndex(s=>s.id===r.stage)] : 'leaf')}</div><div class="reward-copy"><h3>${esc(r.title)}</h3><p>${esc(r.description)}<br>${r.points} 枚时光籽 · ${new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',timeZone:'Asia/Shanghai'}).format(new Date(r.createdAt))}</p><button class="primary-button ${r.claimed ? 'outline' : ''}" data-action="claim" data-id="${esc(r.id)}" ${r.claimed ? 'disabled' : ''}>${r.claimed ? '已好好收下' : '收下这份奖励'}</button></div></article>`).join('') : `<div class="card empty-state">${icon('seed')}<h2>故事，才刚刚开始。</h2><p>不同物件，按自己的月与年慢慢成长。<br>你的第一份时光奖励，正在慢慢酝酿。</p><button class="primary-button outline" data-action="nav" data-page="dashboard">回去盘一会儿 ${icon('arrow')}</button></div>`}</div>`;
}

function updateLive() {
  const item = deriveItem(state), p = item.progress;
  const text = (name,value) => document.querySelectorAll(`[data-live="${name}"]`).forEach(el=>{el.textContent=value;});
  const width = (name,value) => document.querySelectorAll(`[data-live="${name}"]`).forEach(el=>{el.style.width=`${Math.max(0,Math.min(100,value))}%`;});
  text('item-time',growthLabel(p.seconds));
  text('item-time-unit',state.speed > 1 ? '模拟时光' : '养成时光');
  text('stage-label',`${p.stage.name} · Lv.0${p.stageIndex+1}`);
  text('stage-percent',`${Math.floor(p.percent)}%`);
  text('next-stage',p.nextStage ? `距离「${p.nextStage.name}」，还需 ${growthLabel(p.remainingSeconds)}养成时光` : '已养成传世光泽，陪伴还会继续。');
  width('stage-bar',p.percent);
  document.querySelector('[role=progressbar]')?.setAttribute('aria-valuenow',Math.floor(p.percent));
  text('clean-label',`${Math.round(item.cleanliness)}% · ${item.cleanliness > 70 ? '清爽' : '待清洁'}`);
  text('moisture-label',`${Math.round(item.moisture)}% · ${item.moisture >= 30 && item.moisture <= 65 ? '均衡' : '需留意'}`);
  width('clean-bar',item.cleanliness); width('moisture-bar',item.moisture);
  const today = state.stats.realTodaySeconds ?? state.stats.todaySeconds;
  text('today-time',timeLabel(today)); width('daily-bar',today/(preferences.goal*60)*100);
  text('daily-percent',`${Math.min(100,Math.floor(today/(preferences.goal*60)*100))}%`);
  text('points',`${state.points} 枚时光籽`);
  text('journal-real',timeLabel(state.stats.realTotalSeconds ?? state.stats.totalSeconds,true));
  text('journal-stages',state.rewards.filter(r=>r.itemId).length);
  text('journal-points',state.points);
  text('widget-time-label',state.speed>1?'模拟成长':'养成时光');
  text('climate',`${state.care.temperature}°C · ${state.tools.includes('humidity-box') ? 50 : state.care.humidity}% RH`);
  const advice = getCareAdvice(state);
  const warning = advice.find(a=>a.type === 'warning');
  text('guide-efficiency',`效率 ${Math.round(p.efficiency*100)}%`);
  const guideAdvice=document.querySelector('[data-live=guide-advice]');
  if(guideAdvice)guideAdvice.innerHTML=advice.map(a=>`<div class="guide-row">${icon(a.type==='warning'?'info':'check')}<div><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p></div></div>`).join('');
  text('advice',warning ? warning.message : `${item.rules.slice(0,2).join('，')}。`);
  const note = document.querySelector('[data-live=method-note]');
  if (note) note.innerHTML = methodNote(item);
  document.querySelectorAll('[data-live=toggle]').forEach(el=>{el.innerHTML=`${icon(state.running ? 'pause' : 'play')}<span>${state.running ? '暂停盘玩' : '开始盘玩'}</span>`;});
  const foot = document.querySelector('[data-live=session-status]');
  if (foot) { foot.classList.toggle('fast',state.speed > 1);foot.innerHTML=`<span class="dot"></span>${state.speed > 1 ? `${speedLabel()} · 阶段时间为模拟值` : state.running ? '正在轻轻盘玩，忙自己的事就好。' : '点击开始，让喜欢的物件陪你一会儿。'}`; }
  const key = `${item.id}-${p.stageIndex}`;
  document.querySelectorAll('[data-live=art]').forEach(el=>{ if(key !== lastArtKey) el.innerHTML=art(item.id,p.stageIndex,companion ? 'widget':'hero'); el.classList.toggle('rotating',state.running&&!manualMode()); });
  lastArtKey=key;
  text('widget-stage',`${p.stage.name} · ${state.speed>1 ? '岁月预览' : '慢慢生光'}`);
  text('widget-advice',manualMode()?'移动鼠标，轻轻盘我。':warning?warning.title:state.running?'你忙你的，我慢慢变好。':'歇一会儿，也很好。');
  updateInteractionVisuals();
  document.querySelectorAll('[data-live=widget-toggle]').forEach(el=>{el.innerHTML=`${icon(state.running ? 'pause':'play')}${state.running ? '暂停':'继续'}`;});
}
function renderCompanion(item) {
  app.innerHTML=`<main class="widget" aria-label="盘物桌面陪伴"><div class="widget-bubble" data-live="widget-advice">你忙你的，我慢慢变好。</div><div class="widget-actions"><button data-action="dashboard" title="打开盘物" aria-label="打开盘物">${icon('home')}</button><button data-action="pin" title="切换置顶" aria-label="切换置顶">${icon('pin')}</button><button data-action="hide-widget" title="隐藏挂件" aria-label="隐藏挂件">${icon('close')}</button></div><div class="widget-surface">${renderHeldScene(item.id,item.progress.stageIndex,state.care.method,{widget:true,running:state.running})}<div class="widget-mode" data-live="interaction-badge">自动盘玩 · 移入手动</div></div><div class="widget-bottom"><div class="widget-title">${esc(item.name)}<span data-live="widget-stage">${item.progress.stage.name} · 慢慢生光</span></div><div class="widget-timer"><span><span data-live="widget-time-label">${state.speed>1?'模拟成长':'养成时光'}</span> <span data-live="item-time">${growthLabel(item.progress.seconds)}</span></span><button data-action="toggle" data-live="widget-toggle">${icon(state.running?'pause':'play')}${state.running?'暂停':'继续'}</button></div><div class="widget-progress"><span data-live="stage-bar" style="width:${item.progress.percent}%"></span></div></div></main>`;
  lastArtKey=`${item.id}-${item.progress.stageIndex}`;
  updateLive();
}

function updateInteractionVisuals() {
  const manual=manualMode();
  const moving=state.running&&(!manual||state.interaction.movingUntil>Date.now());
  document.querySelectorAll('.hero-art-wrap,.widget-surface').forEach(el=>{
    el.classList.toggle('is-manual',manual);
    el.classList.toggle('is-auto',!manual&&state.running);
    el.classList.toggle('is-stroking',manual&&moving);
    el.classList.toggle('is-paused',!state.running);
    el.style.setProperty('--hand-x',`${pointerPosition.x*14}px`);
    el.style.setProperty('--hand-y',`${pointerPosition.y*11}px`);
    el.style.setProperty('--hand-angle',`${pointerPosition.x*6}deg`);
  });
  document.querySelectorAll('[data-live=interaction-badge]').forEach(el=>{
    el.textContent=!state.running?'已暂停':manual?(state.interaction.owner===interactionOwner?'手动盘玩 · 移动鼠标':'另一窗口正在手动盘玩'):'自动盘玩 · 移入手动';
  });
  if(manual){
    const foot=document.querySelector('[data-live=session-status]');
    if(foot)foot.innerHTML=`<span class="dot"></span>${state.running?'手动模式 · 移动时盘玩，停手时静置，移开恢复自动。':'已暂停 · 点击继续后，可用鼠标轻轻盘玩。'}`;
  }
}
function releaseInteraction() {
  if(!hoveredSurface)return;
  hoveredSurface=null;
  pointerPosition={x:0,y:0};
  mutate((s,now)=>setInteraction(s,interactionOwner,false,now),false);
}
document.addEventListener('pointerover',event=>{
  const surface=event.target.closest('[data-manual-surface]');
  if(!surface||modal||surface.contains(event.relatedTarget))return;
  if(!hoveredSurface){hoveredSurface=surface;mutate((s,now)=>setInteraction(s,interactionOwner,true,now),false);}
});
document.addEventListener('pointermove',event=>{
  const moved = !lastPointerCoordinates || event.clientX!==lastPointerCoordinates.x || event.clientY!==lastPointerCoordinates.y;
  lastPointerCoordinates={x:event.clientX,y:event.clientY};
  const surface=event.target.closest('[data-manual-surface]');
  if(!surface||modal)return;
  if(!hoveredSurface){hoveredSurface=surface;mutate((s,now)=>setInteraction(s,interactionOwner,true,now),false);}
  const rect=surface.getBoundingClientRect();
  pointerPosition={x:Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1)),y:Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1))};
  updateInteractionVisuals();
  if(moved&&Date.now()-lastStroke>=90){lastStroke=Date.now();mutate((s,now)=>manualStroke(s,interactionOwner,now),false);}
});
document.addEventListener('pointerout',event=>{
  const surface=event.target.closest('[data-manual-surface]');
  if(surface&&!surface.contains(event.relatedTarget))releaseInteraction();
});
window.addEventListener('blur',releaseInteraction);
setInterval(()=>{
  if(hoveredSurface&&!modal)mutate((s,now)=>setInteraction(s,interactionOwner,true,now),false);
  updateInteractionVisuals();
},250);

function showModal(next) {
  releaseInteraction();
  if (!modal) previousFocus=document.activeElement;
  modal=next;
  renderModal();
  modalRoot.querySelector('button')?.focus();
}
function closeModal() {
  modal=null;modalRoot.innerHTML='';previousFocus?.focus?.();
}
function modalFrame(content,wide=false) {
  return `<div class="modal-backdrop" data-backdrop="true"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" data-action="close-modal" aria-label="关闭弹窗">${icon('close')}</button>${content}</section></div>`;
}
function renderModal() {
  if (!modal) return;
  const item=deriveItem(state);
  let content='',wide=false;
  if(modal.type==='choose') {
    wide=true;
    content=`<div class="eyebrow">FIND YOUR LITTLE COMPANION</div><h2 id="modal-title">今天，想盘哪一件？</h2><p class="modal-subtitle">每件物品的进度都会单独留存，换着盘，也没关系。</p><div class="collection-grid" style="margin-top:22px">${CATALOG.filter(p=>owned(p)).map(p=>`<button class="card" data-action="select-item" data-id="${p.id}" style="padding:15px 8px;text-align:center;background:${state.selectedId===p.id?'#edf1e5':'#faf9f2'}"><div class="mini-art" style="height:120px">${art(p.id,deriveItem(state,p.id).progress.stageIndex,'choose-'+p.id)}</div><p style="font-size:12px">${p.name}</p><p style="font-size:9px;color:#a1ab91;margin-top:8px">${deriveItem(state,p.id).progress.stage.name}${state.selectedId===p.id?' · 正在相伴':''}</p></button>`).join('')}</div><button class="text-button" data-action="visit-store" style="margin:22px auto 0">去藏品阁，结缘新物 ${icon('arrow')}</button>`;
  } else if(modal.type==='preview') {
    wide=true;
    content=`<div class="eyebrow">A LITTLE CHANGE, EVERY DAY</div><h2 id="modal-title">时光，会留下光泽。</h2><p class="modal-subtitle">${esc(item.name)}的颜色与光泽会随着阶段变化。以下是玩法效果预览。</p><div class="preview-pair"><div class="preview-cell">${art(item.id,0,'preview-start')}<h3>初次相遇</h3><p>质朴原色，故事起点</p></div><div class="preview-cell">${art(item.id,4,'preview-end')}<h3>温润传世</h3><p>光泽内敛，时光入色</p></div></div><p class="modal-note">成长需要累计养成时光时间；养护方式会影响成长效率。<br>各物件周期参照公开经验范围；精确阶段切点为游戏设定。“传世”是长期陪伴称号。</p><button class="primary-button full" data-action="close-modal">慢慢来，陪它变好</button>`;
  } else if(modal.type==='payment') {
    const product=productById(modal.productId);
    content=`<div class="eyebrow">A NEW LITTLE ENCOUNTER</div><h2 id="modal-title">与好物，结个缘。</h2><p class="modal-subtitle">这份新陪伴，已经为你准备好了。</p><div class="payment-product"><div><h3>${esc(product.name)}</h3><p>本地数字藏品 · 一次解锁</p></div><div class="price"><small>¥</small>${product.price.toFixed(2)}</div></div><div class="info-banner">${icon('info')}模拟支付体验 · 不会扣款，也不会打开支付账户。</div><p class="modal-subtitle">选择体验方式</p><div class="payment-methods">${[['wechat','微信支付','wechat'],['alipay','支付宝','alipay']].map(([id,name,i])=>`<button class="payment-method ${modal.method===id?'active':''}" data-action="payment-method" data-method="${id}" aria-pressed="${modal.method===id}">${icon(i)}${name}</button>`).join('')}</div><button class="primary-button full" data-action="confirm-payment" ${modal.busy?'disabled':''}>${modal.busy?'正在解锁…':`模拟支付 ¥${product.price.toFixed(2)}`}</button><p class="modal-note">体验订单仅保存在本机。正式收款需接入商户服务。<br>当前没有真实支付二维码或真实资金交易。</p>`;
  } else if(modal.type==='receipt') {
    const product=productById(modal.productId),isTool=TOOLS.some(t=>t.id===product.id);
    content=`<div style="text-align:center;padding-top:10px"><div class="reward-emblem" style="margin:0 auto 22px">${icon('check')}</div><h2 id="modal-title">新陪伴，已到身边。</h2><p class="modal-subtitle">${esc(product.name)}已放入${isTool?'工具箱':'你的藏架'}。<br>模拟流程已完成，没有发生任何扣款。</p>${!isTool?`<div class="modal-art">${art(product.id,0,'receipt')}</div>`:''}<button class="primary-button full" data-action="${isTool?'use-tool':'select-item'}" data-id="${product.id}">${isTool?'试试新工具':'让它陪我一会儿'}</button><button class="text-button" style="margin:12px auto 0" data-action="close-modal">好好收下，稍后再看</button></div>`;
  } else if(modal.type==='stage') {
    const stage=item.progress.stages[modal.stageIndex];
    const reached=item.progress.seconds>=stage.seconds;
    const reward=state.rewards.find(r=>r.id===`${item.id}:${stage.id}`);
    content=`<div style="text-align:center"><div class="reward-emblem" style="margin:10px auto 22px">${icon(stageIcons[modal.stageIndex])}</div><div class="eyebrow">A MILESTONE OF COMPANIONSHIP</div><h2 id="modal-title">${esc(stage.name)} · ${esc(item.name)}</h2><p class="modal-subtitle">${stage.description}</p><div class="modal-rule">${stage.seconds===0?'初次相遇，就是一个温暖的开始。':`参考养成时光 ${thresholdLabel(stage.seconds)}${reached?'，你已经走到了这里。':'，点亮这个阶段。'}`}<br>${stage.reward?`阶段奖励：${stage.reward} 枚时光籽`:'每一段光泽，都从这一刻开始。'}</div><button class="primary-button full" data-action="${reward&&!reward.claimed?'claim':'close-modal'}" ${reward&&!reward.claimed?`data-id="${reward.id}"`:''}>${reward?reward.claimed?'这份纪念，已好好收下':'收下阶段奖励':reached?'从这里，慢慢开始':'期待下一次蜕变'}</button></div>`;
  } else if(modal.type==='settings') {
    content=`<div class="eyebrow">MAKE YOURSELF AT HOME</div><h2 id="modal-title">按自己的节奏来。</h2><p class="modal-subtitle">在一个安静的小角落，给时光一点耐心。</p><div class="settings-section"><h3>每日陪伴小目标</h3><div class="switch-pair">${[15,25,45].map(m=>`<button class="${preferences.goal===m?'active':''}" data-action="goal" data-goal="${m}">${m} 分钟</button>`).join('')}</div><p>按真实陪伴时间提醒你休息，不受加速模式影响。每日满15分钟另有固定时光奖励；这里的小目标只控制休息提醒。</p></div><div class="settings-section"><h3>成长节奏</h3><div class="switch-pair"><button class="${state.speed===1?'active':''}" data-action="speed" data-speed="1">正常 · 1×</button><button class="${state.speed===60?'active':''}" data-action="speed" data-speed="60">体验 · 60×</button><button class="${state.speed===2592000?'active':''}" data-action="speed" data-speed="2592000">岁月预览</button></div><p>正常模式按自然时光成长；60× 可加速体验，不会放大真实陪伴时长。物件达到各自阶段后，会有提醒。岁月预览为每秒30天，用于快速查看多年变化。</p></div><div class="settings-section"><h3>桌面陪伴</h3><div class="settings-line"><span>${desktop?'独立透明挂件，可拖动、可置顶':'浏览器可预览主界面，独立挂件需桌面版'}</span><button class="primary-button outline" data-action="companion" style="font-size:10px;padding:8px 12px">开启陪伴</button></div></div><p class="modal-note">进度自动保存在本机，不上传账号、设备信息或支付资料。<br>应用关闭后暂停成长；挂件与主窗口共享同一份进度。</p>`;
  } else if(modal.type==='references') {
    wide=true;
    content=`<div class="eyebrow">REFERENCES, WITH THEIR LIMITS</div><h2 id="modal-title">${esc(item.name)}，慢慢养成的依据。</h2><p class="modal-subtitle">${esc(item.timelineNote)}</p><div class="modal-rule">${esc(item.maturationNote)}<br>本件阶段：${item.progress.stages.map(s=>`${s.name} ${s.timeLabel}`).join(' · ')}</div>${item.timelineSources.map(source=>`<div class="source-entry"><h3>${esc(source.title)}</h3><p>${esc(source.kind)} · ${esc(source.scope)}</p><button data-action="open-reference" data-url="${esc(source.url)}">${esc(source.url)} ↗</button></div>`).join('')}<p class="modal-note">同一物件的盘玩频率、温湿度、初始料性与清洁方式均有影响。<br>应用不会把单个经验案例包装为统一的真实年限。</p>`;
  }
  modalRoot.innerHTML=modalFrame(content,wide);
}

function openPurchase(id) {
  const product=productById(id);
  if(!product)return;
  if(owned(product)){showToast('这份好物已经在你的收藏里。');return;}
  const orders=readJSON(ORDERS_KEY,[]);
  const order={id:`DEMO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,productId:id,amount:product.price,method:'wechat',status:'pending',createdAt:Date.now()};
  writeJSON(ORDERS_KEY,[...(Array.isArray(orders)?orders:[]).slice(-99),order]);
  showModal({type:'payment',productId:id,method:'wechat',orderId:order.id});
}
async function confirmPayment() {
  if(modal?.type!=='payment'||modal.busy)return;
  const payment={...modal};
  modal.busy=true;renderModal();
  await mutate((s,now)=>unlockProduct(s,payment.productId,now));
  if(!owned(productById(payment.productId))){modal.busy=false;renderModal();return;}
  const orders=readJSON(ORDERS_KEY,[]);
  writeJSON(ORDERS_KEY,(Array.isArray(orders)?orders:[]).map(order=>order.id===payment.orderId?{...order,status:'completed',method:payment.method,completedAt:Date.now()}:order));
  showModal({type:'receipt',productId:payment.productId});
}
async function useTool(id) {
  closeModal();
  if(!state.tools.includes(id)){openPurchase(id);return;}
  if(id==='cloth'){await mutate((s,now)=>performCare(s,'clean',now));return;}
  if(id==='humidity-box'){showToast('恒湿养护盒已自动启用，模拟湿度稳定在 50%。','box');return;}
  await mutate((s,now)=>setCare(s,'method',id,now));
  page='dashboard';render();
  showToast(`已切换为${id==='glove'?'手套':'软刷'}盘玩。`);
}
function changePage(next) { page=next;render();window.scrollTo({top:0}); }

document.addEventListener('click',async event=>{
  const el=event.target.closest('[data-action]');
  if(!el || el.disabled) {if(event.target.matches('[data-backdrop]'))closeModal();return;}
  const action=el.dataset.action;
  if(action==='nav'){closeModal();changePage(el.dataset.page);}
  else if(action==='shop-tab'){shopTab=el.dataset.tab;render();}
  else if(action==='toggle')await mutate((s,now)=>setRunning(s,!s.running,now));
  else if(action==='choose')showModal({type:'choose'});
  else if(action==='preview')showModal({type:'preview'});
  else if(action==='settings')showModal({type:'settings'});
  else if(action==='references')showModal({type:'references'});
  else if(action==='open-reference'){
    if(desktop?.openReference)desktop.openReference(el.dataset.url);
    else window.open(el.dataset.url,'_blank','noopener,noreferrer');
  }
  else if(action==='stage')showModal({type:'stage',stageIndex:Number(el.dataset.stage)});
  else if(action==='close-modal')closeModal();
  else if(action==='care')await mutate((s,now)=>performCare(s,el.dataset.care,now));
  else if(action==='method'){
    if(el.dataset.method!=='bare'&&!state.tools.includes(el.dataset.method))openPurchase(el.dataset.method);
    else await mutate((s,now)=>setCare(s,'method',el.dataset.method,now));
  }
  else if(action==='hand')await mutate((s,now)=>setCare(s,'hand',el.dataset.value,now));
  else if(action==='select-item'){
    const id=el.dataset.id;
    if(!state.inventory.includes(id)){openPurchase(id);return;}
    closeModal();page='dashboard';await mutate((s,now)=>selectItem(s,id,now));
  }
  else if(action==='buy')openPurchase(el.dataset.id);
  else if(action==='use-tool')await useTool(el.dataset.id);
  else if(action==='visit-store'){closeModal();shopTab='all';changePage('collection');}
  else if(action==='payment-method'){if(modal?.type==='payment'){modal.method=el.dataset.method;renderModal();}}
  else if(action==='confirm-payment')await confirmPayment();
  else if(action==='claim'){await mutate((s,now)=>claimReward(s,el.dataset.id,now));if(modal)closeModal();}
  else if(action==='goal'){preferences.goal=Number(el.dataset.goal);savePrefs();goalNotified=(state.stats.realTodaySeconds??0)>=preferences.goal*60;render();renderModal();}
  else if(action==='speed'){await mutate((s,now)=>setSpeed(s,Number(el.dataset.speed),now));renderModal();}
  else if(action==='companion'){
    if(desktop){closeModal();desktop.showCompanion();showToast('桌面小伴已开启，拖动上方气泡可以移动，移到物件上可手动盘玩。','monitor');}
    else {showModal({type:'settings'});showToast('独立桌面挂件请用项目中的「启动盘物.command」打开。','monitor');}
  }
  else if(action==='dashboard'){if(desktop)desktop.showDashboard();else location.href='./index.html';}
  else if(action==='hide-widget'){if(desktop)desktop.hideCompanion();else location.href='./index.html';}
  else if(action==='pin'){preferences.pinned=!preferences.pinned;savePrefs();desktop?.setAlwaysOnTop(preferences.pinned);showToast(preferences.pinned?'已置顶，安静陪在这里。':'已取消置顶。','pin');}
});
document.addEventListener('input',event=>{
  const key=event.target.dataset.careRange;
  if(!key)return;
  const label=document.querySelector(`[data-range-label="${key}"]`);
  if(label)label.textContent=`${event.target.value}${key==='temperature'?'°C':'% RH'}`;
});
document.addEventListener('change',event=>{
  const key=event.target.dataset.careRange;
  if(key)mutate((s,now)=>setCare(s,key,Number(event.target.value),now));
});
document.addEventListener('keydown',event=>{
  if(!modal)return;
  if(event.key==='Escape'){closeModal();event.preventDefault();return;}
  if(event.key==='Tab'){
    const focusable=[...modalRoot.querySelectorAll('button:not(:disabled),input:not(:disabled),[tabindex="0"]')];
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  }
});
window.addEventListener('storage',event=>{
  if(event.key!==STORE_KEY || !event.newValue)return;
  try {
    const previous=state;
    state=normalizeState(JSON.parse(event.newValue));
    const structural=previous.selectedId!==state.selectedId||previous.care.method!==state.care.method||previous.inventory.length!==state.inventory.length||previous.tools.length!==state.tools.length||previous.rewards.length!==state.rewards.length||deriveItem(previous).progress.stageIndex!==deriveItem(state).progress.stageIndex;
    if(structural)render();else updateLive();
    notifyNew();
  }catch{/* Ignore malformed external storage events. */}
});
desktop?.onResumeAuto?.(() => mutate((s,now)=>setRunning(s,true,now)));
render();
// Initialize under the same cross-window lock as every later update.
// A fresh launch starts its clock now, without granting offline progress.
mutate((s,now)=>setRunning({...s,lastTick:now},true,now));
setInterval(()=>mutate((s,now)=>advance(s,now),false),1000);
