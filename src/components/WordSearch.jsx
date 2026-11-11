import { useMemo, useRef, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { PALAVRAS, SENTIMENTOS } from '../data/content'
import { useStore } from '../lib/store.jsx'
import Sheet from './Sheet.jsx'
import { useToast } from './Toast.jsx'

const N = 10
// Só direções "de leitura" (direita, baixo e diagonal) para facilitar a vida de quem joga.
const DIRS = [
  [0, 1],
  [1, 0],
  [1, 1],
]
const LETRAS = 'AAABCCDEEEFGHIIJLMNOOOPQRRSSTTUUVZ'

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gerarGrade(seed) {
  for (let s = seed; s < seed + 200; s++) {
    const rnd = mulberry32(s)
    const grid = Array.from({ length: N }, () => Array(N).fill(null))
    const posicoes = {}
    const palavras = [...PALAVRAS].sort((a, b) => b.palavra.length - a.palavra.length)
    let ok = true
    for (const { palavra } of palavras) {
      let colocada = false
      for (let t = 0; t < 400 && !colocada; t++) {
        const [dr, dc] = DIRS[Math.floor(rnd() * DIRS.length)]
        const maxR = N - (dr ? palavra.length : 1)
        const maxC = N - (dc ? palavra.length : 1)
        if (maxR < 0 || maxC < 0) continue
        const r0 = Math.floor(rnd() * (maxR + 1))
        const c0 = Math.floor(rnd() * (maxC + 1))
        let cabe = true
        for (let i = 0; i < palavra.length; i++) {
          const ch = grid[r0 + dr * i][c0 + dc * i]
          if (ch && ch !== palavra[i]) {
            cabe = false
            break
          }
        }
        if (!cabe) continue
        const cells = []
        for (let i = 0; i < palavra.length; i++) {
          grid[r0 + dr * i][c0 + dc * i] = palavra[i]
          cells.push(`${r0 + dr * i}-${c0 + dc * i}`)
        }
        posicoes[palavra] = cells
        colocada = true
      }
      if (!colocada) {
        ok = false
        break
      }
    }
    if (!ok) continue
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!grid[r][c]) grid[r][c] = LETRAS[Math.floor(rnd() * LETRAS.length)]
    return { grid, posicoes }
  }
  throw new Error('Não foi possível montar o caça-palavras')
}

function linha(a, b) {
  const [r1, c1] = a
  const [r2, c2] = b
  const dr = Math.sign(r2 - r1)
  const dc = Math.sign(c2 - c1)
  const len = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1))
  if (!(r1 === r2 || c1 === c2 || Math.abs(r2 - r1) === Math.abs(c2 - c1))) return null
  return Array.from({ length: len + 1 }, (_, i) => [r1 + dr * i, c1 + dc * i])
}

