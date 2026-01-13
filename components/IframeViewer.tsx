import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';

interface IframeViewerProps {
  url: string;
  title: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const IframeViewer: React.FC<IframeViewerProps> = ({ 
  url, 
  title,
  onLoad,
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset state when URL changes
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    // Set a timeout for loading - if not loaded in 30s, show error
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        handleError('The page is taking too long to load. It may be blocked or unavailable.');
      }
    }, 30000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [url]);

  const handleLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = (message: string) => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setIsLoading(false);
    setHasError(true);
    setErrorMessage(message);
    onError?.(message);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    
    // Force iframe reload
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden"
      role="region"
      aria-label={`${title} embedded content`}
    >
      {/* Loading State */}
      {isLoading && !hasError && (
        <div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50"
          role="status"
          aria-live="polite"
        >
          {/* Skeleton loading animation */}
          <div className="w-full max-w-md px-8 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-slate-700">Loading {title}...</h3>
                <p className="text-sm text-slate-500">Please wait while the content loads</p>
              </div>
            </div>
            
            {/* Skeleton elements */}
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-32 bg-slate-200 rounded mt-4"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 p-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md text-center">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239, 68, 68, 0.1)' }}
            >
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Unable to Load Content
            </h3>
            <p className="text-slate-500 mb-6">
              {errorMessage || 'The embedded site could not be loaded. This may be due to security restrictions or network issues.'}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Retry loading the content"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={handleOpenInNewTab}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                aria-label="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in New Tab</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={url}
        title={title}
        className={`w-full h-full border-0 transition-opacity duration-300 ${
          isLoading || hasError ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={() => handleError('Failed to load the embedded content.')}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        loading="lazy"
        aria-hidden={isLoading || hasError}
      />

    </div>
  );
};
