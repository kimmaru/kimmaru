#!/usr/bin/env node

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
};

function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

async function main() {
  console.log(colorize('\n🤖 AI Usage Monitor\n', 'bold'));

  console.log(colorize('This tool helps you check your AI service usage.', 'gray'));
  console.log(colorize('Since CLI tools only show usage in interactive mode, follow these steps:\n', 'gray'));

  // Claude usage
  console.log(colorize('📊 Claude Usage:', 'cyan') + colorize('', 'bold'));
  console.log(colorize('1. Open a new terminal', 'gray'));
  console.log(colorize('2. Run: ', 'gray') + colorize('claude', 'yellow'));
  console.log(colorize('3. Type: ', 'gray') + colorize('/usage', 'yellow'));
  console.log(colorize('4. Press Tab to cycle between: Settings, Status, Config, Usage\n', 'gray'));

  // Codex usage
  console.log(colorize('📊 Codex Usage:', 'cyan') + colorize('', 'bold'));
  console.log(colorize('1. Open a new terminal', 'gray'));
  console.log(colorize('2. Run: ', 'gray') + colorize('codex', 'yellow'));
  console.log(colorize('3. Type: ', 'gray') + colorize('/status', 'yellow'));
  console.log(colorize('4. View your usage statistics\n', 'gray'));

  // Gemini usage
  console.log(colorize('📊 Gemini Usage:', 'cyan') + colorize('', 'bold'));
  console.log(colorize('1. Visit: ', 'gray') + colorize('https://aistudio.google.com', 'yellow'));
  console.log(colorize('2. Check your quota on the dashboard\n', 'gray'));

  console.log(colorize('\n💡 Quick Commands:\n', 'bold'));
  console.log(colorize('  claude', 'cyan') + colorize('     - Start Claude and type /usage', 'gray'));
  console.log(colorize('  codex', 'cyan') + colorize('      - Start Codex and type /status', 'gray'));
  console.log();

  console.log(colorize('Note: Usage data is only available in interactive terminal sessions.', 'gray'));
  console.log(colorize('These CLI tools don\'t provide programmatic access to usage information.\n', 'gray'));
}

main().catch(error => {
  console.error(colorize('Error: ', 'bold') + error.message);
  process.exit(1);
});
