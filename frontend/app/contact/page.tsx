import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PartnerInquiryForm } from "@/components/partner-inquiry-form"

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-lg text-muted-foreground">
              Bạn có câu hỏi hoặc muốn hợp tác? Hãy liên hệ với chúng tôi ngay hôm nay.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a href="mailto:sitigroup.fptuhcm@gmail.com" className="text-primary hover:underline">
                      sitigroup.fptuhcm@gmail.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Điện thoại</h3>
                    <a href="tel:+84915883688" className="text-primary hover:underline">
                      +84 (0) 915 883 688
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Giờ làm việc</h3>
                    <p className="text-muted-foreground">
                      Thứ Hai - Thứ Sáu: 9:00 - 18:00
                      <br />
                      Thứ Bảy và Chủ Nhật: 10:00 - 16:00
                    </p>
                  </div>
                </div>
              </div>

              <PartnerInquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
