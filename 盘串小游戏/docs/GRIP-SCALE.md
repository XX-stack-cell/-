# 握持与比例

使用统一的 320px 手部场景。手掌在物件之后，弯曲指腹与拇指在物件之前；主界面与透明桌面挂件共用素材、构图和遮挡规则。裸手与棉手套按同一参考姿势分别生成，并保留每种物件的尺寸、位置和前景遮挡微调。

握姿与动作参照用户提供的 GIF，分为四类：

| 姿势 | 物件 | 承托与局部动作 |
| --- | --- | --- |
| `pinch` 侧握揉擦 | 文玩玉米、葫芦、和田玉 | 四指从背后与侧面承托，拇指在物件正面短距离揉擦；玉件按自身轮廓保留孔洞与绳结。 |
| `walnut` 浅掌托滚 | 双核桃 | 两枚核桃落在浅掌窝，四指自然浅弯；拇指推滚核桃，物件可有较明显的局部滚转。 |
| `beads` 环内拨珠 | 小叶紫檀、海南黄花梨、金刚菩提、紫金鼠 | 四指轻蜷在串环内，拇指在顶部按拨珠子；大部分左侧和下侧串弧露在手外。 |
| `loose` 松握捻珠 | 老山檀香、星月菩提、椰蒂、橄榄核 | 拇指与食指在顶部轻捻，其余手指更放松地支持串环，保持各物件的珠径与串形差别。 |

掌根与手腕保持稳定，主要运动分配给拇指和接触处的珠子、物件；整个场景不再大幅左右摇摆。这是基于参考图像的二维分层与局部动作模拟，不是三维关节追踪，也不声称逐帧复原真实手指轨迹。

这是按代表规格制作的视觉比例，不声称所有文玩与所有人的手都具有同样尺寸。实物素材的透明留白、透视和藤柄也参与画布尺寸，不能把PNG画布边长当作物件直径。

- 小葫芦参考主体约4–7cm的手捻规格，手指围住下腹，藤柄露出。公开实例：[京东实物规格](https://item.jd.com/product/Awd1U1k-xwq_7-S9mbPkgg.html)。
- 核桃按单颗约41mm、两颗合计约8cm的量级，宽度接近成人掌宽。[Banri尺寸选购说明](https://www.banri.co/blogs/the-ritual/how-to-choose-your-first-wenwan-walnut-pair-a-buyers-guide)给出不同毫米规格及手型选择的实例。
- 小型观赏玉米取约7cm长的量级。[种子商Strawberry Popcorn](https://www.rareseeds.com/products/corn-strawberry-popcorn)提供2–3英寸小穗的品种实例；这不是对黄色游戏素材品种的鉴定。
- 手串整体外径按约8–9cm的量级。珠数和珠径影响整体大小，界面不额外声称图片是20mm珠。规则圆环可用外径近似式 D=d/sin(pi/n)+d 作构图参考。
- 和田玉把件采用侧握揉擦姿势（`pinch`），四指从后侧承托玉石，拇指在正面局部揉擦，并露出绳结。物件取掌中可握尺寸；不同实物可大幅变化，例如[佳士得6cm白玉雕件](https://www.christies.com/en/lot/lot-5000225)。图片含绳结，尺寸判断以玉石主体为准。

八张参考握姿 PNG 由内置 imagegen 生成，位于 `assets/interactions/reference-{pinch,walnut,beads,loose}-{bare,glove}.png`。每类均包含裸手与棉手套；手套以对应裸手作编辑参考，整体构图相近，布料厚度与局部轮廓仍可能略有差别。分层遮挡直接在应用内合成，不修改原始 PNG。

完整提示词与素材锚点分别见[侧握揉擦](asset-prompts-reference-pinch.md)、[核桃托滚](asset-prompts-reference-walnut.md)、[环内拨珠](asset-prompts-reference-beads.md)、[松握捻珠](asset-prompts-reference-loose.md)。原 GIF 的逐格观察、提取帧与动作幅度说明见 [ANALYSIS.md](../artifacts/reference/ANALYSIS.md)。
