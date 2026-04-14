# 情绪擂台 DESIGN.md

> 16-bit像素风格情绪调节游戏设计系统文档

---

## 1. Visual Theme & Atmosphere

### Design Philosophy
- **Pixel Art Aesthetic**: 16-bit复古游戏风格，像素级渲染
- **Emotional Gaming**: 将抽象情绪具象化为可战斗的"怪物"
- **Warm & Encouraging**: 温暖的鼓励色调，正向反馈设计
- **Playful Interaction**: 轻松有趣的游戏化情绪管理

### Mood & Density
- **Mood**: 游戏化、温暖、鼓励性、像素复古
- **Density**: 中等密度，游戏界面紧凑但不拥挤
- **Visual Weight**: 像素粗线条，强调战斗的紧张感

### Key Visual Elements
- 像素风格角色和情绪怪物
- 战斗擂台背景（木质地板+围栏）
- 血条、进度条等游戏UI元素
- 爆炸特效和连击动画

---

## 2. Color Palette & Roles

### Primary Colors

| Name | Hex | Role |
|------|-----|------|
| Background Dark | `#1a1a2e` | 主背景色，深紫黑色 |
| Background Secondary | `#16213e` | 次级背景，卡片背景 |
| Card Background | `rgba(0,0,0,0.4)` | 卡片/面板背景 |
| Accent Gold | `#f8b500` | 标题、强调、金币色调 |
| Accent Blue | `#3498db` | 辅助强调色，呼吸练习 |
| Primary Green | `#27ae60` | 主要按钮，胜利状态 |
| Danger Red | `#e74c3c` | 危险提示，失败状态 |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#eee` | 主要文字 |
| Text Secondary | `#aaa` | 次级文字，说明 |
| Text Muted | `#888` | 辅助文字，提示 |
| Border Default | `#4a4a6a` | 默认边框 |
| Border Highlight | `#f8b500` | 高亮边框 |
| Overlay | `rgba(0,0,0,0.8)` | 弹窗背景 |

### Difficulty Colors

| Level | Hex | Usage |
|-------|-----|-------|
| Beginner | `#27ae60` | 入门难度标签 |
| Easy | `#3498db` | 简单难度标签 |
| Medium | `#f39c12` | 中等难度标签 |
| Hard | `#e74c3c` | 较高难度标签 |

### Emotion Monster Colors

| Emotion | Hex | Description |
|---------|-----|-------------|
| Sadness (沮丧) | `#3498db` | 蓝色，忧郁色调 |
| Shame (羞耻) | `#f1c40f` | 黄色，尴尬色调 |
| Fear (恐惧) | `#95a5a6` | 灰色，恐惧色调 |
| Anger (愤怒) | `#e74c3c` | 红色，愤怒色调 |
| Jealousy (嫉妒) | `#27ae60` | 绿色，嫉妒色调 |
| Anxiety (焦虑) | `#9b59b6` | 紫色，焦虑色调 |

### Character Skin Colors

| Type | Hex | Usage |
|------|-----|-------|
| Light Skin | `#f5d0c5` | 儿童/青少年肤色 |
| Medium Skin | `#d4a574` | 成年肤色 |
| Dark Hair | `#2c3e50` | 深色头发 |
| Orange Hair | `#ff9800` | 橙色头发（女孩） |

---

## 3. Typography Rules

### Font Family
```css
font-family: 'Press Start 2P', monospace;
```
- **Primary**: Google Fonts像素字体
- **Fallback**: monospace

### Type Scale

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| xs | 10px | normal | 辅助文字，提示 |
| sm | 12px | normal | 次级文字，说明 |
| md | 14px | normal | 正文，卡片内容 |
| lg | 16px | normal | 标题副标题 |
| xl | 20px | normal | 页面标题 |
| 2xl | 28px | normal | 大标题 |
| 3xl | 36px | normal | 主游戏标题 |

### Text Styling

| Element | Style |
|---------|-------|
| Game Title | `text-shadow: 2px 2px 0 #000, -2px -2px 0 #000` |
| Section Headers | `text-align: center, color: #f8b500` |
| Button Text | `text-transform: uppercase` |
| Card Titles | `letter-spacing: 0.5px` |

---

## 4. Component Stylings

### Buttons

#### Primary Button (开始游戏)
```css
background: #27ae60;
color: #eee;
padding: 16px 20px;
border: none;
min-height: 48px;
box-shadow: 0 4px 0 #1e8449;
text-transform: uppercase;
```
- **Hover**: `transform: scale(1.03)`
- **Active**: `transform: scale(0.97)`
- **Focus**: `outline: 2px solid #f8b500`

#### Secondary Button (设置/历史)
```css
background: #4a4a6a;
color: #eee;
padding: 16px 20px;
min-height: 48px;
box-shadow: 0 4px 0 #3a3a5a;
```

