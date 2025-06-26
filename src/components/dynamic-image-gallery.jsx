'use client'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import Image from 'next/image'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const imagesMovies = [
  {
    id: 1,
    src: 'https://i.pinimg.com/736x/87/f3/47/87f34781146412ff3a695adfef4bd86a.jpg',
  },
  {
    id: 2,
    src: 'https://i.pinimg.com/736x/f6/83/58/f6835879ca5503ceea0b10078a858087.jpg',
  },
  {
    id: 3,
    src: 'https://i.pinimg.com/736x/0c/60/c1/0c60c10fd11e882876a03f6f1b1ff709.jpg',
  },
  {
    id: 4,
    src: 'https://i.pinimg.com/736x/12/1c/7e/121c7e0ab80d424e86f59a37d9df040a.jpg',
  },
  {
    id: 5,
    src: 'https://i.pinimg.com/736x/78/f8/2d/78f82dcff64b7ad381e021f684262258.jpg',
  },
  {
    id: 6,
    src: 'https://i.pinimg.com/736x/5d/2f/0f/5d2f0f6a5fa3b0f4f6ef768340817bdd.jpg',
  },
  {
    id: 7,
    src: 'https://i.pinimg.com/736x/1a/d8/18/1ad818ef0a66a055b4dff0a2bde1fa7c.jpg',
  },
  {
    id: 8,
    src: 'https://i.pinimg.com/736x/58/ab/8b/58ab8b230670d470b991e946affaa7d1.jpg',
  },
  {
    id: 9,
    src: 'https://i.pinimg.com/736x/be/3e/3a/be3e3ac6cc98a1854046a43d586565d6.jpg',
  },
  {
    id: 10,
    src: 'https://i.pinimg.com/736x/f1/86/a5/f186a5921bc22e697a9e390c4303d75e.jpg',
  },
  {
    id: 11,
    src: 'https://i.pinimg.com/736x/54/57/9e/54579e8015a96720a04e2c48dc36fdee.jpg',
  },
  {
    id: 12,
    src: 'https://i.pinimg.com/736x/cf/d0/c6/cfd0c610f6e32478f676864290efe484.jpg',
  },
  {
    id: 13,
    src: 'https://i.pinimg.com/736x/44/93/64/44936480150354123eb85136abc2fe35.jpg',
  },
  {
    id: 14,
    src: 'https://i.pinimg.com/736x/3a/56/82/3a56824918a3c96fd6a9d1c6fcd11936.jpg',
  },
  {
    id: 15,
    src: 'https://i.pinimg.com/736x/50/86/29/50862939ac54bfc6b77d4370f669cb52.jpg',
  },
  {
    id: 16,
    src: 'https://i.pinimg.com/736x/50/00/02/50000280015f30c10b7304af7e4af104.jpg',
  },
  {
    id: 17,
    src: 'https://i.pinimg.com/736x/96/cd/e2/96cde2d1caae37d622e55eb2809d3e34.jpg',
  },
  {
    id: 18,
    src: 'https://i.pinimg.com/736x/f0/97/c0/f097c0429e35b2b1117f99d05a4ac492.jpg',
  },
  {
    id: 19,
    src: 'https://i.pinimg.com/736x/f4/f0/c4/f4f0c43b354683e3ce1cf93f284b2062.jpg',
  },
  {
    id: 20,
    src: 'https://i.pinimg.com/736x/56/00/98/560098db091d171c95b3d3cefde1dd05.jpg',
  },
  {
    id: 21,
    src: 'https://i.pinimg.com/736x/56/00/98/560098db091d171c95b3d3cefde1dd05.jpg',
  },
  {
    id: 22,
    src: 'https://i.pinimg.com/736x/b6/aa/24/b6aa2408f8206b84687229859560e18d.jpg',
  },
  {
    id: 23,
    src: 'https://i.pinimg.com/736x/4e/40/9b/4e409b3e17ca81490f8732ea451b7533.jpg',
  },
]

