/**
 * Phaser.js 游戏主文件
 * 战斗场景 + 像素绘制 + 数据定义
 */

// ==================== 数据定义 ====================

// 玩家角色定义
const CHARACTERS = {
  boy_young: {
    name: '活泼少年',
    gender: 'male',
    age: 'child',
    width: 64,
    height: 80,
    colors: {
      skin: '#f5d0c5',
      hair: '#4a3728',
      shirt: '#3498db',
      pants: '#2c3e50',
      shoes: '#1a1a2e'
    }
  },
  boy_student: {
    name: '学生',
    gender: 'male',
    age: 'teen',
    width: 64,
    height: 96,
    colors: {
      skin: '#f5d0c5',
      hair: '#2c3e50',
      shirt: '#ffffff',
      collar: '#2c3e50',      // 校服领子
      pants: '#2c3e50',
      tie: '#e74c3c',         // 红领带
      glassesFrame: '#333',   // 眼镜框
      glassesLens: '#87ceeb', // 眼镜镜片（淡蓝色反光）
      shoes: '#1a1a2e'
    }
  },
  boy_worker: {
    name: '上班族',
    gender: 'male',
    age: 'adult',
    width: 64,
    height: 96,
    colors: {
      skin: '#d4a574',
      hair: '#1a1a1a',
      shirt: '#ffffff',
      suit: '#2c3e50',        // 西装外套
      suitLight: '#34495e',   // 西装浅色边缘
      tie: '#e74c3c',         // 红领带
      tieStripe: '#gold',     // 领带条纹
      pants: '#2c3e50',
      shoes: '#1a1a2e'
    }
  },
  girl_young: {
    name: '可爱女孩',
    gender: 'female',
    age: 'child',
    width: 64,
    height: 80,
    colors: {
      skin: '#fce4ec',
      hair: '#ff9800',
      dress: '#e91e63',
      dressPattern: '#f48fb1', // 连衣裙图案
      ribbon: '#fff',
      shoes: '#e91e63'
    }
  },
  girl_student: {
    name: '女学生',
    gender: 'female',
    age: 'teen',
    width: 64,
    height: 96,
    colors: {
      skin: '#fce4ec',
      hair: '#333',
      hairHighlight: '#666',  // 发丝高光
      shirt: '#fff',
      collar: '#e91e63',      // 校服领子（粉色）
      skirt: '#2c3e50',
      ribbon: '#e91e63',      // 头发ribbon
      socks: '#fff',          // 白袜子
      shoes: '#1a1a2e'
    }
  },
  girl_office: {
    name: '职场女性',
    gender: 'female',
    age: 'adult',
    width: 64,
    height: 96,
    colors: {
      skin: '#d4a574',
      hair: '#1a1a1a',
      hairHighlight: '#333',
      shirt: '#fff',
      suit: '#9c27b0',        // 紫色西装
      suitLight: '#ba68c8',   // 浅紫边缘
      skirt: '#333',
      heels: '#9c27b0'        // 高跟鞋
    }
  }
};

// 情绪怪物定义
const EMOTIONS = {
  sadness: {
    name: '沮丧',
    hp: 80,
    timeLimit: 8,
    requiredClicks: 15,
    width: 80,
    height: 80,
    color: 0x3498db,
    accentColor: 0x2980b9,
    difficulty: '入门'
  },
  shame: {
    name: '羞耻',
    hp: 70,
    timeLimit: 10,
    requiredClicks: 12,
    width: 80,
    height: 80,
    color: 0xf1c40f,
    accentColor: 0xd4ac0d,
    difficulty: '简单'
  },
  fear: {
    name: '恐惧',
    hp: 90,
    timeLimit: 6,
    requiredClicks: 18,
    width: 80,
    height: 80,
    color: 0x95a5a6,
    accentColor: 0x7f8c8d,
    difficulty: '中等'
  },
  anger: {
    name: '愤怒',
    hp: 100,
    timeLimit: 6,
    requiredClicks: 20,
    width: 80,
    height: 80,
    color: 0xe74c3c,
    accentColor: 0xc0392b,
    difficulty: '中等'
  },
  jealousy: {
    name: '嫉妒',
    hp: 110,
    timeLimit: 5,
    requiredClicks: 22,
    width: 80,
    height: 80,
    color: 0x27ae60,
    accentColor: 0x1e8449,
    difficulty: '较高'
  },
  anxiety: {
    name: '焦虑',
    hp: 120,
    timeLimit: 5,
    requiredClicks: 25,
    width: 80,
    height: 80,
    color: 0x9b59b6,
    accentColor: 0x8e44ad,
    difficulty: '较高'
  }
};

// ==================== 常量 ====================

const GAME_CONSTANTS = {
  // 速度和时间常量（固定）
  PLAYER_SPEED: 150,        // 加快玩家速度
  EMOTION_SPEED: 120,       // 加快情绪速度
  ATTACK_TIME: 250,
  WAIT_TIME: 150,           // 减少等待时间
  IDLE_TIME: 800,

  // 固定位置（FIT模式下使用）
  PLAYER_HOME: 100,
  PLAYER_MIN: 60,
  EMOTION_HOME: 600,
  EMOTION_MAX: 640
};

// ==================== 像素绘制工具 ====================

