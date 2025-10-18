"use client"

interface HeroSectionProps {
  clubName: string
  backgroundImage?: string
  subtitle?: string
  quote?: string
}

export function HeroSection({
  clubName,
  backgroundImage,
  subtitle = "cùng Cộng đồng Sinh viên Tính nguyện SiTiGroup",
  quote = "Keep Loving By Sharing",
}: HeroSectionProps) {
  const handleScrollDown = () => {
    const statsSection = document.getElementById("stats-section")
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const defaultBackground =
    "https://pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev/%E1%BA%A2nh%20t%E1%BA%ADp%20th%E1%BB%83%2071.jpg"

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage || defaultBackground})`,
      }}
    >
      {/* Lớp 1: đen → trong suốt (dịu hơn) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Lớp 2: trong suốt → hồng (bắt đầu sớm hơn, nhẹ hơn) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(225,29,72,0) 0%, rgba(225,29,72,0.35) 40%, rgba(225,29,72,0.45) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4">
        {/* Part 1: Main Heading */}
        <div className="text-center mb-16 w-full flex flex-col items-center">
          {/* Small text above */}
          <p className="text-lg md:text-xl text-white/80 mb-4 font-light tracking-wide">HÀNH TRÌNH</p>

          {/* Large heading with accent color */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white text-balance leading-tight mb-6 mx-auto">
            <span className="text-white">16</span>
            <span className="text-pink-500 mx-2">NĂM</span>
            <span className="text-white">LAN TỎA</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-white/90 text-balance max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Chevron down indicator */}
        <div
          className="mb-8 animate-bounce cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleScrollDown}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleScrollDown()}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Part 2: Quote Section */}
      <div className="relative z-10 pb-12 text-center">
        <p className="text-2xl md:text-3xl text-white italic font-light">{quote}</p>
      </div>
    </section>
  )
}
