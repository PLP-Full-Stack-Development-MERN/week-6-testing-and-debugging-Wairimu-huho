import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Layout Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && (
              <div className="mt-4">
                <p className="font-semibold">Error details (dev mode only):</p>
                <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto text-sm">
                  {this.state.error?.toString()}
                </pre>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Navigation items
const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Bugs', path: '/bugs' },
  { name: 'Report Bug', path: '/bugs/new' },
];

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-primary-600 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-white font-bold text-lg">Bug Tracker</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 
                        ${
                          location.pathname === item.path
                            ? 'border-white text-white'
                            : 'border-transparent text-primary-100 hover:text-white'
                        }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div className="sm:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block pl-3 pr-4 py-2 text-base font-medium 
                    ${
                      location.pathname === item.path
                        ? 'bg-primary-700 text-white'
                        : 'text-white hover:bg-primary-500'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Bug Tracker App - Testing and Debugging in MERN Applications
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default Layout;