import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface RouterContextType {
  path: string;
  query: Record<string, string>;
  navigate: (to: string) => void;
  replace: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  query: {},
  navigate: () => {},
  replace: () => {}
});

function parseLocation(): { path: string; query: Record<string, string> } {
  if (typeof window === 'undefined') {
    return { path: '/', query: {} };
  }

  const path = window.location.pathname || '/';
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const query: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  return { path, query };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loc, setLoc] = useState(parseLocation);

  useEffect(() => {
    const handlePopState = () => {
      setLoc(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (typeof window === 'undefined') return;
    if (to === window.location.pathname + window.location.search) return;

    window.history.pushState({}, '', to);
    setLoc(parseLocation());
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const replace = (to: string) => {
    if (typeof window === 'undefined') return;
    window.history.replaceState({}, '', to);
    setLoc(parseLocation());
  };

  const value = useMemo(() => ({
    path: loc.path,
    query: loc.query,
    navigate,
    replace
  }), [loc.path, loc.query]);

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  return useContext(RouterContext);
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, className = '', onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      !e.defaultPrevented &&
      e.button === 0 && // left click
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.shiftKey &&
      !href.startsWith('http') &&
      !href.startsWith('//')
    ) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
