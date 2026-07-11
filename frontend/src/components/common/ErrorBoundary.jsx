import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="text-center max-w-md space-y-4">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-textPrimary">Something went wrong</h2>
            <p className="text-muted text-sm">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-[#131A26] rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

