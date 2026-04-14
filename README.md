# 🎮 情绪擂台 (Emotion Arena)

> 一款16-bit像素风格的情绪调节小游戏，通过"战斗"的方式帮助用户面对和处理负面情绪。

![情绪擂台](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20mobile-purple)

## 📖 项目简介

**情绪擂台**是一款基于Web的情绪调节小游戏，采用16-bit像素风格设计。用户可以选择自己的角色，与代表负面情绪的"情绪怪物"进行战斗。游戏将情绪管理过程游戏化，让用户在轻松有趣的氛围中练习面对和处理情绪。

### 核心理念

> "面对情绪，不是逃避，而是勇敢地与它对话"

通过游戏化的方式：
- 🎯 **直面情绪** - 将抽象的情绪具象化为可"战斗"的对象
- 💪 **建立信心** - 每次胜利都是一次情绪管理的练习
- 📝 **反思记录** - 战斗后记录心得，追溯情绪来源
- 🌬️ **呼吸练习** - 专业的4-7-8呼吸法帮助放松

---

## 🎨 游戏特色

| 特色 | 描述 |
|------|------|
| 🕹️ 16-bit像素风格 | 复古游戏画面，怀旧感十足 |
| ⚡ Phaser.js引擎 | 流畅的动画和物理效果 |
| 👤 6个可选角色 | 儿童/青少年/成年，男女各3个 |
| 😠 6种负面情绪 | 沮丧、羞耻、恐惧、愤怒、嫉妒、焦虑 |
| 💥 20连击大招 | 华丽的爆炸特效和连击动画 |
| 💬 战斗对话 | 活泼的互动反馈和鼓励话语 |
| ✍️ 心得记录 | 选择标签+文字记录战斗心得 |
| 🌬️ 呼吸练习 | 专业的4-7-8呼吸放松法 |
| 📅 战斗日历 | 可视化查看历史记录 |
| 📊 统计分析 | 各情绪胜率、平均用时统计 |
| 🏆 成就系统 | 激励用户持续练习 |

---

## 🚀 快速开始

### 在线体验
直接打开 `index.html` 即可开始游戏（无需服务器）。

### 本地运行
```bash
# 克隆仓库
git clone https://github.com/your-username/emotion-arena.git

# 进入目录
cd emotion-arena

# 直接打开
open index.html

# 或使用本地服务器
python3 -m http.server 8080
# 然后访问 http://localhost:8080
```

---

## 📁 项目结构

```
情绪擂台/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── main.js         # 主逻辑（页面路由、事件处理）
│   ├── storage.js      # 数据存储（localStorage封装）
│   ├── phaser-game.js  # Phaser.js游戏核心
│   ├── audio.js        # 音效系统
│   ├── achievements.js # 成就系统
│   ├── breathing.js    # 呼吸练习系统
│   └── stats.js        # 统计和日历系统
├── assets/
│   └── audio/          # 音效文件（可选）
└── docs/
    └── 操作手册.md      # 用户操作手册
```

---

## 🎮 游戏玩法

### 1. 选择角色
- 选择你的角色（儿童/青少年/成年）
- 选择要对抗的情绪（沮丧/羞耻/恐惧/愤怒/嫉妒/焦虑）

### 2. 开始战斗
- 点击"点击攻击"按钮让角色冲向情绪
- 角色接近情绪时自动攻击
- 使用"大招"释放20连击爆炸攻击

### 3. 战斗结果
- ✅ **胜利** - 在时间内完成点击次数
- ❌ **失败** - 时间耗尽或血量归零
- 🏃 **逃跑** - 主动选择撤退

### 4. 记录心得
- 选择标签（工作/家庭/情感/纯倒霉）
- 输入战斗心得和反思

### 5. 呼吸练习
- 战斗后可选进入呼吸练习
- 跟随4-7-8呼吸法放松身心

---

## 💻 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 | 样式设计（Flexbox/Grid布局） |
| JavaScript | 游戏逻辑 |
| Phaser.js 3 | 游戏引擎（动画、物理） |
| localStorage | 数据持久化 |
| Google Fonts | 像素字体（Press Start 2P） |

---

## 🎯 核心功能

### 战斗系统
- 实时战斗动画
- 碰撞检测和攻击判定
- 血条显示和伤害计算
- 20连击大招特效
- 战斗对话气泡（鼓励话语）

### 数据存储
- 战斗记录保存
- 心得记录保存
- 设置偏好保存
- 成就解锁记录
- 连胜记录追踪

### 统计分析
- 总胜率统计
- 各情绪胜率分析
- 平均用时统计
- 战斗日历可视化

---

## 🔧 配置说明

### 情绪难度配置
```javascript
// js/phaser-game.js
const EMOTIONS = {
  sadness: { timeLimit: 8, requiredClicks: 15, hp: 80, difficulty: '入门' },
  shame: { timeLimit: 10, requiredClicks: 12, hp: 70, difficulty: '简单' },
  fear: { timeLimit: 6, requiredClicks: 18, hp: 90, difficulty: '中等' },
  anger: { timeLimit: 6, requiredClicks: 20, hp: 100, difficulty: '中等' },
  jealousy: { timeLimit: 5, requiredClicks: 22, hp: 110, difficulty: '较高' },
  anxiety: { timeLimit: 5, requiredClicks: 25, hp: 120, difficulty: '较高' }
};
```

### 自定义角色
在 `js/phaser-game.js` 的 `CHARACTERS` 对象中可自定义角色颜色。

---

## 📱 兼容性

| 平台 | 支持情况 |
|------|---------|
| Chrome | ✅ 完全支持 |
| Safari | ✅ 完全支持 |
| Firefox | ✅ 完全支持 |
| Edge | ✅ 完全支持 |
| iOS Safari | ✅ 完全支持 |
| Android Chrome | ✅ 完全支持 |

---

## 📝 开发日志

### v1.0.0 (2024)
- ✅ 完成基础战斗系统
- ✅ 实现6角色和6情绪
- ✅ 添加20连击大招动画
- ✅ 实现心得记录系统
- ✅ 添加呼吸练习功能
- ✅ 实现统计和日历功能
- ✅ 完善成就系统
- ✅ 优化战斗对话气泡
- ✅ 添加攻击延迟机制

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发环境
1. 安装 Node.js
2. Fork 本仓库
3. 创建功能分支
4. 提交代码变更
5. 发起 Pull Request

---

## ⚠️ 重要声明

本游戏仅供娱乐和轻度情绪调节使用。如有严重情绪问题，请寻求专业心理咨询帮助。

---

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

---

## 💬 联系方式

如有问题或建议，请通过 GitHub Issues 联系。

---

**祝你在情绪擂台上，战胜每一个负面情绪！💪**