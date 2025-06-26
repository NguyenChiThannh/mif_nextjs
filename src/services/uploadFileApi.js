import { privateApi } from '@/services/config'
import { useMutation } from '@tanstack/react-query'

const generatePresignedUrlForUpload = async (fileName) => {
  const res = await privateApi.get('/files/generate-presigned-url/upload', {
    params: {
      fileName,
    },
  })
  return res.data
}

const getUploadedFileUrl = async (fileName) => {
  const res = await privateApi.get('/files/uploaded-file-url', {
    params: {
      fileName,
    },
  })
  return res.data
}

export const uploadFileApi = {
  mutation: {
    useGeneratePresignedUrlForUpload() {
      return useMutation({
        mutationFn: generatePresignedUrlForUpload,
      })
    },
    useGetUploadedFileUrl() {
      return useMutation({
        mutationFn: getUploadedFileUrl,
      })
    },
  },
}
