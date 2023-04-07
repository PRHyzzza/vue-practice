import { shallowReactive } from "vue"
import success from "../img/success.svg"
import error from "../img/close.svg"
import warn from "../img/alert.svg"
import info from "../img/formation.svg"


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

export function getHeight(id: string): string {
  const index = getIndex(id)
  return (index === 0 ? 20 : 20 * (index + 1) + (40 * index)) + 'px'
}

export function generateRandomString(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function closeInstance(id: string) {
  array.splice(getIndex(id), 1)
}
