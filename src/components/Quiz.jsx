import { useState } from 'react'
import { ChevronRight, Lock, RotateCcw, Trophy, Unlock } from 'lucide-react'
import { QUIZ, VOCABULARIO } from '../data/content'
import { useStore } from '../lib/store.jsx'
import Foto from './Foto.jsx'
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
      toast('Memória guardada! Obrigado por contar.')
    }
    setMemoria('')
    setDesbloqueio(null)
  }

  return (
    <div className="space-y-4">
      {/* progresso */}
      <div className="flex items-center gap-3">
        <Trophy className="text-tijolo" size={22} />
        <div className="flex-1">
          <div className="flex justify-between text-[14px] font-bold">
            <span>Memórias desbloqueadas</span>
            <span>
              {acertadas}/{QUIZ.length}
            </span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-sm border border-papel-borda bg-papel-escuro">
            <div className="h-full bg-tijolo transition-all" style={{ width: `${(acertadas / QUIZ.length) * 100}%` }} />
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
                i === idx ? 'border-tijolo ring-2 ring-tijolo/30' : 'border-dashed border-tinta/30'
              } ${ok ? 'bg-tijolo text-papel-claro' : 'bg-papel-claro text-tinta-suave'}`}
            >
              {ok ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
          )
        })}
      </div>

      <article className="space-y-4">
        <Foto key={q.id} lugar={`quiz:${q.id}`} giro={idx % 2 ? 0.8 : -0.9} />
        <div className="cartao space-y-3 p-4">
          <p className="flex items-baseline justify-between gap-2">
            <span className="font-mao text-[18px] text-tijolo">{q.termo}</span>
            <span className="font-maquina text-[13px] text-tinta-suave">
              {idx + 1} de {QUIZ.length}
            </span>
          </p>
          <h2 className="font-titulo text-[1.4rem] font-extrabold leading-tight text-vagao">{q.pergunta}</h2>
          <div className="grid gap-2">
            {q.opcoes.map((op, i) => {
              const certa = (escolha === q.correta || jaAcertou) && i === q.correta
              const errada = errou.includes(i)
              return (
                <button
                  key={i}
                  onClick={() => responder(i)}
                  disabled={errada}
                  className={`flex min-h-[56px] items-center gap-2.5 rounded-md border-2 px-3 py-2 text-left text-[16px] font-bold leading-snug transition ${
                    certa
                      ? 'border-vagao bg-vagao text-papel-claro'
                      : errada
                        ? 'border-tijolo/40 bg-tijolo/5 text-tinta/50 line-through'
                        : 'border-papel-borda bg-white hover:border-vagao'
                  }`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-maquina ${certa ? 'bg-latao text-vagao-escuro' : 'bg-papel-escuro'}`}>
                    {certa ? '✓' : 'ABCD'[i]}
                  </span>
                  {op}
                </button>
              )
            })}
          </div>
          {errou.length > 0 && escolha !== q.correta && !jaAcertou && (
            <p className="rounded-md bg-latao-claro/30 px-3 py-2 text-[16px] font-bold" role="status">
              Quase! Tente outra opção, não tem pressa.
            </p>
          )}
          {(escolha === q.correta || jaAcertou) && (
            <div className="space-y-3">
              <p className="rounded-md bg-vagao/10 px-3 py-2.5 text-[16px] leading-relaxed">
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
          <p className="font-titulo text-[1.25rem] font-extrabold text-vagao">Você desbloqueou todas as engenhocas da Serra!</p>
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
            <div className="anim-carimbo mx-auto w-fit rounded-md border-[3px] border-double border-tijolo px-4 py-2 font-maquina text-lg uppercase text-tijolo">{desbloqueio.termo}</div>
            <p className="text-[16px] leading-relaxed">
              <strong>Alguém da sua família contava histórias sobre isso? Conta pra gente!</strong>
            </p>
            {gatilho && <p className="text-[14px] italic text-tinta-suave">{gatilho}</p>}
            <label htmlFor="mem-quiz" className="sr-only">
              Sua memória
            </label>
            <textarea id="mem-quiz" rows={4} className="campo-pautado resize-none" value={memoria} onChange={(e) => setMemoria(e.target.value)} placeholder="Ex.: Meu tio contava que…" maxLength={1200} />
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
