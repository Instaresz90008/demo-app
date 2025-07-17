interface AccessAuditLog {
  timestamp: string;
  userId: string;
  featureId: string;
  action: 'check' | 'grant' | 'deny' | 'track_usage';
  result: boolean;
  reason?: string;
  metadata?: Record<string, any>;
  pluginId?: string;
  componentName?: string;
  evaluationTime?: string;
}

class AccessAuditLogger {
  private logs: AccessAuditLog[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory
  private persistToLocalStorage = true;

  log(entry: Omit<AccessAuditLog, 'timestamp'>) {
    const logEntry: AccessAuditLog = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Persist to localStorage for debugging
    if (this.persistToLocalStorage) {
      try {
        localStorage.setItem('access_audit_logs', JSON.stringify(this.logs.slice(-100))); // Keep last 100 in storage
      } catch (error) {
        console.warn('Failed to persist audit logs:', error);
      }
    }

    // Console log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Access Audit:', logEntry);
    }
  }

  getLogs(filters?: {
    userId?: string;
    featureId?: string;
    action?: string;
    pluginId?: string;
    componentName?: string;
    since?: Date;
  }): AccessAuditLog[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.featureId) {
        filteredLogs = filteredLogs.filter(log => log.featureId === filters.featureId);
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      if (filters.pluginId) {
        filteredLogs = filteredLogs.filter(log => log.pluginId === filters.pluginId);
      }
      if (filters.componentName) {
        filteredLogs = filteredLogs.filter(log => log.componentName === filters.componentName);
      }
      if (filters.since) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= filters.since!);
      }
    }

    return filteredLogs;
  }

  getStats() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentLogs = this.getLogs({ since: oneHourAgo });

    const stats = {
      totalLogs: this.logs.length,
      logsLastHour: recentLogs.length,
      grantRate: recentLogs.filter(log => log.result).length / recentLogs.length * 100,
      denyRate: recentLogs.filter(log => !log.result).length / recentLogs.length * 100,
      avgEvaluationTime: this.calculateAverageEvaluationTime(recentLogs),
      topFeatures: this.getTopFeatures(recentLogs),
      topComponents: this.getTopComponents(recentLogs)
    };

    return stats;
  }

  private calculateAverageEvaluationTime(logs: AccessAuditLog[]): number {
    const timeLogs = logs.filter(log => log.evaluationTime);
    if (timeLogs.length === 0) return 0;

    const totalTime = timeLogs.reduce((sum, log) => {
      const time = parseFloat(log.evaluationTime!.replace('ms', ''));
      return sum + (isNaN(time) ? 0 : time);
    }, 0);

    return totalTime / timeLogs.length;
  }

  private getTopFeatures(logs: AccessAuditLog[]): Array<{ feature: string; count: number }> {
    const featureCounts = logs.reduce((acc, log) => {
      acc[log.featureId] = (acc[log.featureId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(featureCounts)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getTopComponents(logs: AccessAuditLog[]): Array<{ component: string; count: number }> {
    const componentCounts = logs.reduce((acc, log) => {
      if (log.componentName) {
        acc[log.componentName] = (acc[log.componentName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(componentCounts)
      .map(([component, count]) => ({ component, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  clear() {
    this.logs = [];
    if (this.persistToLocalStorage) {
      localStorage.removeItem('access_audit_logs');
    }
  }
}

export const accessAuditLogger = new AccessAuditLogger();
export type { AccessAuditLog };
