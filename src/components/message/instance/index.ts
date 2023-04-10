import { shallowReactive } from "vue"
import success from "../img/success.svg"
import error from "../img/close.svg"
import warn from "../img/alert.svg"
import info from "../img/formation.svg"

// success 操作成功
// error 操作失败
// warn 警告
// info 提示
export type messageType = 'success' | 'error' | 'warn' | 'info'

export function getColorByStatus(status: messageType) {
  switch (status) {
    case 'success':
      return '#4ade80'
    case 'error':
      return '#fb7185'
    case 'warn':
      return '#facc15'
    case 'info':
      return '#93c5fd'
  }
}

export function getImageByStatus(status: messageType) {
  switch (status) {
    case 'success':
      return success
    case 'error':
      return error
    case 'warn':
      return warn
    case 'info':
      return info
  }
}

const array = shallowReactive<{ id: string, data: HTMLDivElement | undefined }[]>([])

export function setInstance(id: string, data: HTMLDivElement | undefined) {
  array.push({ id, data })
}

function getIndex(id: string) {
  return array.findIndex(obj => obj.id === id)
}

/**
 * 返回具有给定 id 的元素的高度。
 * @param id - 要获取高度的元素的 id。
 * @returns 表示元素高度的字符串值（以像素为单位）。
 */
export function getHeight(id: string): string {
  // 使用 getIndex 函数获取具有给定 id 的元素的索引。
  const index = getIndex(id)

  // 如果索引为 0 或 -1，则返回高度为 20 像素。
  if (index === 0 || index === -1) {
    return '20px'
  }

  // 使用公式 20 * (index + 1) + (40 * index) 基于索引计算高度。
  const height = 20 * (index + 1) + (40 * index)

  // 将高度值与字符串 'px' 连接并返回。
  return height + 'px'
}

export function closeInstance(id: string) {
  array.splice(getIndex(id), 1)
}
