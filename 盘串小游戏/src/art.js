/** Original procedural SVG artwork. No remote assets or runtime dependencies. */
let sequence = 0;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const rgb = (a, b, t) => `rgb(${a.map((v, i) => lerp(v, b[i], t)).join(',')})`;
const rand = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export function renderItemArt(itemId = 'gourd', { stage = 0, size = 320, animated = false, unique = '' } = {}) {
  const t = clamp(Number(stage) || 0, 0, 4) / 4;
  const p = `pc-${String(unique || ++sequence).replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const color = rgb([196, 139, 69], [153, 61, 28], t);
  const light = rgb([243, 203, 133], [235, 152, 79], t);
  const dark = rgb([134, 83, 36], [86, 28, 19], t);
  const common = `<defs>
    <radialGradient id="${p}-body" cx="29%" cy="24%" r="79%"><stop stop-color="${light}"/><stop offset=".45" stop-color="${color}"/><stop offset=".9" stop-color="${dark}"/><stop offset="1" stop-color="${color}"/></radialGradient>
    <radialGradient id="${p}-soft" cx="33%" cy="24%" r="78%"><stop stop-color="${light}"/><stop offset=".65" stop-color="${color}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
    <radialGradient id="${p}-shine" cx="30%" cy="22%" r="70%"><stop stop-color="#fff6d5" stop-opacity="${.14 + t * .37}"/><stop offset=".31" stop-color="#fff8da" stop-opacity=".03"/><stop offset=".8" stop-color="#fff8da" stop-opacity="0"/></radialGradient>
    <linearGradient id="${p}-cord" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b8503e"/><stop offset=".45" stop-color="#8e2e25"/><stop offset="1" stop-color="#5c201c"/></linearGradient>
    <radialGradient id="${p}-turquoise" cx="30%" cy="20%"><stop stop-color="#a0c4ae"/><stop offset=".5" stop-color="#5d8a73"/><stop offset="1" stop-color="#2d5a49"/></radialGradient>
    <linearGradient id="${p}-glint" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff9e8" stop-opacity="0"/><stop offset=".46" stop-color="#fff9e8" stop-opacity="${.08 + t * .28}"/><stop offset=".6" stop-color="#fff9e8" stop-opacity="0"/></linearGradient>
    <filter id="${p}-shadow" x="-50%" y="-40%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>`;
  let artwork;
  if (itemId === 'gourd') artwork = gourd(p, t);
  else if (itemId === 'corn') artwork = corn(p, t);
  else if (itemId === 'walnut') artwork = walnuts(p, t);
  else if (itemId === 'hetian') artwork = jade(p, t);
  else artwork = bracelet(p, t, itemId);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${clamp(Number(size) || 320, 20, 2000)}" height="${clamp(Number(size) || 320, 20, 2000)}" role="img" aria-label="${({ gourd: '葫芦', corn: '文玩玉米', walnut: '文玩核桃', hetian: '和田玉', zitan: '小叶紫檀', huanghuali: '海南黄花梨', sandalwood: '老山檀香', xingyue: '星月菩提', jingang: '金刚菩提', zijinshu: '紫金鼠', yedi: '椰蒂', olive: '橄榄核' })[itemId] || '文玩手串'}，第 ${Math.floor(t * 4) + 1} 阶段" class="item-illustration${animated ? ' is-animated' : ''}">${common}${artwork}</svg>`;
}

