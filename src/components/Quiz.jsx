import { useState } from 'react'
import { ChevronRight, Lock, RotateCcw, Trophy, Unlock } from 'lucide-react'
import { QUIZ, VOCABULARIO } from '../data/content'
import { useStore } from '../lib/store.jsx'
import Illustration from './Illustration.jsx'
import Sheet from './Sheet.jsx'
import { useToast } from './Toast.jsx'

const vocabOf = (q) => VOCABULARIO.find((v) => v.id === q.vocab)

export default function Quiz() {
  const { state, actions } = useStore()
  const toast = useToast()
  const primeiraPendente = QUIZ.findIndex((q) => !state.quiz[q.id]?.acertou)
  const [idx, setIdx] = useState(primeiraPendente === -1 ? 0 : primeiraPendente)
  const [escolha, setEscolha] = useState(null)
  const [errou, setErrou] = useState([])
  const [desbloqueio, setDesbloqueio] = useState(null)
  const [memoria, setMemoria] = useState('')

  const q = QUIZ[idx]
  const v = vocabOf(q)
  const curiosidade = q.curiosidade || v?.curiosidade
  const gatilho = q.gatilho || v?.gatilho
  const acertadas = QUIZ.filter((x) => state.quiz[x.id]?.acertou).length
  const jaAcertou = state.quiz[q.id]?.acertou

  const responder = (i) => {
    if (escolha === q.correta || jaAcertou) return
    const ok = i === q.correta
    actions.answerQuiz(q.id, ok)
    setEscolha(i)
    if (ok) {
      setTimeout(() => setDesbloqueio(q), 450)
    } else {
      setErrou((e) => [...e, i])
    }
  }

  const proxima = () => {
    setEscolha(null)
    setErrou([])
    setIdx((i) => (i + 1) % QUIZ.length)
  }

  const salvarMemoria = () => {
    if (memoria.trim()) {
      actions.addQuizMemory(q.id, q.termo, memoria)
      toast('Memória guardada! Obrigado por contar 💛')
    }
    setMemoria('')
    setDesbloqueio(null)
  }

  return (
    <div className="space-y-4">
      {/* progresso */}
      <div className="flex items-center gap-3">
        <Trophy className="text-latao-escuro" size={26} />
        <div className="flex-1">
          <div className="flex justify-between text-base font-bold">
            <span>Memórias desbloqueadas</span>
            <span>
              {acertadas}/{QUIZ.length}
            </span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-papel-escuro">
            <div className="h-full rounded-full bg-latao transition-all" style={{ width: `${(acertadas / QUIZ.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Escolher pergunta">
        {QUIZ.map((x, i) => {
          const ok = state.quiz[x.id]?.acertou
          return (
            <button
              key={x.id}
              onClick={() => {
                setIdx(i)
                setEscolha(null)
                setErrou([])
              }}
              aria-label={`${x.termo}${ok ? ' (desbloqueada)' : ''}`}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 ${
                i === idx ? 'border-tijolo' : 'border-transparent'
              } ${ok ? 'bg-latao text-vagao-escuro' : 'bg-papel-escuro text-tinta-suave'}`}
            >
              {ok ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
          )
        })}
      </div>

      <article className="cartao overflow-hidden">
        <div className="relative">
          <Illustration name={q.ilustracao} title={q.termo} className="block aspect-[400/220] w-full" />
          <span className="absolute left-3 top-3 rounded-full bg-papel/95 px-3 py-1 font-maquina text-sm text-tinta">
            {idx + 1} de {QUIZ.length}
          </span>
        </div>
        <div className="space-y-3 p-4">
          <p className="font-maquina text-sm uppercase tracking-[0.15em] text-tijolo">{q.termo}</p>
          <h2 className="font-titulo text-2xl font-bold leading-tight text-vagao">{q.pergunta}</h2>
          <div className="grid gap-2">
            {q.opcoes.map((op, i) => {
              const certa = (escolha === q.correta || jaAcertou) && i === q.correta
              const errada = errou.includes(i)
              return (
                <button
                  key={i}
                  onClick={() => responder(i)}
                  disabled={errada}
                  className={`flex min-h-[60px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-lg font-bold transition ${
                    certa
                      ? 'border-vagao bg-vagao text-papel'
                      : errada
                        ? 'border-tijolo/40 bg-tijolo/5 text-tinta/50 line-through'
                        : 'border-papel-borda bg-white hover:border-vagao'
                  }`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-maquina ${certa ? 'bg-latao text-vagao-escuro' : 'bg-papel-escuro'}`}>
                    {certa ? '✓' : 'ABCD'[i]}
                  </span>
                  {op}
                </button>
              )
            })}
          </div>
          {errou.length > 0 && escolha !== q.correta && !jaAcertou && (
            <p className="rounded-xl bg-latao-claro/30 px-4 py-3 text-base font-bold" role="status">
              Quase! Tente outra opção — não tem pressa. 🙂
            </p>
          )}
          {(escolha === q.correta || jaAcertou) && (
            <div className="space-y-3">
              <p className="rounded-xl bg-vagao/10 px-4 py-3 text-base leading-relaxed">
                <strong>Isso mesmo!</strong> {curiosidade}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-contorno" onClick={() => setDesbloqueio(q)}>
                  Contar memória
                </button>
                <button className="btn-primario" onClick={proxima}>
                  Próxima <ChevronRight size={22} />
                </button>
              </div>
            </div>
          )}
        </div>
      </article>

      {acertadas === QUIZ.length && (
        <div className="cartao space-y-3 p-4 text-center">
          <p className="font-titulo text-xl font-bold text-vagao">🏆 Você desbloqueou todas as engenhocas da Serra!</p>
          <button
            className="btn-fantasma mx-auto"
            onClick={() => {
              actions.resetQuiz()
              setIdx(0)
              setEscolha(null)
              setErrou([])
            }}
          >
            <RotateCcw size={20} /> Jogar de novo
          </button>
        </div>
      )}

      <Sheet open={!!desbloqueio} onClose={() => setDesbloqueio(null)} title="Você desbloqueou essa memória!" icon={<Unlock className="text-latao-escuro" size={28} />}>
        {desbloqueio && (
          <div className="space-y-4">
            <div className="anim-carimbo mx-auto w-fit rounded-xl border-[3px] border-tijolo px-4 py-2 font-maquina text-lg uppercase text-tijolo">{desbloqueio.termo}</div>
            <p className="text-lg leading-relaxed">
              <strong>Alguém da sua família contava histórias sobre isso? Conta pra gente!</strong>
            </p>
            {gatilho && <p className="text-base italic text-tinta-suave">{gatilho}</p>}
            <label htmlFor="mem-quiz" className="sr-only">
              Sua memória
            </label>
            <textarea id="mem-quiz" rows={4} className="campo resize-none" value={memoria} onChange={(e) => setMemoria(e.target.value)} placeholder="Ex.: Meu tio contava que…" maxLength={1200} />
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-fantasma" onClick={() => setDesbloqueio(null)}>
                Agora não
              </button>
              <button className="btn-primario" onClick={salvarMemoria} disabled={!memoria.trim()}>
                Guardar memória
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
