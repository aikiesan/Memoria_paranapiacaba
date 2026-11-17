import { useState } from 'react'
import { Grid3x3, Lightbulb } from 'lucide-react'
import Quiz from '../components/Quiz.jsx'
import WordSearch from '../components/WordSearch.jsx'

export default function JogosTab() {
  const [sub, setSub] = useState('quiz')
  return (
    <div className="space-y-5 px-4 py-6">
      <div className="px-1">
        <h1 className="titulo-secao">
          <span className="traco-mao">Jogos da Ferrovia</span>
        </h1>
        <p className="mt-2 text-[17px] text-tinta-suave">Brinque, aprenda e desbloqueie memórias da Serra.</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 rounded-md border border-papel-borda bg-papel-escuro p-1" role="tablist">
        {[
          { id: 'quiz', label: 'Quiz', icon: Lightbulb },
          { id: 'caca', label: 'Caça-Palavras', icon: Grid3x3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={sub === id}
            onClick={() => setSub(id)}
            className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded px-2 text-[15px] font-bold leading-tight transition ${
              sub === id ? 'bg-papel-claro text-tijolo shadow-cartao' : 'text-tinta-suave hover:bg-papel'
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
