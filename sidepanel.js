// Gumnuts v9.0 — Sidepanel JS

// SOUNDS
function beep(f1,f2,dur,vol,type){try{var c=new(window.AudioContext||window.webkitAudioContext)();var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=type||'sine';o.frequency.value=f1;if(f2)o.frequency.linearRampToValueAtTime(f2,c.currentTime+dur);g.gain.value=vol||0.15;g.gain.linearRampToValueAtTime(0.001,c.currentTime+dur);o.start();o.stop(c.currentTime+dur+0.05);setTimeout(function(){try{c.close();}catch(e){}},500);}catch(e){}}
function sClick(){beep(600,800,0.06,0.12);}
function sOk(){beep(523,0,0.1,0.12);setTimeout(function(){beep(659,0,0.1,0.12);},90);setTimeout(function(){beep(784,0,0.15,0.12);},180);}
function sErr(){beep(220,110,0.2,0.2,'triangle');}

// DISPATCH
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-act]');
  if (el) { sClick(); go(el.getAttribute('data-act'), el); return; }
  var ab = e.target.closest('.abtn');
  if (ab) { sClick(); pickAI(ab); }
});

function go(a, el) {
  if (a==='back')            return back();
  if (a==='showLoad')        return show('load');
  if (a==='showSave')        return show('save');
  if (a==='showSummarise')   return show('summarise');
  if (a==='showMiner')       return show('miner');
  if (a==='showBroadcast')   return show('broadcast');
  if (a==='showSettings')    return show('settings');
  if (a==='doLoad')          return doLoad();
  if (a==='doSave')          return doSave();
  if (a==='doSummarise')     return doSummarise();
  if (a==='copySumOut')      return copyEl('sumOut', el);
  if (a==='doMine')          return doMine();
  if (a==='sendToSave')      return sendToSave();
  if (a==='doBroadcast')     return doBroadcast();
  if (a==='doSaveSettings')  return doSaveSettings();
  if (a==='doSaveGitHub')    return doSaveGitHub();
  if (a==='doCapture')       return doCapture();
  if (a==='doAutoSave')      return doAutoSave();
}

// NAV
function show(id) {
  document.getElementById('main').style.display = 'none';
  document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on');});
  document.getElementById('p-'+id).classList.add('on');
  if (id==='settings') loadSettings();
}
function back() {
  document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on');});
  document.getElementById('main').style.display = 'block';
}

// AI PICKER
function pickAI(btn) {
  var g = btn.getAttribute('data-group');
  document.querySelectorAll('[data-group="'+g+'"]').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
}
function getAI(g) {
  var s = document.querySelector('[data-group="'+g+'"].on');
  return s ? s.textContent.trim() : 'Generic';
}

// STORY
var STORIES = ["gumnuts wakes up","gumnuts meets kelly","the memory tree","a shadow in the creek","gumnuts brings a leaf","craig appears","craig makes his move","gumnuts stands firm","kelly has a plan","the first memory stolen","gumnuts panics","kelly finds a clue","gumnuts confesses","to be continued...","chapter 2 unlocked","kelly fights back","gumnuts trains","craig's lair","the heist","gumnuts gets caught","kelly to the rescue","the memory bubbles burst","gumnuts remembers","craig's sad backstory","gumnuts forgives craig","the memory tree blooms","kelly says something","gumnuts & kelly forever"];
chrome.storage.local.get(['storyDay'], function(d) {
  var sc = d.storyScene || 0; var day = Math.floor(sc/2)+1;
  var dayBtn = document.getElementById('day-btn');
  var storyDay = document.getElementById('story-day');
  if (dayBtn) dayBtn.textContent = 'day '+day;
  if (storyDay) storyDay.textContent = 'day '+day+' of 28';
});
var dayBtn = document.getElementById('day-btn');
if (dayBtn) dayBtn.addEventListener('click', function() {
  chrome.tabs.create({url: chrome.runtime.getURL('story.html')+'?day=1'});
});
var storyBar = document.getElementById('story-bar');
if (storyBar) storyBar.addEventListener('click', function() {
  chrome.tabs.create({url: chrome.runtime.getURL('story.html')+'?day=1'});
});

