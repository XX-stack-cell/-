/** Local game simulation. Prices, care values and time curves are gameplay settings. */
export const STAGES = Object.freeze([
  { id: 'new', name: '初见', description: '一件素物，故事刚刚开始。', reward: 0 },
  { id: 'warm', name: '磨合', description: '熟悉掌心的触感，初见温润。', reward: 30 },
  { id: 'polish', name: '挂瓷', description: '表面光泽渐显，留下陪伴的痕迹。', reward: 80 },
  { id: 'patina', name: '包浆', description: '岁月入色，光泽内敛。', reward: 150 },
  { id: 'heirloom', name: '传世', description: '长久陪伴的游戏纪念称号，不代表文物年代或价值。', reward: 300 },
]);

const DAY = 86400;
const SOURCE = {
  corn: { title: '昆明日报：用来“盘”的玉米', url: 'https://www.kunming.cn/news/c/2026-10-26/14082335.shtml', kind: '新闻报道', scope: '长期盘玩光泽变化；未给出阶段时限' },
  gourd: { title: '武汉晚报：葫芦盘玩采访（2025-09-11）', url: 'https://whwb.cjn.cn/resfile/2025-09-11/14/B2025-09-11A1401.pdf', kind: '新闻采访', scope: '一位玩家的三至六个月经验；不是实验标准' },
  walnut: { title: '人民网：文玩核桃收藏报道（2013-08-07）', url: 'https://art.people.com.cn/n/2013/0807/c206244-22471754.html', kind: '新闻个例', scope: '记录把玩一年多后圆润包浆的核桃个例' },
  walnutLong: { title: '人民网：文玩核桃十年涨百倍（2013-08-02）', url: 'https://art.people.com.cn/n/2013/0802/c206244-22424447.html', kind: '新闻个例', scope: '展示盘玩三年的核桃；不支持五年必达承诺' },
  zitan: { title: '新浪收藏：小叶紫檀盘玩过程中的五大问题', url: 'https://collection.sina.cn/wenwan/2016-07-15/detail-ifxuapvs8469022.d.html', kind: '收藏经验', scope: '半年至一年静置后也可出现包浆的经验说法' },
  huanghuali: { title: '大旗海黄：海南黄花梨手串盘玩保养方法', url: 'https://www.sohu.com/a/535033758_120846778', kind: '商家经验', scope: '约三个月、盘放结合的主张；无对照验证' },
  sandalwood: { title: '新浪：老山檀香到底怕不怕水', url: 'https://k.sina.cn/article_1823348853_6cae1875020011ffo.html?from=collect', kind: '收藏经验', scope: '以赏香轻盘为主；没有统一成熟时限' },
  xingyue: { title: '海欣翡翠：包浆≠勾芡！开片≠密度低！', url: 'https://k.sina.cn/article_5911115554_1605477220010161lg.html', kind: '商家经验', scope: '约一月挂瓷、数年老化的个体经验说法' },
  jingang: { title: '金刚菩提子大课堂：前中后期盘玩细则', url: 'https://www.sohu.com/a/312200142_182268', kind: '玩家教程', scope: '前数月刷盘、年级别长期养护；不是标准时间表' },
  zijinshu: { title: '玩家记录：紫金鼠怎么盘玩和保养', url: 'https://www.bilibili.com/opus/659632931431514129', kind: '玩家自述', scope: '一周色深、一月初浆、三月效果的单人记录' },
  yedi: { title: '椰蒂手串包浆效果', url: 'https://www.kxting.com/article/20221205/3487789.html', kind: '低可信经验描述', scope: '黑褐色光泽变化；未给出可信定量时限' },
  hetian: { title: 'GIA：Jade Care and Cleaning Guide', url: 'https://www.gia.edu/jade-care-cleaning', kind: '宝石学机构', scope: '支持玉石稳定性与养护；不支持盘玩变红或材质升级' },
  olive: { title: '人民网：橄榄核保养需防油过量', url: 'https://art.people.com.cn/n/2014/0409/c206258-24856181.html', kind: '收藏养护报道', scope: '避免过量上油；未给出统一包浆时限' },
};
// Each cut is an explicit game design choice informed by broad experience ranges.
// Calendar-length units are accumulated simulation time, not literal rubbing hours.
const TIMELINES = {
  corn: { timelineDays: [0, 14, 60, 180, 730], labels: ['初见', '2周', '2个月', '半年', '2年'], maturationNote: '主要表现为籽粒表面光泽；具体速度缺少可靠定量资料。', timelineSources: [SOURCE.corn] },
  gourd: { timelineDays: [0, 30, 90, 365, 1095], labels: ['初见', '1个月', '3个月', '1年', '3年'], maturationNote: '采访有三至六个月包浆个例，也有更慢情况；品种与干燥程度影响很大。', timelineSources: [SOURCE.gourd] },
  walnut: { timelineDays: [0, 30, 180, 365, 1825], labels: ['初见', '1个月', '半年', '1年', '5年'], maturationNote: '从初亮到温润包浆常需长期盘刷；一年、三年报道仅为个例。', timelineSources: [SOURCE.walnut, SOURCE.walnutLong] },
  zitan: { timelineDays: [0, 14, 90, 180, 1095], labels: ['初见', '2周', '3个月', '半年', '3年'], maturationNote: '木质颜色会自然加深，轻盘与静置并行；半年至一年是经验范围。', timelineSources: [SOURCE.zitan] },
  huanghuali: { timelineDays: [0, 21, 90, 180, 1095], labels: ['初见', '3周', '3个月', '半年', '3年'], maturationNote: '约三个月的说法来自商家经验，并非每串通用；纹理与光泽是重点。', timelineSources: [SOURCE.huanghuali] },
  sandalwood: { timelineDays: [0, 28, 90, 180, 1460], labels: ['初见', '4周', '3个月', '半年', '4年'], maturationNote: '以轻盘、赏香和木色温润为主，不把更黑或更厚的表面当作必然更好。', timelineSources: [SOURCE.sandalwood] },
  xingyue: { timelineDays: [0, 30, 180, 730, 1825], labels: ['初见', '1个月', '半年', '2年', '5年'], maturationNote: '白至蜜黄、棕色的变化因籽料而异；开片既不保证，也不是必须追求的指标。', timelineSources: [SOURCE.xingyue] },
  jingang: { timelineDays: [0, 30, 120, 365, 1825], labels: ['初见', '1个月', '4个月', '1年', '5年'], maturationNote: '前期重在沟壑清洁，颜色与光泽并行变化；年级别养护只是经验量级。', timelineSources: [SOURCE.jingang] },
  zijinshu: { timelineDays: [0, 7, 30, 90, 730], labels: ['初见', '1周', '1个月', '3个月', '2年'], maturationNote: '相对较快的曲线参考单人记录；成熟度、油性和手法会造成明显差异。', timelineSources: [SOURCE.zijinshu] },
  yedi: { timelineDays: [0, 30, 90, 365, 1460], labels: ['初见', '1个月', '3个月', '1年', '4年'], maturationNote: '保持深褐至黑褐底色，主要增加温和光泽；阶段时间为游戏设定。', timelineSources: [SOURCE.yedi], appearanceMode: 'gloss-only' },
  hetian: { timelineDays: [0, 90, 365, 1095, 3650], labels: ['初见', '3个月', '1年', '3年', '10年'], maturationNote: '各阶段仅为长期陪伴纪念；保持玉石原色，不模拟盘红、矿物变质或玉质升级。', timelineSources: [SOURCE.hetian], appearanceMode: 'gloss-only' },
  olive: { timelineDays: [0, 21, 90, 365, 1825], labels: ['初见', '3周', '3个月', '1年', '5年'], maturationNote: '关注纹理清洁、缓和温湿变化和防裂；精确阶段时间缺少可靠定量依据。', timelineSources: [SOURCE.olive] },
};

