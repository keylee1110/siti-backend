"use client"

import type React from "react"

import { useState } from "react"
import { submitPartnerInquiry } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function PartnerInquiryForm() {
  const [formData, setFormData] = useState({
    orgName: "",
    contactEmail: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await submitPartnerInquiry(formData)
      if (response.error) {
        setError(response.error.message)
      } else {
        setSuccess(true)
        setFormData({ orgName: "", contactEmail: "", message: "" })
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch {
      setError("Gửi yêu cầu thất bại. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-6">Gửi yêu cầu hợp tác</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Cảm ơn bạn! Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm.
        </div>
      )}

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="orgName" className="block text-sm font-medium mb-2">
            Tên tổ chức
          </label>
          <input
            id="orgName"
            type="text"
            required
            value={formData.orgName}
            onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tên công ty hoặc tổ chức của bạn"
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium mb-2">
            Email liên hệ
          </label>
          <input
            id="contactEmail"
            type="email"
            required
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Tin nhắn
          </label>
          <textarea
            id="message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Hãy cho chúng tôi biết về yêu cầu hợp tác của bạn..."
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
          {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
        </Button>
      </form>
    </Card>
  )
}
