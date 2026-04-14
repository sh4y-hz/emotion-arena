/**
 * 主入口模块
 * 页面路由和全局控制
 */

// 当前选中的角色和情绪
let selectedCharacter = 'boy_young';
let selectedEmotion = 'sadness';
let currentCharacterTab = 'male';

// 当前编辑的战斗记录ID
let editingBattleId = null;

// 当前选中的心得标签
let selectedJournalTag = null;

// 当前战斗结果（用于保存心得）
let currentBattleResult = null;

/**
 * 页面路由系统
 */
function showPage(pageId) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // 显示目标页面
  const targetPage = document.getElementById('page-' + pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // 页面初始化
  switch (pageId) {
    case 'home':
      // 首页不需要特殊初始化
      break;

    case 'select':
      initSelectPage();
      break;

    case 'battle':
      initBattlePage();
      break;

    case 'result':
      // 结果页面由战斗结束时填充
      break;

    case 'breathing':
      BreathingSystem.start();
      break;

    case 'settings':
      initSettingsPage();
      break;

    case 'history':
      renderHistoryList();
      break;

    case 'achievements':
      AchievementSystem.renderList();
      break;

    case 'stats':
      StatsCalendar.renderStats();
      break;

    case 'calendar':
      StatsCalendar.renderCalendar();
      break;
  }
}

/**
 * 切换角色Tab（男性/女性）
 */
function switchCharacterTab(tabId) {
  currentCharacterTab = tabId;

  // 更新Tab按钮状态
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (activeTabBtn) {
    activeTabBtn.classList.add('active');
    activeTabBtn.setAttribute('aria-selected', 'true');
  }

  // 显示/隐藏对应的Tab面板
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  const activePanel = document.getElementById('tab-' + tabId);
  if (activePanel) {
    activePanel.classList.remove('hidden');
  }
}

/**
 * 初始化选择页面（新布局）
 */
function initSelectPage() {
  // 加载保存的选择
  const settings = Storage.getSettings();
  selectedCharacter = settings.selectedCharacter || 'boy_young';
  selectedEmotion = settings.selectedEmotion || 'sadness';

  // 设置下拉选择器的初始值
  const genderSelect = document.getElementById('gender-select');
  const styleSelect = document.getElementById('style-select');
  const emotionSelect = document.getElementById('emotion-select');

  if (genderSelect && styleSelect) {
    // 根据当前角色设置下拉值
    const { gender, style } = getCharacterSelectors(selectedCharacter);
    genderSelect.value = gender;
    styleSelect.value = style;
  }

  if (emotionSelect) {
    emotionSelect.value = selectedEmotion;
  }

  // 绘制预览
  drawLargeCharacterPreview();
  drawLargeEmotionPreview();
}

/**
 * 根据角色ID获取性别和服装选择器值
 */
function getCharacterSelectors(charId) {
  const mapping = {
    'boy_young': { gender: 'male', style: 'young' },
    'boy_student': { gender: 'male', style: 'student' },
    'boy_worker': { gender: 'male', style: 'worker' },
    'girl_young': { gender: 'female', style: 'young' },
    'girl_student': { gender: 'female', style: 'student' },
    'girl_office': { gender: 'female', style: 'worker' }
  };
  return mapping[charId] || { gender: 'male', style: 'young' };
}

/**
 * 根据选择器值获取角色ID
 */
function getCharacterIdFromSelectors(gender, style) {
  const mapping = {
    'male_young': 'boy_young',
    'male_student': 'boy_student',
    'male_worker': 'boy_worker',
    'female_young': 'girl_young',
    'female_student': 'girl_student',
    'female_worker': 'girl_office'
  };
  return mapping[gender + '_' + style] || 'boy_young';
}

/**
 * 从选择器更新角色预览
 */
function updateCharacterFromSelectors() {
  const genderSelect = document.getElementById('gender-select');
  const styleSelect = document.getElementById('style-select');

  if (genderSelect && styleSelect) {
    selectedCharacter = getCharacterIdFromSelectors(genderSelect.value, styleSelect.value);
    drawLargeCharacterPreview();

    // 保存选择
    Storage.saveSettings({ selectedCharacter: selectedCharacter });
  }
}

