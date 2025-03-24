import { Header } from "@/components/Header"
import { theme } from "@/config/theme"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FlowerIcon as Rose } from "lucide-react"

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: theme.colors.background }} className="min-h-screen">
      <Header theme={theme} />
      <main className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">About Roses</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">Welcome to Roses, your vibrant hub for K-pop music discovery and celebration!</p>
            <div className="flex justify-center space-x-8">
              <div className="flex flex-col items-center">
                <Rose className="h-8 w-8 mb-2" style={{ color: theme.colors.accent }} />
                <h3 className="font-semibold">Discover</h3>
                <p className="text-sm">Find new K-pop hits</p>
              </div>
              <div className="flex flex-col items-center">
                <Rose className="h-8 w-8 mb-2" style={{ color: theme.colors.accent }} />
                <h3 className="font-semibold">Connect</h3>
                <p className="text-sm">Join the community</p>
              </div>
              <div className="flex flex-col items-center">
                <Rose className="h-8 w-8 mb-2" style={{ color: theme.colors.accent }} />
                <h3 className="font-semibold">Celebrate</h3>
                <p className="text-sm">Support your favorites</p>
              </div>
            </div>
            <p>
              Roses is more than just rankings - it's a platform where every fan's voice matters. Join us in shaping the
              future of K-pop discovery!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

