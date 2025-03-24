import { Header } from "@/components/Header"
import { WorldGame } from "@/components/WorldGame"
import { theme } from "@/config/theme"

export default function WorldPage() {
  return (
    <div style={{ backgroundColor: theme.colors.background }} className="min-h-screen">
      <Header theme={theme} />
      <main className="container mx-auto p-4">
        <WorldGame />
      </main>
    </div>
  )
}

