import { Component } from 'react';

// TODO: Implement Error Boundary
// Class component yang catch errors di child components

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // TODO: Implement getDerivedStateFromError
  // Return { hasError: true, error }

  // TODO: Implement componentDidCatch
  // Log error to console or error reporting service

  render() {
    if (this.state.hasError) {
      // TODO: Create fallback UI
      // Show user-friendly error message dengan reload button
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
               TODO: Add error message
            </h2>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

