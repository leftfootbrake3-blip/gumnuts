// Gumnuts v9.0 — Sidepanel controller
// Refactored for clarity, performance, and maintainability
'use strict';

// ── AUDIO ────────────────────────────────────────────────────────────────────

var AudioCtx = window.AudioContext || window.webkitAudioContext;

function beep(freq, freqEnd, dur, vol, type) {
  try {
    var ctx = new AudioCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    if (freqEnd) osc.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime + dur);
    gain.gain.value = vol || 0.15;
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.05);
    setTimeout(function() { try { ctx.close(); } catch(e) {} }, 500);
  } catch(e) {}
}

function sClick() { beep(600, 800, 0.06, 0.12); }
function sOk()    { beep(523, 0, 0.1, 0.12); setTimeout(function() { beep(659, 0, 0.1, 0.12); }, 90); setTimeout(function() { beep(784, 0, 0.15, 0.12); }, 180); }
function sErr()   { beep(220, 110, 0.2, 0.2, 'triangle'); }

// ── DOM HELPERS ──────────────────────────────────────────────────────────────

function $(id)       { return document.getElementById(id); }
function setStatus(id, msg, type) {
  var el = $(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'status' + (type ? ' ' + type : '');
}

// Known AI hostnames for injection and broadcast
var AI_HOSTS = [
  'claude.ai', 'chat.openai.com', 'chatgpt.com', 'gemini.google.com',
  'grok.com', 'x.com', 'mistral.ai', 'chat.mistral.ai', 'perplexity.ai',
  'copilot.microsoft.com', 'deepseek.com', 'useai.com'
];

function isAITab(url) {
  try {
    var host = new URL(url).hostname;
    return AI_HOSTS.some(function(h) { return host.includes(h); });
  } catch(e) { return false; }
}

// ── NAVIGATION ───────────────────────────────────────────────────────────────

document.addEventListener('click', function(e) {
  var actEl = e.target.closest('[data-act]');
  if (actEl) { sClick(); dispatch(actEl.getAttribute('data-act'), actEl); return; }
  var aiBtn = e.target.closest('.abtn');
  if (aiBtn) { sClick(); pickAI(aiBtn); }
  var logBtn = e.target.closest('.log-item');
  if (logBtn) { sClick(); viewLog(logBtn.getAttribute('data-path')); }
});

function dispatch(action, el) {
  var actions = {
    back: back, showLoad: function() { show('load'); },
    showSave: function() { show('save'); }, showSummarise: function() { show('summarise'); },
    showMiner: function() { show('miner'); }, showBroadcast: function() { show('broadcast'); },
    showSettings: function() { show('settings'); loadSettings(); },
    showLogs: function() { show('logs'); doListLogs(); },
    showProfile: function() { show('profile'); doLoadProfile(); },
    doLoad: doLoad, doSave: doSave, doCapture: doCapture,
    doAutoSave: doAutoSave, doSummarise: doSummarise, doMine: doMine,
    sendToSave: sendToSave, doBroadcast: doBroadcast,
    doSaveSettings: doSaveSettings, doSaveGitHub: doSaveGitHub,
    doListLogs: doListLogs, doLoadProfile: doLoadProfile,
    doSaveProfile: doSaveProfile, copyLogContent: function() { copyEl('logContent', el); },
    copySumOut: function() { copyEl('sumOut', el); }
  };
  if (actions[action]) actions[action]();
}

function show(id) {
  $('main').style.display = 'none';
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('on'); });
  $('p-' + id).classList.add('on');
}

function back() {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('on'); });
  $('main').style.display = 'block';
}

function pickAI(btn) {
  var group = btn.getAttribute('data-group');
  document.querySelectorAll('[data-group="' + group + '"]').forEach(function(b) { b.classList.remove('on'); });
  btn.classList.add('on');
}

function getAI(group) {
  var sel = document.querySelector('[data-group="' + group + '"].on');
  return sel ? sel.textContent.trim() : 'Generic';
}

// ── STORY (kept from v8) ─────────────────────────────────────────────────────

chrome.storage.local.get(['storyDay'], function(d) {
  var sc = d.storyScene || 0;
  var day = Math.floor(sc / 2) + 1;
  var dayBtn = $('day-btn');
  var storyDay = $('story-day');
  if (dayBtn) dayBtn.textContent = 'day ' + day;
  if (storyDay) storyDay.textContent = 'day ' + day + ' of 28';
});

var dayBtn = $('day-btn');
if (dayBtn) dayBtn.addEventListener('click', function() {
  chrome.tabs.create({ url: chrome.runtime.getURL('story.html') + '?day=1' });
});
var storyBar = $('story-bar');
if (storyBar) storyBar.addEventListener('click', function() {
  chrome.tabs.create({ url: chrome.runtime.getURL('story.html') + '?day=1' });
});