// LOAD
function doLoad() {
  var st = document.getElementById('loadStatus');
  st.textContent = 'fetching from GitHub...'; st.className = 'status';
  chrome.runtime.sendMessage({type:'FETCH_GITHUB'}, function(res) {
    if (!res || !res.ok) {
      st.textContent = 'error: '+(res&&res.error||'failed - check settings'); st.className='status err'; sErr(); return;
    }
    var text = res.text;
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
      var tab = tabs[0];
      if (!tab) { fallbackCopy(text, st); return; }
      var aiHosts = ['claude.ai','chat.openai.com','chatgpt.com','gemini.google.com','grok.com','x.com','mistral.ai','chat.mistral.ai','perplexity.ai','copilot.microsoft.com','deepseek.com','useai.com'];
      var isAI = aiHosts.some(function(h){try{return new URL(tab.url).hostname.includes(h);}catch(e){return false;}});
      if (isAI) {
        chrome.tabs.sendMessage(tab.id, {type:'INJECT_PROMPT', text:text}, function(resp) {
          if (chrome.runtime.lastError || !resp || !resp.ok) {
            fallbackCopy(text, st);
          } else {
            st.textContent = 'context loaded - hit send!'; st.className='status ok'; sOk();
          }
        });
      } else {
        fallbackCopy(text, st);
      }
    });
  });
}

function fallbackCopy(text, st) {
  navigator.clipboard.writeText(text).then(function() {
    st.textContent = 'copied - paste into your AI chat'; st.className='status ok'; sOk();
  }).catch(function() {
    st.textContent = 'copy failed'; st.className='status err'; sErr();
  });
}

// SAVE
function doSave() {
  var notes = document.getElementById('saveNotes').value.trim();
  var st = document.getElementById('saveStatus');
  if (!notes) { st.textContent = 'paste your notes first'; st.className='status err'; sErr(); return; }
  var ai = getAI('saveAI');
  var content = '\n\n## SESSION UPDATE - '+new Date().toLocaleString('en-AU')+' ['+ai+']\n\n'+notes;
  st.textContent = 'saving...'; st.className='status';
  chrome.runtime.sendMessage({type:'PUSH_GITHUB', content:content}, function(res) {
    if (res && res.ok) {
      st.textContent = 'saved to GitHub'; st.className='status ok'; sOk();
      document.getElementById('saveNotes').value = '';
    } else {
      st.textContent = 'error: '+(res&&res.error||'failed - check settings'); st.className='status err'; sErr();
    }
  });
}

// CAPTURE — grab the latest AI response directly from the chat tab
function doCapture() {
  var st = document.getElementById('captureStatus');
  st.textContent = 'reading chat...'; st.className = 'status';
  chrome.runtime.sendMessage({type:'CAPTURE_FROM_TAB'}, function(res) {
    if (!res || !res.ok || !res.text) {
      st.textContent = 'error: '+(res&&res.error||'could not read chat - is an AI tab active?');
      st.className='status err'; sErr(); return;
    }
    document.getElementById('saveNotes').value = res.text;
    st.textContent = 'grabbed latest response - review and save';
    st.className='status ok'; sOk();
  });
}

// AUTO-SAVE — capture + summarise prompt + save in one flow
function doAutoSave() {
  var st = document.getElementById('autoStatus');
  st.textContent = 'step 1/3: reading chat...'; st.className = 'status';

  chrome.runtime.sendMessage({type:'CAPTURE_FROM_TAB'}, function(res) {
    if (!res || !res.ok || !res.text) {
      st.textContent = 'error: '+(res&&res.error||'could not read chat');
      st.className='status err'; sErr(); return;
    }

    // Step 2: Build a summary from the captured text
    var captured = res.text;
    var ai = getAI('autoAI');
    var summary = '### Auto-captured from ' + ai + '\n\n' + captured;

    // Trim to last 4000 chars if huge
    if (summary.length > 4000) {
      summary = summary.slice(-4000);
      summary = '...(trimmed)\n' + summary;
    }

    st.textContent = 'step 2/3: saving to GitHub...'; st.className = 'status';

    var content = '\n\n## SESSION UPDATE - '+new Date().toLocaleString('en-AU')+' ['+ai+'] (auto-captured)\n\n'+summary;
    chrome.runtime.sendMessage({type:'PUSH_GITHUB', content:content}, function(saveRes) {
      if (saveRes && saveRes.ok) {
        st.textContent = 'done - captured and saved!'; st.className='status ok'; sOk();
      } else {
        st.textContent = 'error: '+(saveRes&&saveRes.error||'save failed');
        st.className='status err'; sErr();
      }
    });
  });
}

