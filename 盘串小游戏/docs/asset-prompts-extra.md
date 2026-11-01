# 进阶物件写实素材与生成提示词

使用内置 imagegen 工具，一件物件对应一次独立生成，transparent_background=true。所有六张图已检查并复制到项目 assets/items/，原始 alpha 保留，未做 Python 栅格编辑。

网页照片仅用于识别真实形态与纹理；项目素材全部独立生成，未直接下载、重用网页照片。参考来源可能为商家或玩家，仅作外观参考，不作为材质鉴定或养护结论。

## 外观参考

- [星月菩提](https://us.tansatelier.com/product-page/12-5-10mm-star-moon-bodhi-original-white-beads-mala-bracelet)：奶白籽皮、细密深色星点、单个月眼；参考外形，不采纳页面功效宣称。
- [金刚菩提](https://www.carousell.sg/p/natural-bodhi-rudraksha-seed-mala-%E9%87%91%E9%A3%8E-beads-bracelet-14-53g-11-8-mm-21-beads-1271097609/)：粗糙自然沟壑、纵向分瓣，初期棕褐色。
- [紫金鼠](https://www.pinkoi.com/product/xrkYj2Xx)：椭圆籽形、自然鼠眼与深浅褐色籽皮；不采用商家健康或风水宣称。
- [椰蒂](https://healing-sounds.com/products/coconut-shell-3x8mm-positive-bracelet)：薄片药片形、深黑褐色椰壳与天然细纹；生成图不加入铜饰。
- [和田玉](https://www.thejadejewellery.com/products/92441)：平安扣厚圆边、小中孔、柔和油脂感、棉絮质感；生成图采用素绳。
- [橄榄核](https://item.jd.com/54650666109.html)：椭圆核形、天然棕褐材质、浅浮雕沟槽；生成图采用通用花叶纹，未复刻具体作品。

## 提示词与交付路径

### xingyue

保存：`assets/items/xingyue.png`。内置工具实际输出 1254 × 1254 RGBA PNG，透明背景，已人工检查主体与材质特征。

```text
Use case: product-mockup. Asset type: individual transparent PNG cutout for a desktop wenwan collectible game. Primary request: a physically real Chinese 星月菩提 single-loop bracelet, 18 naturally creamy ivory short-barrel bodhi-seed beads, subtle uneven natural seed material; each bead has many tiny dark brown pinprick pores and one clearly larger recessed crescent moon-eye pore, not painted polka dots. Pristine new unhandled starting condition, matte to satin, no yellow patina. Macro catalog product photography with excellent tactile pore detail. Composition: one complete bracelet in a relaxed near-circular oval seen from 30 degrees above, centered in a square 1024 x 1024 canvas, bracelet fills about 72 percent of canvas width and 65 percent of height, entire object fully visible with generous empty transparent margin. Warm soft daylight from upper left, restrained natural highlights, realistic dimensional depth, crisp seed edges, no white halo. Scene/backdrop: genuinely transparent alpha background. Constraints: only this bracelet and its tiny natural dark-brown knot, no precious spacers, no hands, no gloves, no brush, no tray, no support, no stand, no surface, no environmental background, no cast floor shadow, no text, no symbols, no logos, no watermark. Avoid CGI or vector appearance, oversized perfectly spherical white pearls, fake uniform freckle pattern, shiny plastic, aged dark color. Natural new seed texture is essential.
```

### jingang

保存：`assets/items/jingang.png`。内置工具实际输出 1254 × 1254 RGBA PNG，透明背景，已人工检查主体与材质特征。

```text
Use case: product-mockup. Asset type: individual transparent PNG cutout for a desktop wenwan collectible game. Primary request: a real Chinese 金刚菩提 rudraksha seed single-loop bracelet of 13 medium-size natural five-lobed seeds, each seed russet-tan light warm brown in pristine new unhandled condition. Show the botanical deep branching labyrinth fissures, coarse interlocked knobbly ridges and five longitudinal seams characteristic of authentic rudraksha, with modest irregularity between seeds. Matte raw dry seeds, not glossy red polished pearls, not artificial carved wooden spheres. Macro catalog photography with strong realistic tactile microtexture. Composition: one complete bracelet in a relaxed near-circular oval viewed from 30 degrees above, centered on square 1024 x 1024 canvas, bracelet fills 72 percent of width and 65 percent of height; entire outline visible with generous transparent margins. Small dark brown string knot only. Warm soft daylight upper left, subtle natural shading within seed grooves, realistic volume, sharp clean edges. Genuinely transparent alpha background; absolutely no hands, glove, brush, stand, holder, table, surface, floor shadow, other props, text, logos or watermark. Not a cartoon, SVG, abstract blob, CGI or plastic; preserve intricately corrugated natural seed texture.
```

### zijinshu

保存：`assets/items/zijinshu.png`。内置工具实际输出 1254 × 1254 RGBA PNG，透明背景，已人工检查主体与材质特征。

```text
Use case: product-mockup. Asset type: individual transparent PNG cutout for a desktop wenwan collectible game. Primary request: real natural Chinese 紫金鼠 bodhi seed single-loop bracelet of 16 oval squat seed beads, each naturally golden khaki brown with darker cocoa markings, and clearly recognizable mouse-face natural embryo features: two neighboring small dark oval eye pores and a smaller nose pore at one end, natural mottling and subtle seed wrinkles. Starting new lightly cleaned condition with restrained satin sheen, not already red aged or highly polished. Macro studio product photography emphasizing authentic botanical seed skin and asymmetrical mouse-eye features. Composition: one whole bracelet in a loose circular oval viewed 30 degrees from above, centered square 1024 x 1024, object fills 72 percent of width and 65 percent height, transparent generous margin all around. Brown string with tiny knot, no gemstone accessories. Warm diffuse daylight from upper left; realistic soft three-dimensional shading, no harsh glare. Background is genuinely transparent alpha, no floor plane, no cast floor shadow. Only bracelet: no hand, glove, brush, pedestal, stand, tray, text, watermark, logo, packaging or decorations. Avoid purple metal, cartoon mice, fake facial drawings, shiny plastic spheres, uniformly round brown wooden bead texture.
```

### yedi

保存：`assets/items/yedi.png`。内置工具实际输出 1254 × 1254 RGBA PNG，透明背景，已人工检查主体与材质特征。

```text
Use case: product-mockup. Asset type: individual transparent PNG cutout for a desktop wenwan collectible game. Primary request: one authentic Chinese 椰蒂 coconut-shell disc bead bracelet, a single loop made of about 48 thin dark espresso-black natural coconut-shell discs, each disc about 8 mm in diameter and 3 mm thick. Dense very dark brown nearly black material, fine longitudinal organic coconut grain and tiny natural brown seed-eye specks, gently rounded tablet edges, flat-disc sides clearly visible on front-facing beads, individual disc segments visible rather than a smooth rubber tube. New unhandled matte to soft-satin condition, no red aging, no glitter or copper inlays. Style: photorealistic macro premium product photograph, tactile real natural material. Composition: whole bracelet forms a simple relaxed near-circular oval, 30-degree view from above, centered square 1024x1024, full object fits comfortably in central 72 percent width with generous transparent margins; tiny dark brown cord knot only, no tassels or accessories. Warm diffuse side light and subtle highlights that reveal black bead edges without making them silver. Genuinely transparent alpha background, no visible surface, no cast floor shadow. No hand, glove, brush, tray, pedestal, packaging, text, logo or watermark. Avoid round black pearls, black gemstones, metal discs, rubber, vector illustration, CGI appearance, blurred bead boundaries.
```

### hetian

保存：`assets/items/hetian.png`。内置工具实际输出 1254 × 1254 RGBA PNG，透明背景，已人工检查主体与材质特征。

```text
Use case: product-mockup. Asset type: individual transparent PNG cutout for a desktop wenwan collectible game. Primary request: a single authentic Chinese 和田玉青白玉平安扣 pendant, carved pale celadon-white nephrite jade bi disc with a small circular central hole and softly convex rounded front surface, thick rounded outer edge. Realistic fine-grained dense nephrite texture, muted warm ivory with a restrained gray-green celadon undertone, semi-translucency only along thin edges, understated oily wax-like satin luster, extremely subtle natural cloudy inclusions; not glass, emerald, shiny ceramic or plastic. New unhandled starting condition. One short dark brown silk cord threads through top of central hole, rising to a tiny simple loop above, no necklace chain, no gemstones or ornate fittings. Photorealistic premium macro catalog product photograph. Composition: pendant facing camera with slight 12-degree three-quarter turn to reveal its thickness, centered square 1024x1024, jade disc fills60 percent of canvas width and pendant including short loop fills72 percent height, generous transparent margins. Soft warm diffuse daylight upper left, broad restrained highlights and realistic smooth bevels, crisp silhouette. Genuinely transparent alpha background, no surface, no cast floor shadow. Absolutely no stand, hand, glove, brush, display holder, tray, background, packaging, text, watermark or logo. No carved writing, no scratches, no age patina, no fantasy glowing green.
```

### olive

保存：`assets/items/olive.png`。内置工具实际输出 1254 × 1254 RGBA PNG，透明背景，已人工检查主体与材质特征。

```text
Use case: product-mockup. Asset type: individual transparent PNG cutout for a desktop wenwan collectible game. Primary request: one authentic Chinese 橄榄核雕手串 olive-pit carving bracelet made of 9 elongated oval natural olive-pit beads, each with fine traditional shallow relief carving of abstract lotus petals, clouds and winding vines. Warm light honey-tan to caramel-brown natural pit material in a new unhandled starting condition, visibly dense botanical pit grain, minute natural pores and deeper darker brown carving recesses. Oval pointed-end olive-pit shapes remain recognizable; not spherical wood pearls. No faces or gods, no lettering, no precious gemstone accessories; small dark brown string knots between pits only. Matte to restrained satin surface, not mature dark red high-gloss finish. Photorealistic macro premium catalog product photography showing crisp artisanal relief detail and physical texture. Composition: whole single-loop bracelet in a relaxed circular oval, seen30 degrees from above, centered square1024x1024, complete outline confined to72 percent canvas width and65 percent height, generous transparent margins. Warm soft diffuse daylight upper left, tactile natural shadows inside carving, crisp silhouette. Genuinely transparent alpha background, no surface, no cast floor shadow. No hands, glove, brush, stand, holder, tray, packaging, background, text, brands, watermark, cartoon or CGI look. The natural elongated carved olive pits are essential.
```
