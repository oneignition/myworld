import { Header } from "@/components/Header"
import { theme } from "@/config/theme"
import { FlowerIcon as Rose } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { startOfWeek, endOfWeek, subWeeks, format } from "date-fns"
import { TopRankings } from "@/components/TopRankings"

// This would typically come from an API or database
const currentWeekSongs = Array.from({ length: 20 }, (_, i) => ({
  rank: i + 1,
  song: `Song ${Math.floor(Math.random() * 100) + 1}`,
  artist: `Artist ${Math.floor(Math.random() * 50) + 1}`,
  roses: Math.floor(Math.random() * 10000) + 1000,
  image: "/placeholder.svg",
}))
  .sort((a, b) => b.roses - a.roses)
  .map((song, index) => ({ ...song, rank: index + 1 }))

const previousWeeksTopSongs = Array.from({ length: 5 }, (_, i) => {
  const endDate = endOfWeek(subWeeks(new Date(), i + 1), { weekStartsOn: 1 })
  const startDate = startOfWeek(endDate, { weekStartsOn: 1 })
  return {
    week: format(startDate, "MMM d") + " - " + format(endDate, "MMM d, yyyy"),
    song: `Top Song ${i + 1}`,
    artist: `Top Artist ${i + 1}`,
    roses: Math.floor(Math.random() * 50000) + 10000,
    image: "/placeholder.svg",
  }
})

export default function RankingsPage() {
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const currentWeekStart = startOfWeek(currentWeekEnd, { weekStartsOn: 1 })
  const currentWeek = format(currentWeekStart, "MMM d") + " - " + format(currentWeekEnd, "MMM d, yyyy")

  return (
    <div style={{ backgroundColor: theme.colors.background }} className="min-h-screen">
      <Header theme={theme} />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Rankings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-4">This Week's Top 20 ({currentWeek})</h2>
            <TopRankings rankings={currentWeekSongs} />
          </div>

          <div className="md:w-80">
            <h2 className="text-2xl font-bold mb-4">Previous Weeks No.1</h2>
            {previousWeeksTopSongs.map((song, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 relative">
                      <Image
                        src={song.image}
                        alt={`${song.artist} - ${song.song}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold">{song.song}</div>
                      <div className="text-xs text-gray-500">{song.artist}</div>
                      <div className="text-xs text-gray-500">{song.week}</div>
                      <div className="flex items-center mt-1">
                        <Rose className="h-4 w-4 mr-1" style={{ color: theme.colors.accent }} />
                        <span className="text-sm font-semibold">{song.roses.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

