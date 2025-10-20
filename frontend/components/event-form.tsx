"use client"

import type React from "react"

import { useState } from "react"
import type { Event } from "@/lib/types"
import { createEvent, updateEvent, getPresignedUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface EventFormProps {
  event?: Event
  onSuccess: () => void
  onCancel: () => void
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: "coverImage" | "gallery") {
    console.log("handleImageUpload called", { field });
    const file = e.target.files?.[0]
    if (!file) {
      console.log("No file selected");
      return
    }
    console.log("File selected:", file);

    setUploadingImage(true)
    setError(null)

    // Create a temporary local URL for immediate preview
    const tempPreviewUrl = URL.createObjectURL(file)
    if (field === "coverImage") {
      setCoverPreview(tempPreviewUrl)
    }

    try {
      console.log("Getting presigned URL...");
      const presignResponse = await getPresignedUrl(file.name, file.type)
      console.log("Presign response:", presignResponse);

      if (presignResponse.error || !presignResponse.data?.url || !presignResponse.data?.publicUrl) {
        console.error("Failed to get presigned URL:", presignResponse.error);
        setError(presignResponse.error?.message || "Failed to get upload URL")
        if (field === "coverImage") setCoverPreview(null) // Clear preview on error
        return
      }

      const { url: uploadUrl, publicUrl } = presignResponse.data
      console.log("Uploading to:", uploadUrl);

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })
      console.log("Upload response:", uploadResponse);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error("Image upload failed:", errorText)
        setError(`Failed to upload image: ${uploadResponse.statusText}.`)
        if (field === "coverImage") setCoverPreview(null) // Clear preview on error
        return
      }

      console.log("Upload successful, public URL:", publicUrl);

      // Clean up the temporary URL
      URL.revokeObjectURL(tempPreviewUrl)

      if (field === "coverImage") {
        setFormData({ ...formData, coverImage: publicUrl })
        setCoverPreview(null) // Clear preview state
      } else {
        setFormData({
          ...formData,
          gallery: [...(formData.gallery || []), publicUrl],
        })
      }
    } catch (err: any) {
      console.error("An error occurred during upload:", err);
      setError(err.message || "An unexpected error occurred during upload.")
      if (field === "coverImage") setCoverPreview(null) // Clear preview on error
    } finally {
      console.log("Finished handleImageUpload");
      setUploadingImage(false)
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
              type="datetime-local"
              required
              value={formData.startAt ? new Date(formData.startAt).toISOString().slice(0, 16) : ""}
              onChange={(e) => setFormData({ ...formData, startAt: new Date(e.target.value).toISOString() })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngày kết thúc</label>
            <input
              type="datetime-local"
              value={formData.endAt ? new Date(formData.endAt).toISOString().slice(0, 16) : ""}
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
          {(coverPreview || formData.coverImage) && (
            <div className="relative mt-4 w-full h-48 overflow-hidden rounded-lg">
              <Image
                src={coverPreview || formData.coverImage || "/placeholder.svg"}
                alt="Cover"
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
            onChange={(e) => handleImageUpload(e, "gallery")}
            disabled={uploadingImage}
            className="w-full px-4 py-2 border border-border rounded-lg"
          />
          {formData.gallery && formData.gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.gallery.map((image, idx) => (
                <div key={idx} className="relative">
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
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
    </Card>
  )
}
