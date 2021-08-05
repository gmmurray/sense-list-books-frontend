import { toast, ToastContainer, ToastOptions } from 'react-toastify';

export const toastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 7500,
  hideProgressBar: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
};

type ToastMessageType =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'dark';

export const showToast = (
  type: ToastMessageType,
  message: string,
  options?: ToastOptions,
) => {
  switch (type) {
    case 'default':
      toast(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    case 'success':
      toast.success(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'dark':
      toast.dark(message, options);
      break;
  }
};

export const showErrorToast = (message: string, options?: ToastOptions) =>
  showToast('error', message, options);

export const showSuccessToast = (message: string, options?: ToastOptions) =>
  showToast('success', message, { ...options, autoClose: 3000 });

export const ToastifyWrapper = () => <ToastContainer {...toastOptions} />;
