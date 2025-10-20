
'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import type { Crop } from 'react-image-crop'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'


interface ImageCropDialogProps {
  isOpen: boolean
  onClose: () => void
  coverPreview: string | null
  onCropComplete: (croppedImage: File) => void
}

export function ImageCropDialog({ isOpen, onClose, coverPreview, onCropComplete }: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        16 / 9,
        width,
        height,
      ),
      width,
      height,
    )
    setCrop(newCrop)
  }

  async function handleCropImage() {
    if (!completedCrop || !imgRef.current || !coverPreview) {
      return
    }

    const originalFile = await urltoFile(coverPreview, 'original.jpg', 'image/jpeg')
    if (!originalFile) return

    const croppedImage = await getCroppedImg(imgRef.current, completedCrop, originalFile.name)
    if (croppedImage) {
      onCropComplete(croppedImage)
    }
  }

  async function getCroppedImg(image: HTMLImageElement, crop: Crop, fileName: string): Promise<File | null> {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return null
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null)
          return
        }
        const newFile = new File([blob], fileName, { type: 'image/jpeg' })
        resolve(newFile)
      }, 'image/jpeg')
    })
  }

  async function urltoFile(url: string, filename: string, mimeType: string): Promise<File | null> {
    try {
      const res = await fetch(url)
      const buf = await res.arrayBuffer()
      return new File([buf], filename, { type: mimeType })
    } catch (error) {
      console.error('Error converting URL to file:', error)
      return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa ảnh bìa</DialogTitle>
        </DialogHeader>
        {coverPreview && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={16 / 9}
          >
                            <img
                              ref={imgRef}
                              src={coverPreview}
                              alt="Crop preview"
                              onLoad={onImageLoad}
                            />          </ReactCrop>
        )}
        <DialogFooter>
          <Button onClick={handleCropImage} disabled={!completedCrop}>
            Cắt và lưu ảnh
          </Button>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
