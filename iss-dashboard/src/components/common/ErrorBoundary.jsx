import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Boundary Catch:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-3xl text-center">
          <AlertTriangle size={40} className="text-red-600 mb-4" />
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Satellite Link Failure</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
            Critical error detected in this module. Re-establishing connection might solve the issue.
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg"
          >
            <RefreshCw size={18} />
            Reset Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