const TIMELINE_NOTE = '养成参考周期：阶段切点为游戏设定，参考公开经验的周、月、年量级；并非真实连续摩擦时长或效果保证。「传世」仅为长期陪伴称号。';

export const CATALOG = Object.freeze([
  { id: 'corn', name: '文玩玉米', category: '自然趣物', subtitle: '把平凡，盘成一点金黄', description: '颗粒饱满的观赏玉米，明亮、质朴，是第一位桌面伙伴。', type: 'corn', price: 0, color: '#d8a33d', tags: ['免费领取', '入门友好'], rules: ['净手轻盘', '保持干燥', '避免暴晒'], care: { preferred: 'bare', sweat: false, dry: true, fragile: false } },
  { id: 'gourd', name: '小葫芦', category: '自然趣物', subtitle: '一枚小葫芦，一点慢时光', description: '圆润饱满的手捻葫芦，随着陪伴由浅金慢慢转向琥珀。', type: 'gourd', price: 0, color: '#c48a39', tags: ['免费领取', '温润手感'], rules: ['干手轻盘', '远离潮湿', '少盘多放'], care: { preferred: 'bare', sweat: false, dry: true, rest: true, fragile: true } },
  { id: 'walnut', name: '文玩核桃', category: '核类', subtitle: '掌心里的山川纹理', description: '深浅起伏的纹路藏着时间，需要轻盘，也需要常常清洁。', type: 'walnut', price: 0, color: '#a26a40', tags: ['免费领取', '经典入门'], rules: ['勤刷勤清洁', '净手盘玩', '防碰撞开裂'], care: { preferred: 'brush', sweat: true, fragile: true } },
  { id: 'zitan', name: '小叶紫檀', category: '木质类', subtitle: '深紫木色，静养生光', description: '细密木纹与沉稳色泽，适合干手或手套，间歇静置。', type: 'beads', price: 18, color: '#532d32', tags: ['玻璃底', '宜戴手套'], rules: ['干手或手套', '怕汗怕水', '少盘多放'], care: { preferred: 'glove', sweat: false, dry: true, rest: true } },
  { id: 'huanghuali', name: '海南黄花梨', category: '木质类', subtitle: '把流动的木纹留在桌面', description: '金棕交错的木纹，在轻柔照料下呈现红褐色光泽。', type: 'beads', price: 28, color: '#a56e35', tags: ['细腻木纹', '怕汗怕湿'], rules: ['手套轻盘', '避免高温潮湿', '定时静置'], care: { preferred: 'glove', sweat: false, dry: true, rest: true } },
  { id: 'sandalwood', name: '老山檀香', category: '木质类', subtitle: '一缕安静的木香', description: '浅褐色木珠，适合慢慢欣赏与轻盘。香气为物件设定，应用不会产生气味。', type: 'beads', price: 22, color: '#b89b6d', tags: ['闻香意境', '轻盘慢养'], rules: ['干手轻盘', '远离汗水', '避免猛盘'], care: { preferred: 'glove', sweat: false, dry: true, rest: true } },
  { id: 'xingyue', name: '星月菩提', category: '菩提籽类', subtitle: '星星点点，日久生润', description: '乳白籽面散布细小星点，逐渐养出柔和蜜色。', type: 'beads', price: 12, color: '#ded0ac', tags: ['经典菩提', '温润蜜色'], rules: ['净手盘玩', '注意清洁', '避免温差'], care: { preferred: 'bare', sweat: false, fragile: true } },
  { id: 'jingang', name: '金刚菩提', category: '菩提籽类', subtitle: '深刻纹路，耐心有回响', description: '层叠沟壑让清洁成为仪式，耐心盘刷才有漂亮变化。', type: 'beads', price: 16, color: '#9a5636', tags: ['多刷多盘', '变化明显'], rules: ['勤刷沟壑', '保持清洁', '防骤冷骤热'], care: { preferred: 'brush', sweat: true, fragile: true } },
  { id: 'zijinshu', name: '紫金鼠', category: '菩提籽类', subtitle: '圆滚滚的省心小伙伴', description: '油润深棕的天然籽，日常盘玩就能慢慢变得透亮。', type: 'beads', price: 9, color: '#68402b', tags: ['耐汗', '新手友好'], rules: ['净手盘玩', '定期清洁', '避免长时浸水'], care: { preferred: 'bare', sweat: true } },
  { id: 'yedi', name: '椰蒂', category: '菩提籽类', subtitle: '黑褐之间，沉静有光', description: '朴素的深褐小珠，耐心相伴，养出温和光泽。', type: 'beads', price: 8, color: '#3f3029', tags: ['耐汗', '日常省心'], rules: ['净手盘玩', '擦去浮尘', '避免浸水'], care: { preferred: 'bare', sweat: true } },
  { id: 'hetian', name: '和田玉', category: '玉石类', subtitle: '一抹凝脂，温润相伴', description: '柔和青白的玉石把件，净手轻抚，留意磕碰。', type: 'jade', price: 32, color: '#c5d4b3', tags: ['温润玉感', '净手轻盘'], rules: ['净手轻盘', '避免磕碰', '远离化学品'], care: { preferred: 'bare', sweat: true, fragile: false } },
  { id: 'olive', name: '橄榄核', category: '核类', subtitle: '雕纹细节，细心照料', description: '暖棕色雕刻核串，需要稳定湿度，尤其留意干燥环境。', type: 'beads', price: 15, color: '#9d5735', tags: ['雕刻意趣', '注意防裂'], rules: ['保持适度湿度', '避免骤冷骤热', '定期清洁'], care: { preferred: 'brush', sweat: true, fragile: true } },
].map(item => ({ ...item, ...TIMELINES[item.id], appearanceMode: TIMELINES[item.id].appearanceMode ?? 'subtle-tone', timelineNote: TIMELINE_NOTE })));

