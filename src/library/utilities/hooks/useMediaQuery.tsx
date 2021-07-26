import { useEffect, useState } from 'react';
import {
  MediaQueryBreakpoint,
  MediaQueryParameter,
} from 'src/library/constants/mediaQueries';

type BreakpointType<T> = T[keyof T];
type ParameterType<T> = T[keyof T];

export const useMediaQuery = (
  breakpoint: BreakpointType<MediaQueryBreakpoint>,
  parameters: ParameterType<MediaQueryParameter>,
) => {
  const query = `(${parameters}: ${breakpoint}px)`;

  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
