export type MediaQueryBreakpoint = {
  mobile: number;
};

export type MediaQueryParameter = {
  minWidth: string;
  maxWidth: string;
};

export const MediaQueryBreakpoints: MediaQueryBreakpoint = {
  mobile: 768,
};

export const MediaQueryParameters: MediaQueryParameter = {
  minWidth: 'min-width',
  maxWidth: 'max-width',
};
