import { positions, transitions } from 'react-alert';

const alertOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  transition: transitions.FADE,
  offset: '100px',
};

export const defaultErrorTimeout = { timeout: 10000 };
export default alertOptions;