/**
 * 从选择器更新情绪预览
 */
function updateEmotionPreview() {
  const emotionSelect = document.getElementById('emotion-select');
  if (emotionSelect) {
    selectedEmotion = emotionSelect.value;
    drawLargeEmotionPreview();

    // 保存选择
    Storage.saveSettings({ selectedEmotion: selectedEmotion });
  }
}

/**
 * 绘制大角色预览
 */
function drawLargeCharacterPreview() {
  const previewEl = document.getElementById('character-preview-large');
  if (!previewEl) return;

  previewEl.innerHTML = '';

  const char = CHARACTERS[selectedCharacter];
  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 120;
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // 绘制角色
  drawSimpleCharacter(ctx, selectedCharacter, 40, 110, 'idle');

  previewEl.appendChild(canvas);
}

/**
 * 绘制大情绪预览
 */
function drawLargeEmotionPreview() {
  const previewEl = document.getElementById('emotion-preview-large');
  if (!previewEl) return;

  previewEl.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 80;
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // 绘制情绪
  drawSimpleEmotion(ctx, selectedEmotion, 40, 40, 'idle');

  previewEl.appendChild(canvas);
}

/**
 * 从选择器开始战斗
 */
function startBattleFromSelectors() {
  const characterName = document.getElementById('character-name-input')?.value || '';
  const emotionName = document.getElementById('emotion-name-input')?.value || '';

  startPhaserGame(selectedCharacter, selectedEmotion, characterName, emotionName);
  showPage('battle');
}

/**
 * 绘制情绪预览
 */
