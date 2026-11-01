import { CATALOG } from '../src/engine.js';
import { renderHeldScene, renderPhotographicItem } from '../src/visuals.js';
const widget=new URLSearchParams(location.search).get('mode')==='widget';
document.querySelector('#review').innerHTML=CATALOG.flatMap(item=>['bare','glove'].map(method=>`<section class="review-card"><h2>${item.name} · ${method==='bare'?'净手':'棉手套'}</h2><div class="${widget?'review-widget widget':'hero-art-wrap'}">${widget?'<div class="widget-surface">':''}${renderHeldScene(item.id,1,method,{running:false,widget})}${widget?'</div>':''}</div></section>`)).join('');
document.querySelector('#ages').innerHTML=Array.from({length:5},(_,stage)=>`<div>${renderPhotographicItem('gourd',{stage,unique:`age-${stage}`})}<p>${['初见','磨合','挂瓷','包浆','传世'][stage]}</p></div>`).join('');