function gourd(p, t) {
  const shape = 'M190 65 C168 65 153 86 153 108 C153 129 164 144 175 158 C187 174 181 190 166 205 C145 224 127 250 130 280 C132 322 163 346 203 347 C244 349 276 321 275 279 C275 248 259 223 238 203 C222 188 216 174 228 157 C239 142 248 125 244 104 C241 80 219 65 198 65 Z';
  let grain = '';
  for (let i = 0; i < 165; i++) {
    const x = 128 + rand(i + 4) * 148, y = 65 + rand(i + 205) * 282;
    grain += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(.4 + rand(i + 18) * 1.6).toFixed(1)}" ry="${(.6 + rand(i + 81) * 2).toFixed(1)}" fill="${i % 3 ? '#71471f' : '#f4d18e'}" opacity="${(.04 + rand(i + 62) * (.16 - t * .06)).toFixed(2)}"/>`;
  }
  return `<ellipse cx="203" cy="358" rx="75" ry="10" fill="#4e3426" opacity=".13" filter="url(#${p}-shadow)"/>
    <defs><clipPath id="${p}-gourd-clip"><path d="${shape}"/></clipPath></defs>
    <g transform="rotate(-8 204 214)">
      <path d="M192 73 C195 61 187 49 190 37 C193 32 201 35 201 40 C199 49 210 54 204 71" fill="#775331" stroke="#67472e" stroke-width="2"/>
      <path d="M194 39 Q199 44 197 54" fill="none" stroke="#c2a171" stroke-width="2" opacity=".7"/>
      <path d="${shape}" fill="url(#${p}-body)" stroke="#84512d" stroke-opacity=".35" stroke-width="1.2"/>
      <g clip-path="url(#${p}-gourd-clip)">${grain}
        <path d="M164 94 C150 141 198 142 189 180 C186 203 144 231 146 278 C147 316 179 336 205 337" fill="none" stroke="#ffe7a6" stroke-width="8" opacity="${.05 + t * .08}"/>
        <ellipse cx="178" cy="98" rx="17" ry="23" fill="#fff4cf" opacity="${.1 + t * .22}" transform="rotate(25 178 98)"/>
        <ellipse cx="166" cy="254" rx="15" ry="36" fill="#fff6dc" opacity="${.06 + t * .16}" transform="rotate(19 166 254)"/>
        <path class="polish-sheen" d="M101 176 L244 73 L294 104 L145 325 Z" fill="url(#${p}-glint)"/>
      </g>
      <ellipse cx="207" cy="338" rx="12" ry="3" fill="#663a23" opacity=".22"/>
      <path d="M179 178 Q199 187 220 177 M179 182 Q201 190 223 180" fill="none" stroke="#60251c" stroke-width="3" stroke-linecap="round"/>
      <path d="M179 178 Q200 184 220 177 M179 182 Q200 187 223 180" fill="none" stroke="url(#${p}-cord)" stroke-width="2" stroke-linecap="round"/>
      <path d="M220 178 C233 164 255 169 249 181 C245 190 228 187 220 180 C238 192 254 204 247 236" fill="none" stroke="url(#${p}-cord)" stroke-width="2.5"/>
      <path d="M221 180 Q230 171 228 183" fill="none" stroke="#a84131" stroke-width="4"/>
      <ellipse cx="246" cy="233" rx="7" ry="10" transform="rotate(10 246 233)" fill="url(#${p}-turquoise)" stroke="#44674e" stroke-width=".5"/>
      <path d="M242 227 Q246 224 249 228" fill="none" stroke="#d3e5c8" stroke-width="1.2" opacity=".6"/>
      <path d="M246 243 Q242 253 247 265 M246 244 Q251 253 249 262 M245 245 Q239 255 242 261" fill="none" stroke="url(#${p}-cord)" stroke-width="1.8" stroke-linecap="round"/>
    </g>`;
}

