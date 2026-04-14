/**
 * 统计和日历模块
 * 基于 localStorage 数据实现战斗统计和日历视图
 */

const StatsCalendar = {
  // 当前日历显示的月份
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  selectedDate: null,

  // ===== 统计功能 =====

  // 计算并渲染统计数据
  renderStats() {
    const battles = Storage.getBattles();

    // 总览统计
    const totalBattles = battles.length;
    const victories = battles.filter(b => b.result === 'victory').length;
    const winRate = totalBattles > 0 ? Math.round((victories / totalBattles) * 100) : 0;

    document.getElementById('total-battles').textContent = totalBattles;
    document.getElementById('total-victories').textContent = victories;
    document.getElementById('win-rate').textContent = winRate + '%';

    // 各情绪胜率统计
    this.renderEmotionStats(battles);
  },

  // 渲染各情绪统计
  renderEmotionStats(battles) {
    const listEl = document.getElementById('emotion-stats-list');
    if (!listEl) return;

    // 按情绪分组统计
    const emotionStats = {};
    Object.keys(EMOTIONS).forEach(emotionId => {
      emotionStats[emotionId] = {
        name: EMOTIONS[emotionId].name,
        color: EMOTIONS[emotionId].color,
        total: 0,
        victories: 0,
        avgTime: 0,
        avgClicks: 0,
        times: [],
        clicks: []
      };
    });

    // 统计数据
    battles.forEach(battle => {
      const stat = emotionStats[battle.emotion];
      if (stat) {
        stat.total++;
        if (battle.result === 'victory') {
          stat.victories++;
        }
        stat.times.push(battle.time);
        stat.clicks.push(battle.clicks);
      }
    });

    // 计算平均值
    Object.keys(emotionStats).forEach(emotionId => {
      const stat = emotionStats[emotionId];
      if (stat.times.length > 0) {
        stat.avgTime = Math.round(stat.times.reduce((a, b) => a + b, 0) / stat.times.length * 10) / 10;
        stat.avgClicks = Math.round(stat.clicks.reduce((a, b) => a + b, 0) / stat.clicks.length);
      }
    });

    // 渲染列表
    listEl.innerHTML = Object.keys(emotionStats).map(emotionId => {
      const stat = emotionStats[emotionId];
      const winRate = stat.total > 0 ? Math.round((stat.victories / stat.total) * 100) : 0;
      const colorHex = '#' + stat.color.toString(16).padStart(6, '0');

      return `
        <div class="emotion-stat-item">
          <div class="emotion-stat-name">
            <div class="emotion-stat-color" style="background: ${colorHex}"></div>
            <span>${stat.name}</span>
          </div>
          <div class="emotion-stat-details">
            <span>胜率: ${winRate}%</span>
            <span>战斗: ${stat.total}</span>
            <span>平均: ${stat.avgTime}秒 / ${stat.avgClicks}次</span>
          </div>
        </div>
      `;
    }).join('');
  },

  // ===== 日历功能 =====

  // 渲染日历
  renderCalendar() {
    const gridEl = document.getElementById('calendar-grid');
    const monthLabelEl = document.getElementById('calendar-month-label');
    if (!gridEl) return;

    // 更新月份标签
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    monthLabelEl.textContent = `${this.currentYear}年${monthNames[this.currentMonth]}`;

    // 获取战斗数据
    const battles = Storage.getBattles();

    // 创建日期战斗映射
    const battleByDate = {};
    battles.forEach(battle => {
      // 解析日期格式 "2026/4/14 下午3:30:45" 或 "2026/04/14"
      const dateStr = battle.date.split(' ')[0]; // 取日期部分
      if (!battleByDate[dateStr]) {
        battleByDate[dateStr] = [];
      }
      battleByDate[dateStr].push(battle);
    });

    // 计算日历数据
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startWeekday = firstDay.getDay(); // 0=周日
    const totalDays = lastDay.getDate();

    // 生成日历头（周一到周日）
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    let html = weekdays.map(day => `<div class="calendar-day-header">${day}</div>`).join('');

    // 填充空白天数（到月初第一天）
    for (let i = 0; i < startWeekday; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    // 填充日期
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${this.currentYear}/${this.currentMonth + 1}/${day}`;
      const battlesOfDay = battleByDate[dateStr] || [];

      // 判断日期状态
      let dayClass = 'calendar-day';
      let marker = '';

      if (battlesOfDay.length > 0) {
        const victories = battlesOfDay.filter(b => b.result === 'victory').length;
        const defeats = battlesOfDay.filter(b => b.result === 'defeat').length;

        if (victories > 0 && defeats === 0) {
          dayClass += ' victory-day';
          marker = '✅';
        } else if (defeats > 0 && victories === 0) {
          dayClass += ' defeat-day';
          marker = '❌';
        } else if (victories > 0 && defeats > 0) {
          dayClass += ' mixed-day';
          marker = '⚖️';
        } else {
          dayClass += ' has-battle';
          marker = '🏃';
        }

        marker += ` ${battlesOfDay.length}`;
      }

      // 检查是否为选中日期
      if (this.selectedDate === dateStr) {
        dayClass += ' selected';
      }

      html += `
        <div class="${dayClass}" onclick="StatsCalendar.selectDate('${dateStr}')">
          <span class="calendar-day-number">${day}</span>
          ${marker ? `<span class="calendar-day-marker">${marker}</span>` : ''}
        </div>
      `;
    }

    gridEl.innerHTML = html;

    // 清空当日战斗列表
    this.renderDayBattles(null);
  },

  // 选择日期
  selectDate(dateStr) {
    this.selectedDate = dateStr;
    this.renderCalendar();
    this.renderDayBattles(dateStr);
  },

  // 渲染当日战斗
  renderDayBattles(dateStr) {
    const titleEl = document.getElementById('day-battles-title');
    const listEl = document.getElementById('day-battles-list');
    if (!titleEl || !listEl) return;

    if (!dateStr) {
      titleEl.textContent = '选择日期查看记录';
      listEl.innerHTML = '';
      return;
    }

    const battles = Storage.getBattles();
    const battlesOfDay = battles.filter(b => b.date.split(' ')[0] === dateStr);

    titleEl.textContent = `${dateStr} 的战斗记录`;

    if (battlesOfDay.length === 0) {
      listEl.innerHTML = '<p class="empty-message">当日无战斗记录</p>';
      return;
    }

    // 获取所有心得，用于关联战斗
    const journals = Storage.getJournals();

    // 显示战斗记录，每条战斗右侧显示关联的心得
    listEl.innerHTML = battlesOfDay.map(battle => {
      const emotionName = EMOTIONS[battle.emotion]?.name || battle.emotion;
      let resultClass = '';
      let resultText = '';

      if (battle.result === 'victory') {
        resultClass = 'victory';
        resultText = '✅ 胜利';
      } else if (battle.result === 'defeat') {
        resultClass = 'defeat';
        resultText = '❌ 失败';
      } else {
        resultClass = 'escape';
        resultText = '🏃 逃跑';
      }

      // 查找关联的心得（通过battleId或时间匹配）
      const relatedJournal = journals.find(j =>
        j.battleId === battle.id ||
        (j.emotion === battle.emotion && j.result === battle.result &&
         Math.abs(new Date(j.createdAt) - new Date(battle.date)) < 60000)
      );

      let journalHtml = '';
      if (relatedJournal) {
        const tagText = relatedJournal.tag ? this.getTagLabel(relatedJournal.tag) : '';
        journalHtml = `
          <div class="battle-journal-box">
            ${tagText ? `<span class="battle-journal-tag">${tagText}</span>` : ''}
            ${relatedJournal.journal ? `<p class="battle-journal-text">${relatedJournal.journal}</p>` : ''}
          </div>
        `;
      }

      return `
        <div class="day-battle-item-with-journal">
          <div class="day-battle-main">
            <div class="day-battle-info">
              <span class="day-battle-emotion">${emotionName}</span>
              <span class="day-battle-time">${battle.time.toFixed(1)}秒 · ${battle.clicks}次</span>
            </div>
            <span class="day-battle-result ${resultClass}">${resultText}</span>
          </div>
          ${journalHtml}
        </div>
      `;
    }).join('');
  },

  // 获取标签文字
  getTagLabel(tag) {
    const tagLabels = {
      'work': '💼 工作',
      'family': '👨‍👩‍👧 家庭',
      'relationship': '❤️ 情感',
      'luck': '🎲 纯倒霉'
    };
    return tagLabels[tag] || tag;
  },

  // 上个月
  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.selectedDate = null;
    this.renderCalendar();
  },

  // 下个月
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedDate = null;
    this.renderCalendar();
  }
};

// 导出
window.StatsCalendar = StatsCalendar;