const PixelDrawer = {
  pixelSize: 4,

  // 绘制像素方块
  drawPixelRect(graphics, x, y, w, h, color) {
    graphics.fillStyle(color);
    graphics.fillRect(x, y, w, h);
  },

  // 绘制像素圆（近似）
  drawPixelCircle(graphics, cx, cy, r, color) {
    graphics.fillStyle(color);
    for (let y = -r; y <= r; y += this.pixelSize) {
      for (let x = -r; x <= r; x += this.pixelSize) {
        if (x * x + y * y <= r * r) {
          graphics.fillRect(cx + x, cy + y, this.pixelSize, this.pixelSize);
        }
      }
    }
  },

  // 绘制角色
  drawCharacter(graphics, charId, state, frame, offsetX = 0, offsetY = 0) {
    const char = CHARACTERS[charId];
    if (!char) return;

    const ps = this.pixelSize;
    const colors = char.colors;
    let headSize = char.age === 'child' ? 24 : 28;
    const cx = char.width / 2 + offsetX;

    // 动画偏移
    let animOffset = 0;
    if (state === 'walk_front' || state === 'walk_back') {
      animOffset = Math.sin(frame * 0.5) * 2;
    } else if (state === 'idle') {
      animOffset = Math.sin(frame * 0.3) * 1;
    }

    const headY = headSize / 2 + animOffset + offsetY;
    const bodyY = headSize + animOffset + offsetY;

    // ===== 头部 =====
    this.drawPixelCircle(graphics, cx, headY, headSize / 2, Phaser.Display.Color.HexStringToColor(colors.skin).color);

    // ===== 头发 =====
    graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.hair).color);
    // 头发顶部
    graphics.fillRect(cx - 14, headY - headSize / 2 - 4 + animOffset, 28, 8);
    // 头发两侧（根据角色类型）
    if (charId === 'girl_student' || charId === 'girl_office') {
      // 长发
      graphics.fillRect(cx - 16, headY - 8, 4, 40); // 左侧长发
      graphics.fillRect(cx + 12, headY - 8, 4, 40); // 右侧长发
      // 发丝高光
      if (colors.hairHighlight) {
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.hairHighlight).color);
        graphics.fillRect(cx - 14, headY - headSize / 2 - 2, 4, 4);
        graphics.fillRect(cx + 10, headY - headSize / 2 - 2, 4, 4);
      }
    } else if (charId === 'girl_young') {
      // 辫子
      graphics.fillRect(cx - 20, headY - 4, 8, 20);
      graphics.fillRect(cx + 12, headY - 4, 8, 20);
      // 辫子蝴蝶结
      if (colors.ribbon) {
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.ribbon).color);
        graphics.fillRect(cx - 22, headY - 6, 6, 6);
        graphics.fillRect(cx + 16, headY - 6, 6, 6);
      }
    }

    // ===== 眼睛 =====
    graphics.fillStyle(0x000000);
    graphics.fillRect(cx - 8, headY + 2, 4, 4);
    graphics.fillRect(cx + 4, headY + 2, 4, 4);

    // ===== 学生眼镜 =====
    if (charId === 'boy_student') {
      // 眼镜框
      graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.glassesFrame).color);
      // 左眼镜框
      graphics.fillRect(cx - 12, headY - 2, 12, 12);
      graphics.fillRect(cx - 14, headY, 2, 8);
      // 右眼镜框
      graphics.fillRect(cx + 2, headY - 2, 12, 12);
      graphics.fillRect(cx + 12, headY, 2, 8);
      // 鼻梁连接
      graphics.fillRect(cx - 2, headY + 2, 4, 2);
      // 镜片反光
      if (colors.glassesLens) {
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.glassesLens).color);
        graphics.fillRect(cx - 10, headY, 4, 4);
        graphics.fillRect(cx + 4, headY, 4, 4);
      }
    }

    // ===== 身体 =====
    if (char.gender === 'male') {
      // 根据角色绘制不同服装
      if (charId === 'boy_worker') {
        // 上班族：西装外套
        // 西装主体
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.suit).color);
        graphics.fillRect(cx - 16, bodyY, 32, 24);
        // 西装浅色边缘（模拟翻领）
        if (colors.suitLight) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.suitLight).color);
          graphics.fillRect(cx - 14, bodyY, 4, 20);
          graphics.fillRect(cx + 10, bodyY, 4, 20);
        }
        // 白衬衫领子露出
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.shirt).color);
        graphics.fillRect(cx - 6, bodyY, 12, 8);
        // V领效果
        graphics.fillRect(cx - 4, bodyY + 4, 8, 4);
        // 红领带
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.tie).color);
        graphics.fillRect(cx - 2, bodyY + 8, 4, 16);
        // 领带头
        graphics.fillRect(cx - 4, bodyY + 6, 8, 4);
        // 西装裤子
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.pants).color);
        graphics.fillRect(cx - 12, bodyY + 24, 24, char.height - headSize - 24);
      } else if (charId === 'boy_student') {
        // 学生：校服
        // 白衬衫
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.shirt).color);
        graphics.fillRect(cx - 12, bodyY, 24, 20);
        // 校服领子
        if (colors.collar) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.collar).color);
          // V形领口
          graphics.fillRect(cx - 8, bodyY, 4, 8);
          graphics.fillRect(cx + 4, bodyY, 4, 8);
        }
        // 红领带
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.tie).color);
        graphics.fillRect(cx - 2, bodyY + 8, 4, 12);
        // 领带头
        graphics.fillRect(cx - 3, bodyY + 6, 6, 3);
        // 校服裤子
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.pants).color);
        graphics.fillRect(cx - 10, bodyY + 20, 20, char.height - headSize - 20);
      } else {
        // 活泼少年：T恤短裤
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.shirt).color);
        graphics.fillRect(cx - 12, bodyY, 24, 20);
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.pants).color);
        graphics.fillRect(cx - 10, bodyY + 20, 20, char.height - headSize - 20);
      }

      // 鞋子
      if (colors.shoes) {
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.shoes).color);
        graphics.fillRect(cx - 10, bodyY + char.height - headSize - 4, 8, 4);
        graphics.fillRect(cx + 2, bodyY + char.height - headSize - 4, 8, 4);
      }
    } else {
      // 女性
      if (charId === 'girl_office') {
        // 职场女性：职业西装裙
        // 紫色西装外套
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.suit).color);
        graphics.fillRect(cx - 16, bodyY, 32, 20);
        // 浅紫边缘
        if (colors.suitLight) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.suitLight).color);
          graphics.fillRect(cx - 14, bodyY, 4, 16);
          graphics.fillRect(cx + 10, bodyY, 4, 16);
        }
        // 白衬衫领子
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.shirt).color);
        graphics.fillRect(cx - 6, bodyY, 12, 6);
        // 职业裙
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.skirt).color);
        graphics.fillRect(cx - 14, bodyY + 20, 28, char.height - headSize - 20);
        // 高跟鞋
        if (colors.heels) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.heels).color);
          graphics.fillRect(cx - 12, bodyY + char.height - headSize, 6, 4);
          graphics.fillRect(cx + 6, bodyY + char.height - headSize, 6, 4);
        }
      } else if (charId === 'girl_student') {
        // 女学生：校服裙
        // 白衬衫
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.shirt).color);
        graphics.fillRect(cx - 12, bodyY, 24, 16);
        // 粉色领子
        if (colors.collar) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.collar).color);
          graphics.fillRect(cx - 8, bodyY, 4, 6);
          graphics.fillRect(cx + 4, bodyY, 4, 6);
        }
        // 头发ribbon
        if (colors.ribbon) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.ribbon).color);
          graphics.fillRect(cx - 20, headY - 8, 6, 6);
          graphics.fillRect(cx + 14, headY - 8, 6, 6);
        }
        // 校服裙
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.skirt).color);
        graphics.fillRect(cx - 14, bodyY + 16, 28, char.height - headSize - 16);
        // 白袜子
        if (colors.socks) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.socks).color);
          graphics.fillRect(cx - 10, bodyY + char.height - headSize - 12, 8, 12);
          graphics.fillRect(cx + 2, bodyY + char.height - headSize - 12, 8, 12);
        }
        // 鞋子
        if (colors.shoes) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.shoes).color);
          graphics.fillRect(cx - 10, bodyY + char.height - headSize - 4, 8, 4);
          graphics.fillRect(cx + 2, bodyY + char.height - headSize - 4, 8, 4);
        }
      } else {
        // 可爱女孩：连衣裙
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.dress).color);
        graphics.fillRect(cx - 14, bodyY, 28, char.height - headSize);
        // 连衣裙图案
        if (colors.dressPattern) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.dressPattern).color);
          graphics.fillRect(cx - 8, bodyY + 8, 4, 4);
          graphics.fillRect(cx + 4, bodyY + 12, 4, 4);
          graphics.fillRect(cx - 4, bodyY + 20, 4, 4);
        }
        // 鞋子
        if (colors.shoes) {
          graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.shoes).color);
          graphics.fillRect(cx - 10, bodyY + char.height - headSize - 4, 8, 4);
          graphics.fillRect(cx + 2, bodyY + char.height - headSize - 4, 8, 4);
        }
      }
    }

    // ===== 攻击状态绘制拳头 =====
    if (state === 'attack') {
      graphics.fillStyle(Phaser.Display.Color.HexStringToColor(colors.skin).color);
      graphics.fillRect(char.width + offsetX, headSize + 10 + offsetY, 16, 16);
    }
  },

  // 绘制情绪怪物
  drawEmotion(graphics, emotionId, state, frame, offsetX = 0, offsetY = 0) {
    const emotion = EMOTIONS[emotionId];
    if (!emotion) return;

    const size = emotion.width;
    const color = emotion.color;
    const accent = emotion.accentColor;

    // 呼吸动画
    let breatheOffset = 0;
    if (state === 'idle' || state === 'waiting') {
      breatheOffset = Math.sin(frame * 0.3) * 2;
    }

    // 根据情绪类型绘制不同形状
    const cx = size / 2 + offsetX;
    const cy = size / 2 + breatheOffset + offsetY;

    // 主体（圆形/椭圆）
    this.drawPixelCircle(graphics, cx, cy, size / 3, color);

    // 眼睛
    graphics.fillStyle(0xffffff);
    graphics.fillRect(cx - 12, cy - 8, 8, 8);
    graphics.fillRect(cx + 4, cy - 8, 8, 8);

    // 眼珠（根据状态变化）
    graphics.fillStyle(0x000000);
    if (state === 'attack') {
      // 攻击时眼珠变大
      graphics.fillRect(cx - 10, cy - 6, 6, 6);
      graphics.fillRect(cx + 6, cy - 6, 6, 6);
    } else {
      graphics.fillRect(cx - 8, cy - 6, 4, 4);
      graphics.fillRect(cx + 8, cy - 6, 4, 4);
    }

    // 攻击状态绘制尖刺
    if (state === 'attack') {
      graphics.fillStyle(accent);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const spikeX = cx + Math.cos(angle) * (size / 2);
        const spikeY = cy + Math.sin(angle) * (size / 2);
        graphics.fillRect(spikeX - 4, spikeY - 4, 8, 8);
      }
    }
  },

  // 绘制血条
  drawHealthBar(graphics, x, y, current, max, color, width = 120, height = 12) {
    const ps = 4;

    // 背景
    graphics.fillStyle(0x222222);
    graphics.fillRect(x - 2, y - 2, width + 4, height + 4);
    graphics.fillStyle(0x444444);
    graphics.fillRect(x, y, width, height);

    // 血量
    const healthPixels = Math.floor(current / max * (width / ps));
    for (let i = 0; i < healthPixels; i++) {
      graphics.fillStyle(color);
      graphics.fillRect(x + i * ps, y + 1, ps - 1, height - 2);
    }
  }
};