function drawEmotionPreviews() {
  Object.keys(EMOTIONS).forEach(emotionId => {
    const previewEl = document.getElementById('preview-' + emotionId);
    if (!previewEl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // 使用简化的像素绘制
    drawSimpleEmotion(ctx, emotionId, 40, 80, 'idle');

    previewEl.innerHTML = '';
    previewEl.appendChild(canvas);
  });
}

/**
 * 简化版角色绘制（用于预览）
 */
function drawSimpleCharacter(ctx, charId, x, y, state) {
  const char = CHARACTERS[charId];
  if (!char) return;

  const colors = char.colors;
  const ps = 4;
  let headSize = char.age === 'child' ? 24 : 28;
  const headY = y - char.height + headSize / 2;
  const bodyY = y - char.height + headSize;

  // 头部
  ctx.fillStyle = colors.skin;
  for (let dy = -headSize/2; dy <= headSize/2; dy += ps) {
    for (let dx = -headSize/2; dx <= headSize/2; dx += ps) {
      if (dx*dx + dy*dy <= (headSize/2)*(headSize/2)) {
        ctx.fillRect(x + dx, headY + dy, ps, ps);
      }
    }
  }

  // 头发
  ctx.fillStyle = colors.hair;
  ctx.fillRect(x - 14, headY - headSize/2 - 4, 28, 8);

  // 眼睛
  ctx.fillStyle = '#000';
  ctx.fillRect(x - 8, headY + 2, 4, 4);
  ctx.fillRect(x + 4, headY + 2, 4, 4);

  // ===== 角色特征绘制 =====
  if (charId === 'boy_student') {
    // 学生眼镜
    ctx.fillStyle = colors.glassesFrame || '#333';
    ctx.fillRect(x - 12, headY - 2, 12, 12);
    ctx.fillRect(x + 2, headY - 2, 12, 12);
    ctx.fillRect(x - 2, headY + 2, 4, 2);
    // 镜片反光
    if (colors.glassesLens) {
      ctx.fillStyle = colors.glassesLens;
      ctx.fillRect(x - 10, headY, 4, 4);
      ctx.fillRect(x + 4, headY, 4, 4);
    }
    // 白衬衫
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(x - 12, bodyY, 24, 20);
    // 校服领子
    if (colors.collar) {
      ctx.fillStyle = colors.collar;
      ctx.fillRect(x - 8, bodyY, 4, 8);
      ctx.fillRect(x + 4, bodyY, 4, 8);
    }
    // 红领带
    ctx.fillStyle = colors.tie;
    ctx.fillRect(x - 2, bodyY + 8, 4, 12);
    ctx.fillRect(x - 3, bodyY + 6, 6, 3);
    // 裤子
    ctx.fillStyle = colors.pants;
    ctx.fillRect(x - 10, bodyY + 20, 20, char.height - headSize - 20);
  } else if (charId === 'boy_worker') {
    // 上班族：西装外套
    ctx.fillStyle = colors.suit;
    ctx.fillRect(x - 16, bodyY, 32, 24);
    // 西装边缘
    if (colors.suitLight) {
      ctx.fillStyle = colors.suitLight;
      ctx.fillRect(x - 14, bodyY, 4, 20);
      ctx.fillRect(x + 10, bodyY, 4, 20);
    }
    // 白衬衫领子
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(x - 6, bodyY, 12, 8);
    // 红领带
    ctx.fillStyle = colors.tie;
    ctx.fillRect(x - 2, bodyY + 8, 4, 16);
    ctx.fillRect(x - 4, bodyY + 6, 8, 4);
    // 裤子
    ctx.fillStyle = colors.pants;
    ctx.fillRect(x - 12, bodyY + 24, 24, char.height - headSize - 24);
  } else if (charId === 'girl_young') {
    // 可爱女孩：连衣裙
    ctx.fillStyle = colors.dress;
    ctx.fillRect(x - 14, bodyY, 28, char.height - headSize);
    // 辫子
    ctx.fillStyle = colors.hair;
    ctx.fillRect(x - 20, headY - 4, 8, 20);
    ctx.fillRect(x + 12, headY - 4, 8, 20);
    // 蝴蝶结
    if (colors.ribbon) {
      ctx.fillStyle = colors.ribbon;
      ctx.fillRect(x - 22, headY - 6, 6, 6);
      ctx.fillRect(x + 16, headY - 6, 6, 6);
    }
  } else if (charId === 'girl_student') {
    // 女学生：长发 + 校服裙
    ctx.fillStyle = colors.hair;
    ctx.fillRect(x - 16, headY - 8, 4, 40);
    ctx.fillRect(x + 12, headY - 8, 4, 40);
    // 白衬衫
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(x - 12, bodyY, 24, 16);
    // 校服裙
    ctx.fillStyle = colors.skirt;
    ctx.fillRect(x - 14, bodyY + 16, 28, char.height - headSize - 16);
  } else if (charId === 'girl_office') {
    // 职场女性：西装
    ctx.fillStyle = colors.hair;
    ctx.fillRect(x - 16, headY - 8, 4, 40);
    ctx.fillRect(x + 12, headY - 8, 4, 40);
    // 西装外套
    ctx.fillStyle = colors.suit;
    ctx.fillRect(x - 16, bodyY, 32, 20);
    // 衬衫领子
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(x - 6, bodyY, 12, 6);
    // 职业裙
    ctx.fillStyle = colors.skirt;
    ctx.fillRect(x - 14, bodyY + 20, 28, char.height - headSize - 20);
  } else {
    // 活泼少年：T恤短裤（默认）
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(x - 12, bodyY, 24, 20);
    ctx.fillStyle = colors.pants;
    ctx.fillRect(x - 10, bodyY + 20, 20, char.height - headSize - 20);
  }

  // 鞋子
  if (colors.shoes) {
    ctx.fillStyle = colors.shoes;
    ctx.fillRect(x - 10, y - 4, 8, 4);
    ctx.fillRect(x + 2, y - 4, 8, 4);
  }
}

/**
 * 简化版情绪绘制（用于预览）
 */
function drawSimpleEmotion(ctx, emotionId, x, y, state) {
  const emotion = EMOTIONS[emotionId];
  if (!emotion) return;

  const color = emotion.color;
  const size = 40;

  // 主体圆形
  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  for (let dy = -size; dy <= size; dy += 4) {
    for (let dx = -size; dx <= size; dx += 4) {
      if (dx*dx + dy*dy <= size*size) {
        ctx.fillRect(x + dx, y - 40 + dy, 4, 4);
      }
    }
  }

  // 眼睛
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 12, y - 48, 8, 8);
  ctx.fillRect(x + 4, y - 48, 8, 8);
  ctx.fillStyle = '#000';
  ctx.fillRect(x - 8, y - 46, 4, 4);
  ctx.fillRect(x + 8, y - 46, 4, 4);
}