export const TOOLS = Object.freeze([
  { id: 'cloth', name: '软棉清洁布', category: '养护工具', subtitle: '轻轻擦去浮尘', description: '随手清洁，保持每一件物品的好状态。', price: 0, type: 'cloth', tags: ['已赠送'] },
  { id: 'glove', name: '纯棉盘玩手套', category: '养护工具', subtitle: '温柔一点，光泽多一点', description: '解锁手套模式，适合怕汗的木质物件。', price: 6, type: 'glove', tags: ['木质养护'] },
  { id: 'brush', name: '软毛文玩刷', category: '养护工具', subtitle: '照顾每一条细小纹理', description: '解锁刷盘模式，适合核桃、金刚与橄榄核。', price: 5, type: 'brush', tags: ['深纹清洁'] },
  { id: 'humidity-box', name: '恒湿养护盒', category: '养护工具', subtitle: '给心爱之物一个好环境', description: '在游戏模拟中稳定湿度，降低干燥风险。', price: 12, type: 'humidity', tags: ['模拟恒湿'] },
]);

const itemById = new Map(CATALOG.map(item => [item.id, item]));
const toolById = new Map(TOOLS.map(item => [item.id, item]));
const FREE_IDS = CATALOG.filter(item => item.price === 0).map(item => item.id);
const finite = (value, fallback = 0) => typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const time = now => finite(now, Date.now());
const copy = state => structuredClone(state);
const localDate = now => { const d = new Date(now); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const initialItem = () => ({ seconds: 0, continuousSeconds: 0, cleanliness: 94, moisture: 50, claimedStages: [] });
export const SPEEDS = Object.freeze([1, 60, 86400, 2592000]);

export function getItemStages(idOrState = 'gourd') {
  const id = typeof idOrState === 'string' ? idOrState : idOrState?.selectedId;
  const item = itemById.get(id) ?? itemById.get('gourd');
  return STAGES.map((stage, index) => ({ ...stage, seconds: item.timelineDays[index] * DAY, days: item.timelineDays[index], timeLabel: item.labels[index], referenceLabel: item.labels[index], description: item.id === 'hetian' && index > 0 ? `${item.labels[index]}陪伴纪念，保持玉石原色；不代表玉质改变。` : stage.description }));
}
export const getStagesForItem = getItemStages;

export function createState(now = Date.now()) {
  now = time(now);
  return { version: 1, selectedId: 'gourd', running: true, speed: 1, lastTick: now, interaction: { owner: null, leaseUntil: 0, movingUntil: 0 }, items: Object.fromEntries(CATALOG.map(item => [item.id, initialItem()])), inventory: [...FREE_IDS], tools: ['cloth'], care: { method: 'bare', humidity: 50, temperature: 23, hand: 'dry' }, notifications: [], rewards: [], stats: { totalSeconds: 0, realTotalSeconds: 0, sessions: 0, todaySeconds: 0, realTodaySeconds: 0, date: localDate(now) }, points: 0 };
}

/** Treat saved state as untrusted input and only retain supported fields. */
export function normalizeState(raw, now = Date.now()) {
  const fresh = createState(now);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fresh;
  const unique = (values, predicate) => [...new Set(Array.isArray(values) ? values.filter(predicate) : [])];
  fresh.inventory = [...new Set([...FREE_IDS, ...unique(raw.inventory, id => itemById.has(id))])];
  fresh.tools = [...new Set(['cloth', ...unique(raw.tools, id => toolById.has(id))])];
  fresh.selectedId = fresh.inventory.includes(raw.selectedId) ? raw.selectedId : 'gourd';
  fresh.running = raw.running === true;
  fresh.speed = SPEEDS.includes(raw.speed) ? raw.speed : 1;
  fresh.lastTick = time(now); // Opening the app never silently accrues offline progress.
  const interaction = raw.interaction;
  if (interaction && typeof interaction.owner === 'string' && interaction.owner.length > 0 && interaction.owner.length <= 100 && finite(interaction.leaseUntil) > now) {
    const leaseUntil = Math.min(finite(interaction.leaseUntil), now + 3000);
    fresh.interaction = { owner: interaction.owner, leaseUntil, movingUntil: clamp(finite(interaction.movingUntil), 0, Math.min(leaseUntil, now + 250)) };
  }
  for (const item of CATALOG) {
    const entry = raw.items?.[item.id];
    if (!entry || typeof entry !== 'object') continue;
    const seconds = clamp(finite(entry.seconds), 0, 1e9);
    fresh.items[item.id] = { seconds, continuousSeconds: clamp(finite(entry.continuousSeconds), 0, 1e9), cleanliness: clamp(finite(entry.cleanliness, 94)), moisture: clamp(finite(entry.moisture, 50)), claimedStages: unique(entry.claimedStages, id => getItemStages(item.id).some(stage => stage.id === id && stage.seconds > 0 && seconds >= stage.seconds)) };
  }
  const care = raw.care ?? {};
  fresh.care = { method: ['bare', 'glove', 'brush'].includes(care.method) && (care.method === 'bare' || fresh.tools.includes(care.method)) ? care.method : 'bare', humidity: clamp(finite(care.humidity, 50), 15, 90), temperature: clamp(finite(care.temperature, 23), 5, 40), hand: care.hand === 'sweaty' ? 'sweaty' : 'dry' };
  fresh.points = clamp(finite(raw.points), 0, 1e9);
  fresh.stats.totalSeconds = clamp(finite(raw.stats?.totalSeconds), 0, 1e9);
  fresh.stats.realTotalSeconds = clamp(finite(raw.stats?.realTotalSeconds), 0, 1e9);
  fresh.stats.sessions = clamp(Math.floor(finite(raw.stats?.sessions)), 0, 1e9);
  if (raw.stats?.date === fresh.stats.date) {
    fresh.stats.todaySeconds = clamp(finite(raw.stats.todaySeconds), 0, 1e9);
    fresh.stats.realTodaySeconds = clamp(finite(raw.stats.realTodaySeconds), 0, 86400);
  }
  if (Array.isArray(raw.rewards)) {
    const rewards = new Map();
    for (const reward of raw.rewards) {
      if (!reward || typeof reward.id !== 'string') continue;
      const isStage = itemById.has(reward.itemId) && getItemStages(reward.itemId).some(stage => stage.id === reward.stage && stage.seconds > 0 && reward.id === `${reward.itemId}:${stage.id}` && fresh.items[reward.itemId].seconds >= stage.seconds);
      const isDaily = /^daily:\d{4}-\d{2}-\d{2}$/.test(reward.id);
      if (!isStage && !isDaily) continue;
      const claimed = reward.claimed === true || rewards.get(reward.id)?.claimed === true || (isStage && fresh.items[reward.itemId].claimedStages.includes(reward.stage));
      rewards.set(reward.id, { id: reward.id, itemId: isStage ? reward.itemId : null, stage: isStage ? reward.stage : null, title: String(reward.title ?? '陪伴奖励').slice(0, 80), description: String(reward.description ?? '').slice(0, 180), points: isDaily ? 20 : STAGES.find(stage => stage.id === reward.stage).reward, claimed, createdAt: finite(reward.createdAt, now) });
    }
    fresh.rewards = [...rewards.values()].slice(-120);
    for (const reward of fresh.rewards) {
      if (reward.itemId && reward.claimed && !fresh.items[reward.itemId].claimedStages.includes(reward.stage)) fresh.items[reward.itemId].claimedStages.push(reward.stage);
    }
  }
  if (Array.isArray(raw.notifications)) fresh.notifications = raw.notifications.slice(-20).filter(value => value && typeof value.title === 'string').map(value => ({ id: String(value.id ?? ''), type: ['success', 'warning', 'info'].includes(value.type) ? value.type : 'info', title: value.title.slice(0, 80), message: String(value.message ?? '').slice(0, 180), at: finite(value.at, now) }));
  return fresh;
}

function notify(state, type, title, message, now) {
  state.notifications.push({ id: `${now}-${state.notifications.length}-${title}`, type, title, message, at: now });
  state.notifications = state.notifications.slice(-20);
}

export function getCareAdvice(state) {
  const item = itemById.get(state.selectedId) ?? CATALOG[0];
  const health = state.items[item.id];
  const { care } = state;
  const humidity = state.tools.includes('humidity-box') ? 50 : care.humidity;
  const advice = [];
  if (!item.care.sweat && care.hand === 'sweaty' && care.method !== 'glove') advice.push({ type: 'warning', title: '有点怕汗', message: `${item.name}适合干手或手套，当前盘玩效率降低。` });
  if (item.care.dry && (humidity > 65 || care.temperature > 30)) advice.push({ type: 'warning', title: '环境偏热或偏湿', message: '请调整模拟环境，或先静置休息。' });
  if (item.care.fragile && humidity < 35) advice.push({ type: 'warning', title: '环境偏干', message: '注意保湿防裂，可调整模拟湿度或使用养护盒。' });
  if (health.cleanliness < 60) advice.push({ type: 'warning', title: '该清洁一下了', message: '轻拭浮尘，让盘玩光泽更均匀。' });
  if (item.care.preferred === 'brush' && care.method !== 'brush') advice.push({ type: 'warning', title: '纹路需要照顾', message: '搭配软毛刷更有效，清洁布也可以日常清洁。' });
  if (health.moisture < 30 && item.care.fragile) advice.push({ type: 'warning', title: '物件略显干燥', message: '点击保养可以恢复状态，避免持续处于低湿度。' });
  if (item.care.rest && health.continuousSeconds >= 1800) advice.push({ type: 'warning', title: '该静置一会儿了', message: '已经连续盘玩半小时，点击静置可让它恢复好状态。' });
  if (!advice.length) advice.push({ type: 'good', title: '状态刚刚好', message: `${item.name}正在舒适的环境里，慢慢积攒光泽。` });
  return advice;
}

function efficiency(state) {
  const item = itemById.get(state.selectedId);
  const warningCount = getCareAdvice(state).filter(value => value.type === 'warning').length;
  const preferred = state.care.method === item.care.preferred;
  return Math.max(0.3, (preferred ? 1 : 0.88) - warningCount * 0.15);
}

function addRewards(state, now) {
  const id = state.selectedId;
  for (const stage of getItemStages(id).slice(1)) {
    const rewardId = `${id}:${stage.id}`;
    if (state.items[id].seconds < stage.seconds || state.rewards.some(reward => reward.id === rewardId) || state.items[id].claimedStages.includes(stage.id)) continue;
    const item = itemById.get(id);
    state.rewards.push({ id: rewardId, itemId: id, stage: stage.id, title: `${item.name} · ${stage.name}`, description: stage.description, points: stage.reward, claimed: false, createdAt: now });
    notify(state, 'success', `达到「${stage.name}」阶段`, `${item.name}有了新变化，${stage.reward} 枚时光籽待领取。`, now);
  }
  const dailyId = `daily:${state.stats.date}`;
  if (state.stats.realTodaySeconds >= 900 && !state.rewards.some(reward => reward.id === dailyId)) {
    state.rewards.push({ id: dailyId, itemId: null, stage: null, title: '今日相伴 · 一刻钟', description: '慢一点，日常也会发光。', points: 20, claimed: false, createdAt: now });
    notify(state, 'success', '今日实际陪伴已满一刻钟', '20 枚时光籽待领取。岁月预览不会加速每日奖励。', now);
  }
}

export function advance(state, now = Date.now()) {
  now = time(now);
  const next = copy(state);
  const delta = clamp((now - finite(state.lastTick, now)) / 1000, 0, 5);
  const intervalStart = now - delta * 1000;
  const interaction = next.interaction ?? { owner: null, leaseUntil: 0, movingUntil: 0 };
  let engagedDelta = delta;
  if (interaction.owner) {
    const manualMoving = Math.max(0, Math.min(now, interaction.leaseUntil, interaction.movingUntil) - intervalStart);
    const autoAfterExpiry = Math.max(0, now - Math.max(intervalStart, interaction.leaseUntil));
    engagedDelta = (manualMoving + autoAfterExpiry) / 1000;
  }
  next.interaction = interaction.owner && interaction.leaseUntil > now ? interaction : { owner: null, leaseUntil: 0, movingUntil: 0 };
  next.lastTick = now;
  const day = localDate(now);
  if (day !== next.stats.date) { next.stats.date = day; next.stats.todaySeconds = 0; next.stats.realTodaySeconds = 0; }
  if (!next.running || engagedDelta === 0) return next;
  const simulatedSeconds = engagedDelta * next.speed;
  // A time preview shows age, not millions of physical rubbing actions at once.
  const careSeconds = next.speed > 60 ? engagedDelta : simulatedSeconds;
  const entry = next.items[next.selectedId];
  entry.seconds = clamp(entry.seconds + simulatedSeconds * efficiency(next), 0, 1e9);
  entry.continuousSeconds = finite(entry.continuousSeconds) + careSeconds;
  entry.cleanliness = clamp(entry.cleanliness - careSeconds / 360);
  const humidity = next.tools.includes('humidity-box') ? 50 : next.care.humidity;
  entry.moisture = clamp(entry.moisture + (humidity - entry.moisture) * Math.min(1, careSeconds / 7200));
  if (next.care.method === 'brush') entry.cleanliness = clamp(entry.cleanliness + careSeconds / 500);
  next.stats.totalSeconds = clamp(next.stats.totalSeconds + simulatedSeconds, 0, 1e9);
  next.stats.realTotalSeconds = finite(next.stats.realTotalSeconds) + engagedDelta;
  next.stats.todaySeconds = Math.min(1e9, next.stats.todaySeconds + simulatedSeconds);
  next.stats.realTodaySeconds = Math.min(86400, finite(next.stats.realTodaySeconds) + engagedDelta);
  addRewards(next, now);
  return next;
}

export function setInteraction(state, owner, active, now = Date.now()) {
  if (typeof owner !== 'string' || !owner || owner.length > 100) return state;
  now = time(now);
  const current = state.interaction ?? { owner: null, leaseUntil: 0, movingUntil: 0 };
  if (active === true && current.owner && current.owner !== owner && current.leaseUntil > now) return state;
  if (active !== true && current.owner !== owner) return state;
  const next = advance(state, now);
  if (active === true) next.interaction = { owner, leaseUntil: now + 3000, movingUntil: next.interaction.owner === owner ? next.interaction.movingUntil : 0 };
  else next.interaction = { owner: null, leaseUntil: 0, movingUntil: 0 };
  return next;
}

export function manualStroke(state, owner, now = Date.now()) {
  now = time(now);
  if (state.interaction?.owner !== owner || state.interaction.leaseUntil <= now) return state;
  const next = advance(state, now);
  next.interaction = { owner, leaseUntil: now + 3000, movingUntil: now + 250 };
  return next;
}

export function selectItem(state, id, now = Date.now()) {
  if (!itemById.has(id) || !state.inventory.includes(id)) return state;
  const next = advance(state, now);
  next.selectedId = id;
  return next;
}

export function setRunning(state, running, now = Date.now()) {
  const next = advance(state, now);
  if (running === true && !next.running) next.stats.sessions += 1;
  next.running = running === true;
  return next;
}

export function setSpeed(state, speed, now = Date.now()) {
  if (!SPEEDS.includes(speed)) return state;
  const next = advance(state, now);
  next.speed = speed;
  return next;
}

export function setCare(state, key, value, now = Date.now()) {
  if (!['method', 'humidity', 'temperature', 'hand'].includes(key)) return state;
  if (key === 'method' && (!['bare', 'glove', 'brush'].includes(value) || (value !== 'bare' && !state.tools.includes(value)))) return state;
  if (key === 'hand' && !['dry', 'sweaty'].includes(value)) return state;
  if (['humidity', 'temperature'].includes(key) && !Number.isFinite(value)) return state;
  const next = advance(state, now);
  next.care[key] = key === 'humidity' ? clamp(value, 15, 90) : key === 'temperature' ? clamp(value, 5, 40) : value;
  return next;
}

export function performCare(state, action, now = Date.now()) {
  if (!['clean', 'hydrate', 'rest'].includes(action)) return state;
  const next = advance(state, now);
  const item = next.items[next.selectedId];
  if (action === 'clean') { item.cleanliness = 100; notify(next, 'success', '擦拭完成', '浮尘已去，重新焕发好状态。', now); }
  if (action === 'hydrate') { item.moisture = 50; notify(next, 'success', '保养完成', '物件状态恢复均衡。养护数值为游戏模拟。', now); }
  if (action === 'rest') { next.running = false; item.continuousSeconds = 0; notify(next, 'info', '让它歇一歇', '静置也是盘玩的一部分，准备好后再继续。', now); }
  return next;
}

/** Called only after the interface explicitly confirms a simulated, zero-charge order. */
export function unlockProduct(state, productId, now = Date.now()) {
  const item = itemById.get(productId);
  const tool = toolById.get(productId);
  if (!item && !tool) return state;
  const key = item ? 'inventory' : 'tools';
  if (state[key].includes(productId)) return state;
  const next = advance(state, now);
  next[key].push(productId);
  notify(next, 'success', '体验物品已解锁', `${(item ?? tool).name}已加入收藏。本次为模拟订单，未发生扣款。`, now);
  return next;
}

export function claimReward(state, rewardId, now = Date.now()) {
  const reward = state.rewards.find(entry => entry.id === rewardId);
  if (!reward || reward.claimed) return state;
  const next = advance(state, now);
  const claimed = next.rewards.find(entry => entry.id === rewardId);
  claimed.claimed = true;
  // Saved claim markers are conservative: either marker prevents paying twice.
  if (claimed.itemId && next.items[claimed.itemId].claimedStages.includes(claimed.stage)) return next;
  next.points += claimed.points;
  if (claimed.itemId && !next.items[claimed.itemId].claimedStages.includes(claimed.stage)) next.items[claimed.itemId].claimedStages.push(claimed.stage);
  notify(next, 'success', '奖励已收下', `${claimed.points} 枚时光籽已加入你的时光账户。`, now);
  return next;
}

export function deriveItem(state, id = state.selectedId) {
  const item = itemById.get(id) ?? CATALOG[0];
  const entry = state.items[item.id] ?? initialItem();
  const stages = getItemStages(item.id);
  let stageIndex = 0;
  for (let i = 1; i < stages.length; i++) if (entry.seconds >= stages[i].seconds) stageIndex = i;
  const stage = stages[stageIndex];
  const nextStage = stages[stageIndex + 1] ?? null;
  const percent = nextStage ? clamp((entry.seconds - stage.seconds) / (nextStage.seconds - stage.seconds) * 100) : 100;
  const growth = nextStage ? (stageIndex + percent / 100) / (stages.length - 1) : 1;
  return { ...item, owned: state.inventory.includes(item.id), cleanliness: entry.cleanliness, moisture: entry.moisture, progress: { seconds: entry.seconds, stages, stageIndex, stage, nextStage, percent, remainingSeconds: nextStage ? Math.max(0, nextStage.seconds - entry.seconds) : 0, gloss: 12 + growth * 72, color: item.appearanceMode === 'gloss-only' ? 0 : growth, efficiency: item.id === state.selectedId ? efficiency(state) : 1 } };
}
