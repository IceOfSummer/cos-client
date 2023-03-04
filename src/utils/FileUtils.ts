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