// ── LOAD CONTEXT ─────────────────────────────────────────────────────────────

function doLoad() {
  setStatus('loadStatus', 'fetching profile + context...');
  chrome.runtime.sendMessage({ type: 'FETCH_GITHUB' }, function(res) {
    if (!res || !res.ok) {
      setStatus('loadStatus', res && res.error || 'failed', 'err'); sErr(); return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      if (!tab || !isAITab(tab.url)) { fallbackCopy(res.text, 'loadStatus'); return; }
      chrome.tabs.sendMessage(tab.id, { type: 'INJECT_PROMPT', text: res.text }, function(resp) {
        if (chrome.runtime.lastError || !resp || !resp.ok) {
          fallbackCopy(res.text, 'loadStatus');
        } else {
          setStatus('loadStatus', 'context loaded - hit send!', 'ok'); sOk();
        }
      });
    });
  });
}

function fallbackCopy(text, statusId) {
  navigator.clipboard.writeText(text).then(function() {
    setStatus(statusId, 'copied to clipboard - paste into your AI chat', 'ok'); sOk();
  }).catch(function() {
    setStatus(statusId, 'copy failed', 'err'); sErr();
  });
}

// ── SAVE SESSION ─────────────────────────────────────────────────────────────

function doSave() {
  var notes = $('saveNotes').value.trim();
  if (!notes) { setStatus('saveStatus', 'paste your notes first', 'err'); sErr(); return; }
  var ai = getAI('saveAI');
  var content = '\n\n## SESSION UPDATE - ' + new Date().toLocaleString('en-AU') + ' [' + ai + ']\n\n' + notes;
  setStatus('saveStatus', 'saving...');
  chrome.runtime.sendMessage({ type: 'PUSH_GITHUB', content: content }, function(res) {
    if (res && res.ok) {
      setStatus('saveStatus', 'saved to GitHub (profile auto-updated)', 'ok'); sOk();
      $('saveNotes').value = '';
    } else {
      setStatus('saveStatus', res && res.error || 'failed', 'err'); sErr();
    }
  });
}

// ── CAPTURE AI RESPONSE ──────────────────────────────────────────────────────

function doCapture() {
  setStatus('captureStatus', 'reading chat...');
  chrome.runtime.sendMessage({ type: 'CAPTURE_FROM_TAB' }, function(res) {
    if (!res || !res.ok || !res.text) {
      setStatus('captureStatus', res && res.error || 'could not read chat', 'err'); sErr(); return;
    }
    $('saveNotes').value = res.text;
    setStatus('captureStatus', 'grabbed latest response - review and save', 'ok'); sOk();
  });
}

function doAutoSave() {
  setStatus('autoStatus', 'step 1: reading chat...');
  chrome.runtime.sendMessage({ type: 'CAPTURE_FROM_TAB' }, function(res) {
    if (!res || !res.ok || !res.text) {
      setStatus('autoStatus', res && res.error || 'could not read chat', 'err'); sErr(); return;
    }
    var ai = getAI('autoAI');
    var summary = '### Auto-captured from ' + ai + '\n\n' + res.text;
    // Trim to last 4000 chars if too large
    if (summary.length > 4000) summary = '...(trimmed)\n' + summary.slice(-4000);

    setStatus('autoStatus', 'step 2: saving to GitHub...');
    var content = '\n\n## SESSION UPDATE - ' + new Date().toLocaleString('en-AU') + ' [' + ai + '] (auto-captured)\n\n' + summary;
    chrome.runtime.sendMessage({ type: 'PUSH_GITHUB', content: content }, function(saveRes) {
      if (saveRes && saveRes.ok) {
        setStatus('autoStatus', 'captured and saved!', 'ok'); sOk();
      } else {
        setStatus('autoStatus', saveRes && saveRes.error || 'save failed', 'err'); sErr();
      }
    });
  });
}

// 🔧 SUMMARISE ────────────────────────────────────────────────────────────────

