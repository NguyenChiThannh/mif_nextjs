import { uploadFileApi } from '@/services/uploadFileApi';
import { useState } from 'react';

const useUploadImages = () => {
    const [images, setImages] = useState([]);
    const getUploadedFileUrlMutation = uploadFileApi.mutation.useGetUploadedFileUrl();
    const generatePresignedUrlForUploadMutation = uploadFileApi.mutation.useGeneratePresignedUrlForUpload();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

    const uploadImage = async (image) => {
        return new Promise((resolve, reject) => {
            generatePresignedUrlForUploadMutation.mutate(image.name, {
                onSuccess: async (data) => {
                    const { presignedUrl, fileName } = data;

                    await fetch(presignedUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': image.type,
                        },
                        body: image,
                    });

                    getUploadedFileUrlMutation.mutate(fileName, {
                        onSuccess: (fileUrl) => {
                            resolve(fileUrl)
                        },
                        onError: (error) => {
                            reject(error);
                        }
                    });
                },

            });
        })
    };

    return {
        images,
        setImages,
        handleImageChange,
        removeImage,
        uploadImage,
    };
};

export default useUploadImages;