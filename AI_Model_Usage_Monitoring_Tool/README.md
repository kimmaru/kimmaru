# 🤖 Simple AI Usage Monitor

Simple CLI tool to check your AI service usage across Codex, Claude, and Gemini.

## ✨ Features

- 📊 **Quick usage check** - Instantly see your AI service usage
- 🎨 **Visual progress bars** - Color-coded usage indicators
- ⚡ **Fast & lightweight** - No database or complex dependencies

## 🚀 Installation

### Prerequisites

You need the CLI tools for the AI services you want to monitor:

1. **Claude CLI**: Install from [https://docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code)
2. **Codex CLI**: Install from [https://www.openai.com/codex](https://www.openai.com/codex)
3. **Gemini CLI**: Gemini does not provide usage info via CLI (not supported)

### Install AI Usage Monitor

```bash
# Clone the repository
git clone <repo-url>
cd AI_Model_Usage_Monitoring_Tool

# Install dependencies
npm install

# Build the project
npm run build

# (Optional) Link globally
npm link
```

### Login to CLI tools

Make sure you're logged in to each CLI tool:

```bash
# Claude CLI
claude  # Then follow login prompts

# Codex CLI
codex  # Then follow login prompts
```

## 📖 Usage

### Check Current Status

Simply run:

```bash
ai-usage
```

Or in development mode:

```bash
npm run dev
```

Output example:
```
🤖 AI Usage Monitor

Checking AI service usage...

📊 OPENAI
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  1/10000 requests/min (0%)

🤖 CLAUDE
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  1/50 requests/min (2%)
Resets: 12/31/2024

✨ GEMINI
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0/60 requests/min (0%)
```

The tool shows your **current rate limit usage** per minute for each service, not total monthly usage.

## 🛠️ Development

### Run in development mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Clean build files

```bash
npm run clean
```

## 📁 Project Structure

```
simple-ai-usage-monitor/
├── src/
│   ├── collectors/         # Service-specific data collectors
│   │   ├── codex.ts       # OpenAI Codex usage collector
│   │   ├── claude.ts      # Claude usage collector
│   │   └── gemini.ts      # Gemini usage collector
│   ├── parsers/
│   │   └── types.ts       # TypeScript types
│   └── index.ts           # Main entry point
├── dist/                  # Compiled JavaScript (generated)
└── package.json
```

## 🎨 Color Indicators

The progress bars use color coding to indicate usage levels:

- 🟢 **Green (0-79%)** - Safe usage level
- 🟡 **Yellow (80-89%)** - Approaching limit
- 🔴 **Red (90-100%)** - Near or at limit

## 🔧 Troubleshooting

### No data returned

If no usage data is displayed:

1. **Check if API keys are set:**
   ```bash
   echo $ANTHROPIC_API_KEY
   echo $OPENAI_API_KEY
   echo $GEMINI_API_KEY
   ```

2. **Verify API keys are valid:**
   - Test Claude: Visit [https://console.anthropic.com](https://console.anthropic.com)
   - Test OpenAI: Visit [https://platform.openai.com](https://platform.openai.com)
   - Test Gemini: Visit [https://aistudio.google.com](https://aistudio.google.com)

3. **Check for API errors:**
   - Make sure your API keys have not expired
   - Ensure you have credits/quota remaining
   - Check that your API keys have the necessary permissions

### Rate limits vs. Total usage

This tool shows **rate limits** (requests per minute), not total monthly usage or credits. To see total usage:

- **Claude**: Visit [https://console.anthropic.com/settings/usage](https://console.anthropic.com/settings/usage)
- **OpenAI**: Visit [https://platform.openai.com/usage](https://platform.openai.com/usage)
- **Gemini**: Visit [https://aistudio.google.com](https://aistudio.google.com)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Simple and straightforward AI usage monitoring
