import { getPatinaAppearance } from './patina.js';
/** Generated photographic cutouts; material-specific ageing preserves natural texture. */
const names = { corn:'文玩玉米',gourd:'小葫芦',walnut:'文玩核桃',zitan:'小叶紫檀',huanghuali:'海南黄花梨',sandalwood:'老山檀香',xingyue:'星月菩提',jingang:'金刚菩提',zijinshu:'紫金鼠',yedi:'椰蒂',hetian:'和田玉',olive:'橄榄核' };
export function renderPhotographicItem(id,{stage=0,unique='item'}={}) {
  if (!names[id]) id='gourd';
  const p=Math.max(0,Math.min(4,Number(stage)||0))/4;
  const appearance=getPatinaAppearance(id,p*4);
  const src=`./assets/items/${id}.png`;
  // Keep the critical photo in the same paint as its masked patina layers.
  // Async decoding can briefly leave only the tinted silhouette after a tool swap.
  return `<span class="photoreal-object material-${id} phase-${Math.floor(p*4)}" data-visual="${unique}" style="--object-source:url('${src}');--polish-opacity:${appearance.glossOpacity};--patina-color:${appearance.toneColor};--patina-opacity:${appearance.toneOpacity}"><img class="object-photo" src="${src}" alt="${names[id]}，第${Math.floor(p*4)+1}阶段的写实外观" draggable="false" decoding="sync" style="filter:${appearance.filter}"/><span class="patina-tone" aria-hidden="true"></span><span class="patina-highlight" aria-hidden="true"></span></span>`;
}
export function renderInteraction(method='bare',pose='pinch') {
  const id=['bare','glove','brush'].includes(method)?method:'bare';
  const label={bare:'净手轻盘',glove:'棉手套轻盘',brush:'软刷刷拭'}[id];
  const src=id==='brush'?'./assets/interactions/brush-hand.png':`./assets/interactions/reference-${pose}-${id}.png`;
  return `<div class="interaction-hand hand-back interaction-${id}" data-live="interaction-hand" aria-label="${label}"><img src="${src}" alt="${label}动作" draggable="false" decoding="sync"/></div>${id==='brush'?'':`<div class="hand-front front-fingers" aria-hidden="true"><img src="${src}" alt="" draggable="false" decoding="sync"/></div><div class="hand-front front-thumb" aria-hidden="true"><img src="${src}" alt="" draggable="false" decoding="sync"/></div>`}`;
}

// Four grips follow the user's GIF: side rubbing, shallow palm, curled loop and
// loose top pinch. Width/height account for each cutout's transparent margins.
// Turn photographed loops upright without stretching individual beads.
const holds={
  corn:{pose:'pinch',width:235,height:235,x:2,y:18,angle:-12},
  gourd:{pose:'pinch',width:190,height:190,x:32,y:30,angle:-5},
  walnut:{pose:'walnut',width:220,height:220,x:57,y:12,angle:-7},
  zitan:{pose:'beads',width:225,height:225,x:41,y:43,angle:84},
  huanghuali:{pose:'beads',width:235,height:235,x:35,y:39,angle:84},
  sandalwood:{pose:'loose',width:226,height:226,x:25,y:50,angle:82},
  xingyue:{pose:'loose',width:230,height:230,x:24,y:48,angle:82},
  jingang:{pose:'beads',width:244,height:244,x:30,y:35,angle:84},
  zijinshu:{pose:'beads',width:255,height:255,x:25,y:31,angle:84},
  yedi:{pose:'loose',width:194,height:194,x:40,y:51,angle:82},
  hetian:{pose:'pinch',width:176,height:176,x:40,y:57,angle:-12},
  olive:{pose:'loose',width:238,height:238,x:19,y:43,angle:82},
};
export function renderHeldScene(id,stage,method,{widget=false,running=true}={}) {
  const hold=holds[id]||holds.gourd;
  const variant=widget?'widget':'hero';
  return `<div class="hold-scene hold-${id} pose-${hold.pose} method-${method}" data-held-item="${id}" data-pose="${hold.pose}" style="--held-size:${hold.width}px;--held-height:${hold.height}px;--held-left:${hold.x}px;--held-top:${hold.y}px;--held-angle:${hold.angle}deg">${renderInteraction(method,hold.pose)}<div class="held-object ${variant}-art manual-surface" data-live="art" data-manual-surface="${variant}" aria-label="盘玩区域，悬停进入手动模式，移动鼠标盘玩">${renderPhotographicItem(id,{stage,unique:variant})}</div></div>`;
}
