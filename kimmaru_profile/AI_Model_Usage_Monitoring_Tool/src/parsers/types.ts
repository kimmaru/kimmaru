export type ServiceType = 'codex' | 'claude' | 'gemini';

export interface UsageData {
  service: ServiceType;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
  resetDate?: Date;
  timestamp: Date;
}

export interface CollectorResult {
  success: boolean;
  data?: UsageData;
  error?: string;
}

export interface ServiceConfig {
  enabled: boolean;
  command: string;
  name: string;
  icon: string;
}

export interface Config {
  services: {
    codex: ServiceConfig;
    claude: ServiceConfig;
    gemini: ServiceConfig;
  };
  refreshInterval: number;
  notifications: {
    enabled: boolean;
    thresholds: number[];
  };
}