const imagesActors = [
  {
    id: 1,
    src: 'https://i.pinimg.com/736x/24/02/3d/24023dec0cd7f6f92e3eee3267ef08a7.jpg',
  },
  {
    id: 2,
    src: 'https://i.pinimg.com/736x/15/37/cb/1537cb82c78733c1f69f21c37b5c4ec5.jpg',
  },
  {
    id: 3,
    src: 'https://i.pinimg.com/736x/5e/9f/36/5e9f36d41637e9dc343d5e1e60886368.jpg',
  },
  {
    id: 4,
    src: 'https://i.pinimg.com/736x/27/a3/09/27a3099036c54f5fcfab9d535aa7478f.jpg',
  },
  {
    id: 5,
    src: 'https://i.pinimg.com/736x/73/c5/6d/73c56d52ff528b3f9d0d79d24eb0619c.jpg',
  },
  {
    id: 6,
    src: 'https://i.pinimg.com/736x/6c/c7/c3/6cc7c3c3e117fe78a98028b0abe5e166.jpg',
  },
  {
    id: 7,
    src: 'https://i.pinimg.com/736x/1c/e8/d3/1ce8d3b903c27056ba08c6a4625f3c58.jpg',
  },
  {
    id: 8,
    src: 'https://i.pinimg.com/736x/d6/53/98/d65398b650776cf446f45273642692d6.jpg',
  },
  {
    id: 9,
    src: 'https://i.pinimg.com/736x/46/83/61/468361e577256a685e85150f666f4e42.jpg',
  },
  {
    id: 10,
    src: 'https://i.pinimg.com/736x/7b/e4/60/7be460f1df1f1d1189ae0b646f054506.jpg',
  },
  {
    id: 11,
    src: 'https://i.pinimg.com/736x/1b/9a/a8/1b9aa8b7f80ca6a531be3c19ca00fbdd.jpg',
  },
  {
    id: 12,
    src: 'https://i.pinimg.com/736x/4a/30/f1/4a30f173ba2ebbca3c50d610f7c81342.jpg',
  },
  {
    id: 13,
    src: 'https://i.pinimg.com/736x/5b/2d/ee/5b2dee912740af2838a1332164051620.jpg',
  },
  {
    id: 14,
    src: 'https://i.pinimg.com/736x/7b/37/d5/7b37d5084b5f259a2405e497836f5dbe.jpg',
  },
  {
    id: 15,
    src: 'https://i.pinimg.com/736x/5a/ed/88/5aed88db4d4f06466067cfa36bb4e4b8.jpg',
  },
  {
    id: 16,
    src: 'https://i.pinimg.com/736x/fc/20/1a/fc201a319bacf53ecb96654b5d1e5569.jpg',
  },
  {
    id: 17,
    src: 'https://i.pinimg.com/736x/a2/e9/da/a2e9da25f70e1d27697b0865719a764b.jpg',
  },
  {
    id: 18,
    src: 'https://i.pinimg.com/736x/0c/b0/d1/0cb0d14b96cddb0a39ce823c8bb01753.jpg',
  },
  {
    id: 19,
    src: 'https://i.pinimg.com/736x/54/4b/27/544b27ac60f4af6131e726ed5c054949.jpg',
  },
  {
    id: 20,
    src: 'https://i.pinimg.com/736x/1f/69/7f/1f697f82e425f9d63b7f8fa7a33b2997.jpg',
  },
  {
    id: 21,
    src: 'https://i.pinimg.com/736x/46/c6/d6/46c6d679e98074958396cb85d7677a48.jpg',
  },
  {
    id: 22,
    src: 'https://i.pinimg.com/736x/cd/a4/58/cda458ab74304f276bd30a23b9be0964.jpg',
  },
]

// Hàm xáo trộn mảng ảnh
const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function DynamicImageGallery({ type }) {
  const maxVisibleImages = 7
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const selectedImages = type === 'movie' ? imagesMovies : imagesActors

  // Chỉ xáo trộn ảnh một lần duy nhất khi component được mount
  const shuffledImages = React.useMemo(
    () => shuffleArray(selectedImages),
    [type],
  )

  const handleImageClick = (index) => {
    setCurrentImageIndex(index)
    setIsDialogOpen(true)
  }

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? shuffledImages.length - 1 : prev - 1,
    )
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === shuffledImages.length - 1 ? 0 : prev + 1,
    )
  }

  const remainingImages = shuffledImages.length - maxVisibleImages

  return (
    <div className='grid grid-cols-12 gap-2 w-full'>
      {shuffledImages.slice(0, maxVisibleImages).map((image, index) => (
        <div
          key={image.id}
          className={`relative w-full h-[150px] ${index < 3 ? 'col-span-4' : 'col-span-3'}`}
        >
          <Image
            src={image.src}
            alt={`Image ${image.id}`}
            layout='fill'
            objectFit='cover'
            className='w-full h-full object-cover cursor-pointer'
            onClick={() => handleImageClick(index)}
          />
          {index === maxVisibleImages - 1 && remainingImages > 0 && (
            <div
              className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold cursor-pointer'
              onClick={() => handleImageClick(index)}
            >
              +{remainingImages}
            </div>
          )}
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='h-fit max-w-2xl'>
          <DialogHeader>
            {currentImageIndex + 1}/{shuffledImages.length}
          </DialogHeader>
          <div className='flex items-center justify-between gap-4'>
            <ChevronLeft
              className='cursor-pointer border-2 hover:text-primary'
              size={32}
              strokeWidth={1}
              onClick={handlePrev}
            />
            <div className='h-[550px] flex items-center justify-center'>
              <Image
                src={shuffledImages[currentImageIndex].src}
                alt={`Image ${currentImageIndex}`}
                width={400}
                height={500}
                objectFit='cover'
                className='rounded-md h-full w-full'
              />
            </div>
            <ChevronRight
              className='cursor-pointer border-2 hover:text-primary'
              size={32}
              strokeWidth={1}
              onClick={handleNext}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