#### Attack Button (战斗界面)
```css
background: #e74c3c;
color: #fff;
font-size: 14px;
box-shadow: 0 4px 0 #c0392b;
```

#### Ultimate Button (大招)
```css
background: #f39c12;
color: #fff;
box-shadow: 0 4px 0 #d68910;
```

#### Saved Button State
```css
background: #4a4a6a;
color: #888;
cursor: default;
disabled: true;
```

### Cards

#### Character Card
```css
background: rgba(0,0,0,0.4);
border: 2px solid #4a4a6a;
padding: 12px;
max-width: 110px;
```
- **Hover**: `border-color: #f8b500, transform: translateY(-2px)`
- **Selected**: `border-color: #27ae60, background: rgba(39,174,96,0.2)`

#### Emotion Card
```css
background: rgba(0,0,0,0.4);
border: 2px solid #4a4a6a;
padding: 12px;
max-width: 110px;
```
- **Hover**: `border-color: #e74c3c, transform: translateY(-2px)`
- **Selected**: `border-color: #e74c3c`

#### History Item
```css
background: rgba(0,0,0,0.4);
border: 2px solid #4a4a6a;
padding: 12px;
margin-bottom: 8px;
```

### Input Fields

#### Text Input
```css
width: 120px;
padding: 8px;
border: 2px solid #4a4a6a;
background: #1a1a2e;
color: #eee;
font-family: 'Press Start 2P';
font-size: 12px;
```
- **Focus**: `border-color: #f8b500`

#### Textarea (心得输入)
```css
width: 100%;
padding: 12px;
min-height: 80px;
resize: vertical;
background: #1a1a2e;
color: #eee;
```

### Warning Box

```css
background: rgba(0,0,0,0.4);
border: 2px solid #4a4a6a;
padding: 16px;
max-width: 500px;
text-align: center;
```

### Battle UI

#### Health Bar
```css
width: 120px;
height: 12px;
background: #444;
border: 2px solid #222;
```
- **Player HP**: `fill: #e74c3c`
- **Emotion HP**: `fill: emotion.color`

#### Stats Display
```css
display: flex;
justify-content: space-around;
gap: 12px;
font-size: 12px;
```

---

## 5. Layout Principles

### Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | 微小间距 |
| sm | 8px | 小间距 |
| md | 12px | 中间距 |
| lg | 16px | 大间距 |
| xl | 20px | 超大间距 |
| 2xl | 24px | 巨大间距 |
| 3xl | 32px | 最大间距 |

### Grid Layouts

#### Button Grid (6 buttons)
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-template-rows: repeat(2, auto);
gap: 12px;
```

#### Button Grid (4 buttons)
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
```

#### Character Grid (3 cards)
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 12px;
```

#### Emotion Grid (6 cards)
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 8px;
```

#### Calendar Grid (7 days)
```css
display: grid;
grid-template-columns: repeat(7, 1fr);
gap: 2px;
```

### Page Layout

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  gap: 20px;
}

.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-footer {
  padding-top: 20px;
}
```

### App Container
```css
#app {
  max-width: 800px;
  max-height: 600px;
  margin: 0 auto;
  padding: env(safe-area-inset-top) env(safe-area-inset-bottom);
}
```

---

## 6. Depth & Elevation

### Surface Hierarchy

| Level | Background | Usage |
|-------|------------|-------|
| Level 0 | `#1a1a2e` | 页面背景 |
| Level 1 | `rgba(0,0,0,0.4)` | 卡片、面板 |
| Level 2 | `rgba(0,0,0,0.8)` | 弹窗背景 |
| Level 3 | `#222` | 预览图背景 |

### Shadow System

| Type | Shadow | Usage |
|------|--------|-------|
| Button | `0 4px 0 {color-dark}` | 按钮底部阴影 |
| Card | none | 卡片无边框阴影 |
| Modal | `0 0 20px rgba(0,0,0,0.5)` | 弹窗阴影 |

### Border System

| Type | Width | Color | Usage |
|------|-------|-------|-------|
| Default | 2px | `#4a4a6a` | 默认边框 |
| Highlight | 2px | `#f8b500` | 高亮边框 |
| Selected | 2px | `#27ae60` | 选中边框 |
| Danger | 2px | `#e74c3c` | 危险边框 |

---

## 7. Do's and Don'ts

### Do's ✅

- ✅ 使用像素字体保持复古风格
- ✅ 保持文字清晰可读（字号≥10px）
- ✅ 使用温暖的鼓励色调
- ✅ 战斗界面保持紧凑但不拥挤
- ✅ 按钮有明显的hover和active状态
- ✅ 选中状态使用绿色高亮
- ✅ 血条和进度条清晰可见
- ✅ 保持一致的间距系统

### Don'ts ❌

