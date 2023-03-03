
type SearchFn<T> = (value: T)=> boolean

/**
 * 删除指定的元素并返回一个去除了指定元素的新数组
 * @param array 旧数组
 * @param searchFn 搜索函数
 */
export function deleteElement <T> (array: T[], searchFn: SearchFn<T>): T[] {
  if (!array) {
    return []
  }
  if (array.length === 0) {
    return array
  }
  return deleteIndexAt(array, array.findIndex(searchFn))
}

/**
 * 删除指定索引下的元素，返回不包含对应索引元素的全新数组
 * @param array 数组
 * @param index 指定索引，若越界则会返回原数组
 */
export function deleteIndexAt <T> (array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    return array
  }
  const cpy: T[] = []
  let i = 0
  for (; i < index; ++i) {
    cpy.push(array[i])
  }
  i++
  for (let len = array.length; i < len; ++i) {
    cpy.push(array[i])
  }
  return cpy
}