function corn(p, t) {
  let kernels = '';
  for (let row = 0; row < 12; row++) {
    const y = 98 + row * 18.2;
    const width = 23 + Math.sin((row + .8) / 13 * Math.PI) * 27;
    for (let col = 0; col < 5; col++) {
      const x = 200 + (col - 2) * width / 2.1 + (row % 2 ? 2 : 0);
      const w = width / 5.2;
      kernels += `<path d="M${x - w} ${y - 5} Q${x} ${y - 10} ${x + w} ${y - 5} L${x + w + 1} ${y + 6} Q${x} ${y + 13} ${x - w - 1} ${y + 6}Z" fill="url(#${p}-kernel${col % 3})" stroke="#8b4a22" stroke-width=".8"/><path d="M${x - w + 3} ${y - 3} Q${x - 2} ${y - 7} ${x + w - 2} ${y - 3}" stroke="#ffe6ad" opacity="${.3 + t * .25}" stroke-width="1.5" fill="none"/>`;
    }
  }
  return `<defs>${[0, 1, 2].map((i) => `<radialGradient id="${p}-kernel${i}" cx="29%" cy="22%" r="95%"><stop stop-color="${rgb([249 - i * 6, 207 - i * 10, 118 - i * 8], [242 - i * 7, 153 - i * 15, 63 - i * 5], t)}"/><stop offset=".65" stop-color="${rgb([214, 153 - i * 8, 54], [179, 71 + i * 5, 27], t)}"/><stop offset="1" stop-color="#9b5825"/></radialGradient>`).join('')}</defs>
    <ellipse cx="203" cy="359" rx="68" ry="11" fill="#4e3426" opacity=".14" filter="url(#${p}-shadow)"/>
    <g transform="rotate(14 200 215)"><path d="M180 312 Q165 328 159 345 Q183 353 200 327 Q213 350 231 340 Q232 323 220 309" fill="#b08a4d" stroke="#8e6b3d" stroke-width="1.5"/><path d="M164 341 Q189 331 193 312 M227 336 Q216 329 211 315" stroke="#d6bc81" fill="none" stroke-width="2"/>
    <path d="M190 72 Q200 65 211 74 L224 105 L240 252 Q241 290 222 311 Q201 324 180 311 Q159 295 159 257 L174 112Z" fill="url(#${p}-body)"/>
    ${kernels}
    <path d="M192 78 Q198 65 204 78 L207 90 Q199 93 191 90Z" fill="url(#${p}-soft)"/>
    <path d="M194 76 Q192 60 205 50 Q222 34 234 46 Q248 60 234 78 Q225 89 210 84" fill="none" stroke="url(#${p}-cord)" stroke-width="3"/>
    <path d="M209 84 Q228 96 238 116" fill="none" stroke="url(#${p}-cord)" stroke-width="2.5"/>
    <ellipse cx="237" cy="115" rx="6" ry="8" fill="url(#${p}-turquoise)"/><path d="M239 122 L247 137 M239 122 L240 139" stroke="#943d2e" stroke-width="2" stroke-linecap="round"/>
    <path class="polish-sheen" d="M174 129 Q180 107 190 105 L183 279 Q175 288 171 277Z" fill="#fff1c2" opacity="${.07 + t * .15}"/>
    </g>`;
}

