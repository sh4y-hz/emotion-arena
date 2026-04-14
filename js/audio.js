/**
 * 音效管理模块
 */

const AudioSystem = {
  enabled: true,
  sounds: {},
  context: null,

  // 初始化
  init() {
    const settings = Storage.getSettings();
    this.enabled = settings.soundEnabled;

    // 创建 AudioContext（用于生成简单音效）
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  },

  // 生成简单音效（使用 Web Audio API）
  generateSound(type) {
    if (!this.context || !this.enabled) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    switch (type) {
      case 'click':
        // 点击音效 - 短促高频
        oscillator.frequency.setValueAtTime(800, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        oscillator.type = 'square';
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
        break;

      case 'hit':
        // 命中音效 - 低频撞击感
        oscillator.frequency.setValueAtTime(200, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.4, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
        oscillator.type = 'sawtooth';
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.15);
        break;

      case 'attack':
        // 攻击音效 - 上升音调
        oscillator.frequency.setValueAtTime(150, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
        oscillator.type = 'square';
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.2);
        break;

      case 'victory':
        // 胜利音效 - 上升旋律
        this.playMelody([523, 659, 784, 1047], 0.15);
        break;

      case 'defeat':
        // 失败音效 - 下降旋律
        this.playMelody([400, 350, 300, 250], 0.2);
        break;

      case 'ultimate':
        // 大招音效 - 爆发感
        oscillator.frequency.setValueAtTime(100, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, this.context.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.5, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
        break;

      case 'breathing':
        // 呼吸音效 - 柔和正弦波
        oscillator.frequency.setValueAtTime(220, this.context.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 2);
        oscillator.type = 'sine';
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 2);
        break;
    }
  },

  // 播放旋律
  playMelody(frequencies, duration) {
    if (!this.context || !this.enabled) return;

    frequencies.forEach((freq, index) => {
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      const startTime = this.context.currentTime + index * duration;

      oscillator.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.type = 'square';
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  },

  // 播放音效
  play(type) {
    if (!this.enabled) return;

    // 确保 AudioContext 已激活
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }

    this.generateSound(type);
  },

  // 设置开关
  setEnabled(enabled) {
    this.enabled = enabled;
    const settings = Storage.getSettings();
    settings.soundEnabled = enabled;
    Storage.saveSettings(settings);
  },

  // 震动反馈
  vibrate(duration = 50) {
    const settings = Storage.getSettings();
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }
};

// 初始化
AudioSystem.init();