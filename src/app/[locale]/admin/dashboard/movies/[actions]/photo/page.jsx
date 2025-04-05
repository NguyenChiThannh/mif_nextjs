'use client'
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useUploadImages from '@/hooks/useUploadImages';
import { movieApi } from '@/services/movieApi';
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function AddPhotoMovie() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const movieId = searchParams.get('id');
    const [imagesFromAPI, setImagesFromAPI] = useState([])
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
    const { images, handleImageChange, removeImage, uploadImage } = useUploadImages();
    const { data: movieImages, isLoading: isLoadingMovieImages } = movieApi.query.useGetMovieImages(movieId)

    const updateMovieImagesMutation = movieApi.mutation.useUpdateMovieImages()

    useEffect(() => {
        if (movieImages) {
            setImagesFromAPI(movieImages);
        }
    }, [movieImages]);

    if (isLoadingMovieImages) return <Loading />

    const removeImageFromAPI = (index) => setImagesFromAPI(imagesFromAPI.filter((_, i) => i !== index));

    const handleSubmitImage = async () => {
        setIsLoadingSubmit(true)
        const mediaUrls = await Promise.all(images.map((image) => uploadImage(image)));
        const data = {
            url: [
                ...mediaUrls,
                ...imagesFromAPI,
            ],
            movieId,
        }

        updateMovieImagesMutation.mutate(data, {
            onSuccess: () => {
                router.push('/admin/dashboard/movies')
            },
            onSettled: () => {
                setIsLoadingSubmit(false)
            }
        })
    }
    return (
        <div>
            <div className="flex items-center justify-end mb-6">
                <div className='flex items-center gap-2'>
                    <Button
                        disbale={isLoadingSubmit}
                        onClick={handleSubmitImage}
                    >
                        {isLoadingSubmit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                </div>
            </div>
            <Label htmlFor="imageUpload" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                <Upload className="w-4 h-4" />
                Thêm ảnh
            </Label>
            <input
                type="file"
                id="imageUpload"
                className="hidden"
                multiple
                onChange={handleImageChange}
            />
            <div className="flex flex-wrap gap-3 mt-3">
                {imagesFromAPI && imagesFromAPI.length > 0 && imagesFromAPI.map((image, index) => (
                    <div key={index} className="relative group">
                        <Image
                            src={image}
                            alt={`movie-image-${index}`}
                            width={160}
                            height={160}
                            className="w-36 h-36 rounded object-cover"
                        />
                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => removeImageFromAPI(index)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                {images.map((image, index) => (
                    <div key={index} className="relative group">
                        <Image
                            src={URL.createObjectURL(image)}
                            alt={`image-${index}`}
                            width={160}
                            height={160}
                            className="w-36 h-36 rounded object-cover"
                        />
                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
