# GIF 参考：手串拨珠手部素材

生成日期：2026-11-01。使用内置 image_gen：先用 GIF 的静态切片作姿势参考生成裸手；目视确认后，以裸手为编辑目标生成同姿势棉手套。两张 PNG 均保留生成器原始 alpha，未二次抠图、缩放或修改像素。未修改渲染代码。

## 输入与输出

- 用户 GIF：`ChatGPT GIF 2026年11月1日 18_01_11.gif`，50 帧、4 秒。
- 主姿势参考：`artifacts/reference/item-05-first.png`。
- 次参考：`artifacts/reference/item-12-first.png`。
- 裸手：`assets/interactions/reference-beads-bare.png`。
- 棉手套：`assets/interactions/reference-beads-glove.png`。
- 输出尺寸：两张均为 1254 × 1254，RGBA PNG。
- 透明性验证：PNG 解码逐像素检查。主体范围以下均按 alpha > 127 计算；画布左侧 34% 内最大 alpha 为 1/255，视觉上透明。少量 alpha=1 的生成器边缘噪声存在于其他透明区域，不能用 alpha>0 的包围盒计算实际主体大小。

## 实际主体范围与合成锚点

坐标以整张图左上角为原点、宽高归一化；以下指尖与接触面坐标为目视估计，主体包围盒为实际 PNG 逐像素计算。

| 项目 | 裸手 | 棉手套 |
| --- | --- | --- |
| 主体像素 x 范围 | 447–1253 | 446–1253 |
| 主体像素 y 范围 | 172–1253 | 167–1253 |
| 主体 x 百分比 | 35.65–99.92% | 35.57–99.92% |
| 主体 y 百分比 | 13.72–99.92% | 13.32–99.92% |
| 主体面积比例 | 41.21% | 41.49% |

- 拇指接触珠子的下侧：约 x=54–63%、y=24–28%；在 320px 素材画布中约 x=173–202px、y=77–90px。
- 拇指最左端约 x=51%、y=18%，不宜把此处误作下侧拨珠接触点。
- 食指指腹约 x=50–55%、y=34–39%；其余手指前缘依次约 x=55–61%、y=50–54% / 61–65% / 69–73%。
- 左侧约 x<34% 全高可作为串珠展示区；下左侧同样开放。手掌本体内没有虚构的大型透明孔。
- 建议先将串珠椭圆上右段对准拇指下侧，环的右侧穿过轻蜷四指；把大部分左弧、下弧保留在手外，避免将整个圈挤成拇指与食指之间的小环。
- 素材是一个完整手部。掌心作为后层时，前景遮挡层应覆盖拇指上方及弯曲指腹，切勿把整只手重复压到串的左侧与下侧。
- 手套在同一裸手上编辑而成，整体姿势与锚点相近；布料厚度和局部轮廓存在几个像素至约 1% 画幅的自然偏差，并非逐像素配准。

## 裸手完整提示词

```text
Use case: product-mockup. Asset type: a single photorealistic transparent HAND-ONLY animation/compositing sprite for a wenwan bead-rolling desktop app.
Input images: Image 1 is the main POSE reference (the hand holding a golden-brown round-bead bracelet); Image 2 is a secondary natural-relaxation reference (the hand holding an olive-pit bracelet). Reference the HAND POSE only. Do not reproduce the bracelets, dark cloth background or commercial photography composition as background.
Primary request: create one anatomically correct adult right hand, palm facing viewer in a gentle three-quarter view, wrist entering diagonally from lower right. Closely match the relaxed hand in Image 1: four fingers are softly curled and stacked one above another inside the space where the bracelet loop would go; fingertip pads face viewer near the upper-middle-left of the hand. The index finger is bent at top, middle/ring/little finger tips gently curl below it. The thumb extends leftwards across the top from the upper-right hand, as if pressing and advancing ONE bead at a time, while the other four fingers loosely support the loop from inside. There is NO bracelet or bead in the output. The thumb and index pad approach at the top but do NOT form a touching OK sign. Do NOT make a tight closed fist, a C-shaped clamp, a squeezing pinching gesture or an open palm with stretched fingers. This is a soft relaxed bead-feeding pose matching the supplied photo.
Composition: square canvas. The wrist and palm occupy middle-right and lower-right, leaving most of the left half plus the lower-left area completely clear and transparent for the hanging bead loop. The hand including short wrist occupies about x=34% through 96%, y=16% through 96%. Approximate thumb contact pad at (61%,29%); softly curled finger pads around x=48–58%, y=39%,49%,59%,68%. Leave transparent negative space to the left of these fingertips and between any separated fingers. Do not invent a large oval cutout through the palm. Entire hand silhouette at natural size, not zoomed macro fingertips, no awkwardly detached parts.
Materials and lighting: real natural clean short nails and subtle warm skin tone, fine believable skin creases and pores, soft neutral studio illumination from upper-left, photoreal catalog quality matching reference light.
Constraints: exactly one hand with five fingers, no extra digits, no jewelry. NO bead, string, bracelet, ring, object or prop anywhere. No painted residual bead shapes. Genuinely transparent alpha background everywhere outside the hand including any gaps, not black, white or grey backdrop; no tabletop, shadow plane, labels, numbers, text, branding, watermark, illustration or plastic 3D rendering. Preserve empty areas needed for later layering.
```

工具参数：`transparent_background: true`；`referenced_image_paths` 为上述第 5、12 格参考图片。

## 棉手套完整提示词

```text
Use case: precise-object-edit. Edit target: the supplied transparent image of one relaxed hand in a bead-feeding pose. Change ONLY skin and nails to a fitted plain warm ivory-white cotton wenwan handling glove. Preserve exactly the same five-finger anatomy, softly curled four fingers, horizontal upper thumb, hand pose, empty left area, silhouette, finger pad positions, scale, frame crop, wrist at lower right and upper-left photographic illumination. Preserve the true transparent alpha background and every transparent gap; do not add a background, cut an artificial hole through the palm, widen the grip, close a fist or form a C-shaped/OK gesture. The glove has a realistic very fine matte cotton knit, restrained fabric seams and soft natural folds around curved fingers; all fingers and visible wrist covered, no nail or skin exposure. NO bracelets, beads, rings, string, sphere, props or object anywhere. No text, watermark, labels, branding, extra hand, extra digit, illustration or 3D cartoon. This is a precisely registered cotton-glove alternate to the same original hand sprite for compositing. Do not reposition the hand or change empty space.
```

工具参数：`transparent_background: true`；`referenced_image_paths` 为已检查的裸手生成 PNG。只将肤色/指甲换为细织棉手套，要求保留姿势、画幅、左侧留白与透明指缝。

## 检查记录

已查看两张最终 PNG：单只手、五指，右下进入，四指自然轻蜷、拇指在上方；没有串珠、绳、物件、文字或背景。它们用于 GIF 第 4–10 / 12 格一类的手串拨珠姿势，不替代葫芦与核桃的独立握姿。