/**
 * 选择角色
 */
function selectCharacter(charId) {
  selectedCharacter = charId;
  updateCharacterSelection(charId);
}

/**
 * 更新角色选中状态
 */
function updateCharacterSelection(charId) {
  document.querySelectorAll('.character-card').forEach(card => {
    card.classList.remove('selected');
  });

  const selectedCard = document.querySelector(`.character-card[data-character="${charId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
}

/**
 * 选择情绪
 */
function selectEmotion(emotionId) {
  selectedEmotion = emotionId;
  updateEmotionSelection(emotionId);
  updateDifficultyInfo();
}

/**
 * 更新情绪选中状态
 */
function updateEmotionSelection(emotionId) {
  document.querySelectorAll('.emotion-card').forEach(card => {
    card.classList.remove('selected');
  });

  const selectedCard = document.querySelector(`.emotion-card[data-emotion="${emotionId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
}

/**
 * 更新难度信息
 */
function updateDifficultyInfo() {
  const emotion = EMOTIONS[selectedEmotion];
  const textEl = document.getElementById('difficulty-text');

  if (emotion && textEl) {
    textEl.textContent = `当前难度：时间 ${emotion.timeLimit}秒 | 点击 ${emotion.requiredClicks}次`;
  }
}

/**
 * 开始战斗
 */
function startBattle() {
  // 获取命名输入
  const characterNameInput = document.getElementById('character-name-input');
  const emotionNameInput = document.getElementById('emotion-name-input');

  const characterName = characterNameInput ? characterNameInput.value.trim() : '';
  const emotionName = emotionNameInput ? emotionNameInput.value.trim() : '';

  // 保存选择和名称
  const settings = Storage.getSettings();
  settings.selectedCharacter = selectedCharacter;
  settings.selectedEmotion = selectedEmotion;
  settings.characterName = characterName;
  settings.emotionName = emotionName;
  Storage.saveSettings(settings);

  // 切换到战斗页面（传递名称）
  showPage('battle');
}

/**
 * 初始化战斗页面
 */
function initBattlePage() {
  // 获取保存的名称
  const settings = Storage.getSettings();
  const characterName = settings.characterName || '';
  const emotionName = settings.emotionName || '';

  // 启动Phaser游戏（传递名称）
  startPhaserGame(selectedCharacter, selectedEmotion, characterName, emotionName);

  // 绑定触摸事件（移动端）
  const attackBtn = document.getElementById('attack-btn');
  if (attackBtn) {
    attackBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleAttackClick();
    });

    attackBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      // 触摸结束不立即切换，等待idleTimer
    });
  }
}

/**
 * 处理攻击点击
 */
function handleAttackClick() {
  window.handleAttackClick_phaser();
}

/**
 * 使用大招
 */
function useUltimate() {
  AudioSystem.play('ultimate');
  window.useUltimate_phaser();
}

/**
 * 逃跑
 */
function escapeBattle() {
  window.escapeBattle_phaser();
}

/**
 * 渲染结果界面
 */
