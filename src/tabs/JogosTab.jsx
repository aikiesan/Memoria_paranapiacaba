import { useState } from 'react'
import { Grid3x3, Lightbulb } from 'lucide-react'
import Quiz from '../components/Quiz.jsx'
import WordSearch from '../components/WordSearch.jsx'

export default function JogosTab() {
  const [sub, setSub] = useState('quiz')
  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="titulo-secao">Jogos da Ferrovia</h1>
        <p className="mt-0.5 text-[15px] text-tinta-suave">Brinque, aprenda e desbloqueie memórias da Serra.</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-papel-escuro p-1" role="tablist">
        {[
          { id: 'quiz', label: 'Quiz', icon: Lightbulb },
          { id: 'caca', label: 'Caça-Palavras', icon: Grid3x3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={sub === id}
            onClick={() => setSub(id)}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-2 text-[14px] font-bold leading-tight transition ${
              sub === id ? 'bg-vagao text-papel shadow' : 'text-tinta-suave hover:bg-papel'
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>
      {sub === 'quiz' ? <Quiz /> : <WordSearch />}
    </div>
  )
}
