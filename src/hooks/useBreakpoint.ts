import { useEffect, useState } from 'react';

const LG_QUERY = '(min-width: 1024px)';

export function useBreakpoint(query: string = LG_QUERY): boolean {
  const getMatch = () =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : true;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useIsDesktop(): boolean {
  return useBreakpoint(LG_QUERY);
}

export default useBreakpoint;
