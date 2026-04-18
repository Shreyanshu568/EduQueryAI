let questionCount = 0;

/* ── Theme Toggle ── */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const toggleLabel = document.getElementById('toggleLabel');
  if (toggleLabel) toggleLabel.textContent = isDark ? 'DARK' : 'WHITE';
}

/* ── Auto-resize textarea ── */
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

/* ── Quick prompt click ── */
function sendQuick(btn) {
  document.getElementById('chatInput').value = btn.textContent;
  sendMessage();
}

/* ── Particle effect on send button ── */
function showParticleEffect() {
  const sendBtn = document.querySelector('.send-btn');
  if (!sendBtn) return;
  
  const rect = sendBtn.getBoundingClientRect();
  
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = rect.left + rect.width / 2 + 'px';
    particle.style.top = rect.top + rect.height / 2 + 'px';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = (Math.random() * 4 + 2) + 'px';
    particle.style.background = '#059669';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.animation = 'particleExplosion 0.5s ease forwards';
    particle.style.animationDelay = Math.random() * 0.2 + 's';
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 500);
  }
}

/* ── Send a message ── */
function sendMessage() {
  showParticleEffect();
  
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';

  const wm = document.getElementById('welcomeMsg');
  if (wm) wm.remove();

  appendMessage('user', text);
  showTyping();
  addToHistory(text);

  questionCount++;
  const statQ = document.getElementById('statQ');
  if (statQ) statQ.textContent = questionCount;

  const isQuiz = text.toLowerCase().includes('quiz') ||
                 text.toLowerCase().includes('mcq') ||
                 text.toLowerCase().includes('questions on') ||
                 text.toLowerCase().includes('generate questions');

  const endpoint = isQuiz ? 
    'http://127.0.0.1:8000/quiz' : 
    'http://127.0.0.1:8000/ask';

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: text })
  })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(data => {
    removeTyping();
    const rawAnswer = data.answer || data.quiz || 'No answer received';
    const formattedAnswer = rawAnswer
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    appendMessage('ai', formattedAnswer);
  })
  .catch(error => {
    console.error('Fetch error:', error);
    removeTyping();
    appendMessage('ai', 'Sorry, could not connect to backend. Make sure server is running.');
  });
}

/* ── Append a chat message bubble ── */
function appendMessage(role, text) {
  const messages = document.getElementById('chatMessages');
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isAI = role === 'ai';

  const row = document.createElement('div');
  row.className = `msg-row ${role}`;

  let avatarHTML = '';
  if (isAI) {
    avatarHTML = `<div class="msg-avatar ai-av">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>`;
  } else {
    avatarHTML = `<div class="msg-avatar user-av">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>`;
  }

  row.innerHTML = avatarHTML + `
    <div class="msg-bubble">
      <div class="msg-text">${text}</div>
      <div class="msg-time">${now}</div>
    </div>
  `;
  
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

/* ── Typing indicator ── */
function showTyping() {
  const messages = document.getElementById('chatMessages');
  const row = document.createElement('div');
  row.className = 'msg-row ai';
  row.id = 'typingRow';
  row.innerHTML = `
    <div class="msg-avatar ai-av">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
    <div class="msg-bubble" style="padding: 0;">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const typingRow = document.getElementById('typingRow');
  if (typingRow) typingRow.remove();
}

/* ── Add question to history sidebar ── */
function addToHistory(question) {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  
  const emptyMessage = historyList.querySelector('.empty-history-message');
  if (emptyMessage) emptyMessage.remove();
  
  historyList.querySelectorAll('.history-item').forEach(item => item.classList.remove('active'));
  
  const item = document.createElement('div');
  item.className = 'history-item active';
  const shortQuestion = question.length > 50 ? question.slice(0, 50) + '…' : question;
  item.innerHTML = `
    <div class="history-dot"></div>
    <div>
      <div class="history-q">${escapeHtml(shortQuestion)}</div>
      <div class="history-time">Just now</div>
    </div>
  `;
  
  historyList.insertBefore(item, historyList.firstChild);
  
  while (historyList.children.length > 20) {
    historyList.removeChild(historyList.lastChild);
  }
}

/* ── Helper: Escape HTML ── */
function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

/* ── Add particle animation CSS ── */
(function addParticleAnimation() {
  if (!document.querySelector('#particleAnimationStyle')) {
    const style = document.createElement('style');
    style.id = 'particleAnimationStyle';
    style.textContent = `
      @keyframes particleExplosion {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(var(--x, 30px), var(--y, -30px)) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();