function renderResult(result, newAchievements) {
  const contentEl = document.getElementById('result-content');
  const encouragementEl = document.getElementById('encouragement-text');
  const achievementEl = document.getElementById('achievement-unlock');

  if (!contentEl) return;

  // 结果标题
  let titleClass = '';
  let titleText = '';
  let icon = '';

  if (result.result === 'victory') {
    titleClass = '';
    titleText = '胜利!';
    icon = '🎉';
  } else if (result.result === 'defeat') {
    titleClass = 'defeat';
    titleText = '未能打败';
    icon = '😢';
  } else {
    titleClass = 'escape';
    titleText = '选择逃跑';
    icon = '🏃';
  }

  // 情绪名称
  const emotionName = EMOTIONS[result.emotion]?.name || result.emotion;

  contentEl.innerHTML = `
    <div class="result-icon">${icon}</div>
    <h2 class="result-title ${titleClass}">${titleText}</h2>
    <div class="result-stats">
      <p>用时 ${result.time.toFixed(1)} 秒</p>
      <p>点击次数：${result.clicks} 次</p>
      <p>对手：${emotionName}</p>
    </div>
  `;

  // 鼓励/安慰语句
  const encouragements = {
    victory: [
      '你战胜了' + emotionName + '，真棒！每一次面对都是成长！',
      '太厉害了！' + emotionName + '被你打败了！',
      emotionName + '逃跑了！你是最棒的！',
      '闪电般的速度！你的勇气无可阻挡！'
    ],
    defeat: [
      '没关系，下次试着更快面对它！',
      '别灰心，每一场战斗都是练习！',
      '情绪有时候很强大，但你更强大！'
    ],
    escape: [
      '选择暂时逃避也是一种智慧。',
      '休息一下，下次再来！',
      '接纳自己的情绪，也是一种勇气。'
    ]
  };

  const messages = encouragements[result.result];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  if (encouragementEl) {
    encouragementEl.textContent = randomMessage;
  }

  // 显示解锁的成就
  if (achievementEl && newAchievements.length > 0) {
    achievementEl.style.display = 'block';
    document.getElementById('unlock-name').textContent = newAchievements[0].name;
  } else if (achievementEl) {
    achievementEl.style.display = 'none';
  }

  // 保存当前战斗结果用于心得记录
  currentBattleResult = result;

  // 重置心得输入
  selectedJournalTag = null;
  document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
  const journalInput = document.getElementById('journal-input');
  if (journalInput) {
    journalInput.value = '';
  }
}

/**
 * 选择心得标签
 */
function selectTag(tag) {
  selectedJournalTag = tag;

  // 更新按钮选中状态
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.tag === tag);
  });
}

/**
 * 保存心得
 */
function saveJournal() {
  if (!currentBattleResult) return;

  const journalInput = document.getElementById('journal-input');
  const journalText = journalInput ? journalInput.value.trim() : '';

  if (!selectedJournalTag && !journalText) {
    // 不弹窗，只在控制台提示
    console.log('请选择标签或输入心得内容');
    return;
  }

  // 构建心得数据
  const journalData = {
    battleId: currentBattleResult.battleId || Date.now(),
    date: new Date().toLocaleDateString('zh-CN'),
    tag: selectedJournalTag,
    journal: journalText,
    emotion: currentBattleResult.emotion,
    result: currentBattleResult.result,
    time: currentBattleResult.time,
    clicks: currentBattleResult.clicks,
    character: currentBattleResult.character
  };

  // 保存到Storage
  if (typeof Storage !== 'undefined') {
    Storage.addJournal(journalData);
  }

  // 控制台确认
  console.log('心得已保存！');

  // 更新按钮状态：变成"已保存"并禁用
  const saveBtn = document.querySelector('.journal-section .btn-primary');
  if (saveBtn) {
    saveBtn.textContent = '✅ 已保存';
    saveBtn.disabled = true;
    saveBtn.classList.add('saved');
  }

  // 清空输入
  selectedJournalTag = null;
  document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
  if (journalInput) {
    journalInput.value = '';
    journalInput.disabled = true;
  }
}

/**
 * 初始化设置页面
 */
function initSettingsPage() {
  const settings = Storage.getSettings();

  // 音效开关
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.textContent = settings.soundEnabled ? '开启' : '关闭';
    soundToggle.classList.toggle('off', !settings.soundEnabled);
  }

  // 震动开关
  const vibrationToggle = document.getElementById('vibration-toggle');
  if (vibrationToggle) {
    vibrationToggle.textContent = settings.vibrationEnabled ? '开启' : '关闭';
    vibrationToggle.classList.toggle('off', !settings.vibrationEnabled);
  }
}

/**
 * 切换音效
 */