function walnut(p, t, number, transform) {
  let ridges = '';
  for (let i = 0; i < 12; i++) {
    const start = -44 + i * 8;
    const sign = i % 2 ? 1 : -1;
    const d = `M${start * .72} -55 C${start + sign * 15} -43 ${start - sign * 13} -26 ${start + sign * 3} -13 S${start - sign * 15} 12 ${start + sign * 4} 26 S${start + sign * 4} 47 ${start * .68} 58`;
    ridges += `<path d="${d}" fill="none" stroke="#542e1a" opacity=".6" stroke-width="${3.5 + rand(i + number) * 2}" stroke-linecap="round"/><path d="${d}" transform="translate(-2.2 -1.7)" fill="none" stroke="${rgb([226, 169, 107], [210, 113, 64], t)}" opacity=".74" stroke-width="2.8" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 27; i++) {
    const x = -40 + rand(i + number * 73) * 80, y = -49 + rand(i + number * 12) * 95;
    ridges += `<path d="M${x} ${y} q${i % 2 ? 10 : -10} -5 8 -11" stroke="#693d20" stroke-width="2.4" fill="none" opacity=".55"/><path d="M${x - 1} ${y - 1} q${i % 2 ? 10 : -10} -5 8 -11" stroke="#d99b5b" stroke-width="1.2" fill="none" opacity=".5"/>`;
  }
  return `<g transform="${transform}"><defs><clipPath id="${p}-walnut${number}"><path d="M-5 -65 C-18 -71 -30 -60 -37 -52 C-54 -47 -58 -25 -57 -9 C-65 5 -55 28 -46 38 C-42 57 -20 68 -3 64 C13 70 31 60 37 49 C55 38 58 23 55 7 C64 -10 50 -32 42 -41 C32 -61 12 -67 -5 -65Z"/></clipPath></defs><path d="M-5 -65 C-18 -71 -30 -60 -37 -52 C-54 -47 -58 -25 -57 -9 C-65 5 -55 28 -46 38 C-42 57 -20 68 -3 64 C13 70 31 60 37 49 C55 38 58 23 55 7 C64 -10 50 -32 42 -41 C32 -61 12 -67 -5 -65Z" fill="url(#${p}-body)" stroke="#83522d" stroke-width="1.8"/>
  <g clip-path="url(#${p}-walnut${number})">${ridges}<ellipse cx="-22" cy="-29" rx="35" ry="55" fill="url(#${p}-shine)"/><path d="M-5 -62 C3 -34 -3 -2 2 22 Q8 42 1 66" fill="none" stroke="#4f2b19" stroke-width="2.2" opacity=".65"/><path class="polish-sheen" d="M-56 -35 Q-19 -69 21 -56 L-47 48Z" fill="url(#${p}-glint)"/></g></g>`;
}
function walnuts(p, t) {
  return `<ellipse cx="202" cy="332" rx="112" ry="15" fill="#4e3426" opacity=".14" filter="url(#${p}-shadow)"/>${walnut(p, t, 1, 'translate(248 204) rotate(28) scale(1.3)')}${walnut(p, t, 2, 'translate(155 235) rotate(-19) scale(1.24)')}`;
}

function bracelet(p, t, type) {
  const palette = {
    zitan: [[103, 48, 35], [43, 19, 23]], huanghuali: [[177, 116, 48], [111, 57, 28]],
    sandalwood: [[200, 163, 98], [159, 111, 60]], xingyue: [[226, 207, 165], [161, 72, 37]],
    jingang: [[167, 104, 51], [117, 36, 24]], zijinshu: [[139, 85, 46], [85, 35, 20]],
    yedi: [[79, 56, 38], [46, 29, 24]], olive: [[183, 124, 66], [127, 47, 27]],
  };
  const base = palette[type] || palette.huanghuali;
  const color = rgb(base[0], base[1], t);
  const light = rgb(base[0].map(n => clamp(n + 43, 0, 255)), base[1].map(n => clamp(n + 69, 0, 255)), t);
  const dark = rgb(base[0].map(n => n * .43), base[1].map(n => n * .43), t);
  const count = type === 'olive' ? 12 : type === 'yedi' ? 24 : 18;
  const radius = type === 'yedi' ? 13 : type === 'olive' ? 22 : 21;
  let beads = '';
  for (let i = 0; i < count; i++) {
    const a = i / count * Math.PI * 2 - Math.PI / 2;
    const x = 200 + Math.cos(a) * 104, y = 204 + Math.sin(a) * 104;
    let marks = '';
    if (type === 'xingyue') {
      for (let j = 0; j < 13; j++) { const ax = (rand(i * 16 + j) - .5) * 31, ay = (rand(i * 32 + j + 9) - .5) * 31; if (ax * ax + ay * ay < 225) marks += `<circle cx="${ax}" cy="${ay}" r="${.5 + rand(i + j) * .7}" fill="#694429" opacity=".75"/>`; }
      marks += '<ellipse cx="3" cy="-3" rx="2.8" ry="3.7" fill="#543b28"/><ellipse cx="2.5" cy="-3.5" rx="1.3" ry="2" fill="#342c23"/>';
    } else if (type === 'jingang') {
      for (let j = 0; j < 7; j++) { const d = -15 + j * 5; marks += `<path d="M${d * .6} -19 Q${d + 6} -10 ${d - 3} 0 Q${d + 6} 9 ${d * .6} 19" fill="none" stroke="#60351e" stroke-width="2.6"/><path d="M${d * .6 - 1} -18 Q${d + 4} -10 ${d - 4} 0 Q${d + 4} 9 ${d * .6 - 1} 18" fill="none" stroke="#cf8d4d" stroke-width="1" opacity=".8"/>`; }
    } else if (type === 'zijinshu') {
      marks += '<circle cx="-4" cy="-3" r="2.1" fill="#3b261a"/><circle cx="5" cy="-3" r="2.1" fill="#3b261a"/><path d="M-3 6 Q1 10 5 5" fill="none" stroke="#4f2b1c" stroke-width="1.5"/>';
    } else if (type === 'olive') {
      for (let j = 0; j < 5; j++) marks += `<path d="M${-10 + j * 5} -24 Q${-19 + j * 8} -6 ${-10 + j * 5} 0 Q${-18 + j * 8} 13 ${-10 + j * 5} 24" fill="none" stroke="#713c23" stroke-width="2" opacity=".6"/>`;
      marks += '<path d="M-11 -12 Q0 -22 11 -12 M-12 11 Q0 22 12 11" stroke="#c8874c" stroke-width="2" fill="none"/>';
    } else {
      for (let j = 0; j < 4; j++) marks += `<path d="M-18 ${-8 + j * 6} Q0 ${-15 + j * 6} 18 ${-9 + j * 6}" fill="none" stroke="${type === 'zitan' ? '#211718' : '#704224'}" stroke-width="${j % 2 ? '.7' : '1.2'}" opacity="${type === 'sandalwood' ? '.12' : '.25'}"/>`;
    }
    beads += `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(a * 180 / Math.PI + 90).toFixed(1)})"><ellipse rx="${radius}" ry="${type === 'olive' ? 29 : type === 'yedi' ? 10 : radius}" fill="url(#${p}-bead)" stroke="${dark}" stroke-width=".8"/>${marks}<ellipse cx="-${radius * .3}" cy="-${radius * .35}" rx="${radius * .32}" ry="${radius * .22}" fill="#fff1ca" opacity="${.09 + t * .18}" transform="rotate(-25)"/></g>`;
  }
  return `<defs><radialGradient id="${p}-bead" cx="27%" cy="23%" r="83%"><stop stop-color="${light}"/><stop offset=".43" stop-color="${color}"/><stop offset="1" stop-color="${dark}"/></radialGradient></defs>
    <ellipse cx="204" cy="333" rx="103" ry="14" fill="#4e3426" opacity=".13" filter="url(#${p}-shadow)"/>
    <g transform="rotate(-14 200 206)"><ellipse cx="200" cy="204" rx="104" ry="104" fill="none" stroke="#6e2d24" stroke-width="3"/>
      ${beads}
      <path d="M200 91 C185 75 184 55 197 53 C211 53 214 73 201 88 C216 72 235 71 236 82 C236 95 214 97 201 91" fill="none" stroke="url(#${p}-cord)" stroke-width="2.6"/>
      <path d="M200 91 Q211 117 230 126 Q246 135 240 153" fill="none" stroke="url(#${p}-cord)" stroke-width="2.7"/>
      <ellipse cx="239" cy="145" rx="8" ry="11" fill="url(#${p}-turquoise)" stroke="#375b45" stroke-width=".6"/>
      <path d="M236 141 Q240 137 243 141" stroke="#d7e7c7" stroke-width="1.5" fill="none" opacity=".6"/>
      <path d="M239 156 Q231 173 238 183 M240 156 Q245 169 241 181 M237 156 Q230 166 231 177" fill="none" stroke="url(#${p}-cord)" stroke-width="2" stroke-linecap="round"/>
    </g>`;
}