// ==================== 战斗场景 ====================

class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  // ===== 初始化 =====
  init(data) {
    this.selectedCharacter = data.character || 'boy_young';
    this.selectedEmotion = data.emotion || 'sadness';

    // 接收自定义名称
    const charData = CHARACTERS[this.selectedCharacter];
    const emotionData = EMOTIONS[this.selectedEmotion];
    this.characterDisplayName = data.characterName || charData.name;
    this.emotionDisplayName = data.emotionName || emotionData.name;
  }

  create() {
    // 游戏尺寸 - 固定值（FIT模式）
    this.gameWidth = 800;
    this.gameHeight = 400;

    // ===== 状态初始化 =====
    this.mode = 'idle';
    this.playerState = 'idle';
    this.emotionState = 'advancing';

    // 玩家数据
    this.playerHp = 100;
    this.playerMaxHp = 100;

    // 情绪数据
    const emotionData = EMOTIONS[this.selectedEmotion];
    this.emotionHp = emotionData.hp;
    this.emotionMaxHp = emotionData.hp;
    this.timeLimit = emotionData.timeLimit;
    this.requiredClicks = emotionData.requiredClicks;

    // 统计
    this.clicks = 0;
    this.battleTime = 0;
    this.startTime = this.time.now;

    // 计时器
    this.idleTimer = null;
    this.attackTimer = 0;
    this.waitTimer = 0;
    this.emotionAdvanceDelay = 0;  // 情绪前进延迟（被攻击后2-4秒）
    this.isAttacking = false;
    this.attacker = null;
    this.collisionTriggered = false;
    this.isUltimateActive = false;

    // 玩家攻击意图（点击攻击按钮后立即记录）
    this.playerAttackIntent = false;

    // 气泡系统
    this.bubbleCooldown = false;
    this.bubbleGraphics = null;
    this.bubbleText = null;
    this.bubbleTarget = null;  // 'player' 或 'emotion'
    this.bubbleTextContent = '';
    this.bubbleAliveTime = 0;

    // ===== 伤害特效系统 =====
    this.damageNumbers = [];  // 伤害数字列表 {x, y, value, time, color}
    this.screenShakeOffset = {x: 0, y: 0};  // 屏幕震动偏移
    this.shakeDuration = 0;   // 震动持续时间

    // ===== 位置（手动管理，固定值） =====
    this.updateLayoutPositions();

    this.playerVelocityX = 0;
    this.emotionVelocityX = -GAME_CONSTANTS.EMOTION_SPEED; // 情绪开始前进

    // ===== 绘制背景 =====
    this.drawBackground();

    // ===== 创建角色Graphics（不使用Container和Physics） =====
    this.playerGraphics = this.add.graphics();
    this.playerGraphics.setDepth(10);  // 确保角色在特效之上
    this.emotionGraphics = this.add.graphics();
    this.emotionGraphics.setDepth(10);

    // ===== 创建UI =====
    this.createUI();

    // ===== 初始绘制 =====
    this.drawCharacters(0);
  }

  // 固定位置计算
  updateLayoutPositions() {
    // Y位置固定
    this.playerY = 280;
    this.emotionY = 280;

    // 玩家起始位置
    this.playerX = GAME_CONSTANTS.PLAYER_HOME;

    // 情绪起始位置
    this.emotionX = GAME_CONSTANTS.EMOTION_HOME;
  }

  // ===== 绘制背景 =====
  drawBackground() {
    const graphics = this.add.graphics();

    // 天空
    graphics.fillStyle(0x1a1a2e);
    graphics.fillRect(0, 0, 800, 400);

    // 擂台地面
    graphics.fillStyle(0x8b4513);
    graphics.fillRect(50, 310, 700, 40);

    // 木纹
    graphics.fillStyle(0x6b3513);
    for (let i = 0; i < 700; i += 20) {
      graphics.fillRect(50 + i, 310, 2, 40);
    }

    // 围栏
    graphics.fillStyle(0x2c3e50);
    graphics.fillRect(40, 50, 10, 260);
    graphics.fillRect(750, 50, 10, 260);

    // 围栏顶部装饰
    graphics.fillStyle(0xf8b500);
    graphics.fillRect(40, 40, 10, 10);
    graphics.fillRect(750, 40, 10, 10);
  }

  // ===== 创建UI =====
  createUI() {
    // 血条Graphics
    this.uiGraphics = this.add.graphics();

    // 使用HTML DOM元素显示进度/时间/距离
    // HTML元素在index.html中已定义
  }

  // ===== 主更新循环 =====
  update(time, delta) {
    // 更新战斗时间
    this.battleTime = (time - this.startTime) / 1000;

    // 更新位置（基于velocity和delta）
    const dt = delta / 1000;
    this.playerX += this.playerVelocityX * dt;
    this.emotionX += this.emotionVelocityX * dt;

    // ===== 穿透修复：玩家不能超过情绪位置 =====
    const minPlayerX = this.emotionX - 80; // 玩家右边界不能超过情绪左边界
    if (this.playerX > minPlayerX) {
      this.playerX = minPlayerX;
      if (this.playerVelocityX > 0) {
        this.playerVelocityX = 0; // 停止前进
        // 重要：当玩家被边界阻挡时，更新状态为等待
        // 这样可以防止碰撞检测误判玩家还在前进
        if (this.playerState === 'advancing') {
          this.playerState = 'waiting';
        }
      }
    }

    // 边界限制（固定值）
    this.playerX = Math.max(GAME_CONSTANTS.PLAYER_MIN, Math.min(GAME_CONSTANTS.EMOTION_MAX - 80, this.playerX));
    this.emotionX = Math.max(GAME_CONSTANTS.PLAYER_MIN + 80, Math.min(GAME_CONSTANTS.EMOTION_MAX, this.emotionX));

    // 更新状态逻辑
    this.updateMovement(delta);
    this.updateAttackTimer(delta);

    // 检查碰撞
    this.checkCollision();

    // 绘制角色（每帧重新绘制像素）
    this.drawCharacters(time);

    // 更新气泡位置（跟随角色/情绪）
    this.updateBubblePosition(delta);

    // ===== 更新和绘制伤害特效 =====
    this.updateEffects(delta);
    this.drawEffects();

    // 绘制血条（在Phaser canvas内）
    this.drawUI();

    // 更新HTML DOM元素
    this.updateHTMLUI();

    // 检查结果
    this.checkResult();
  }

  // ===== 更新HTML UI =====
  updateHTMLUI() {
    const progressEl = document.getElementById('click-progress');
    if (progressEl) {
      progressEl.textContent = this.clicks + '/' + this.requiredClicks;
    }

    const timerEl = document.getElementById('battle-timer');
    if (timerEl) {
      timerEl.textContent = this.battleTime.toFixed(1) + '秒';
    }

    const distanceEl = document.getElementById('distance-info');
    if (distanceEl) {
      const distance = Math.abs(this.emotionX - this.playerX);
      distanceEl.textContent = Math.round(distance) + 'px';
    }
  }

  // ===== 状态更新 =====
  updateMovement(delta) {
    // ========== 玩家边界检测 ==========
    if (this.playerState === 'retreating') {
      if (this.playerX <= GAME_CONSTANTS.PLAYER_HOME) {
        this.playerX = GAME_CONSTANTS.PLAYER_HOME;
        this.playerVelocityX = 0;
        this.playerState = 'idle';
      }
    }

    // 玩家前进时边界
    if (this.playerX < GAME_CONSTANTS.PLAYER_MIN) {
      this.playerX = GAME_CONSTANTS.PLAYER_MIN;
      this.playerVelocityX = 0;
    }

    // ========== 情绪状态更新 ==========
    // 等待状态
    if (this.emotionState === 'waiting') {
      this.waitTimer += delta;
      if (this.waitTimer >= GAME_CONSTANTS.WAIT_TIME) {
        this.waitTimer = 0;
        this.emotionState = 'advancing';
        this.emotionVelocityX = -GAME_CONSTANTS.EMOTION_SPEED;
      }
    }

    // 情绪后退到边界
    if (this.emotionState === 'retreating') {
      if (this.emotionX >= GAME_CONSTANTS.EMOTION_MAX) {
        this.emotionX = GAME_CONSTANTS.EMOTION_MAX;
        this.emotionVelocityX = 0;
        this.emotionState = 'delayed_waiting';  // 进入延迟等待状态
        this.waitTimer = 0;
      }
    }

    // 情绪延迟等待状态（被攻击后等待2-4秒）
    if (this.emotionState === 'delayed_waiting') {
      this.waitTimer += delta;
      if (this.waitTimer >= this.emotionAdvanceDelay) {
        // 延迟结束，进入正常等待状态
        this.emotionState = 'waiting';
        this.waitTimer = 0;
        this.emotionAdvanceDelay = 0;
      }
    }

    // 情绪前进到边界
    if (this.emotionX <= GAME_CONSTANTS.PLAYER_MIN + 80) {
      this.emotionX = GAME_CONSTANTS.PLAYER_MIN + 80;
      this.emotionVelocityX = 0;
      if (this.emotionState === 'advancing') {
        this.emotionState = 'waiting';
        this.waitTimer = 0;
      }
    }
  }

  // ===== 检查碰撞 =====
  checkCollision() {
    const distance = Math.abs(this.emotionX - this.playerX);
    const collisionDist = 80; // 碰撞阈值

    // 特殊情况：情绪在角落最左边界时，玩家即使被边界阻挡也能攻击
    const emotionAtLeftEdge = this.emotionX <= GAME_CONSTANTS.PLAYER_MIN + 80;
    const playerAtEdge = this.playerX <= GAME_CONSTANTS.PLAYER_MIN;

    // 只有在距离足够近且没有正在攻击时才检测碰撞
    if (distance <= collisionDist && !this.collisionTriggered && !this.isAttacking) {
      this.collisionTriggered = true;

      // 优先判定：玩家有攻击意图 → 玩家攻击
      // playerAttackIntent在点击攻击按钮时设置，在攻击完成后重置
      if (this.playerAttackIntent) {
        this.executePlayerAttack();
      }
      // 特殊情况：情绪在角落且玩家也在边界，玩家点击攻击时触发攻击
      else if (emotionAtLeftEdge && playerAtEdge && this.playerState !== 'retreating') {
        // 玩家有攻击倾向（不是后退状态），允许攻击
        this.executePlayerAttack();
      }
      // 玩家正在前进（velocity > 0）→ 玩家攻击
      else if (this.playerVelocityX > 0 && this.playerState === 'advancing') {
        this.executePlayerAttack();
      }
      // 情绪正在前进 → 情绪攻击
      else if (this.emotionState === 'advancing' && this.emotionVelocityX < 0) {
        this.executeEmotionAttack();
      }
      // 两方都在等待 → 情绪攻击（情绪主动进攻）
      else if (this.playerState === 'waiting' && (this.emotionState === 'waiting' || this.emotionState === 'delayed_waiting')) {
        // 等待一段时间后情绪主动攻击
        if (this.waitTimer > GAME_CONSTANTS.WAIT_TIME * 0.5) {
          this.executeEmotionAttack();
        }
      }
    }

    // 碰撞分离后重置标志（放宽条件）
    if (distance > collisionDist + 30 || this.emotionState === 'retreating') {
      // 当情绪后退时，也重置碰撞标志，让下次碰撞可以触发
      this.collisionTriggered = false;
    }
  }

  // ===== 绘制UI =====
  drawUI() {
    this.uiGraphics.clear();

    // 玩家血条
    PixelDrawer.drawHealthBar(
      this.uiGraphics,
      60, 10,
      this.playerHp, this.playerMaxHp,
      0xe74c3c
    );

    // 情绪血条
    PixelDrawer.drawHealthBar(
      this.uiGraphics,
      this.gameWidth - 180, 10,
      this.emotionHp, this.emotionMaxHp,
      EMOTIONS[this.selectedEmotion].color
    );
  }

  // ===== 攻击计时 =====
  updateAttackTimer(delta) {
    if (this.attackTimer > 0) {
      this.attackTimer -= delta;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        // 攻击结束后后退
        if (this.attacker === 'player') {
          this.startPlayerRetreat();
        } else {
          this.startPlayerRetreat();
          this.startEmotionRetreat();
        }
      }
    }

    // 玩家受击恢复
    if (this.playerState === 'hit' && !this.isAttacking) {
      this.startPlayerRetreat();
    }
  }

  // ===== 绘制角色 =====
  drawCharacters(time) {
    const frame = Math.floor(time / 100);

    // 清空Graphics
    this.playerGraphics.clear();
    this.emotionGraphics.clear();

    // 获取动画状态
    const playerAnimState = this.getAnimationState(this.playerState, this.playerVelocityX);
    const emotionAnimState = this.getAnimationState(this.emotionState, this.emotionVelocityX);

    // 绘制角色（居中绘制）
    const charData = CHARACTERS[this.selectedCharacter];
    PixelDrawer.drawCharacter(
      this.playerGraphics,
      this.selectedCharacter,
      playerAnimState,
      frame,
      this.playerX - charData.width / 2,
      this.playerY
    );

    const emotionData = EMOTIONS[this.selectedEmotion];
    PixelDrawer.drawEmotion(
      this.emotionGraphics,
      this.selectedEmotion,
      emotionAnimState,
      frame,
      this.emotionX - emotionData.width / 2,
      this.emotionY
    );
  }

  // ===== 获取动画状态 =====
  getAnimationState(state, velocityX) {
    if (state === 'attacking') return 'attack';
    if (state === 'hit') return 'hit';
    if (state === 'waiting' || state === 'delayed_waiting') return 'idle';
    if (velocityX > 0) return 'walk_back';
    if (velocityX < 0) return 'walk_front';
    return 'idle';
  }

  // ===== 玩家攻击 =====
  executePlayerAttack() {
    // 重置攻击意图
    this.playerAttackIntent = false;

    this.isAttacking = true;
    this.attacker = 'player';
    this.attackTimer = GAME_CONSTANTS.ATTACK_TIME;
    this.playerState = 'attacking';
    this.playerVelocityX = 0;

    // 伤害
    const damage = 8 + Math.floor(Math.random() * 5);
    this.emotionHp = Math.max(0, this.emotionHp - damage);
    this.clicks++;

    // ===== 伤害特效 =====
    this.showDamageNumber(this.emotionX, this.emotionY - 40, damage, '#e74c3c');
    this.triggerScreenShake(8, 150);

    // 显示情绪挨打气泡
    this.showBubble('emotion', this.getEmotionHitMessage());

    // 音效和震动
    if (typeof AudioSystem !== 'undefined') {
      AudioSystem.play('hit');
      AudioSystem.vibrate(50);
    }

    // 情绪后退
    this.startEmotionRetreat();
  }

  // ===== 情绪攻击 =====
  executeEmotionAttack() {
    if (this.playerState === 'attacking') return;

    this.isAttacking = true;
    this.attacker = 'emotion';
    this.attackTimer = GAME_CONSTANTS.ATTACK_TIME;
    this.emotionState = 'attacking';
    this.emotionVelocityX = 0;

    // 玩家受击
    this.playerState = 'hit';
    this.playerVelocityX = 0;

    // 伤害
    const damage = 5 + Math.floor(Math.random() * 3);
    this.playerHp = Math.max(0, this.playerHp - damage);

    // ===== 伤害特效 =====
    this.showDamageNumber(this.playerX, this.playerY - 40, damage, '#f39c12');
    this.triggerScreenShake(5, 100);

    // 显示玩家挨打气泡（鼓励话术）
    this.showBubble('player', this.getPlayerHitMessage());

    // 音效和震动
    if (typeof AudioSystem !== 'undefined') {
      AudioSystem.play('attack');
      AudioSystem.vibrate(80);
    }
  }

  // ===== 开始后退 =====
  startPlayerRetreat() {
    this.playerState = 'retreating';
    this.playerVelocityX = -GAME_CONSTANTS.PLAYER_SPEED;
  }

  startEmotionRetreat() {
    this.emotionState = 'retreating';
    this.emotionVelocityX = GAME_CONSTANTS.EMOTION_SPEED;
    // 设置随机延迟0.5-1.5秒（原来2-4秒太长）
    this.emotionAdvanceDelay = 500 + Math.random() * 1000;
  }

  // ===== 气泡系统 =====

  // 显示气泡文字
  showBubble(target, text) {
    // 2秒冷却期内不显示新气泡
    if (this.bubbleCooldown) return;

    this.bubbleCooldown = true;

    // 清除之前的气泡
    if (this.bubbleGraphics) {
      this.bubbleGraphics.destroy();
    }
    if (this.bubbleText) {
      this.bubbleText.destroy();
    }

    // 记录气泡信息（用于每帧跟随）
    this.bubbleTarget = target;
    this.bubbleTextContent = text;
    this.bubbleAliveTime = 1500; // 1.5秒后消失

    // 创建气泡Graphics和Text（增大字号和气泡）
    this.bubbleGraphics = this.add.graphics();
    this.bubbleText = this.add.text(0, 0, text, {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#333333',
      align: 'center',
      wordWrap: { width: 120 }
    }).setOrigin(0.5);

    // 2秒后解除冷却
    this.time.delayedCall(2000, () => {
      this.bubbleCooldown = false;
    });
  }

  // 更新气泡位置（每帧调用）
  updateBubblePosition(delta) {
    if (!this.bubbleGraphics || !this.bubbleTarget) return;

    // 减少存活时间
    this.bubbleAliveTime -= delta;
    if (this.bubbleAliveTime <= 0) {
      this.bubbleGraphics.destroy();
      this.bubbleGraphics = null;
      this.bubbleText.destroy();
      this.bubbleText = null;
      this.bubbleTarget = null;
      return;
    }

    // 获取目标位置
    let x, y;
    if (this.bubbleTarget === 'player') {
      x = this.playerX;
      y = this.playerY - 100;
    } else {
      x = this.emotionX;
      y = this.emotionY - 100;
    }

    // 重新绘制气泡背景
    this.bubbleGraphics.clear();
    const bubbleWidth = 140;
    const bubbleHeight = 45;

    // 气泡背景
    this.bubbleGraphics.fillStyle(0xffffff, 1);
    this.bubbleGraphics.fillRoundedRect(x - bubbleWidth / 2, y - bubbleHeight / 2, bubbleWidth, bubbleHeight, 10);

    // 气泡边框
    this.bubbleGraphics.lineStyle(2, 0x333333);
    this.bubbleGraphics.strokeRoundedRect(x - bubbleWidth / 2, y - bubbleHeight / 2, bubbleWidth, bubbleHeight, 10);

    // 小尾巴（指向角色）
    this.bubbleGraphics.fillStyle(0xffffff);
    this.bubbleGraphics.fillTriangle(x - 6, y + bubbleHeight / 2, x + 6, y + bubbleHeight / 2, x, y + bubbleHeight / 2 + 12);

    // 更新文字位置
    this.bubbleText.setPosition(x, y);
  }

  // 获取玩家挨打消息（鼓励话术）
  getPlayerHitMessage() {
    const messages = [
      '💪 加油反击！',
      '🛡️ 保护自己！',
      '⚡ 别放弃！',
      '🔥 你可以的！',
      '👊 冲上去！',
      '❤️ 坚持住！',
      '🎯 看准时机！',
      '🌟 你很强！',
      '⚡️ 快反击！',
      '🏆 必胜信念！',
      '🌈 勇敢面对！',
      '💎 相信自己！',
      '🦁 像狮子一样！',
      '🦸 你是英雄！',
      '💪💪 再来一次！',
      '🧠 冷静思考！',
      '⚡⚡⚡ 释放力量！',
      '🌟🌟 继续战斗！',
      '🔥🔥 热血沸腾！',
      '❤️❤️ 爱的力量！'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // 获取情绪挨打消息（吐槽）
  getEmotionHitMessage() {
    const messages = [
      '😱 好强！',
      '💀 要死了...',
      '🌟 太厉害了！',
      '😢 别打了...',
      '🏆 真的强！',
      '😭 痛痛痛...',
      '🔥 这伤害！',
      '💀💀 没血了！',
      '😱😱 妖怪！',
      '🌟🌟 闪亮！',
      '👊 啊啊啊！',
      '💫 晕了...',
      '🤕 头好痛！',
      '🏥 要去医院！',
      '😱❤️ 太残忍！',
      '💀🔥 烧起来了！',
      '🌟🏆 太强了！',
      '😭😭 哭死！',
      '😢😢 悲伤！',
      '😱💀 恐怖！'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // ===== 伤害特效系统 =====

  // 显示伤害数字（浮动向上）
  showDamageNumber(x, y, value, color) {
    this.damageNumbers.push({
      x: x,
      y: y,
      value: value,
      time: 600,  // 显示600ms
      color: color,
      offsetY: 0
    });
  }

  // 触发屏幕震动
  triggerScreenShake(intensity, duration) {
    this.shakeDuration = duration;
    this.screenShakeOffset = {x: intensity, y: intensity};
  }

  // 更新特效（每帧调用）
  updateEffects(delta) {
    // 更新伤害数字
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dn = this.damageNumbers[i];
      dn.time -= delta;
      dn.offsetY -= delta * 0.05;  // 向上浮动
      if (dn.time <= 0) {
        this.damageNumbers.splice(i, 1);
      }
    }

    // 更新屏幕震动
    if (this.shakeDuration > 0) {
      this.shakeDuration -= delta;
      // 随机震动偏移
      const intensity = Math.max(1, this.shakeDuration / 50);
      this.screenShakeOffset.x = (Math.random() - 0.5) * intensity * 2;
      this.screenShakeOffset.y = (Math.random() - 0.5) * intensity * 2;
    } else {
      this.screenShakeOffset = {x: 0, y: 0};
    }
  }

  // 绘制特效（在drawCharacters之后调用）
  drawEffects() {
    // 使用固定的Text对象池来显示伤害数字（不创建Graphics覆盖层）
    if (!this.damageTextPool) {
      this.damageTextPool = [];
      for (let i = 0; i < 5; i++) {
        const txt = this.add.text(0, 0, '', {
          fontFamily: '"Press Start 2P"',
          fontSize: '16px',
          color: '#e74c3c',
          stroke: '#000',
          strokeThickness: 2
        }).setOrigin(0.5).setDepth(50).setVisible(false);
        this.damageTextPool.push(txt);
      }
    }

    // 更新伤害数字显示
    for (let i = 0; i < this.damageTextPool.length; i++) {
      if (i < this.damageNumbers.length) {
        const dn = this.damageNumbers[i];
        const txt = this.damageTextPool[i];
        txt.setText(`-${dn.value}`)
           .setPosition(dn.x, dn.y + dn.offsetY)
           .setColor(dn.color)
           .setAlpha(Math.min(1, dn.time / 300))
           .setVisible(true);
      } else {
        this.damageTextPool[i].setVisible(false);
      }
    }
  }

  // 获取情绪大招反应消息
  getEmotionUltimateMessage() {
    const messages = [
      '😱 太强了！',
      '💀 不可能！',
      '🌟 真的假的！',
      '🔥 完败了...',
      '🏆 你是神！',
      '😭 救命啊！',
      '😱😱😱 天啊！',
      '💀💀💀 完蛋了！',
      '🌟🌟🌟 神级！',
      '🔥🔥🔥 烧死！',
      '🏆🏆🏆 太牛！',
      '😭😭😭 妈妈救命！',
      '😱❤️ 你赢了！',
      '💀⚡ 彻底毁灭！',
      '🌟💎 无法理解！',
      '🔥🦁 像狮子！',
      '🏆🦸 真英雄！',
      '😭🏥 送医院！',
      '😱🤕 脑震荡！',
      '💀🌈 走了走了！'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // ===== 处理攻击按钮 =====
  handleAttackClick() {
    // 记录玩家攻击意图（用于碰撞检测优先判定）
    this.playerAttackIntent = true;

    // 玩家前进（打断当前状态）
    this.playerState = 'advancing';
    this.playerVelocityX = GAME_CONSTANTS.PLAYER_SPEED;

    // 情绪停止前进（但不主动后退，只在被击中时后退）
    if (this.emotionState === 'advancing') {
      this.emotionVelocityX = 0;
      this.emotionState = 'waiting';
      this.waitTimer = 0;
    }

    this.mode = 'active';

    // 重置空闲计时器
    this.resetIdleTimer();

    // 音效
    if (typeof AudioSystem !== 'undefined') {
      AudioSystem.play('click');
      AudioSystem.vibrate(30);
    }
  }

  // ===== 重置空闲计时器 =====
  resetIdleTimer() {
    if (this.idleTimer) {
      this.idleTimer.remove();
    }
    this.idleTimer = this.time.delayedCall(GAME_CONSTANTS.IDLE_TIME, () => {
      this.switchToIdle();
    });
  }

  // ===== 切换到空闲模式 =====
  switchToIdle() {
    this.mode = 'idle';
    // 玩家后退
    this.startPlayerRetreat();
    // 情绪继续后退或开始前进
    if (this.emotionState !== 'advancing') {
      this.waitTimer = 0;
      this.emotionState = 'waiting';
    }
  }

  // ===== 使用大招 =====
  useUltimate() {
    // 20连击大招
    this.isUltimateActive = true;
    this.ultimateComboCount = 20;
    this.ultimateComboIndex = 0;

    // 停止移动
    this.playerVelocityX = 0;
    this.emotionVelocityX = 0;

    // 播放音效
    if (typeof AudioSystem !== 'undefined') {
      AudioSystem.play('ultimate');
      AudioSystem.vibrate(100);
    }

    // 创建爆炸特效
    this.createUltimateExplosion();

    // 开始连击（快速连击）
    this.time.delayedCall(100, () => this.executeUltimateHit());
  }

  // ===== 大招爆炸特效 =====
  createUltimateExplosion() {
    // 创建爆炸Graphics
    const explosionGraphics = this.add.graphics();
    const centerX = this.emotionX;
    const centerY = this.emotionY;

    // 爆炸动画：圆圈扩散
    let radius = 20;
    const expandSpeed = 8; // 加快扩散速度

    const expandAnimation = () => {
      explosionGraphics.clear();

      // 绘制多层爆炸圆圈
      for (let i = 0; i < 3; i++) {
        const r = radius - i * 15;
        if (r > 0) {
          const alpha = 1 - i * 0.3;
          explosionGraphics.fillStyle(Phaser.Display.Color.GetColor32(255, 200, 0, alpha * 255));
          explosionGraphics.fillCircle(centerX, centerY, r);
        }
      }

      // 绘制火花（增加数量）
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const sparkX = centerX + Math.cos(angle) * radius * 0.8;
        const sparkY = centerY + Math.sin(angle) * radius * 0.8;
        explosionGraphics.fillStyle(0xff6600);
        explosionGraphics.fillRect(sparkX - 4, sparkY - 4, 8, 8);
      }

      radius += expandSpeed;

      if (radius < 180) {
        this.time.delayedCall(25, expandAnimation);
      } else {
        explosionGraphics.destroy();
      }
    };

    expandAnimation();
  }

  // ===== 执行大招连击 =====
  executeUltimateHit() {
    if (!this.isUltimateActive) return;

    // 每次攻击造成伤害（20连击总伤害约200-300）
    const damage = 10 + Math.floor(Math.random() * 5);
    this.emotionHp = Math.max(0, this.emotionHp - damage);
    this.clicks++;

    // 显示连击数字
    this.showUltimateDamageNumber(damage, this.ultimateComboIndex + 1);

    // 屏幕震动效果（轻微震动）
    this.shakeScreenLight();

    // 播放音效（每隔5次播放一次，避免过于嘈杂）
    if (this.ultimateComboIndex % 5 === 0 && typeof AudioSystem !== 'undefined') {
      AudioSystem.play('hit');
      AudioSystem.vibrate(30);
    }

    // 显示气泡（只在关键连击显示：第1、10、20次）
    if (this.ultimateComboIndex === 0 || this.ultimateComboIndex === 9 || this.ultimateComboIndex === 19) {
      this.showBubble('emotion', this.getEmotionUltimateMessage());
    }

    this.ultimateComboIndex++;
    if (this.ultimateComboIndex < this.ultimateComboCount) {
      // 快速连击间隔（80ms）
      this.time.delayedCall(80, () => this.executeUltimateHit());
    } else {
      // 连击结束
      this.isUltimateActive = false;
      // 检查结果（可能直接胜利或继续战斗）
      this.checkResult();
    }
  }

  // ===== 轻微屏幕震动 =====
  shakeScreenLight() {
    const shakeAmount = 3;
    const originalX = this.cameras.main.x;

    this.cameras.main.x = originalX + shakeAmount;
    this.time.delayedCall(30, () => {
      this.cameras.main.x = originalX - shakeAmount;
      this.time.delayedCall(30, () => {
        this.cameras.main.x = originalX;
      });
    });
  }

  // ===== 显示大招伤害数字 =====
  showUltimateDamageNumber(damage, comboIndex) {
    // 使用随机偏移避免重叠
    const offsetX = (comboIndex % 5) * 15 - 30 + Math.random() * 10;
    const offsetY = -40 - (comboIndex % 4) * 12 + Math.random() * 5;

    // 创建伤害数字Text
    const damageText = this.add.text(
      this.emotionX + offsetX,
      this.emotionY + offsetY,
      `-${damage}`,
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        color: '#ff0000',
        stroke: '#fff',
        strokeThickness: 2
      }
    ).setOrigin(0.5);

    // 只在关键连击显示连击文字（第5、10、15、20次）
    let comboText = null;
    if (comboIndex === 5 || comboIndex === 10 || comboIndex === 15 || comboIndex === 20) {
      comboText = this.add.text(
        this.emotionX,
        this.emotionY - 80,
        `${comboIndex}连击!`,
        {
          fontFamily: '"Press Start 2P"',
          fontSize: '14px',
          color: '#ff6600'
        }
      ).setOrigin(0.5);
    }

    // 0.6秒后消失（更快消失避免堆积）
    this.time.delayedCall(600, () => {
      damageText.destroy();
      if (comboText) comboText.destroy();
    });
  }

  // ===== 屏幕震动 =====
  shakeScreen() {
    const shakeAmount = 5;
    const originalX = this.cameras.main.x;

    this.cameras.main.x = originalX + shakeAmount;
    this.time.delayedCall(50, () => {
      this.cameras.main.x = originalX - shakeAmount;
      this.time.delayedCall(50, () => {
        this.cameras.main.x = originalX;
      });
    });
  }

  // ===== 逃跑 =====
  escape() {
    this.endBattle('escape');
  }

  // ===== 检查结果 =====
  checkResult() {
    if (this.emotionHp <= 0) {
      this.endBattle('victory');
    }
    if (this.playerHp <= 0) {
      this.endBattle('defeat');
    }
  }

  // ===== 结束战斗 =====
  endBattle(result) {
    // 停止所有移动
    this.playerVelocityX = 0;
    this.emotionVelocityX = 0;

    // 清除计时器
    if (this.idleTimer) {
      this.idleTimer.remove();
    }

    // 保存结果
    const battleResult = {
      result: result,
      time: this.battleTime,
      clicks: this.clicks,
      emotion: this.selectedEmotion,
      character: this.selectedCharacter
    };

    if (typeof Storage !== 'undefined') {
      Storage.addBattle(battleResult);
      Storage.updateStreak(result === 'victory');
    }

    // 播放音效
    if (typeof AudioSystem !== 'undefined') {
      if (result === 'victory') {
        AudioSystem.play('victory');
      } else {
        AudioSystem.play('defeat');
      }
    }

    // 检查成就
    let newAchievements = [];
    if (typeof AchievementSystem !== 'undefined') {
      newAchievements = AchievementSystem.checkAchievements(battleResult);
    }

    // 停止场景
    this.scene.pause();

    // 显示结果页面
    if (typeof showPage !== 'undefined') {
      showPage('result');
      if (typeof renderResult !== 'undefined') {
        renderResult(battleResult, newAchievements);
      }
    }
  }
}

// ==================== 游戏实例管理 ====================

let phaserGame = null;

function startPhaserGame(character, emotion, characterName = '', emotionName = '') {
  // 如果已有游戏实例，先销毁
  if (phaserGame) {
    phaserGame.destroy(true);
    phaserGame = null;
  }

  // 创建新游戏实例（响应式缩放）
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'phaser-container',
    backgroundColor: '#1a1a2e',
    scale: {
      mode: Phaser.Scale.FIT,  // FIT模式自动缩放适应容器
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
      }
    },
    scene: [BattleScene]
  };

  phaserGame = new Phaser.Game(config);

  // 手动启动场景并传入数据（包括名称）
  phaserGame.scene.start('BattleScene', {
    character: character,
    emotion: emotion,
    characterName: characterName,
    emotionName: emotionName
  });
}

function handleAttackClick_phaser() {
  if (phaserGame && phaserGame.scene.isActive('BattleScene')) {
    const scene = phaserGame.scene.getScene('BattleScene');
    if (scene) {
      scene.handleAttackClick();
    }
  }
}

function useUltimate_phaser() {
  if (phaserGame && phaserGame.scene.isActive('BattleScene')) {
    const scene = phaserGame.scene.getScene('BattleScene');
    if (scene) {
      scene.useUltimate();
    }
  }
}

function escapeBattle_phaser() {
  if (phaserGame && phaserGame.scene.isActive('BattleScene')) {
    const scene = phaserGame.scene.getScene('BattleScene');
    if (scene) {
      scene.escape();
    }
  }
}

// ==================== 导出 ====================

window.CHARACTERS = CHARACTERS;
window.EMOTIONS = EMOTIONS;
window.startPhaserGame = startPhaserGame;
window.handleAttackClick_phaser = handleAttackClick_phaser;
window.useUltimate_phaser = useUltimate_phaser;
window.escapeBattle_phaser = escapeBattle_phaser;