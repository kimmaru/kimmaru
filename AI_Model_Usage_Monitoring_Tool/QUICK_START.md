# ⚡ Quick Start - Simple AI Usage Monitor

Get started in 60 seconds! 🚀

## 1️⃣ Install

```bash
cd AI_Model_Usage_Monitoring_Tool
npm install
npm run build
npm link
```

## 2️⃣ Check Your AI Usage

```bash
ai-usage
```

Or in development mode:
```bash
npm run dev
```

You'll see:
```
🤖 AI Usage Monitor

Checking AI service usage...

📊 CODEX
████████████████████████░░░░░░  80/100 requests (80%)

🤖 CLAUDE
███████████████████████████░░░  45/50 messages (90%)

✨ GEMINI
█████████░░░░░░░░░░░░░░░░░░░░░  30/100 queries (30%)
```

---

## 🔧 Prerequisites (Optional)

For the tool to display usage data, you need the respective AI CLI tools installed:

```bash
# Install OpenAI CLI
pip install openai
openai auth login

# Install Claude Code CLI
# Follow Anthropic's installation guide

# Install Gemini CLI
# Follow Google's installation guide
```

The tool will automatically detect which CLI tools you have installed and show their usage.

---

## 📖 Full Documentation

See [README.md](README.md) for complete documentation.

---

**That's it! You're ready to monitor your AI usage! 🎉**

