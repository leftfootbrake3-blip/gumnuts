// Gumnuts v9.0 — Content script: inject prompts into AI chat inputs
// Updated selectors for 2026 DOM structures across all major AI platforms

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type === 'INJECT_PROMPT') {
    var result = injectText(msg.text);
    sendResponse({ ok: result });
    return true;
  }

  if (msg.type === 'CAPTURE_RESPONSE') {
    var text = captureLatestResponse();
    sendResponse({ ok: !!text, text: text || '' });
    return true;
  }
});

// ── INJECT TEXT INTO CHAT INPUT ──────────────────────────────────────────────

function injectText(text) {
  // Strategy 1: Site-specific selectors (fast, precise)
  var el = findInputSpecific();

  // Strategy 2: Universal fallback — largest contenteditable on page
  if (!el) el = findLargestEditable();

  // Strategy 3: Any textarea on the page
  if (!el) el = findTextarea();

  if (!el) return false;

  el.focus();

  // Contenteditable elements (Claude, ChatGPT 2024+, Gemini)
  if (el.contentEditable === 'true' || el.isContentEditable) {
    // Clear existing content first
    el.innerHTML = '';
    // Use execCommand for proper framework event triggering
    document.execCommand('insertText', false, text);
    // Also dispatch input event for React/Angular frameworks
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  // Textarea elements (older UIs, Perplexity, some Copilot views)
  if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    // Use native setter to bypass React's synthetic event system
    var setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value'
    );
    if (setter && setter.set) {
      setter.set.call(el, text);
    } else {
      el.value = text;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    // Some frameworks also need keydown/keyup
    el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    return true;
  }

  return false;
}

// Site-specific selectors — ordered by specificity
function findInputSpecific() {
  var selectors = [
    // ChatGPT — #prompt-textarea (contenteditable div since late 2024)
    '#prompt-textarea',
    // Claude — ProseMirror contenteditable with fieldset or data-testid
    '[contenteditable="true"].ProseMirror',
    'fieldset [contenteditable="true"]',
    '[data-testid] [contenteditable="true"]',
    // Gemini — rich text input
    'rich-textarea [contenteditable="true"]',
    '.ql-editor[contenteditable="true"]',
    // Grok
    'textarea[placeholder*="Ask"]',
    'textarea[placeholder*="ask"]',
    // Perplexity
    'textarea[placeholder*="Ask"]',
    'textarea.grow',
    // Copilot
    '#searchbox textarea',
    'textarea[id*="cib"]',
    '#userInput',
    // Mistral / Le Chat
    'textarea[placeholder*="Ask"]',
    // DeepSeek
    '#chat-input',
    'textarea[placeholder*="Send"]',
    // UseAI and others
    'textarea[placeholder*="Type"]',
    'textarea[placeholder*="Message"]',
  ];

  for (var i = 0; i < selectors.length; i++) {
    try {
      var el = document.querySelector(selectors[i]);
      if (el && isVisible(el)) return el;
    } catch(e) {}
  }
  return null;
}

// Universal fallback: find largest contenteditable element
function findLargestEditable() {
  var all = document.querySelectorAll('[contenteditable="true"]');
  var best = null;
  var bestArea = 0;
  for (var i = 0; i < all.length; i++) {
    var el = all[i];
    if (!isVisible(el)) continue;
    var rect = el.getBoundingClientRect();
    var area = rect.width * rect.height;
    if (area > bestArea) {
      bestArea = area;
      best = el;
    }
  }
  return best;
}

// Last resort: any visible textarea
function findTextarea() {
  var all = document.querySelectorAll('textarea');
  for (var i = 0; i < all.length; i++) {
    if (isVisible(all[i])) return all[i];
  }
  return null;
}

function isVisible(el) {
  if (!el) return false;
  var rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  var style = window.getComputedStyle(el);
  return style.display !== 'none' &&
         style.visibility !== 'hidden' &&
         style.opacity !== '0';
}

// ── CAPTURE LATEST AI RESPONSE ───────────────────────────────────────────────
// Extracts the most recent assistant message from the page

function captureLatestResponse() {
  var selectors = [
    // ChatGPT — assistant messages
    '[data-message-author-role="assistant"]',
    // Claude — assistant turn blocks
    '.font-claude-message',
    '[data-testid="chat-message-content"]',
    '.agent-turn .markdown',
    // Gemini — model responses
    'model-response .markdown',
    'message-content.model-response-text',
    '.response-container .markdown',
    // Grok — response blocks
    '.message-bubble.response',
    '[class*="assistant"] [class*="markdown"]',
    // Perplexity — answer blocks
    '.prose',
    '[class*="answer"]',
    // Copilot
    '[data-content="ai-message"]',
    'cib-message-group[source="bot"]',
    // Generic fallback — any element with markdown class
    '.markdown-body',
    '.markdown',
  ];

  var messages = [];
  for (var i = 0; i < selectors.length; i++) {
    try {
      var found = document.querySelectorAll(selectors[i]);
      if (found.length > 0) {
        messages = found;
        break;
      }
    } catch(e) {}
  }

  if (messages.length === 0) return null;

  // Return the LAST (most recent) message's text
  var last = messages[messages.length - 1];
  return (last.innerText || last.textContent || '').trim();
}
