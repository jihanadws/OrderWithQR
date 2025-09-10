import React, { Component, ReactNode } from 'react';
import { AppError, ErrorType } from '../types';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: {
        type: ErrorType.VALIDATION_ERROR,
        message: 'Terjadi kesalahan tak terduga. Silakan muat ulang halaman.',
        details: error.message
      }
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className=\"error-boundary\">
          <div className=\"error-content\">
            <div className=\"error-icon\">💥</div>
            <h2>Oops! Terjadi Kesalahan</h2>
            <p>{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className=\"btn-primary\"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;