import Toastify from 'toastify-js'

type ToastType = 'primary' | 'error'


function generateConfig(text: string, type?: ToastType):Toastify.Options {
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
      return { text, duration: 3000 }
  }
  return toastConfig
}

export const showToast = (text: string, type?: ToastType) => {
  const toast = Toastify(generateConfig(text, type))
  toast.showToast()
  return toast
}

export const showToastFromBottom = (text: string, type?: ToastType) => {
  const config = generateConfig(text, type)
  config.position = 'center'
  const toast = Toastify(config)
  toast.showToast()
  return toast
}
