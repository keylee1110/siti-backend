export const revalidate = 60;
import { getClubInfo, getPublishedEvents } from "@/lib/api"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import dynamic from 'next/dynamic'

const StatsSection = dynamic(() => import('@/components/stats-section').then(mod => mod.StatsSection))
const TabsSection = dynamic(() => import('@/components/tabs-section').then(mod => mod.TabsSection))
const EventsListSection = dynamic(() => import('@/components/events-list-section').then(mod => mod.EventsListSection))
const InfiniteScroller = dynamic(() => import('@/components/infinite-scroller').then(mod => mod.InfiniteScroller))
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
      label: "Hòa nhập",
      title: "",
      description:
        `SiTi là tập hợp những sinh viên hòa đồng, thân hiện, nhiệt huyết và luôn sẵn sàng đón nhận tất cả những <span class="text-pink-500">"tân binh"</span> sẽ đồng hành trong hành trình tạo ra những giá trị tích cực cho cộng đồng.`,
      image: "/hoanhap.png",
    },
    {
      id: "mission",
      label: "Trải nghiệm",
      title: "Sứ mệnh của chúng tôi",
      description:
        `Những hoạt động do SiTi định hướng tổ chức <span class="text-pink-500"> luôn dựa vào mục đích cộng đồng </span> với mục tiêu chung là mang lại những điều tích cực cho thành viên và xã hội.`,
      image: "/trainghiem.png",
    },
    {
      id: "impact",
      label: "Thực tế",
      title: "Tác động của chúng tôi",
      description:
        `Thành viên SiTi <span class="text-pink-500">"luôn đồng hành</span>, chia sẻ kiến thức, kinh nghiệm, và trải nghiệm. Mọi người <span class="text-pink-500">thẳng thắn</span> góp ý để cùng phát triển và đạt mục tiêu chung.`,
      image: "/thucte.png",
    },
    {
      id: "community",
      label: "Lan tỏa",
      title: "Cộng đồng SiTiGroup",
      description:
        `SiTiGroup là một <span class="text-pink-500">""Cộng đồng"</span> không phải một "Tổ chức", các thành viên luôn có cơ hội <span class="text-pink-500">chia sẻ</span> những điều tốt đẹp cho nhau và cùng nhau lan tỏa những điều tích cực đó đến với nhiều người hơn.`,
      image: "/lantoa.png",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection
          backgroundImage={club?.featuredImages?.[0]}
          subtitle="cùng Cộng đồng Sinh viên Tình nguyện SiTiGroup"
          quote={"Keep Loving by Sharing"}
        />

        <StatsSection />

        <TabsSection tabs={tabsData} />

        <section className="py-16 md:py-24">
          <InfiniteScroller
            images={[
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/536272863_1080626620911119_7447905397251531054_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/558192066_1112844611022653_592381328922229657_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/H%C3%A0nh%20tr%C3%ACnh%20hy%20v%E1%BB%8Dng%202025%20(1).jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/XYT%202024%20(2).jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/XYT%202024%20(8).jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/545798057_1086756573631457_3090809739295962483_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/L%E1%BB%9Bp%20h%E1%BB%8Dc%20t%C3%ACnh%20th%C6%B0%C6%A1ng%202024%20Spring%20(12).jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/540675378_1080626054244509_835715219157676819_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/H%C3%A0nh%20tr%C3%ACnh%20hy%20v%E1%BB%8Dng%202025%20(3).jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/558159489_1112844741022640_1976493473862023020_n.jpg",
            ]}
            direction="right"
          />
        </section>

        <EventsListSection events={events} />

        <section className="py-16 md:py-24">
          <InfiniteScroller
            images={[
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/536272863_1080626620911119_7447905397251531054_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/561595267_1112859784354469_4721643356762422356_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/H%C3%A0nh%20tr%C3%ACnh%20hy%20v%E1%BB%8Dng%202025%20(2).jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/1/545636935_1086757110298070_8396252798641870370_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/L%E1%BB%9Bp%20h%E1%BB%8Dc%20t%C3%ACnh%20th%C6%B0%C6%A1ng%202024%20Spring.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/556879944_1103540711953043_4826156978774986188_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/518742394_1045044754469306_843951881576860076_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/557933109_1112845174355930_8189570871197412941_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/558470398_1112844284356019_1106005238634030267_n.jpg",
              "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/slideshow/2/542109585_1080626000911181_3151581864008339212_n.jpg",
            ]}
          />
        </section>

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
