"use client"

import type React from "react"

import { useState } from "react"
import type { Event } from "@/lib/types"
import { createEvent, updateEvent, getPresignedUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"



import dynamic from 'next/dynamic'

const ImageCropDialog = dynamic(() => import('@/components/image-crop-dialog').then(mod => mod.ImageCropDialog))

interface EventFormProps {
  event?: Event
  onSuccess: () => void
  onCancel: () => void
}

interface GalleryFile {
  file: File
  preview: string
  controller: AbortController
}

export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<Partial<Event>>(
    event || {
      title: "",
      summary: "",
      description: "",
      status: "DRAFT",
      startAt: "",
      endAt: "",
      coverImage: "",
      gallery: [],
      location: { name: "" },
    },
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>([])
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: "coverImage" | "posterImage" | "gallery") {
    const files = e.target.files
    if (!files || files.length === 0) {
      return
    }

    if (field === "coverImage") {
      const file = files[0]
      setCoverPreview(URL.createObjectURL(file))
      setIsCropModalOpen(true)
    } else if (field === "posterImage") {
      const file = files[0]
      const tempPreviewUrl = URL.createObjectURL(file)
      setPosterPreview(tempPreviewUrl)
      uploadFile(file, "posterImage", undefined, tempPreviewUrl)
    } else {
      const newFiles = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        controller: new AbortController(),
      }))

      setGalleryFiles((prev) => [...prev, ...newFiles])

      newFiles.forEach((file) => {
        uploadFile(file.file, "gallery", file.controller.signal, file.preview)
      })
    }
  }

  function handleCropComplete(croppedImage: File) {
    setIsCropModalOpen(false)
    uploadFile(croppedImage, "coverImage")
  }

  async function uploadFile(file: File, field: "coverImage" | "posterImage" | "gallery", signal?: AbortSignal, previewUrl?: string) {
    setUploadingImage(true)
    setError(null)

    try {
      const presignResponse = await getPresignedUrl(file.name, file.type)

      if (presignResponse.error || !presignResponse.data?.url || !presignResponse.data?.publicUrl) {
        setError(presignResponse.error?.message || "Failed to get upload URL")
        return
      }

      const { url: uploadUrl, publicUrl } = presignResponse.data

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
        signal,
      })

      if (!uploadResponse.ok) {
        setError(`Failed to upload image: ${uploadResponse.statusText}.`)
        return
      }

      if (field === "coverImage") {
        setFormData({ ...formData, coverImage: publicUrl })
        setCoverPreview(null)
      } else if (field === "posterImage") {
        setFormData({ ...formData, posterImage: publicUrl })
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
        setPosterPreview(null)
      } else {
        setFormData((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), publicUrl],
        }))
        if (previewUrl) {
          setGalleryFiles((prev) => prev.filter((f) => f.preview !== previewUrl))
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Upload aborted');
      } else {
        setError(err.message || "An unexpected error occurred during upload.")
      }
    } finally {
      setUploadingImage(false)
    }
  }

  function handleRemoveGalleryImage(preview: string) {
    const fileToRemove = galleryFiles.find((f) => f.preview === preview)
    if (fileToRemove) {
      fileToRemove.controller.abort()
      setGalleryFiles((prev) => prev.filter((f) => f.preview !== preview))
      URL.revokeObjectURL(preview)
    }
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (event?.id) {
        const response = await updateEvent(event.id, formData)
        if (response.error) {
          setError(response.error.message)
        } else {
          onSuccess()
        }
      } else {
        const response = await createEvent(formData)
        if (response.error) {
          setError(response.error.message)
        } else {
          onSuccess()
        }
      }
    } catch {
      setError("Failed to save event")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{event ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</h2>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Tiêu đề</label>
          <input
            type="text"
            required
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tiêu đề sự kiện"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tóm tắt</label>
          <input
            type="text"
            value={formData.summary || ""}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tóm tắt ngắn gọn"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mô tả chi tiết</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Mô tả chi tiết về sự kiện"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Ngày bắt đầu</label>
            <input
              type="date"
              required
              value={formData.startAt ? new Date(formData.startAt).toISOString().slice(0, 10) : ""}
              onChange={(e) => setFormData({ ...formData, startAt: new Date(e.target.value).toISOString() })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngày kết thúc</label>
            <input
              type="date"
              value={formData.endAt ? new Date(formData.endAt).toISOString().slice(0, 10) : ""}
              onChange={(e) => setFormData({ ...formData, endAt: new Date(e.target.value).toISOString() })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Địa điểm</label>
          <input
            type="text"
            value={formData.location?.name || ""}
            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, name: e.target.value } })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tên địa điểm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái</label>
          <select
            value={formData.status || "DRAFT"}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="DRAFT">Nháp</option>
            <option value="PUBLISHED">Công bố</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ảnh bìa</label>
          <div className="flex gap-4 items-start">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "coverImage")}
              disabled={uploadingImage}
              className="flex-1 px-4 py-2 border border-border rounded-lg"
            />
            {uploadingImage && <span className="text-sm text-muted-foreground">Đang tải...</span>}
          </div>
          {formData.coverImage && (
            <div className="relative mt-4 w-full h-48 overflow-hidden rounded-lg">
              <Image
                src={formData.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ảnh poster (2000x2000)</label>
          <div className="flex gap-4 items-start">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "posterImage")}
              disabled={uploadingImage}
              className="flex-1 px-4 py-2 border border-border rounded-lg"
            />
            {uploadingImage && <span className="text-sm text-muted-foreground">Đang tải...</span>}
          </div>
          {(posterPreview || formData.posterImage) && (
            <div className="relative mt-4 w-48 h-48 overflow-hidden rounded-lg">
              <Image
                src={posterPreview || formData.posterImage || "/placeholder.svg"}
                alt="Poster"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-2">Thư viện ảnh</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e, "gallery")}
            disabled={uploadingImage}
            className="w-full px-4 py-2 border border-border rounded-lg"
          />
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {galleryFiles.map((file) => (
              <div key={file.preview} className="relative aspect-square">
                <Image
                  src={file.preview}
                  alt={`Preview`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(file.preview)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
                >
                  ✕
                </button>
              </div>
            ))}
            {formData.gallery && formData.gallery.map((image, idx) => (
              <div key={idx} className="relative aspect-square">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Gallery ${idx}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      gallery: formData.gallery?.filter((_, i) => i !== idx),
                    })
                  }
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90">
            {isLoading ? "Đang lưu..." : "Lưu sự kiện"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Hủy
          </Button>
        </div>
      </form>

      {isCropModalOpen && (
        <ImageCropDialog
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          coverPreview={coverPreview}
          onCropComplete={handleCropComplete}
        />
      )}
    </Card>
  )
}