function doSummarise() {
  var notes = $('sumNotes').value.trim();
  if (!notes) { setStatus('sumStatus', 'paste content to summarise first', 'err'); sErr(); return; }
  var ai = getAI('sumAI');
  var prompts = {
    ChatGPT:  'Summarise the following session notes. Extract: key decisions, action items, technical details, names, companies, and project references.\n\n',
    Claude:   'Please provide a structured summary of these session notes. Include: decisions made, action items, technical specifics, people/companies mentioned, and project context.\n\n',
    Gemini:   'Create a concise structured summary of the following. Highlight: decisions, tasks, technical details, names, and project info.\n\n',
    Generic:  'Summarise the following session notes into structured sections: Decisions, Action Items, Technical Details, People & Projects.\n\n'
  };
  var prompt = (prompts[ai] || prompts.Generic) + notes;
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tab = tabs[0];
    if (!tab || !isAITab(tab.url)) {
      navigator.clipboard.writeText(prompt).then(function() {
        setStatus('sumStatus', 'prompt copied - paste into AI chat', 'ok'); sOk();
      });
      return;
    }
    chrome.tabs.sendMessage(tab.id, { type: 'INJECT_PROMPT', text: prompt }, function(resp) {
      if (chrome.runtime.lastError || !resp || !resp.ok) {
        navigator.clipboard.writeText(prompt).then(function() {
          setStatus('sumStatus', 'injected failed - copied to clipboard instead', 'ok'); sOk();
        });
      } else {
        setStatus('sumStatus', 'prompt injected - hit send!', 'ok'); sOk();
      }
    });
  });
}

// ⛏ DATA MINER ───────────────────────────────────────────────────────────────

function doMine() {
  var text = $('mineInput').value.trim();
  if (!text) { setStatus('mineStatus', 'paste content to mine first', 'err'); sErr(); return; }
  var results = [];
  // URLs
  var urls = text.match(/https?:\/\/[^\s<>"')\]]+/g);
  if (urls && urls.length) results.push('### URLs\n' + urls.map(function(u) { return '- ' + u; }).join('\n'));
  // File paths (Windows and Unix)
  var paths = text.match(/(?:[A-Z]:\\|\/)[^\s:*?"<>|]+/gi);
  if (paths && paths.length) results.push('### File Paths\n' + paths.map(function(p) { return '- `' + p + '`'; }).join('\n'));
  // Dollar amounts
  var dollars = text.match(/\$[\d,]+\.?\d*/g);
  if (dollars && dollars.length) results.push('### Dollar Amounts\n' + dollars.map(function(d) { return '- ' + d; }).join('\n'));
  // Email addresses
  var emails = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g);
  if (emails && emails.length) results.push('### Emails\n' + emails.map(function(e) { return '- ' + e; }).join('\n'));
  // Action items (lines starting with TODO, ACTION, TASK, or containing checkboxes)
  var actions = text.match(/(?:^|\n)\s*(?:[-*]\s*\[.\]|TODO|ACTION|TASK)[^\n]*/gi);
  if (actions && actions.length) results.push('### Action Items\n' + actions.map(function(a) { return '- ' + a.trim(); }).join('\n'));

  if (!results.length) {
    setStatus('mineStatus', 'no structured data found', 'err'); sErr(); return;
  }
  $('mineOutput').value = results.join('\n\n');
  setStatus('mineStatus', 'extracted ' + results.length + ' categories', 'ok'); sOk();
}

function sendToSave() {
  var mined = $('mineOutput').value.trim();
  if (!mined) { sErr(); return; }
  $('saveNotes').value = mined;
  show('save');
  setStatus('saveStatus', 'mined data loaded - review and save', 'ok');
}

// 📡 BROADCAST ────────────────────────────────────────────────────────────────

function doBroadcast() {
  var text = $('broadcastText').value.trim();
  if (!text) { setStatus('broadStatus', 'type a prompt first', 'err'); sErr(); return; }
  setStatus('broadStatus', 'broadcasting...');
  chrome.tabs.query({}, function(tabs) {
    var aiTabs = tabs.filter(function(t) { return isAITab(t.url); });
    if (!aiTabs.length) {
      setStatus('broadStatus', 'no AI tabs open', 'err'); sErr(); return;
    }
    var sent = 0; var fail = 0;
    aiTabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, { type: 'INJECT_PROMPT', text: text }, function(resp) {
        if (chrome.runtime.lastError || !resp || !resp.ok) fail++;
        else sent++;
        if (sent + fail === aiTabs.length) {
          setStatus('broadStatus', 'sent to ' + sent + ' tab(s)' + (fail ? ', ' + fail + ' failed' : ''), sent ? 'ok' : 'err');
          sent ? sOk() : sErr();
        }
      });
    });
  });
}

// 📋 MEMORY LOGS ─────────────────────────────────────────────────────────────

