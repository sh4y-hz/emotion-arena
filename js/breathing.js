/**
 * 呼吸练习模块
 * 4-7-8 呼吸法引导
 */

const BreathingSystem = {
  // 呼吸阶段
  phases: ['inhale', 'hold', 'exhale'],
  currentPhase: 'inhale',
  currentRound: 0,
  totalRounds: 8,

  // 时间参数（4-7-8呼吸法）
  inhaleTime: 4,
  holdTime: 7,
  exhaleTime: 8,

  // 状态
  isRunning: false,
  timer: null,
  startTime: 0,

  // DOM元素
  circleEl: null,
  phaseEl: null,
  countEl: null,
  progressEl: null,

  // 开始呼吸练习
  start() {
    this.circleEl = document.getElementById('breathing-circle');
    this.phaseEl = document.getElementById('breathing-phase');
    this.countEl = document.getElementById('breathing-count');
    this.progressEl = document.getElementById('breathing-progress-num');

    this.currentPhase = 'inhale';
    this.currentRound = 0;
    this.isRunning = true;
    this.startTime = Date.now();

    this.runPhase();
  },

  // 执行呼吸阶段
  runPhase() {
    if (!this.isRunning) return;

    const phaseTimes = {
      inhale: this.inhaleTime,
      hold: this.holdTime,
      exhale: this.exhaleTime
    };

    const phaseTexts = {
      inhale: '吸气...',
      hold: '屏息...',
      exhale: '呼气...'
    };

    const duration = phaseTimes[this.currentPhase] * 1000;

    // 更新UI
    if (this.phaseEl) {
      this.phaseEl.textContent = phaseTexts[this.currentPhase];
      // 更新文字样式类
      this.phaseEl.classList.remove('inhale-phase', 'hold-phase', 'exhale-phase');
      this.phaseEl.classList.add(`${this.currentPhase}-phase`);
    }

    if (this.countEl) {
      this.countEl.textContent = `${phaseTimes[this.currentPhase]}秒`;
    }

    // 更新圆圈动画
    if (this.circleEl) {
      this.circleEl.classList.remove('inhale', 'exhale', 'hold');

      if (this.currentPhase === 'inhale') {
        this.circleEl.classList.add('inhale');
        this.circleEl.style.transition = `transform ${this.inhaleTime}s ease-in-out, background ${this.inhaleTime}s ease-in-out, border-color ${this.inhaleTime}s ease-in-out, box-shadow ${this.inhaleTime}s ease-in-out`;
      } else if (this.currentPhase === 'exhale') {
        this.circleEl.classList.add('exhale');
        this.circleEl.style.transition = `transform ${this.exhaleTime}s ease-in-out, background ${this.exhaleTime}s ease-in-out, border-color ${this.exhaleTime}s ease-in-out, box-shadow ${this.exhaleTime}s ease-in-out`;
      } else if (this.currentPhase === 'hold') {
        // 屏息时保持当前大小，添加微弱的脉动效果
        this.circleEl.classList.add('hold');
        this.circleEl.style.transition = 'box-shadow 1s ease-in-out';
      }
    }

    // 更新进度
    if (this.progressEl) {
      this.progressEl.textContent = this.currentRound;
    }

    // 播放呼吸音效
    if (this.currentPhase === 'inhale') {
      AudioSystem.play('breathing');
    }

    // 倒计时更新
    this.startCountdown(phaseTimes[this.currentPhase]);

    // 阶段结束后切换
    this.timer = setTimeout(() => {
      this.nextPhase();
    }, duration);
  },

  // 倒计时更新
  startCountdown(totalSeconds) {
    let remaining = totalSeconds;
    const countdownInterval = setInterval(() => {
      if (!this.isRunning || remaining <= 0) {
        clearInterval(countdownInterval);
        return;
      }
      remaining--;
      if (this.countEl) {
        this.countEl.textContent = `${remaining}秒`;
      }
    }, 1000);
  },

  // 切换到下一阶段
  nextPhase() {
    if (!this.isRunning) return;

    const phaseOrder = ['inhale', 'hold', 'exhale'];
    const currentIndex = phaseOrder.indexOf(this.currentPhase);

    if (currentIndex < phaseOrder.length - 1) {
      // 切换到下一阶段
      this.currentPhase = phaseOrder[currentIndex + 1];
    } else {
      // 完成一轮，开始下一轮
      this.currentRound++;

      if (this.currentRound >= this.totalRounds) {
        // 完成8轮
        this.complete();
        return;
      }

      this.currentPhase = 'inhale';
    }

    this.runPhase();
  },

  // 完成呼吸练习
  complete() {
    this.isRunning = false;
    clearTimeout(this.timer);

    if (this.phaseEl) {
      this.phaseEl.textContent = '练习完成!';
    }

    if (this.countEl) {
      this.countEl.textContent = '放松心情';
    }

    if (this.circleEl) {
      this.circleEl.classList.remove('inhale', 'exhale');
    }

    // 显示返回按钮
    setTimeout(() => {
      showPage('home');
    }, 2000);
  },

  // 结束呼吸练习
  end() {
    this.isRunning = false;
    clearTimeout(this.timer);

    if (this.circleEl) {
      this.circleEl.classList.remove('inhale', 'exhale');
    }

    showPage('home');
  }
};

// 导出
window.BreathingSystem = BreathingSystem;