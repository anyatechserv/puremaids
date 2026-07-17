'use client';

import { Component, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section py-20">
          <div className="mx-auto max-w-md text-center">
            <h1 className="heading-3 mb-4">Something went wrong</h1>
            <p className="text-body mb-6">Please try again or contact support.</p>
            <button className="btn-primary" onClick={() => this.setState({ hasError: false })}>Try Again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