// SUMMARISE
function doSummarise() {
  var ai = getAI('sumAI');
  var focus = document.getElementById('sumFocus').value.trim();
  var sfx = focus ? '\n\nFocus especially on: '+focus : '';
  var prompts = {
    Claude: 'Please mine this entire conversation and produce a structured session update for my CLAUDE_CONTEXT.md file.\n\nFormat:\n## SESSION UPDATE - [DATE] [TIME] [Claude]\n\n### Projects & Status\n### Technical Details\n### Business & Strategy\n### People\n### Pending Actions\n### Personal Notes\n### Everything Else\n\nBe thorough. Capture file paths, URLs, dollar amounts, decisions, action items.'+sfx,
    ChatGPT: 'Analyse this full conversation and produce a structured session summary. Sections: Projects & Status, Technical Details, Business & Strategy, People, Pending Actions, Personal Notes, Everything Else.'+sfx,
    Gemini: 'Review this conversation and create a detailed session summary covering what was accomplished, tech details, decisions, people, and action items.'+sfx,
    Grok: 'Mine this chat. Projects updated, tech details, business decisions, people, TODOs. Structured markdown, no fluff.'+sfx,
    Generic: 'Summarise this conversation: Projects & Status, Technical Details, Business & Strategy, People, Pending Actions, Personal Notes, Everything Else.'+sfx
  };
  var out = document.getElementById('sumOut');
  out.textContent = prompts[ai]||prompts.Generic;
  out.style.display = 'block';
  document.getElementById('sumCopyBtn').style.display = 'block';
  sOk();
}

// MINER
function doMine() {
  var input = document.getElementById('minerIn').value.trim();
  if (!input) { sErr(); return; }
  var urls=(input.match(/https?:\/\/[^\s)>"]+/g)||[]).slice(0,8).join('\n');
  var paths=(input.match(/[A-Za-z]:\\[^\s"']+|\/[a-z][^\s"']{3,}/g)||[]).slice(0,8).join('\n');
  var dollars=(input.match(/\$[\d,.KMBkm]+[^\s]*/g)||[]).join(', ');
  var actions=(input.match(/\[\s*\]\s*.+/g)||[]).join('\n');
  var out='MINED SESSION\n'+'='.repeat(24)+'\n';
  if(dollars)out+='\nAmounts: '+dollars;
  if(urls)out+='\n\nURLs:\n'+urls;
  if(paths)out+='\n\nPaths:\n'+paths;
  if(actions)out+='\n\nAction items:\n'+actions;
  if(!dollars&&!urls&&!paths&&!actions)out+='\nNothing found.';
  var el=document.getElementById('minerOut');
  el.textContent=out; el.style.display='block';
  document.getElementById('minerSendBtn').style.display='block';
  sOk();
}
function sendToSave() {
  document.getElementById('saveNotes').value=document.getElementById('minerOut').textContent;
  back(); show('save');
}

// BROADCAST
function doBroadcast() {
  var text = document.getElementById('broadcastText').value.trim();
  var st = document.getElementById('broadcastStatus');
  if (!text) { st.textContent='enter a prompt first'; st.className='status err'; sErr(); return; }
  var hosts=['claude.ai','chat.openai.com','chatgpt.com','gemini.google.com','grok.com','x.com','mistral.ai','chat.mistral.ai','perplexity.ai','copilot.microsoft.com','deepseek.com','useai.com'];
  chrome.tabs.query({}, function(tabs) {
    var ai=tabs.filter(function(t){try{return hosts.some(function(h){return new URL(t.url).hostname.includes(h);});}catch(e){return false;}});
    if(!ai.length){st.textContent='no AI tabs open';st.className='status err';sErr();return;}
    ai.forEach(function(t){chrome.tabs.sendMessage(t.id,{type:'INJECT_PROMPT',text:text},function(){});});
    st.textContent='sent to '+ai.length+' tab'+(ai.length>1?'s':'');st.className='status ok';sOk();
  });
}

// SETTINGS
function loadSettings() {
  chrome.storage.local.get(['userName','userProjects','githubToken','githubRepo'],function(d){
    if(d.userName) document.getElementById('sName').value=d.userName;
    if(d.userProjects) document.getElementById('sProjects').value=d.userProjects;
    if(d.githubToken) document.getElementById('sToken').value=d.githubToken;
    if(d.githubRepo) document.getElementById('sRepo').value=d.githubRepo;
  });
}
function doSaveSettings() {
  chrome.storage.local.set({userName:document.getElementById('sName').value.trim(), userProjects:document.getElementById('sProjects').value.trim()},function(){
    var st=document.getElementById('settingsStatus');
    st.textContent='saved'; st.className='status ok'; sOk();
  });
}
function doSaveGitHub() {
  var token=document.getElementById('sToken').value.trim();
  var repo=document.getElementById('sRepo').value.trim();
  var st=document.getElementById('githubStatus');
  if(!token||!repo){st.textContent='enter both token and repo';st.className='status err';sErr();return;}
  chrome.storage.local.set({githubToken:token, githubRepo:repo},function(){
    st.textContent='saved'; st.className='status ok'; sOk();
  });
}

// COPY
function copyEl(id, btn) {
  var text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(function() {
    var orig=btn.textContent; btn.textContent='copied!';
    setTimeout(function(){btn.textContent=orig;},1500);
  });
}