function doListLogs() {
  setStatus('logsStatus', 'fetching log list...');
  chrome.runtime.sendMessage({ type: 'LIST_LOGS' }, function(res) {
    if (!res || !res.ok) {
      setStatus('logsStatus', res && res.error || 'failed to list logs', 'err'); sErr(); return;
    }
    var list = $('logList');
    list.innerHTML = '';
    if (!res.files || !res.files.length) {
      list.innerHTML = '<div style="padding:8px;opacity:0.6">No memory files found. Save a session first.</div>';
      setStatus('logsStatus', 'no files found', 'err'); return;
    }
    res.files.forEach(function(f) {
      var item = document.createElement('div');
      item.className = 'log-item';
      item.setAttribute('data-path', f.path);
      var icon = f.path.includes('PROFILE') ? '👤' : f.path.includes('archive') ? '📦' : '📄';
      var sizeKB = f.size ? (f.size / 1024).toFixed(1) + ' KB' : '';
      item.innerHTML = '<span>' + icon + ' ' + f.name + '</span><span style="opacity:0.5;font-size:0.85em">' + sizeKB + '</span>';
      list.appendChild(item);
    });
    setStatus('logsStatus', res.files.length + ' file(s)', 'ok'); sOk();
  });
}

function viewLog(path) {
  setStatus('logsStatus', 'loading...');
  $('logContent').textContent = '';
  $('logViewer').style.display = 'block';
  chrome.runtime.sendMessage({ type: 'FETCH_LOG', path: path }, function(res) {
    if (!res || !res.ok) {
      $('logContent').textContent = 'Error: ' + (res && res.error || 'failed');
      setStatus('logsStatus', 'load failed', 'err'); sErr(); return;
    }
    $('logContent').textContent = res.text;
    setStatus('logsStatus', 'loaded: ' + path, 'ok');
  });
}

// 👤 PROFILE ──────────────────────────────────────────────────────────────────

function doLoadProfile() {
  setStatus('profileStatus', 'loading profile...');
  chrome.runtime.sendMessage({ type: 'FETCH_LOG', path: 'PROFILE.md' }, function(res) {
    if (!res || !res.ok) {
      $('profileEditor').value = '# My Profile\n\n**Name:** \n**Company:** \n**Projects:** \n\nEdit this to set your persistent identity across AI chats.';
      setStatus('profileStatus', 'no profile yet - fill in and save', 'ok'); return;
    }
    $('profileEditor').value = res.text;
    setStatus('profileStatus', 'profile loaded', 'ok'); sOk();
  });
}

function doSaveProfile() {
  var text = $('profileEditor').value.trim();
  if (!text) { setStatus('profileStatus', 'profile is empty', 'err'); sErr(); return; }
  setStatus('profileStatus', 'saving profile...');
  chrome.runtime.sendMessage({ type: 'SAVE_PROFILE', content: text }, function(res) {
    if (res && res.ok) {
      setStatus('profileStatus', 'profile saved!', 'ok'); sOk();
    } else {
      setStatus('profileStatus', res && res.error || 'save failed', 'err'); sErr();
    }
  });
}

// ⚙ SETTINGS ─────────────────────────────────────────────────────────────────

function loadSettings() {
  chrome.storage.local.get(['ghUser', 'ghRepo', 'ghToken'], function(d) {
    $('ghUser').value  = d.ghUser  || '';
    $('ghRepo').value  = d.ghRepo  || '';
    $('ghToken').value = d.ghToken || '';
    setStatus('settingsStatus', 'settings loaded', 'ok');
  });
}

function doSaveSettings() {
  var user  = $('ghUser').value.trim();
  var repo  = $('ghRepo').value.trim();
  var token = $('ghToken').value.trim();
  if (!user || !repo || !token) {
    setStatus('settingsStatus', 'all fields required', 'err'); sErr(); return;
  }
  chrome.storage.local.set({ ghUser: user, ghRepo: repo, ghToken: token }, function() {
    setStatus('settingsStatus', 'settings saved!', 'ok'); sOk();
  });
}

function doSaveGitHub() {
  doSaveSettings();
}

// 📎 UTILITIES ────────────────────────────────────────────────────────────────

function copyEl(id, btnEl) {
  var el = $(id);
  if (!el) return;
  var text = el.value || el.textContent || '';
  navigator.clipboard.writeText(text).then(function() {
    if (btnEl) {
      var orig = btnEl.textContent;
      btnEl.textContent = 'copied!';
      setTimeout(function() { btnEl.textContent = orig; }, 1200);
    }
    sOk();
  }).catch(function() { sErr(); });
}

// 🚀 INIT ─────────────────────────────────────────────────────────────────────

(function init() {
  chrome.storage.local.get(['ghUser', 'ghRepo', 'ghToken'], function(d) {
    if (!d.ghUser || !d.ghRepo || !d.ghToken) {
      setStatus('mainStatus', 'set up GitHub in settings first', 'err');
    } else {
      setStatus('mainStatus', 'v9.0 ready — ' + d.ghUser + '/' + d.ghRepo, 'ok');
    }
  });
})();
