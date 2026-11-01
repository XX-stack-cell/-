# 小物件包握手素材

日期：2026-11-01。使用内置 imagegen；先独立生成裸手，查看生成 PNG 后，以裸手本地文件作为 referenced_image_paths 编辑为棉手套。未使用 CLI / API key，未用程序合成或修图。

交付：

- assets/interactions/small-grip-bare.png
- assets/interactions/small-grip-glove.png

两图均为 1254 × 1254 RGBA PNG，已逐张打开观察，sips 验证存在 alpha。两图基本保持同一握持轮廓、指位和裁切。图形已明显收拢，掌心非摊开；一手从右下方进入、四指弯曲在左、拇指在右上，中央为可叠放小物件的透明孔洞。

构图检查：虽然提示词目标握孔中心为 (50%,44%)，实际生成握孔中心约 (49.5%,36.5%)；孔洞边界约 x=39%–60%，y=21%–52%。应用应按实际图形定位，不能沿用提示词里的 44%。手腕在右下角接边，主体包含短腕，无额外手臂。

建议叠层：将整张手图作为后层，物件居于握孔位置且轮廓略压入指缘，再把同图左侧指尖区与右上拇指区作为前景遮挡层。裸手与手套分别沿相同遮挡路径裁剪。不要把中间整个空孔也作为前层覆盖。

裸手完整提示词：

```text
Use case: product-mockup. Asset type: photorealistic hand-only transparent sprite for a premium desktop app; the app will composite a miniature gourd 3.5 cm wide into this hand. Primary request: one anatomically correct adult LEFT hand in a genuinely ENCLOSING SMALL-OBJECT GRIP, not an open supporting palm. Palm faces toward camera in a slight three-quarter view. Wrist enters diagonally from lower right. All four fingers naturally curl inward toward the palm, forming the left, lower-left and lower sides of a compact grip; the thumb bends inward from the RIGHT and rests prominently in front at upper right. Bent index finger is at upper left and curved middle/ring/little fingers wrap the bottom; realistic fingertip pads and some nails face viewer. The pose must look like comfortably wrapping around and securely holding an invisible small 3-to-4-centimeter object, with opposing thumb and fingers very close together. No flat extended fingers, no open outstretched palm, no pointing, no OK sign, no detached finger. There is NO object. Leave one clear genuinely transparent vertically oval negative-space aperture between the curled fingers and thumb, centered exactly at about x50% y44% of square canvas, about 24% of canvas wide and 30% tall, the grip surrounding it closely. No large visible flat palm across this aperture. Palm/hand back forms the back-lower support outside the opening. Keep fingertips naturally in the foreground suitable for later layered occlusion of the held object. Complete hand and short wrist are centered and fully contained, hand height including wrist 80% of canvas, outer silhouette has ample transparent margins, no arm cut awkwardly through canvas edge. Fine real skin pores, subtle creases, gentle warm neutral skin tone, natural short clean nails, no rings or jewelry. Professional macro product photograph, large softbox upper left and gentle fill, sharp natural photographic detail without oversmoothing. Background genuinely transparent alpha, including the small central grip opening; no colored or white backdrop, no floor or cast shadow. Only this single hand; no objects, gourd, spheres, props, text, watermark, branding, illustration, plastic mannequin or 3D cartoon. Square canvas.
```

手套编辑完整提示词：

```text
Use case: precise-object-edit. Edit target: the supplied transparent photo of a single curled left hand forming a compact small-object grip. Change ONLY the skin surface to a fitted soft natural ivory-white fine cotton wenwan handling glove. Preserve the exact same hand, finger count, pose, silhouette, anatomy, curled finger locations, thumb, wrist direction, view angle, photographic lighting, scale, crop and composition. Preserve every transparent region, especially the central vertical oval transparent grip opening, at its exact current pixel position and size; do NOT fill the hole with palm or glove. The glove has a fine realistic knitted cotton weave, subtle stitched seams, natural cloth folds around the tightly curved knuckles, fitted covered fingertips, a simple cuff at the wrist, and diffuse matte highlights. The whole hand wears the glove: no exposed nails, skin, bare wrist or jewelry. Do not add or remove any finger. Do not widen or open the grip. Do not add an object. Keep the same genuinely transparent alpha background, no tabletop, background, props, shadow plane, text, logo, watermark, drawing or 3D cartoon. Only this one cotton-gloved hand. This is an exactly registered companion sprite to the original bare hand.
```

