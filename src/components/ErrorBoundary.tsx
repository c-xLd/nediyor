import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/Button.js';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI component:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
              Bir Hata Oluştu
            </h1>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {this.state.error?.message && this.state.error.message !== '[object Object]'
                ? this.state.error.message
                : 'Sayfa yüklenirken beklenmeyen bir durum meydana geldi.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={this.handleReset}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Sayfayı Yenile
              </Button>
              <Button
                variant="secondary"
                onClick={this.handleGoHome}
                leftIcon={<Home className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Ana Sayfa
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
