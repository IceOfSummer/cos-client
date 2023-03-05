export const readFileUrl = (file: File):string => {
    let path
    // electron上有这个属性，浏览器上由于安全问题拿不到
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if ((path = file.path)) {
      return path
    } else {
      console.warn('readFileUrl is invalid on browser!')
      return 'readFileUrl is invalid on browser!'
    }
}


export const readFileAsBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onerror = e => {
      reject(e)
    }
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result)
      } else {
        reject(new Error('发生未知错误，文件不能被读取为ArrayBuffer'))
      }
    }
  })
}
