import { getClubInfo, getPublishedEvents } from "@/lib/api"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { TabsSection } from "@/components/tabs-section"
import { EventsListSection } from "@/components/events-list-section"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const clubResponse = await getClubInfo()
  const club = clubResponse.data

  const eventsResponse = await getPublishedEvents(0, 6)
  const events = eventsResponse.data?.content || []

  const tabsData = [
    {
      id: "about",
      label: "Về chúng tôi",
      title: "Giới thiệu SiTiGroup",
      description:
        "SiTiGroup là một tổ chức phi lợi nhuận tập trung vào việc hỗ trợ các hoàn cảnh khó khăn và tạo tác động tích cực cho cộng đồng. Chúng tôi tin rằng mỗi hành động nhỏ có thể tạo nên sự thay đổi lớn.",
      image: "/about-club.jpg",
    },
    {
      id: "mission",
      label: "Sứ mệnh",
      title: "Sứ mệnh của chúng tôi",
      description:
        "Chúng tôi cam kết kết nối những người có tâm huyết, phát triển các chương trình hỗ trợ bền vững, và tạo ra những cơ hội để mọi người có thể đóng góp cho cộng đồng.",
      image: "/mission-control.png",
    },
    {
      id: "impact",
      label: "Tác động",
      title: "Tác động của chúng tôi",
      description:
        "Qua các năm hoạt động, chúng tôi đã hỗ trợ hàng chục nghìn hoàn cảnh khó khăn, gây dựng quỹ từ thiện lớn, và xây dựng một cộng đồng mạnh mẽ.",
      image: "/impact.png",
    },
    {
      id: "community",
      label: "Cộng đồng",
      title: "Cộng đồng SiTiGroup",
      description:
        "Cộng đồng của chúng tôi bao gồm những tình nguyện viên, nhà tài trợ, và những người tin tưởng vào sức mạnh của sự kết nối và chia sẻ.",
      image: "/diverse-community-gathering.png",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection
          backgroundImage={club?.featuredImages?.[0]}
          subtitle={club?.mission || "cùng Cộng đồng Sinh viên Tình nguyện SiTiGroup"}
          quote={"Keep Loving by Sharing"}
        />

        <StatsSection />

        <TabsSection tabs={tabsData} />

        <EventsListSection events={events} />

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Cùng SiTi chia sẻ yêu thương</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Hãy theo dõi các sự kiện sắp tới của chúng mình và trở thành một phần của cộng đồng SiTiGroup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button size="lg" variant="secondary">
                  Xem tất cả sự kiện
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  Liên hệ với chúng tôi
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