function jade(p, t) {
  return `<defs><radialGradient id="${p}-jade" cx="28%" cy="25%" r="90%"><stop stop-color="#f5f0d8"/><stop offset=".43" stop-color="${rgb([223, 223, 192], [232, 230, 198], t)}"/><stop offset=".8" stop-color="#abbc97"/><stop offset="1" stop-color="#8f9f7c"/></radialGradient></defs>
    <ellipse cx="200" cy="343" rx="76" ry="13" fill="#4e3426" opacity=".12" filter="url(#${p}-shadow)"/>
    <g transform="rotate(8 200 215)"><path d="M191 133 Q168 63 184 35 Q205 11 220 37 Q237 67 209 134" fill="none" stroke="url(#${p}-cord)" stroke-width="3.6"/>
    <path d="M198 119 Q207 106 212 119 L214 135 Q207 140 199 134Z" fill="url(#${p}-turquoise)" stroke="#5e7c5c" stroke-width="1"/>
    <path d="M201 132 Q194 143 199 154 M208 134 Q207 144 204 154" fill="none" stroke="#8b3c2d" stroke-width="2.2"/>
    <path d="M200 143 C246 140 282 181 280 233 C278 285 247 321 200 322 C153 322 121 286 120 233 C119 181 153 143 200 143 Z M200 200 C183 200 172 214 172 231 C172 249 183 261 200 261 C216 261 228 248 228 231 C228 214 217 200 200 200Z" fill="url(#${p}-jade)" fill-rule="evenodd" stroke="#acb497" stroke-width="1.4"/>
    <path d="M193 153 C154 158 128 192 130 233 C130 278 156 309 196 312 M205 208 C218 211 224 224 220 237" fill="none" stroke="#ffffe9" stroke-width="4.3" opacity="${.25 + t * .4}" stroke-linecap="round"/>
    <path d="M151 203 Q137 226 151 251 Q161 273 181 269 M216 178 Q246 182 250 208 M227 284 Q245 278 252 257" fill="none" stroke="#8fa17d" stroke-width="1.3" opacity=".4"/>
    <path d="M146 210 Q136 219 145 232 Q157 236 155 249 M234 173 Q248 174 249 191 Q240 201 252 211 M224 297 Q238 301 248 286" stroke="#f6f0d9" fill="none" stroke-width="3" opacity=".55"/>
    <ellipse class="polish-sheen" cx="157" cy="187" rx="8" ry="18" fill="#fffdeb" opacity="${.1 + t * .35}" transform="rotate(34 157 187)"/>
    </g>`;
}
