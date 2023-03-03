import Toastify from 'toastify-js'

type ToastType = 'primary' | 'error'


export const showToast = (text: string, type?: ToastType) => {
  let toastConfig:Toastify.Options
  switch (type) {
    case undefined:
    case 'primary':
      toastConfig = {
        text,
        duration: 3000
      }
      break
    case 'error':
      toastConfig = {
        text,
        duration: 3000,
        style: {
          background: 'linear-gradient(to right, #ee0979, #ff6a00)',
        }
      }
      break
    default:
      console.error('unknown toast type: ' + type)
      return
  }
  const toast = Toastify(toastConfig)
  toast.showToast()
  return toast
}
