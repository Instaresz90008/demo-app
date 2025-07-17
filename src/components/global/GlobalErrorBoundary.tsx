
import React, { ErrorInfo, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { AlertTriangle, WifiOff } from 'lucide-react';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  debugMode?: boolean;
  featureKey?: string;
  requiredRoles?: string[];
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  renderFailCount: number;
}

// Simple fallback UI component
const FallbackUI: React.FC<{
  title: string;
  description: string;
  icon: 'alert-triangle' | 'wifi-off';
  action?: { label: string; onClick: () => void };
  error?: Error | null;
  debugMode?: boolean;
}> = ({ title, description, icon, action, error, debugMode }) => {
  const IconComponent = icon === 'alert-triangle' ? AlertTriangle : WifiOff;
  
  return (
    <div key={error?.message || 'fallback'} className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <IconComponent className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {debugMode && error && (
        <details className="mb-4 text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground">Error Details</summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-w-md">
            {error.stack}
          </pre>
        </details>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = {
    hasError: false,
    error: null,
    renderFailCount: 0
  };

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('🧨 GlobalErrorBoundary caught error:', error);

    // Prevent fallback infinite loop
    if (this.state.renderFailCount >= 1) {
      return;
    }

    // Custom logger
    logger.error('Error boundary caught error', { 
      error: error.message, 
      stack: error.stack, 
      componentStack: info.componentStack 
    });

    // Show toast notification
    toast({
      title: "An error occurred",
      description: "Something went wrong. Please try again.",
      variant: "destructive"
    });

    // Optional external hook
    this.props.onError?.(error, info);

    this.setState(prevState => ({
      renderFailCount: prevState.renderFailCount + 1
    }));
  }

  componentDidUpdate(_: any, prevState: GlobalErrorBoundaryState) {
    if (prevState.hasError && !this.state.hasError) {
      this.setState({ renderFailCount: 0 });
    }
    // Reset when error changes
    if (prevState.error !== this.state.error && this.state.error) {
      this.setState({ renderFailCount: 0 });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, renderFailCount: 0 });
  };

  render() {
    const { hasError, error, renderFailCount } = this.state;
    const { fallback, children, debugMode } = this.props;

    // If offline
    if (!navigator.onLine) {
      return (
        <FallbackUI
          title="Offline Mode"
          description="You appear to be offline. Please check your internet connection."
          icon="wifi-off"
          action={{ label: 'Retry', onClick: this.handleRetry }}
          error={error}
          debugMode={debugMode}
        />
      );
    }

    if (hasError && renderFailCount < 1) {
      try {
        return (
          fallback || (
            <FallbackUI
              title="Something went wrong"
              description={error?.message || 'Unknown error'}
              icon="alert-triangle"
              action={{ label: 'Try Again', onClick: this.handleRetry }}
              error={error}
              debugMode={debugMode}
            />
          )
        );
      } catch {
        // Safe fallback
        return <div className="p-4 text-red-600 text-sm">Critical error. Please reload the page.</div>;
      }
    }

    return children;
  }
}

export default GlobalErrorBoundary;