export default function WordSearch() {
  const { state, actions } = useStore()
  const toast = useToast()
  const { grid, posicoes } = useMemo(() => gerarGrade(1867), [])
  const [inicio, setInicio] = useState(null)
  const [hover, setHover] = useState(null)
  const [achada, setAchada] = useState(null)
  const [comentario, setComentario] = useState('')
  const [sentimento, setSentimento] = useState(null)
  const arrastando = useRef(false)

  const encontradas = state.wordFinds
  const celulasAchadas = new Set(Object.keys(encontradas).flatMap((w) => posicoes[w] || []))
  const selecao = inicio && hover ? linha(inicio, hover) || [inicio] : inicio ? [inicio] : []
  const selSet = new Set(selecao.map(([r, c]) => `${r}-${c}`))

  const verificar = (a, b) => {
    const cells = linha(a, b)
    if (!cells) return false
    const texto = cells.map(([r, c]) => grid[r][c]).join('')
    const rev = texto.split('').reverse().join('')
    const item = PALAVRAS.find((p) => p.palavra === texto || p.palavra === rev)
    if (!item) return false
    const chave = cells.map(([r, c]) => `${r}-${c}`)
    const alvo = posicoes[item.palavra]
    const mesmo = alvo.length === chave.length && (alvo.every((x, i) => x === chave[i]) || alvo.every((x, i) => x === chave[chave.length - 1 - i]))
    if (!mesmo) return false
    if (!encontradas[item.palavra]) {
      actions.saveWordFind(item.palavra, {})
      setSentimento(null)
      setComentario('')
      setAchada(item)
    } else {
      toast(`Você já encontrou ${item.rotulo}!`)
    }
    return true
  }

  const cellFromEvent = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const rc = el?.dataset?.rc
    return rc ? rc.split('-').map(Number) : null
  }

  const onDown = (e) => {
    const rc = cellFromEvent(e)
    if (!rc) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    arrastando.current = true
    if (inicio && (inicio[0] !== rc[0] || inicio[1] !== rc[1])) {
      // segundo toque: tenta fechar a palavra
      if (!verificar(inicio, rc)) toast('Hmm, essa não é uma das palavras. Tente de novo!')
      setInicio(null)
      setHover(null)
      arrastando.current = false
      return
    }
    setInicio(rc)
    setHover(rc)
  }
  const onMove = (e) => {
    if (!arrastando.current || !inicio) return
    const rc = cellFromEvent(e)
    if (rc) setHover(rc)
  }
  const onUp = (e) => {
    if (!arrastando.current) return
    arrastando.current = false
    const rc = cellFromEvent(e) || hover
    if (inicio && rc && (rc[0] !== inicio[0] || rc[1] !== inicio[1])) {
      if (verificar(inicio, rc)) {
        setInicio(null)
        setHover(null)
      } else {
        setInicio(null)
        setHover(null)
        toast('Hmm, essa não é uma das palavras. Tente de novo!')
      }
    }
    // toque simples: mantém a primeira letra marcada e espera o segundo toque
  }

  const total = PALAVRAS.length
  const qtd = Object.keys(encontradas).length

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed">
        Toque na <strong>primeira</strong> e depois na <strong>última letra</strong> da palavra (ou arraste o dedo). As palavras estão na horizontal,
        vertical ou diagonal.
      </p>

      <div
        className="mx-auto grid w-full max-w-[380px] touch-none select-none gap-[3px] rounded-2xl border-4 border-vagao bg-vagao p-[6px]"
        style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => {
          arrastando.current = false
        }}
        role="grid"
        aria-label="Caça-palavras ferroviário"
      >
        {grid.map((row, r) =>
          row.map((ch, c) => {
            const k = `${r}-${c}`
            const sel = selSet.has(k)
            const achou = celulasAchadas.has(k)
            return (
              <div
                key={k}
                data-rc={k}
                role="gridcell"
                className={`grid aspect-square place-items-center rounded-md font-maquina text-[clamp(1rem,4.6vw,1.35rem)] font-bold transition-colors ${
                  sel ? 'scale-105 bg-tijolo text-papel' : achou ? 'bg-latao text-vagao-escuro' : 'bg-papel text-tinta'
                }`}
              >
                {ch}
              </div>
            )
          }),
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-base font-bold">
          Encontradas: {qtd}/{total}
        </p>
        {inicio && (
          <button
            className="btn-fantasma min-h-[44px] px-3 text-sm"
            onClick={() => {
              setInicio(null)
              setHover(null)
            }}
          >
            Desmarcar letra
          </button>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {PALAVRAS.map((p) => {
          const ok = !!encontradas[p.palavra]
          return (
            <li key={p.palavra}>
              <button
                disabled={!ok}
                onClick={() => {
                  setSentimento(encontradas[p.palavra]?.sentimento || null)
                  setComentario(encontradas[p.palavra]?.comentario || '')
                  setAchada(p)
                }}
                className={`flex min-h-[40px] w-full items-center gap-2 rounded-lg border-2 px-2.5 text-left font-maquina text-[14px] ${
                  ok ? 'border-latao bg-latao-claro/30 text-vagao-escuro' : 'border-papel-borda bg-white text-tinta'
                }`}
              >
                {ok ? <Check size={20} className="text-vagao" /> : <span className="w-5" />}
                <span className={ok ? 'line-through decoration-2' : ''}>{p.palavra}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {qtd === total && (
        <div className="cartao space-y-2 p-4 text-center">
          <p className="font-titulo text-lg font-bold text-vagao">🎉 Você encontrou todas as palavras da Serra!</p>
          <button className="btn-fantasma mx-auto" onClick={actions.resetWordSearch}>
            <RotateCcw size={20} /> Jogar de novo
          </button>
        </div>
      )}

      <Sheet open={!!achada} onClose={() => setAchada(null)} title={`Você achou: ${achada?.rotulo || ''}!`}>
        {achada && (
          <div className="space-y-4">
            <div className="rounded-xl bg-latao-claro/25 p-4">
              <p className="font-maquina text-sm uppercase tracking-[0.15em] text-tijolo">Curiosidade rápida</p>
              <p className="mt-1 text-[15px] leading-relaxed">{achada.curiosidade}</p>
            </div>
            <fieldset>
              <legend className="rotulo">Que sentimento “{achada.rotulo}” desperta em você?</legend>
              <div className="grid grid-cols-2 gap-2">
                {SENTIMENTOS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSentimento(s.key)}
                    aria-pressed={sentimento === s.key}
                    className={`flex min-h-[48px] items-center gap-2 rounded-xl border-2 px-3 text-left text-[15px] font-bold ${
                      sentimento === s.key ? 'border-tijolo bg-tijolo text-papel' : 'border-papel-borda bg-white'
                    }`}
                  >
                    <span className="text-xl" aria-hidden>
                      {s.emoji}
                    </span>
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="ws-com" className="rotulo">
                Quer contar mais? (opcional)
              </label>
              <textarea id="ws-com" rows={3} className="campo resize-none" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Uma lembrança, uma história, um nome…" maxLength={800} />
            </div>
            <button
              className="btn-primario w-full"
              onClick={() => {
                actions.saveWordFind(achada.palavra, { sentimento, comentario: comentario.trim() })
                setAchada(null)
                toast('Obrigado por compartilhar! 💛')
              }}
            >
              Guardar e continuar
            </button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
