![Gumnuts](koala_capturess.png)

-- by Left Foot Brake --
💛 Support Gumnuts on PayPal - Eucalyptus leaves are expensive and koalas don't even water, only energy drinks.

🐨 Gumnuts — AI Memory for Everyone

the best ai tool, ever. It's like a having an omnipotent, fat koala watching over you as you walk through the bush. 

Gumnuts is a browser extension for Microsoft Edge and Chrome that gives your AI a persistent memory across sessions. Never lose context again. Don't pay for that premium upgrade, just use a koala. Too many images in the chat? Start a new one and pick up right where you left off, between chats, tabs, windows, a.i's even different computers and devices with dev. mode switched on!

The Problem
Every time you start a new chat with Claude, ChatGPT, Gemini, or any other AI — it has no idea who you are, what you've been working on, or what you decided last session. You spend the first 10 minutes re-explaining everything. Every. Single. Time. It can't remember who you are, what your favourite type of gumtree is, nuthin'!

Gumnuts fixes that! He sits in a tree at the side of your browser, waiting for your commands. He can talk to multiple A.I's across all your open tabs at once, summarise a conversation and most importantly, generates prompts for the A.I to capture details of your chat. He then remembers this and when asked, tells any new A.I's who they're dealing with, all your details, project info, everythin'! 

What It Does
① Load My Memory — one click pulls your saved context from your private GitHub repo and injects it directly into your current AI chat. Your AI picks up exactly where you left off.
② Ask AI to Summarise — at the end of a session, generate a structured summary prompt and send it to your AI. It mines the full conversation and gives you a clean summary. 
③ Save to Cloud — paste the summary back into Gumnuts and hit Save. It appends to your private memory file on GitHub. Done in 30 seconds.

Features

🧠 Load Memory — pulls your context file from GitHub and injects it into any AI chat automatically
⚡ Generate Prompt — creates a structured end-of-session summary prompt optimised for each AI
📡 Send to ALL AI Tabs — broadcasts your prompt to every open AI tab simultaneously (Claude + ChatGPT + Gemini at once)
💾 Save to Cloud — appends session summaries to your private GitHub context file via the GitHub API
🌙 Dark mode — pastel pink light mode, deep dark mode, remembers your preference
🐨 Floating sidebar — draggable, resizable, minimises to a pill, always visible on AI pages
✅ Works on Claude, ChatGPT, Gemini, Grok, Copilot, Mistral, Perplexity


How to Install (Developer Mode)
Gumnuts is not yet on the Edge or Chrome Web Store. Install it manually:

Download the latest release zip from the Releases page
Extract the zip to a folder on your machine
Open Edge and go to edge://extensions
Turn on Developer mode (bottom left)
Click Load unpacked
Select the extracted gumnuts folder
Gumnuts will appear in your toolbar

For Chrome: same steps but go to chrome://extensions

Setup

Create a private GitHub repository — name it anything (e.g. my-ai-memory)
Generate a GitHub Personal Access Token with repo scope:

Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
Click Generate new token → select repo → generate → copy it


Click the Gumnuts icon in your toolbar → the Welcome page will open
Enter your GitHub username, repo name, and token → click Save Settings

That's it. Gumnuts will now load and save your memory file (CLAUDE_CONTEXT.md) to your private repo.

How to Use
Starting a new chat

Open Claude, ChatGPT, Gemini (or any supported AI)
The Gumnuts sidebar appears automatically on the right
Click 🧠 Load My Memory
Your context is injected into the chat — the AI knows who you are and what you're working on

End of session

Click ⚡ Ask AI to Summarise
Copy the generated prompt and paste it into your AI chat
The AI will produce a structured summary of everything you worked on
Paste that summary into the Paste summary here box
Click 💾 Save to Cloud
Done — your memory is updated for next time

Broadcast to all AIs

Generate your prompt
Click 📡 Send to ALL AI Tabs
The prompt is injected into every open AI tab simultaneously


The Memory File
Gumnuts stores your memory as a plain markdown file (CLAUDE_CONTEXT.md) in your private GitHub repo. Each session appends a new ## SESSION UPDATE block with the date, AI used, and full summary.
You own your data. It lives in your private repo. Gumnuts never sees it — it goes directly from your browser to GitHub's API using your own token.
You can edit the file manually, read it any time, and paste it into any AI tool even without the extension.

Supported AI Platforms
PlatformLoad MemoryInject PromptSave SummaryClaude (claude.ai)✅✅✅ChatGPT (chatgpt.com)✅✅✅Google Gemini✅✅✅Grok (grok.com)✅✅✅Microsoft Copilot✅✅✅Mistral / Le Chat✅✅✅Perplexity✅✅✅

Privacy & Security

Your GitHub token is stored locally in your browser's extension storage — it never leaves your machine except to talk to GitHub's API directly
Your memory file lives in your private GitHub repo — Gumnuts has no server, no database, no analytics
No data is collected. No accounts. No subscriptions required.
The extension only accesses the AI platforms listed above and api.github.com


Donationware
Gumnuts is free. It will always be free.
If it saves you time and frustration, consider buying the koala a coffee:
💛 Support Gumnuts on PayPal
Every donation keeps the koala fed and the project alive.

Roadmap

 Floating sidebar on all AI pages
 Load memory from GitHub → inject into chat
 Save session summaries to GitHub
 Broadcast prompt to all open AI tabs
 Dark mode
 Draggable + resizable sidebar
 Custom prompt library (Sprint 1)
 Hotkeys for all actions (Sprint 1)
 Daily Gumnuts adventure animations (in progress)
 Edge Add-ons Store listing
 Chrome Web Store listing
 Web app / SaaS version


License
MIT — do whatever you want with it. Just don't be a dick.

🐨 Gumnuts is watching.

