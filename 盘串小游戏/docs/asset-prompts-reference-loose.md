# GIF 参考：松握顶部捻珠手部素材

使用内置 `image_gen` 工具（未使用 CLI/API），阅读 imagegen 技能后生成。先生成裸手，再以裸手为编辑目标生成同姿势棉手套。原 GIF 只读提取的第 06/07/10/12 格提供姿态参考，第 12 格为主。图片均用于项目，不是原 GIF 的直接抠图。

最终资源：

- `assets/interactions/reference-loose-bare.png`
- `assets/interactions/reference-loose-glove.png`

二者均为 1254×1254 RGBA PNG，真实透明 alpha；一只成人右手，从右下进入，上方拇指/食指轻捻，下方三指浅弯展开，空手、无珠无物，无人工掌心孔。手套基于裸手编辑，轮廓与指尖基本对应。生成结果的捻持位置约在画布 (50%,25%)，下方三指端点约 (45–52%,38–63%)，集成时应以实际图形定位；这比提示词目标偏左，未通过代码移动或裁切修图。

参考图片：

- `artifacts/reference/item-06-first.png`
- `artifacts/reference/item-07-first.png`
- `artifacts/reference/item-10-first.png`
- `artifacts/reference/item-12-first.png`

裸手完整提示词：

```text
Use case: photorealistic-natural.
Asset type: a transparent photographic hand cutout for a desktop bead-polishing companion.
Reference images 1–4 show real loose bead-handling gestures; image 4 (olive-pit loop) is the primary pose reference. Use only the relaxed hand anatomy and camera orientation from the references. Do not include their beads, background, or objects.
Create exactly ONE anatomically correct adult RIGHT BARE HAND, empty, in a relaxed TOP PINCH gesture suitable for loosely feeding a bead loop. The wrist enters from the LOWER RIGHT corner and most of the hand lies in the RIGHT HALF of a square canvas. Palm side is visible in a gentle three-quarter view, matching the primary reference. The thumb and index finger lightly approach each other near the upper center-right, contact point around x61%, y23%, with a tiny natural gap. Below them, the middle, ring and little fingers stay relatively OPEN and only shallowly curved, separated naturally, their fingertip arc roughly x53–61%, y35–70%. These lower three fingers must NOT curl into a fist and must NOT form the tight C-ring grip of gripping a cylinder. Leave open transparent space to the LEFT and BELOW the pinch for a future hanging oval bead loop. This is a relaxed hand, not an artificial hand with a hole carved through the palm; the palm itself remains continuous, solid and anatomically natural.
Composition: 1024-square-style image, only one hand and short wrist, all fingertips entirely inside frame, generous transparent margin on the left. Warm natural skin, detailed pores, creases, nails and believable joints, soft diffused neutral studio light, photographic realism consistent with the references.
Absolutely no beads, no strings, no walnut, no stone, no held object, no glove, no sleeve, no second hand, no extra fingers, no text or watermark. Entire background must have real transparent alpha, no gray or white backdrop, no cast shadow on a background.
```

手套完整编辑提示词：

```text
Use case: identity-preserve / precise-object-edit.
Edit target: the attached transparent photographic RIGHT bare hand. Make exactly one change: dress this very same hand in a thin fitted ivory-white cotton polishing glove.
STRICT INVARIANTS: preserve the complete hand silhouette, exact finger joints and fingertip locations, every gap between fingers, the top thumb/index loose pinch, the three relaxed shallowly curved lower fingers, hand and wrist scale, camera orientation, canvas size, framing, lighting direction, wrist entering lower right, open space on the left and beneath the pinch. Do not tighten it into a fist or C-ring grip. Do not move the hand or invent a palm hole.
Replace all visible bare skin and nails with realistic thin matte cotton glove fabric, subtle knitted weave, believable small finger seams and gentle fabric folds following the existing anatomy. Keep the glove thin, with no exaggerated puffy padding. There must be ONE right hand only, no skin showing, no held object, no bead, no string, no jewelry, no sleeve, no extra fingers, no text or watermark.
Preserve genuinely transparent alpha everywhere outside the hand and in the natural inter-finger gaps; no white, gray or checkerboard background. This is an empty loose top-pinch hand that will receive a bead-loop overlay later.
```

默认生成原件留存于 CODEX_HOME/generated_images/01a1964a-6b1f-71d2-8afb-0b83b5abb71f/：

- 裸手：`exec-5e2485a3-49f1-49f3-895d-694651f01d56.png`
- 手套：`exec-5dff14d0-b276-4b90-84ba-c7137bb59a9c.png`

