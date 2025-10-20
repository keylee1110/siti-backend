import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const faqTopics = [
  {
    title: "Tổng quan về SiTiGroup",
    questions: [
      {
        question: "Tên đầy đủ của SiTiGroup là gì?",
        answer: ["Tên đầy đủ của câu lạc bộ là \"Câu lạc bộ tổ chức hoạt động xã hội vì cộng đồng trường Đại học FPT phân hiệu Hồ Chí Minh - Cộng đồng Sinh viên Tình nguyện SiTiGroup\". Bạn cũng có thể gọi chúng tôi là SiTiGroup hoặc SiTi."],
      },
      {
        question: "SiTiGroup có phải là một câu lạc bộ từ thiện không?",
        answer: ["Không. SiTiGroup là một câu lạc bộ chuyên tổ chức các hoạt động xã hội, không phải là câu lạc bộ thiện nguyện, câu lạc bộ từ thiện hay tổ chức từ thiện. Chúng tôi tập trung vào việc tạo ra các hoạt động ý nghĩa và lan tỏa giá trị tích cực đến cộng đồng."],
      },
      {
        question: "SiTiGroup được thành lập khi nào và với mục đích gì?",
        answer: ["SiTiGroup được thành lập vào ngày 15/07/2009 bởi anh Lê Anh Bảo. Mục đích của câu lạc bộ là kết nối những sinh viên năng nổ và nhiệt huyết để cùng nhau tham gia các hoạt động mang lại lợi ích cho cộng đồng và xã hội."],
      },
      {
        question: "Hiện tại SiTiGroup có bao nhiêu thành viên?",
        answer: ["Tính đến thời điểm hiện tại, SiTiGroup có hon 100 thành viên."],
      },
    ],
  },
  {
    title: "Cơ cấu và Hoạt động",
    questions: [
      {
        question: "SiTiGroup có những ban nào?",
        answer: [
          "SiTiGroup có 5 ban chính, mỗi ban có một vai trò riêng:",
          "- Ban Nhân sự: Tổ chức hoạt động nội bộ và chăm lo đời sống tinh thần cho thành viên.",
          "- Ban Kế hoạch: Lên ý tưởng và chuẩn bị cho các hoạt động.",
          "- Ban Truyền thông: Quảng bá thông tin và lan tỏa thông điệp của các hoạt động.",
          "- Ban Thiết kế: \"Hình ảnh hóa\" các ý tưởng, hỗ trợ Ban Truyền thông.",
          "- Ban Hậu cần: Hiện thực hóa các ý tưởng và chịu trách nhiệm vận hành hoạt động.",
        ],
      },
      {
        question: "Hoạt động chính của SiTiGroup là gì?",
        answer: ["SiTiGroup tập trung vào việc phát triển các hoạt động xã hội để lan tỏa những điều bổ ích đến cộng đồng, đặc biệt là các hoạt động liên quan đến giáo dục, nâng cao sức khỏe và tinh thần, và giúp đỡ những hoàn cảnh khó khăn."],
      },
    ],
  },
  {
    title: "Trở thành thành viên",
    questions: [
      {
        question: "Làm thế nào để trở thành một thành viên của SiTiGroup?",
        answer: ["Bạn chỉ cần điền form đăng ký trên trang chủ hoặc các đợt mở tuyển chính thức của nhóm. Sau khi trải qua các vòng phỏng vấn và thử thách, bạn sẽ trở thành thành viên chính thức."],
      },
      {
        question: "Những tiêu chí về \"tinh thần\" để tham gia SiTiGroup là gì?",
        answer: ["Bạn cần có tinh thần vui vẻ, sẵn sàng đón nhận, năng động, nhiệt huyết, có mong muốn tham gia tổ chức hoạt động cộng đồng và có trách nhiệm với công việc mình nhận."],
      },
      {
        question: "Tôi có cần kỹ năng đặc biệt để tham gia SiTiGroup không?",
        answer: ["Không bắt buộc! SiTiGroup luôn chào đón những bạn có tinh thần ham học hỏi. Khi bạn tham gia và chọn được ban phù hợp, bạn sẽ được hướng dẫn và đào tạo những kỹ năng cần thiết để phát triển bản thân."],
      },
    ],
  },
  {
    title: "Quyền lợi & trách nhiệm",
    questions: [
      {
        question: "Thành viên nhận được quyền lợi gì khi tham gia?",
        answer: [
          "- Cơ hội phát triển kỹ năng thực tế (lên kế hoạch, quản lý dự án, truyền thông, teamwork, chạy sự kiện).",
          "- Được tham gia vào các dự án thật, có chứng nhận và giới thiệu uy tín.",
          "- Môi trường thân thiện, nhiều cơ hội giao lưu và học hỏi.",
        ],
      },
      {
        question: "Thành viên cần tuân thủ những quy định nào?",
        answer: [
          "- Tham gia đầy đủ các buổi họp, hoạt động theo lịch.",
          "- Hoàn thành nhiệm vụ đúng deadline.",
          "- Giữ thái độ tôn trọng và hỗ trợ lẫn nhau.",
        ],
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center">Câu hỏi thường gặp (FAQ)</h1>
            
            <div className="space-y-12">
              {faqTopics.map((topic, topicIndex) => (
                <div key={topicIndex}>
                  <h2 className="text-2xl font-bold mb-6 border-b pb-2">{topic.title}</h2>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {topic.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${topicIndex}-${faqIndex}`} className="border rounded-lg bg-primary/10">
                        <AccordionTrigger className="text-lg text-left font-semibold px-6 py-4 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base space-y-3 p-6 pt-0">
                          {faq.answer.map((line, lineIndex) => (
                            <p key={lineIndex}>{line}</p>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}