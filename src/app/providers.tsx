'use client';

import React, { ReactNode, ErrorInfo } from 'react';
import ClientTinyMCEScript from '@/components/ClientTinyMCEScript';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Client error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">משהו השתבש</h2>
            <p className="text-gray-700 mb-6">
              אירעה שגיאה בטעינת העמוד. נא לנסות שוב מאוחר יותר.
            </p>
            <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded mb-4 overflow-auto max-h-32 text-left">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              חזרה לדף הבית
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ClientTinyMCEScript />
      {children}
    </ErrorBoundary>
  );
} 