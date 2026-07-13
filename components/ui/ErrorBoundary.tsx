'use client';

import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="flex min-h-[40vh] items-center justify-center p-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">Something went wrong</p>
            <p className="mt-2 text-sm text-gray-600">{this.state.error.message}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="btn btn-md btn-secondary mt-4"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
