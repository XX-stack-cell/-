# GIF 03 核桃掌托动作素材

使用内置 ImageGen，透明背景；裸手先生成并检查，棉手套以该裸手图作编辑目标，保持几何一致。参考为用户提供的 `ChatGPT GIF 2026年11月1日 18_01_11.gif` 首帧右上第 03 格。图片是生成素材，不是用户手部照片。

## 裸手 `reference-walnut-bare.png`

Use case: photorealistic-natural.
Asset type: transparent photographic hand cutout for a desktop wenwan companion, square 1024 by 1024 canvas.
Input image: pose reference only, cropped panel 03 from the user's reference GIF (`artifacts/reference/item-03-first.png`). Ignore its background and the two walnuts; preserve its hand pose and camera angle.
Primary request: recreate this natural broad-palm walnut supporting pose as a single isolated adult right hand with the walnuts removed. The right hand enters from the lower-right, palm faces the camera and slightly upwards. Four relaxed fingers curl gently along the left and upper-left edge, as if lightly supporting the undersides and left sides of two side-by-side walnuts. The thumb rests at the upper-right edge and does not stretch across or hide the central palm. Keep the palm broad, anatomically correct, relaxed and slightly cupped; show the intact, continuous skin of the empty palm where the two walnuts used to be. There is no central hole and no circular C-shaped pinching pose, no fist, no grasping empty air.
Composition/framing: one hand only; fingertips remain inside the upper-left and upper part of the square with a small transparent margin; the wrist enters and is naturally cropped at the lower-right edge. Large usable palm surface occupies the central area, approximately x=35–72%, y=34–68%; it will receive two separate 41 mm walnut sprites later. Match panel 03 camera angle and hand proportions, enlarging the hand consistently to fill the square without cutting off fingers.
Style/medium: photorealistic macro product photograph, adult warm natural skin, realistic palm creases, pores, softly groomed nails, subtle natural variation, no jewelry. Soft diffuse upper-left daylight, gentle shading; realistic hand volume without dramatic shadows.
Constraints: real transparent alpha background everywhere outside the hand. Leave the palm as skin, not transparency. Remove both walnuts and all other objects completely. Exactly five anatomically plausible fingers. No objects, no text, no numbers, no grid, no collage, no table, no dark backdrop, no watermark, no cartoon or plastic CGI finish.

## 棉手套 `reference-walnut-glove.png`

Use case: precise-object-edit.
Asset type: matching transparent photographic hand cutout for a desktop wenwan companion.
Input image: the generated and approved reference-walnut-bare.png is the edit target, not merely inspiration.
Primary request: change only the visible bare skin into a close-fitting ivory-white cotton jewelry-polishing glove. Preserve the exact hand pose, silhouette, camera, framing, scale, finger positions, wrist position, palm opening, lighting direction and transparent alpha. The broad empty palm remains a continuous glove fabric surface, ready to receive two separate walnut sprites; no hole, no C-shaped pinching pose, no fist. The thumb stays at the upper-right and does not cross the palm. Keep the same square dimensions.
Materials/textures: fine realistic cotton knit, understated seams along finger edges and natural small folds following the existing joints. Preserve natural relaxed finger anatomy and three-dimensional palm volume. Cotton should look soft and thin, not padded ski gloves, rubber or latex.
Constraints: exactly one gloved right hand and no objects. Do not add walnuts. No background, no text, no watermark. Preserve real transparency outside the hand and keep the full palm fabric intact.

## 检查与接入记录

两张图片均已保存为 1254 × 1254 RGBA PNG（工具最终输出尺寸），保留真实透明通道。裸手和手套图的手指、拇指、腕口及掌心位置近似一致；以 alpha > 200 的主体轮廓计算，交并比约为 98.58%，两图主体各只有一个连通分量。手套仅有合理布料增厚。未修改应用渲染代码。

下列坐标以整张图左上角为 `(0, 0)`，单位为画布百分比，是接入建议，尚未在应用中做遮挡合成验证：

- 宽掌心可放置区域：`x=36–78%, y=34–72%`；手掌完整，没有透明洞。
- 两核桃建议中心：左 `(45%, 40%)`，右 `(68%, 49%)`；单颗可见外径约 `25–28%` 画布宽。对应 320 px 场景，中心约 `(144,128)` 与 `(218,157)`，直径约 `80–90 px`。若现有核桃图片本身含透明留白，应按实际不透明包围盒校正。
- 四指边缘可作为前景遮挡的保守多边形：`polygon(10% 17%, 26% 17%, 41% 29%, 49% 39%, 45% 47%, 39% 57%, 32% 65%, 20% 57%, 10% 40%)`。中间的掌面必须留在物件后方，不要将整手作为前景。
- 拇指前景遮挡建议：`polygon(54% 19%, 64% 19%, 75% 16%, 84% 23%, 84% 32%, 76% 39%, 66% 35%, 56% 30%)`。拇指主要覆盖物件右上边缘，避免横挡整个掌心。
- 食指指腹中心约 `(33%, 15%)`，中指 `(18%, 26%)`，无名指 `(15%, 37%)`，小指 `(23%, 51%)`，拇指指腹约 `(65%, 26%)`；手腕从右下角进入。

两张源图的外缘有生成透明图常见的极低透明度细边，主体与掌心约为 99% 不透明；未进行抠图后处理。源素材和提示词保留以供复现；动作只作游戏视觉表达，不保证物理尺寸或专业手法。
