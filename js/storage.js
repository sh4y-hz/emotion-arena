/**
 * 存储管理模块 - localStorage封装
 */

const Storage = {
  KEYS: {
    BATTLES: 'emotionArena_battles',
    SETTINGS: 'emotionArena_settings',
    ACHIEVEMENTS: 'emotionArena_achievements',
    STREAK: 'emotionArena_streak',
    JOURNALS: 'emotionArena_journals'
  },

  // 初始化存储
  init() {
    if (!this.get(this.KEYS.BATTLES)) {
      this.set(this.KEYS.BATTLES, []);
    }
    if (!this.get(this.KEYS.SETTINGS)) {
      this.set(this.KEYS.SETTINGS, {
        selectedCharacter: 'boy_young',
        selectedEmotion: 'sadness',
        soundEnabled: true,
        vibrationEnabled: true
      });
    }
    if (!this.get(this.KEYS.ACHIEVEMENTS)) {
      this.set(this.KEYS.ACHIEVEMENTS, {
        unlocked: [],
        progress: {}
      });
    }
    if (!this.get(this.KEYS.STREAK)) {
      this.set(this.KEYS.STREAK, {
        current: 0,
        best: 0
      });
    }
    if (!this.get(this.KEYS.JOURNALS)) {
      this.set(this.KEYS.JOURNALS, []);
    }
  },

  // 获取数据
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },

  // 设置数据
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  // 获取设置
  getSettings() {
    return this.get(this.KEYS.SETTINGS) || {
      selectedCharacter: 'boy_young',
      selectedEmotion: 'sadness',
      soundEnabled: true,
      vibrationEnabled: true
    };
  },

  // 保存设置
  saveSettings(settings) {
    this.set(this.KEYS.SETTINGS, settings);
  },

  // 添加战斗记录
  addBattle(battle) {
    const battles = this.get(this.KEYS.BATTLES) || [];
    battle.id = Date.now();
    battle.date = new Date().toLocaleString('zh-CN');
    battles.unshift(battle); // 添加到开头

    // 限制最多保存100条记录
    if (battles.length > 100) {
      battles.pop();
    }

    this.set(this.KEYS.BATTLES, battles);
    return battle;
  },

  // 获取战斗记录
  getBattles() {
    return this.get(this.KEYS.BATTLES) || [];
  },

  // 更新战斗备注
  updateBattleNote(battleId, note) {
    const battles = this.get(this.KEYS.BATTLES) || [];
    const battle = battles.find(b => b.id === battleId);
    if (battle) {
      battle.note = note;
      this.set(this.KEYS.BATTLES, battles);
      return true;
    }
    return false;
  },

  // 删除战斗记录
  deleteBattle(battleId) {
    const battles = this.get(this.KEYS.BATTLES) || [];
    const index = battles.findIndex(b => b.id === battleId);
    if (index !== -1) {
      battles.splice(index, 1);
      this.set(this.KEYS.BATTLES, battles);
      return true;
    }
    return false;
  },

  // 获取连胜数据
  getStreak() {
    return this.get(this.KEYS.STREAK) || { current: 0, best: 0 };
  },

  // 更新连胜
  updateStreak(victory) {
    const streak = this.getStreak();
    if (victory) {
      streak.current++;
      if (streak.current > streak.best) {
        streak.best = streak.current;
      }
    } else {
      streak.current = 0;
    }
    this.set(this.KEYS.STREAK, streak);
    return streak;
  },

  // 获取成就
  getAchievements() {
    return this.get(this.KEYS.ACHIEVEMENTS) || { unlocked: [], progress: {} };
  },

  // 解锁成就
  unlockAchievement(achievementId) {
    const achievements = this.getAchievements();
    if (!achievements.unlocked.includes(achievementId)) {
      achievements.unlocked.push(achievementId);
      this.set(this.KEYS.ACHIEVEMENTS, achievements);
      return true; // 新解锁
    }
    return false; // 已解锁
  },

  // 更新成就进度
  updateAchievementProgress(achievementId, progress) {
    const achievements = this.getAchievements();
    achievements.progress[achievementId] = progress;
    this.set(this.KEYS.ACHIEVEMENTS, achievements);
  },

  // 添加心得记录
  addJournal(journalData) {
    const journals = this.get(this.KEYS.JOURNALS) || [];
    journalData.id = Date.now();
    journalData.createdAt = new Date().toISOString();
    journals.unshift(journalData); // 添加到开头

    // 限制最多保存50条心得
    if (journals.length > 50) {
      journals.pop();
    }

    this.set(this.KEYS.JOURNALS, journals);
    return journalData;
  },

  // 获取心得记录
  getJournals() {
    return this.get(this.KEYS.JOURNALS) || [];
  },

  // 按日期获取心得
  getJournalsByDate(date) {
    const journals = this.getJournals();
    return journals.filter(j => j.date === date);
  },

  // 按标签获取心得
  getJournalsByTag(tag) {
    const journals = this.getJournals();
    return journals.filter(j => j.tag === tag);
  }
};

// 初始化存储
Storage.init();