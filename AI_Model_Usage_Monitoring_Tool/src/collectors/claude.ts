import { spawn } from 'child_process';
import { CollectorResult, UsageData } from '../parsers/types';

export async function collectClaudeUsage(): Promise<CollectorResult> {
  try {
    // Use Claude CLI with /usage command
    const output = await runClaudeCommand('/usage');
    const usage = parseClaudeUsageOutput(output);

    if (usage) {
      return {
        success: true,
        data: usage
      };
    }

    return {
      success: false,
      error: 'Could not parse Claude usage data'
    };
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return {
        success: false,
        error: 'Claude CLI not found. Install from: https://docs.claude.com/en/docs/claude-code'
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to collect Claude usage'
    };
  }
}

function runClaudeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p', command], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code === 0 || output.length > 0) {
        resolve(output);
      } else {
        reject(new Error(errorOutput || 'Command failed'));
      }
    });

    // Send command and exit
    child.stdin?.write(command + '\n');
    child.stdin?.end();

    // Kill after 10 seconds
    setTimeout(() => {
      child.kill();
      resolve(output);
    }, 10000);
  });
}

function parseClaudeUsageOutput(output: string): UsageData | null {
  try {
    // Parse output like:
    // Current session
    // [progress bar] 54% used
    // Resets 9pm (Asia/Seoul)
    //
    // Current week (all models)
    // [progress bar] 51% used
    // Resets Oct 15, 8pm (Asia/Seoul)

    const lines = output.split('\n');

    // Look for "Current session" section
    let sessionIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Current session')) {
        sessionIndex = i;
        break;
      }
    }

    if (sessionIndex === -1) {
      return null;
    }

    // Find percentage in next few lines
    let percentage = 0;
    let resetInfo = '';

    for (let i = sessionIndex + 1; i < Math.min(sessionIndex + 5, lines.length); i++) {
      const line = lines[i];

      // Match percentage: "54% used"
      const percentMatch = line.match(/(\d+)%\s*used/i);
      if (percentMatch) {
        percentage = parseInt(percentMatch[1]);
      }

      // Match reset time: "Resets 9pm (Asia/Seoul)" or "Resets Oct 15, 8pm (Asia/Seoul)"
      if (line.includes('Resets') || line.includes('resets')) {
        resetInfo = line.trim();
      }
    }

    if (percentage > 0) {
      // Calculate current and limit based on percentage
      // Assuming a typical 45 messages per 5 hours limit
      const estimatedLimit = 45;
      const current = Math.round((percentage / 100) * estimatedLimit);

      return {
        service: 'claude',
        current,
        limit: estimatedLimit,
        unit: 'messages/5h',
        percentage,
        timestamp: new Date(),
        resetDate: parseResetDate(resetInfo)
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

function parseResetDate(resetInfo: string): Date | undefined {
  if (!resetInfo) return undefined;

  try {
    // Try to extract time info from strings like:
    // "Resets 9pm (Asia/Seoul)"
    // "Resets Oct 15, 8pm (Asia/Seoul)"

    const now = new Date();

    // Simple heuristic: if it says "Resets" assume it's today or near future
    // This is approximate - the actual parsing would need more complex logic

    return undefined; // For now, return undefined as parsing time zones is complex
  } catch {
    return undefined;
  }
}

