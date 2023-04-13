import { ref } from 'vue'

export default (fileName = '下载文件') => {
  const isDownloading = ref(false)

  const downloadBlob = async (blob: Blob) => {
    const link = document.createElement('a')
    link.style.display = 'none'
    document.body.appendChild(link)

    try {
      isDownloading.value = true
      const objectUrl = URL.createObjectURL(blob)
      link.href = objectUrl
      link.download = fileName
      link.click()
      URL.revokeObjectURL(objectUrl)
    }
    catch (error) {
      console.error(error)
    }
    finally {
      isDownloading.value = false
      link.remove()
    }
  }

  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      downloadBlob(blob)
    }
    catch (error) {
      console.error(error)
    }
  }

  return { downloadFile, downloadBlob, isDownloading }
}