function toggleSound() {
  const settings = Storage.getSettings();
  settings.soundEnabled = !settings.soundEnabled;
  Storage.saveSettings(settings);

  AudioSystem.setEnabled(settings.soundEnabled);

  const toggle = document.getElementById('sound-toggle');
  if (toggle) {
    toggle.textContent = settings.soundEnabled ? '开启' : '关闭';
    toggle.classList.toggle('off', !settings.soundEnabled);
  }
}

/**
 * 切换震动
 */
function toggleVibration() {
  const settings = Storage.getSettings();
  settings.vibrationEnabled = !settings.vibrationEnabled;
  Storage.saveSettings(settings);

  const toggle = document.getElementById('vibration-toggle');
  if (toggle) {
    toggle.textContent = settings.vibrationEnabled ? '开启' : '关闭';
    toggle.classList.toggle('off', !settings.vibrationEnabled);
  }
}

/**
 * 保存设置
 */
function saveSettings() {
  showPage('home');
}

/**
 * 渲染历史记录列表
 */
function renderHistoryList() {
  const listEl = document.getElementById('history-list');
  if (!listEl) return;

  const battles = Storage.getBattles();

  if (battles.length === 0) {
    listEl.innerHTML = '<p class="empty-message">暂无战斗记录</p>';
    return;
  }

  listEl.innerHTML = battles.map(battle => {
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

    return `
      <div class="history-item">
        <div class="history-header">
          <span class="history-date">${battle.date}</span>
          <span class="history-result ${resultClass}">${resultText}</span>
        </div>
        <div class="history-details">
          ${emotionName} · ${battle.time.toFixed(1)}秒 · ${battle.clicks}次
        </div>
        ${battle.note ? `<div class="history-note">${battle.note}</div>` : ''}
        <div class="history-actions">
          <button class="btn btn-secondary btn-small" onclick="editNote(${battle.id})">
            ${battle.note ? '修改备注' : '添加备注'}
          </button>
          <button class="btn btn-secondary btn-small" onclick="deleteRecord(${battle.id})">
            删除
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 编辑备注
 */
function editNote(battleId) {
  editingBattleId = battleId;

  const battles = Storage.getBattles();
  const battle = battles.find(b => b.id === battleId);

  const modal = document.getElementById('note-modal');
  const input = document.getElementById('note-input');

  if (modal && input) {
    input.value = battle?.note || '';
    modal.style.display = 'flex';
  }
}

/**
 * 保存备注
 */
function saveNote() {
  if (!editingBattleId) return;

  const input = document.getElementById('note-input');
  if (!input) return;

  const note = input.value.trim();
  Storage.updateBattleNote(editingBattleId, note);

  closeNoteModal();
  renderHistoryList();
}

/**
 * 关闭备注弹窗
 */
function closeNoteModal() {
  const modal = document.getElementById('note-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  editingBattleId = null;
}

/**
 * 删除记录
 */
function deleteRecord(battleId) {
  if (confirm('确定要删除这条记录吗？')) {
    Storage.deleteBattle(battleId);
    renderHistoryList();
  }
}

/**
 * 结束呼吸练习
 */
function endBreathing() {
  BreathingSystem.end();
}

/**
 * 绘制像素风格Battle Logo（更大、斜体风格）
 */
function drawBattleLogo() {
  const canvas = document.getElementById('battle-logo-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const ps = 6; // 像素大小增大
  const width = canvas.width;
  const height = canvas.height;

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 绘制"BATTLE"像素文字 - 斜体风格（向左倾斜）
  // 使用canvas transform实现斜体效果
  ctx.save();
  ctx.transform(1, 0, -0.2, 1, 0, 0); // 从右往左斜（负值）

  // 调整起始位置使文字居中
  const startX = 20;
  const startY = 12;
  const letterSpacing = 36; // 字母间隔

  // B - 红色
  ctx.fillStyle = '#e74c3c';
  drawPixelLetterB(ctx, startX, startY, ps);
  // A - 橙色
  ctx.fillStyle = '#f39c12';
  drawPixelLetterA(ctx, startX + letterSpacing, startY, ps);
  // T - 绿色
  ctx.fillStyle = '#27ae60';
  drawPixelLetterT(ctx, startX + letterSpacing * 2, startY, ps);
  // T - 蓝色
  ctx.fillStyle = '#3498db';
  drawPixelLetterT(ctx, startX + letterSpacing * 3, startY, ps);
  // L - 紫色
  ctx.fillStyle = '#9b59b6';
  drawPixelLetterL(ctx, startX + letterSpacing * 4, startY, ps);
  // E - 红色
  ctx.fillStyle = '#e74c3c';
  drawPixelLetterE(ctx, startX + letterSpacing * 5, startY, ps);

  ctx.restore();

  // 绘制装饰剑图标（放大）
  ctx.fillStyle = '#f8b500';
  ctx.fillRect(startX + letterSpacing * 6 + 5, startY - 4, 8, 32); // 剑身
  ctx.fillStyle = '#fff';
  ctx.fillRect(startX + letterSpacing * 6, startY + 28, 16, 8); // 剑柄
}

/**
 * 绘制像素字母B
 */
function drawPixelLetterB(ctx, x, y, ps) {
  // B的像素形状
  const pattern = [
    [1,1,1,1],
    [1,0,0,1],
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,1,1,1]
  ];
  pattern.forEach((row, ri) => {
    row.forEach((col, ci) => {
      if (col) ctx.fillRect(x + ci * ps, y + ri * ps, ps, ps);
    });
  });
}

/**
 * 绘制像素字母A
 */
function drawPixelLetterA(ctx, x, y, ps) {
  const pattern = [
    [0,1,1,0],
    [1,0,0,1],
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1]
  ];
  pattern.forEach((row, ri) => {
    row.forEach((col, ci) => {
      if (col) ctx.fillRect(x + ci * ps, y + ri * ps, ps, ps);
    });
  });
}

/**
 * 绘制像素字母T
 */
function drawPixelLetterT(ctx, x, y, ps) {
  const pattern = [
    [1,1,1,1],
    [0,1,1,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,1,1,0]
  ];
  pattern.forEach((row, ri) => {
    row.forEach((col, ci) => {
      if (col) ctx.fillRect(x + ci * ps, y + ri * ps, ps, ps);
    });
  });
}

/**
 * 绘制像素字母L
 */
function drawPixelLetterL(ctx, x, y, ps) {
  const pattern = [
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,1,1,1]
  ];
  pattern.forEach((row, ri) => {
    row.forEach((col, ci) => {
      if (col) ctx.fillRect(x + ci * ps, y + ri * ps, ps, ps);
    });
  });
}

/**
 * 绘制像素字母E
 */
function drawPixelLetterE(ctx, x, y, ps) {
  const pattern = [
    [1,1,1,1],
    [1,0,0,0],
    [1,1,1,1],
    [1,0,0,0],
    [1,0,0,0],
    [1,1,1,1]
  ];
  pattern.forEach((row, ri) => {
    row.forEach((col, ci) => {
      if (col) ctx.fillRect(x + ci * ps, y + ri * ps, ps, ps);
    });
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化存储
  Storage.init();

  // 初始化音频系统
  AudioSystem.init();

  // 绘制Battle Logo
  drawBattleLogo();

  // 显示首页
  showPage('home');
});

// 导出全局函数
window.showPage = showPage;
window.switchCharacterTab = switchCharacterTab;
window.selectCharacter = selectCharacter;
window.selectEmotion = selectEmotion;
window.startBattle = startBattle;
window.handleAttackClick = handleAttackClick;
window.useUltimate = useUltimate;
window.escapeBattle = escapeBattle;
window.toggleSound = toggleSound;
window.toggleVibration = toggleVibration;
window.saveSettings = saveSettings;
window.editNote = editNote;
window.saveNote = saveNote;
window.closeNoteModal = closeNoteModal;
window.deleteRecord = deleteRecord;
window.endBreathing = endBreathing;
window.selectTag = selectTag;
window.saveJournal = saveJournal;
window.prevMonth = () => StatsCalendar.prevMonth();
window.nextMonth = () => StatsCalendar.nextMonth();