- ❌ 不要使用现代扁平设计风格
- ❌ 不要使用过多渐变效果
- ❌ 不要让字号过小（<8px）
- ❌ 不要使用圆形按钮（保持方形像素风格）
- ❌ 不要隐藏重要UI元素
- ❌ 不要使用白色背景（保持深色主题）
- ❌ 不要忽略hover/active状态反馈
- ❌ 不要让动画过于缓慢（影响游戏节奏）

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| Desktop | > 768px | 默认布局 |
| Tablet | 768px | 中等布局 |
| Mobile | 480px | 紧凑布局 |
| Small | 360px | 最小布局 |

### Collapsing Strategy

| Component | Desktop | Mobile | Small |
|-----------|---------|--------|-------|
| Button Grid 6 | 3列×2行 | 2列×3行 | 1列×6行 |
| Character Grid | 3列 | 2列 | 1列 |
| Emotion Grid | 3列 | 2列 | 2列 |
| Character Preview | 64×96 | 64×96 | 64×96 |
| Breathing Circle | 150px | 100px | 80px |

### Touch Targets

| Element | Min Size | Mobile |
|---------|----------|--------|
| Buttons | 48px height | 48px height |
| Cards | 110px width | 110px width |
| Calendar Days | 40px height | 40px height |

### Mobile Adaptations

```css
@media (max-width: 480px) {
  .game-title { font-size: 20px; }
  .btn { font-size: 12px; min-height: 44px; }
  .character-card { max-width: 90px; }
  .emotion-card { max-width: 90px; }
}
```

---

## 9. Agent Prompt Guide

### Quick Color Reference

```
背景: #1a1a2e (深紫黑)
卡片: rgba(0,0,0,0.4) (半透明黑)
强调: #f8b500 (金色)
按钮主色: #27ae60 (绿色)
按钮次色: #4a4a6a (灰紫)
危险: #e74c3c (红色)
文字: #eee (浅灰)
```

### Ready-to-Use Prompts

#### 创建首页
```
创建一个16-bit像素风格的游戏首页，使用深紫黑色背景(#1a1a2e)，
标题使用金色(#f8b500)和像素字体(Press Start 2P)，字号36px。
居中显示游戏标题"情绪擂台"，下方显示像素风格的BATTLE logo（从右往左斜体）。
温馨提示使用半透明黑背景，居中显示。
底部6个按钮使用绿色主按钮和灰紫次按钮，按3×2网格排列。
```

#### 创建战斗界面
```
创建一个16-bit像素风格的战斗界面，使用Phaser.js引擎。
玩家角色(64×96像素)在左侧，情绪怪物(80×80)在右侧。
显示血条(120×12像素)、进度、用时、距离。
底部3个按钮：红色攻击按钮、橙色大招按钮、灰色逃跑按钮。
战斗时有爆炸特效、连击动画、屏幕震动。
气泡对话框跟随角色移动，字号14px。
```

#### 创建角色卡片
```
创建像素风格的角色选择卡片，使用半透明黑背景(rgba(0,0,0,0.4))，
边框2px #4a4a6a，hover时边框变为金色(#f8b500)。
包含64×96像素的角色预览图、名称和描述。
选中时边框变为绿色(#27ae60)，背景添加绿色半透明。
```

#### 创建日历组件
```
创建战斗日历组件，使用7列网格显示一周。
每日格子40px高度，背景半透明黑。
有战斗记录的日期显示彩色：胜利绿色、失败红色、混合黄色。
点击日期显示当日战斗记录和关联心得，心得使用金色边框。
```

---

## 10. Animation Specifications

### Transition Timing

| Type | Duration | Usage |
|------|----------|-------|
| Fast | 0.1s | hover/active快速反馈 |
| Normal | 0.2s | 常规过渡 |
| Slow | 0.4s | 大动作过渡 |

### Battle Animations

| Animation | Specs |
|-----------|-------|
| Attack Move | 100px forward, 250ms |
| Retreat | backward, 400ms |
| Ultimate Explosion | 180px radius, 25ms/frame |
| 20 Combo Hit | 80ms interval |
| Screen Shake | 5px ±, 50ms |
| Bubble Fade | 1.5s display |
| Damage Number | 0.6s display |

### Breathing Animation

| Phase | Duration | Transform |
|-------|----------|-----------|
| Inhale | 4s | scale(1.8) |
| Hold | 7s | scale(1.8) + pulse |
| Exhale | 8s | scale(1) |

---

## 11. Sound & Vibration

### Sound Effects

| Event | Sound |
|-------|-------|
| Click | 轻点击音 |
| Hit | 战斗击打音 |
| Ultimate | 爆炸音效 |
| Victory | 胜利音效 |
| Defeat | 失败音效 |
| Breathing | 呼吸引导音 |

### Vibration (Mobile)

| Event | Duration |
|-------|----------|
| Click | 30ms |
| Hit | 50ms |
| Ultimate | 100ms |
| Ultimate Combo | 30ms (every 5 hits) |

---

*Generated for 情绪擂台 - Emotion Arena*