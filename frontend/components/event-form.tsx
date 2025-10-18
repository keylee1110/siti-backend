"use client"

import type React from "react"

import { useState } from "react"
import type { Event } from "@/lib/types"
import { createEvent, updateEvent, getPresignedUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: "coverImage" | "gallery") {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const presignResponse = await getPresignedUrl(file.name, file.type)
      if (presignResponse.error) {
        setError("Failed to get upload URL")
        return
      }

      const uploadUrl = presignResponse.data?.url
      const publicUrl = presignResponse.data?.publicUrl

      if (!uploadUrl || !publicUrl) {
        setError("Invalid upload response")
        return
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })

      if (!uploadResponse.ok) {
        setError("Failed to upload image")
        return
      }

      if (field === "coverImage") {
        setFormData({ ...formData, coverImage: publicUrl })
      } else {
        setFormData({
          ...formData,
          gallery: [...(formData.gallery || []), publicUrl],
        })
      }
    } catch (err) {
      setError("Upload failed")
    } finally {
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
    } catch (err) {
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
          {formData.coverImage && (
            <div className="mt-4">
              <img
                src={formData.coverImage || "/placeholder.svg"}
                alt="Cover"
                className="w-full h-48 object-cover rounded-lg"
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
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Gallery ${idx}`}
                    className="w-full h-24 object-cover rounded-lg"
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
