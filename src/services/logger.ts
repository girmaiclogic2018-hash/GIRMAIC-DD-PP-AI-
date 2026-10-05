export type LogLevel = 'INFO' | 'WARN' | 'ERROR';
export type LogCategory = 'API' | 'UI' | 'RAG' | 'AUTH' | 'SYSTEM';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: any;
}

class AppLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 200;

  private record(level: LogLevel, category: LogCategory, message: string, details?: any) {
    const entry: LogEntry = {
      id: 'LOG-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.category}] ${entry.message}`;
    if (level === 'ERROR') {
      console.error(formatted, details || '');
    } else if (level === 'WARN') {
      console.warn(formatted, details || '');
    } else {
      console.log(formatted, details || '');
    }
  }

  info(category: LogCategory, message: string, details?: any) {
    this.record('INFO', category, message, details);
  }

  warn(category: LogCategory, message: string, details?: any) {
    this.record('WARN', category, message, details);
  }

  error(category: LogCategory, message: string, details?: any) {
    this.record('ERROR', category, message, details);
  }

  getRecentLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export const logger = new AppLogger();
