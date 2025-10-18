interface StatItem {
  label: string
  value: string
}

interface StatsSectionProps {
  stats?: StatItem[]
}

export function StatsSection({ stats }: StatsSectionProps) {
  const defaultStats: StatItem[] = [
    { label: "Hoàn cảnh khó khăn được hỗ trợ", value: "10.000+" },
    { label: "Yêu thương được sẻ chia", value: "50.000+" },
    { label: "Quỹ được gây dựng", value: "500+ triệu" },
  ]

  const displayStats = stats || defaultStats

  // Bạn có thể trộn mã màu và class Tailwind
  const statColors = ["#145098", "#f17228", "#53b54d"]

  return (
    <section id="stats-section" className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayStats.map((stat, idx) => {
            const color = statColors[idx % statColors.length]
            const isHex = color.startsWith("#")

            return (
              <div key={idx} className="text-center flex flex-col items-center justify-center">
                <div
                  className={`text-4xl md:text-5xl font-bold mb-3 ${!isHex ? color : ""}`}
                  style={isHex ? { color } : {}}
                >
                  {stat.value}
                </div>
                <p className="text-lg text-muted-foreground">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
