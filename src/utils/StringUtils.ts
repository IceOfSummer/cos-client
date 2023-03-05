const REGX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i
/**
 * 将字符串里可能出现的url替换为a标签
 * @param text
 */
export const replaceURLWithHTMLLinks = (text: string) => {
  return text.replace(REGX,'<a class="link-text" target="_blank" href=\'$1\'>$1</a>')
}
