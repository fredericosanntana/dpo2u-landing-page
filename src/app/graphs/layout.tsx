import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zettelkasten Knowledge Graph | DPO2U',
  description: 'Visualização interativa do grafo de conhecimento DPO2U com 747 notas e 124 conexões.',
  keywords: ['zettelkasten', 'knowledge graph', 'visualização', 'dpo2u', 'pkm'],
  openGraph: {
    title: 'Zettelkasten Knowledge Graph | DPO2U',
    description: 'Explore conexões de conhecimento em tempo real',
    type: 'website',
  },
}

export default function GraphsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2523ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      {children}
    </div>
  )
}