import { useState } from 'react'
import { Grid3x3, Lightbulb } from 'lucide-react'
import Quiz from '../components/Quiz.jsx'
import WordSearch from '../components/WordSearch.jsx'

export default function JogosTab() {
  const [sub, setSub] = useState('quiz')
  return (
    <div className="space-y-5 px-4 py-5">
      <div>
        <h1 className="titulo-secao">Jogos da Ferrovia</h1>
        <p className="mt-1 text-lg text-tinta-suave">Brinque, aprenda e desbloqueie memórias da Serra.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-papel-escuro p-1.5" role="tablist">
        {[
          { id: 'quiz', label: 'Quiz das Engenhocas', icon: Lightbulb },
          { id: 'caca', label: 'Caça-Palavras', icon: Grid3x3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={sub === id}
            onClick={() => setSub(id)}
            className={`flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-2 text-base font-bold leading-tight transition ${
              sub === id ? 'bg-vagao text-papel shadow' : 'text-tinta-suave hover:bg-papel'
            }`}
          >
            <Icon size={22} /> {label}
          </button>
        ))}
      </div>
      {sub === 'quiz' ? <Quiz /> : <WordSearch />}
    </div>
  )
}
