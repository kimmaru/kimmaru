import { spawn } from 'child_process';
import { CollectorResult, UsageData } from '../parsers/types';

export async function collectCodexUsage(): Promise<CollectorResult> {
  try {
    // Use Codex CLI with /status command
    const output = await runCodexCommand('/status');
    const usage = parseCodexUsageOutput(output);

    if (usage) {
      return {
        success: true,
        data: usage
      };
    }

    return {
      success: false,
      error: 'Could not parse Codex usage data'
    };
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return {
        success: false,
        error: 'Codex CLI not found. Install from: https://www.openai.com/codex'
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to collect Codex usage'
    };
  }
}

function runCodexCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('codex', ['exec', command], {
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

    // Kill after 10 seconds
    setTimeout(() => {
      child.kill();
      resolve(output);
    }, 10000);
  });
}

function parseCodexUsageOutput(output: string): UsageData | null {
  try {
    // Parse output from /status command
    // Looking for usage information in various formats

    const lines = output.split('\n');

    // Try to find usage percentages or counts
    for (const line of lines) {
      // Look for patterns like "80% used" or "40/50 messages"
      const percentMatch = line.match(/(\d+)%\s*(?:used|remaining)/i);
      if (percentMatch) {
        const percentage = parseInt(percentMatch[1]);

        // Estimate based on known ChatGPT Plus limits
        // GPT-4o: 80 messages / 3 hours
        const estimatedLimit = 80;
        const current = Math.round((percentage / 100) * estimatedLimit);

        return {
          service: 'codex',
          current,
          limit: estimatedLimit,
          unit: 'messages/3h',
          percentage,
          timestamp: new Date()
        };
      }

      // Look for explicit count patterns like "40/80 messages"
      const countMatch = line.match(/(\d+)\s*\/\s*(\d+)\s*(?:messages?|queries?)/i);
      if (countMatch) {
        const current = parseInt(countMatch[1]);
        const limit = parseInt(countMatch[2]);
        const percentage = Math.round((current / limit) * 100);

        return {
          service: 'codex',
          current,
          limit,
          unit: 'messages',
          percentage,
          timestamp: new Date()
        };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}
