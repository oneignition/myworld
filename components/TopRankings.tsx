import Image from "next/image"
import { FlowerIcon as Rose } from "lucide-react"
import { theme } from "@/config/theme"

interface Ranking {
  rank: number
  song: string
  artist: string
  roses: number
  image: string
}

export function TopRankings({ rankings }: { rankings: Ranking[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Top Rankings</h2>
      {rankings.map((ranking) => (
        <div key={ranking.rank} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-lg">{ranking.rank}</span>
            <Image
              src={ranking.image}
              alt={`${ranking.artist} - ${ranking.song}`}
              width={40}
              height={40}
              className="rounded-md"
            />
            <div>
              <p className="font-semibold">{ranking.song}</p>
              <p className="text-sm text-gray-600">{ranking.artist}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Rose className="h-4 w-4" style={{ color: theme.colors.accent }} />
            <span>{ranking.roses.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

