import { _decorator, Component, Node, Vec3, UITransform, Canvas, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ground')
export class Ground extends Component {

    // ground1 — ပထမမြေပြင် node (Inspector ထဲမှ ဆွဲထည့်ရန်)
    @property({ type: Node, tooltip: 'Ground segment 1' })
    public ground1: Node = null;

    // ground2 — ဒုတိယမြေပြင် node
    @property({ type: Node, tooltip: 'Ground segment 2' })
    public ground2: Node = null;

    // ground3 — တတိယမြေပြင် node
    @property({ type: Node, tooltip: 'Ground segment 3' })
    public ground3: Node = null;

    // gameSpeed — မြေပြင် ရွေ့လျားနှုန်း (တစ်စက္ကန့်လျှင် pixel အရေအတွက်)
    @property({ tooltip: 'Scroll speed in pixels per second' })
    public gameSpeed: number = 300;

    // grounds — မြေပြင် node အားလုံးကို စုစည်းထားသော array
    private grounds: Node[] = [];

    // widths — မြေပြင်တစ်ခုစီ၏ အကျယ် (width) များ
    private widths: number[] = [];

    // rightOffsets — node ၏ x မှ ၎င်း၏ ညာဘက်အစွန်းအထိ အကွာအဝေး
    private rightOffsets: number[] = [];

    // totalWidth — မြေပြင်အားလုံး၏ အကျယ် စုစုပေါင်း (belt အရှည်)
    private totalWidth: number = 0;

    // viewLeft — မျက်နှာပြင်၏ ဘယ်ဘက်အစွန်း world x တန်ဖိုး
    private viewLeft: number = 0;

    // tmp — တွက်ချက်ရာတွင် ပြန်သုံးနိုင်သော ယာယီ vector (frame တိုင်း object အသစ်မဆောက်ရအောင်)
    private tmp: Vec3 = new Vec3();

    // onLoad() — ဂိမ်းစတင်ချိန် တစ်ကြိမ်သာ အလုပ်လုပ်သည်။
    // မြေပြင် node များ၊ width များ၊ anchor များနှင့် မျက်နှာပြင်၏ ဘယ်ဘက်အစွန်းကို
    // ကြိုတင်တွက်ချက်ပြီး သိမ်းဆည်းထားသည် (update ထဲတွင် ထပ်ခါတလဲလဲ မတွက်ရအောင်)။
    onLoad() {
        this.grounds = [this.ground1, this.ground2, this.ground3].filter(g => !!g);
        if (this.grounds.length === 0) {
            console.warn('[Ground] No ground nodes assigned in the Inspector — disabling.');
            this.enabled = false;
            return;
        }

        for (const g of this.grounds) {
            const ut = g.getComponent(UITransform);
            const width = ut ? ut.width : 0;
            const anchorX = ut ? ut.anchorX : 0;
            this.widths.push(width);
            // right edge = x + width * (1 - anchorX); works for any anchor.
            this.rightOffsets.push(width * (1 - anchorX));
            this.totalWidth += width;
        }

        // Left edge of the visible area (assumes a centered Canvas, the default).
        const canvas = director.getScene().getComponentInChildren(Canvas);
        const canvasUT = canvas ? canvas.getComponent(UITransform) : null;
        this.viewLeft = canvasUT ? -canvasUT.width * canvasUT.anchorX : 0;
    }

    // update() — frame တိုင်းတွင် အလုပ်လုပ်သည်။
    // မြေပြင်တစ်ခုစီကို ဘယ်ဘက်သို့ ရွှေ့ပေးသည်။ မြေပြင်တစ်ခု မျက်နှာပြင်ဘယ်ဘက်အစွန်းကို
    // ကျော်လွန်သွားသည်နှင့် ၎င်းကို belt အရှည်တစ်ခုလုံးအတိုင်း ညာဘက်အဆုံးသို့ ပြန်ရွှေ့ပေးသဖြင့်
    // မြေပြင်သည် အဆက်မပြတ် (seamless) လှည့်ပတ်နေသကဲ့သို့ ဖြစ်စေသည်။
    update(deltaTime: number) {
        const move = this.gameSpeed * deltaTime;

        for (let i = 0; i < this.grounds.length; i++) {
            const g = this.grounds[i];
            this.tmp.set(g.position.x - move, g.position.y, g.position.z);

            // Once a segment's right edge passes the left edge of the view,
            // jump it forward by the whole belt length -> seamless infinite loop.
            if (this.tmp.x + this.rightOffsets[i] <= this.viewLeft) {
                this.tmp.x += this.totalWidth;
            }

            g.setPosition(this.tmp);
        }
    }
}
