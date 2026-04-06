// Gumnuts v9.0 - background service worker

chrome.action.onClicked.addListener(function(tab) {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  // PUSH: APPEND new session block to existing file
  if (msg.type === 'PUSH_GITHUB') {
    chrome.storage.local.get(['githubToken', 'githubRepo'], function(cfg) {
      var token = cfg.githubToken;
      var repo  = cfg.githubRepo;
      if (!token || !repo) {
        sendResponse({ ok: false, error: 'not configured - open Settings and add GitHub token and repo' });
        return;
      }

      var apiBase = 'https://api.github.com/repos/' + repo + '/contents/CLAUDE_CONTEXT.md';
      var headers = {
        Authorization: 'token ' + token,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      // Step 1: GET existing file (need content + sha)
      fetch(apiBase, { headers: headers })
        .then(function(r) { return r.json(); })
        .then(function(j) {
          var existingContent = '';
          var sha = null;

          if (j && j.sha) {
            sha = j.sha;
            if (j.content) {
              try {
                var b64 = j.content.replace(/[\n\r\t ]/g, '');
                existingContent = decodeURIComponent(escape(atob(b64)));
              } catch(e) {
                existingContent = '';
              }
            }
          }

          // Step 2: APPEND new block to existing content
          var newContent = existingContent + msg.content;
          var encoded = btoa(unescape(encodeURIComponent(newContent)));

          var body = {
            message: 'memory saved ' + new Date().toISOString().slice(0,16).replace('T',' ') + ' [Gumnuts]',
            content: encoded
          };
          if (sha) body.sha = sha;

          // Step 3: PUT the full appended content back
          return fetch(apiBase, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
          });
        })
        .then(function(r) {
          if (r && r.ok) {
            sendResponse({ ok: true });
          } else {
            return r.json().then(function(e) {
              sendResponse({ ok: false, error: e.message || 'save failed' });
            });
          }
        })
        .catch(function(e) {
          sendResponse({ ok: false, error: e.message });
        });
    });
    return true;
  }

  // FETCH: Load full context file from GitHub
  if (msg.type === 'FETCH_GITHUB') {
    chrome.storage.local.get(['githubToken', 'githubRepo'], function(cfg) {
      var token = cfg.githubToken;
      var repo  = cfg.githubRepo;
      if (!token || !repo) {
        sendResponse({ ok: false, error: 'not configured - open Settings and add GitHub token and repo' });
        return;
      }

      var apiBase = 'https://api.github.com/repos/' + repo + '/contents/CLAUDE_CONTEXT.md';
      var headers = {
        Authorization: 'token ' + token,
        Accept: 'application/vnd.github.v3+json'
      };

      fetch(apiBase, { headers: headers })
        .then(function(r) { return r.json(); })
        .then(function(j) {
          if (!j || !j.sha) {
            sendResponse({ ok: false, error: j && j.message ? j.message : 'file not found' });
            return null;
          }
          // Use blob API for large files (>1MB)
          return fetch('https://api.github.com/repos/' + repo + '/git/blobs/' + j.sha, {
            headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github.v3+json' }
          });
        })
        .then(function(r) { return r ? r.json() : null; })
        .then(function(blob) {
          if (!blob || !blob.content) {
            sendResponse({ ok: false, error: 'empty file' });
            return;
          }
          var b64 = blob.content.replace(/[\n\r\t ]/g, '');
          try {
            var text = decodeURIComponent(escape(atob(b64)));
            sendResponse({ ok: true, text: text });
          } catch(e) {
            sendResponse({ ok: false, error: 'decode error: ' + e.message });
          }
        })
        .catch(function(e) {
          sendResponse({ ok: false, error: e.message });
        });
    });
    return true;
  }

  // CAPTURE: Get the latest AI response from the active tab
  if (msg.type === 'CAPTURE_FROM_TAB') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      if (!tab) { sendResponse({ ok: false, error: 'no active tab' }); return; }
      chrome.tabs.sendMessage(tab.id, { type: 'CAPTURE_RESPONSE' }, function(resp) {
        if (chrome.runtime.lastError) {
          sendResponse({ ok: false, error: 'could not read tab - refresh the AI page and try again' });
        } else {
          sendResponse(resp || { ok: false, error: 'no response captured' });
        }
      });
    });
    return true;
  }

});
