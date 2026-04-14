/**
 * 成就系统模块
 */

const AchievementSystem = {
  // 成就定义
  ACHIEVEMENTS: [
    {
      id: 'first_win',
      name: '初次胜利',
      description: '第一次打败任何情绪',
      condition: (stats) => stats.totalWins >= 1,
      icon: '🏆'
    },
    {
      id: 'streak_3',
      name: '三连胜',
      description: '连续打败3次情绪',
      condition: (stats) => stats.currentStreak >= 3,
      icon: '🔥'
    },
    {
      id: 'streak_5',
      name: '五连胜',
      description: '连续打败5次情绪',
      condition: (stats) => stats.currentStreak >= 5,
      icon: '⭐'
    },
    {
      id: 'beat_sadness',
      name: '战胜沮丧',
      description: '打败沮丧情绪',
      condition: (stats) => stats.emotionWins.sadness >= 1,
      icon: '💧'
    },
    {
      id: 'beat_anger',
      name: '战胜愤怒',
      description: '打败愤怒情绪',
      condition: (stats) => stats.emotionWins.anger >= 1,
      icon: '🔥'
    },
    {
      id: 'beat_anxiety',
      name: '战胜焦虑',
      description: '打败焦虑情绪',
      condition: (stats) => stats.emotionWins.anxiety >= 1,
      icon: '🌀'
    },
    {
      id: 'beat_fear',
      name: '战胜恐惧',
      description: '打败恐惧情绪',
      condition: (stats) => stats.emotionWins.fear >= 1,
      icon: '👻'
    },
    {
      id: 'beat_shame',
      name: '战胜羞耻',
      description: '打败羞耻情绪',
      condition: (stats) => stats.emotionWins.shame >= 1,
      icon: '💛'
    },
    {
      id: 'beat_jealousy',
      name: '战胜嫉妒',
      description: '打败嫉妒情绪',
      condition: (stats) => stats.emotionWins.jealousy >= 1,
      icon: '💚'
    },
    {
      id: 'beat_all',
      name: '全情绪征服',
      description: '打败全部6种情绪',
      condition: (stats) => Object.keys(stats.emotionWins).length >= 6 &&
                            Object.values(stats.emotionWins).every(v => v >= 1),
      icon: '👑'
    },
    {
      id: 'speed_master',
      name: '速度大师',
      description: '任何情绪在3秒内打败',
      condition: (stats) => stats.fastestWin <= 3,
      icon: '⚡'
    },
    {
      id: 'persistent',
      name: '坚持不懈',
      description: '累计战斗50次',
      condition: (stats) => stats.totalBattles >= 50,
      icon: '💪'
    },
    {
      id: 'character_boy',
      name: '男性角色',
      description: '使用全部3个男性角色胜利',
      condition: (stats) => stats.characterWins.boy_young >= 1 &&
                            stats.characterWins.boy_student >= 1 &&
                            stats.characterWins.boy_worker >= 1,
      icon: '👦'
    },
    {
      id: 'character_girl',
      name: '女性角色',
      description: '使用全部3个女性角色胜利',
      condition: (stats) => stats.characterWins.girl_young >= 1 &&
                            stats.characterWins.girl_student >= 1 &&
                            stats.characterWins.girl_office >= 1,
      icon: '👧'
    },
    {
      id: 'all_characters',
      name: '多面手',
      description: '使用全部6个角色胜利',
      condition: (stats) => Object.values(stats.characterWins).every(v => v >= 1),
      icon: '🎭'
    }
  ],

  // 获取统计数据
  getStats() {
    const battles = Storage.getBattles();
    const streak = Storage.getStreak();

    const stats = {
      totalBattles: battles.length,
      totalWins: battles.filter(b => b.result === 'victory').length,
      currentStreak: streak.current,
      bestStreak: streak.best,
      emotionWins: {},
      characterWins: {},
      fastestWin: Infinity
    };

    // 统计各情绪胜利次数
    battles.forEach(b => {
      if (b.result === 'victory') {
        if (!stats.emotionWins[b.emotion]) {
          stats.emotionWins[b.emotion] = 0;
        }
        stats.emotionWins[b.emotion]++;

        if (!stats.characterWins[b.character]) {
          stats.characterWins[b.character] = 0;
        }
        stats.characterWins[b.character]++;

        if (b.time < stats.fastestWin) {
          stats.fastestWin = b.time;
        }
      }
    });

    return stats;
  },

  // 检查成就
  checkAchievements(result) {
    const stats = this.getStats();
    const newAchievements = [];

    this.ACHIEVEMENTS.forEach(achievement => {
      if (achievement.condition(stats)) {
        const isNew = Storage.unlockAchievement(achievement.id);
        if (isNew) {
          newAchievements.push(achievement);
        }
      }
    });

    return newAchievements;
  },

  // 获取已解锁成就
  getUnlockedAchievements() {
    const achievementsData = Storage.getAchievements();
    const unlocked = [];

    this.ACHIEVEMENTS.forEach(achievement => {
      if (achievementsData.unlocked.includes(achievement.id)) {
        unlocked.push({
          ...achievement,
          unlocked: true
        });
      } else {
        unlocked.push({
          ...achievement,
          unlocked: false
        });
      }
    });

    return unlocked;
  },

  // 渲染成就列表
  renderList() {
    const container = document.getElementById('achievements-list');
    if (!container) return;

    const achievements = this.getUnlockedAchievements();

    container.innerHTML = achievements.map(a => `
      <div class="achievement-item ${a.unlocked ? 'unlocked' : ''}">
        <div class="achievement-icon ${a.unlocked ? 'unlocked' : 'locked'}">
          ${a.icon}
        </div>
        <div class="achievement-info">
          <p class="achievement-name">${a.name}</p>
          <p class="achievement-desc">${a.description}</p>
        </div>
      </div>
    `).join('');
  }
};

// 导出
window.AchievementSystem = AchievementSystem;