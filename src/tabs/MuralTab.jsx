import { useState } from 'react'
import { BookOpen, Heart, House, Info, MapPin, MessageCircle, PenLine, Send, TrainFront } from 'lucide-react'
import { POSTS, REACOES, RELATOS, SENTIDOS } from '../data/content'
import { useStore } from '../lib/store.jsx'
import Foto from '../components/Foto.jsx'
import { fotoDe } from '../data/imagens'

const ICONE_REACAO = { trabalhou: TrainFront, morei: House, saudade: Heart }
import AudioRecorder, { AudioPlayer } from '../components/AudioRecorder.jsx'
import Sheet from '../components/Sheet.jsx'
import { useToast } from '../components/Toast.jsx'

const quando = (iso) => {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'agora mesmo'
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const iniciais = (nome = '?') =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase()

function Comment({ c, i = 0 }) {
  return (
    <li className="recado" style={{ transform: `rotate(${i % 2 ? 0.6 : -0.5}deg)` }}>
      <span className="fita" aria-hidden />
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-titulo text-[17px] font-bold leading-tight text-vagao">
        {c.autor}
        {c.idade && <span className="font-corpo text-[14px] font-normal text-tinta-suave">{c.idade} anos</span>}
        {c.ficticio && <span className="selo-ficticio">relato fictício</span>}
      </p>
      {c.relacao && <p className="text-[13px] text-tinta-suave">{c.relacao}</p>}
      {c.texto && <p className="mt-1.5 text-[16px] leading-relaxed">{c.texto}</p>}
      {c.audio && <AudioPlayer audio={c.audio} />}
      <p className="mt-1 font-mao text-[14px] text-tinta-suave">{quando(c.ts)}</p>
    </li>
  )
}

function Post({ post, n }) {
  const { state, actions } = useStore()
  const toast = useToast()
  const [texto, setTexto] = useState('')
  const [audio, setAudio] = useState(null)
  const [aberto, setAberto] = useState(false)
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const [info, setInfo] = useState(false)
  const comments = state.comments[post.id] || []
  const visiveis = mostrarTodos ? comments : comments.slice(-1)
  const counts = state.reactions[post.id] || {}
  const mine = state.myReactions[post.id] || {}

  const enviar = () => {
    if (!texto.trim() && !audio) return
    actions.addComment(post.id, { texto, audio })
    setTexto('')
    setAudio(null)
    setMostrarTodos(true)
    toast('Obrigado! Sua memória foi guardada no álbum.')
  }

  return (
    <article className="space-y-4" aria-labelledby={`t-${post.id}`}>
      <p className="flex items-center gap-2 px-1 font-maquina text-[13px] text-tinta-suave">
        <span>Nº {String(n).padStart(2, '0')}</span>
        <span className="h-px flex-1 bg-papel-borda" aria-hidden />
        <MapPin size={15} className="text-tijolo" aria-hidden />
        <span>{post.local}</span>
      </p>

      <Foto lugar={`post:${post.id}`} ilustracao={post.ilustracao} titulo={post.titulo} giro={n % 2 ? -1.1 : 0.9} />

      <div className="px-1">
        <h2 id={`t-${post.id}`} className="font-titulo text-[1.45rem] font-extrabold leading-tight text-vagao">
          {post.titulo}
        </h2>
        <p className="mt-1.5 text-[17px] leading-relaxed text-tinta">{post.legenda}</p>
        <button
          onClick={() => setInfo((v) => !v)}
          className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-1 text-[16px] font-bold text-tijolo underline decoration-dotted underline-offset-4"
          aria-expanded={info}
        >
          <Info size={18} /> {info ? 'Fechar a curiosidade' : 'Você sabia?'}
        </button>
        {info && <p className="campo-pautado mt-1 border-kraft/60 bg-[#FFFCF2] text-[16px]">{post.curiosidade}</p>}
      </div>

      <div className="grid grid-cols-3 gap-2.5 px-1" role="group" aria-label="Como este lugar toca você?">
        {REACOES.map((r) => {
          const on = !!mine[r.key]
          const Icone = ICONE_REACAO[r.key] || Heart
          return (
            <button
              key={r.key}
              onClick={() => actions.toggleReaction(post.id, r.key)}
              aria-pressed={on}
              aria-label={`${r.label}: ${counts[r.key] || 0}`}
              className={`${on ? 'carimbo-on' : 'carimbo-off'} min-h-[78px] gap-1 px-1 py-2`}
            >
              <span className="flex items-center gap-1.5">
                <Icone size={20} strokeWidth={2.2} fill={on && r.key === 'saudade' ? 'currentColor' : 'none'} aria-hidden />
                <span className="font-maquina text-[16px]">{counts[r.key] || 0}</span>
              </span>
              <span className="text-[13px] font-bold leading-tight">{r.label}</span>
            </button>
          )
        })}
      </div>

      <section className="px-1">
        <h3 className="mb-3 flex items-center gap-2 font-titulo text-[1.15rem] font-bold text-vagao">
          <MessageCircle size={20} /> Memórias dos moradores ({comments.length})
        </h3>
        {comments.length > 1 && !mostrarTodos && (
          <button onClick={() => setMostrarTodos(true)} className="mb-3 min-h-[44px] text-[16px] font-bold text-tijolo underline underline-offset-4">
            Ver todas as {comments.length} memórias
          </button>
        )}
        <ul className="space-y-4">
          {visiveis.map((c, i) => (
            <Comment key={c.id} c={c} i={i} />
          ))}
        </ul>

        {!aberto ? (
          <button onClick={() => setAberto(true)} className="btn-verde mt-4 w-full">
            <PenLine size={20} /> Contar a minha lembrança
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-[16px] font-bold">Toque numa frase para começar ou escreva do seu jeito:</p>
            <div className="flex flex-wrap gap-2">
              {post.respostasRapidas.map((r) => (
                <button key={r} onClick={() => setTexto((t) => (t ? `${t} ${r}` : r))} className="min-h-[44px] rounded-md border-2 border-dashed border-kraft bg-[#FFFCF2] px-3 py-1.5 text-left font-mao text-[16px] text-tinta hover:border-tijolo">
                  “{r}”
                </button>
              ))}
            </div>
            <label htmlFor={`txt-${post.id}`} className="sr-only">
              Sua lembrança
            </label>
            <textarea id={`txt-${post.id}`} value={texto} onChange={(e) => setTexto(e.target.value)} rows={4} className="campo-pautado resize-none" placeholder="Escreva aqui a sua lembrança…" maxLength={1200} />
            <AudioRecorder value={audio} onChange={setAudio} />
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <button className="btn-fantasma" onClick={() => setAberto(false)}>
                Fechar
              </button>
              <button className="btn-primario" onClick={enviar} disabled={!texto.trim() && !audio}>
                <Send size={20} /> Publicar memória
              </button>
            </div>
            {!state.profile && <p className="text-sm text-tinta-suave">Dica: emita seu bilhete na primeira aba para a memória aparecer com o seu nome.</p>}
          </div>
        )}
      </section>
    </article>
  )
}

function SentidoCard({ sentido }) {
  const { actions } = useStore()
  const toast = useToast()
  const [texto, setTexto] = useState('')
  const [feito, setFeito] = useState(false)
  const temFoto = !!fotoDe(`sentido:${sentido.id}`)
  return (
    <aside className="relative overflow-hidden rounded-md border border-kraft-escuro/40 bg-kraft-claro/45 shadow-cartao" aria-labelledby={`s-t-${sentido.id}`}>
      {/* aba de envelope */}
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="block h-5 w-full" aria-hidden>
        <path d="M0 0 L50 10 L100 0" fill="none" stroke="#9C7B4E" strokeWidth="1.2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="space-y-3 px-4 pb-4">
        <p className="font-mao text-[17px] text-tijolo">Sons e cheiros da Serra</p>
        {temFoto && (
          <div className="overflow-hidden rounded-sm shadow-foto">
            <Foto lugar={`sentido:${sentido.id}`} titulo={sentido.titulo} moldura={false} proporcao="aspect-[2/1]" />
          </div>
        )}
        <h2 id={`s-t-${sentido.id}`} className="font-titulo text-[1.35rem] font-extrabold leading-tight text-vagao">
          {sentido.titulo}
        </h2>
        <p className="text-[17px] leading-relaxed">{sentido.texto}</p>
        {feito ? (
          <p className="recado text-[16px] font-bold text-vagao" role="status">
            <span className="fita" aria-hidden />
            Lembrança guardada. Muito obrigado!
          </p>
        ) : (
          <div className="space-y-2">
            <label htmlFor={`s-${sentido.id}`} className="rotulo !mb-1">
              {sentido.pergunta}
            </label>
            <textarea id={`s-${sentido.id}`} value={texto} onChange={(e) => setTexto(e.target.value)} rows={2} className="campo-pautado resize-none" placeholder="Conte em poucas palavras…" maxLength={800} />
            <button
              className="btn-verde w-full"
              disabled={!texto.trim()}
              onClick={() => {
                actions.addSensoryMemory(sentido.id, texto)
                setFeito(true)
                toast('Lembrança guardada. Obrigado!')
              }}
            >
              Guardar lembrança
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default function MuralTab() {
  const [relato, setRelato] = useState(null)
  const feed = []
  POSTS.forEach((p, i) => {
    feed.push(<Post key={p.id} post={p} n={i + 1} />)
    feed.push(<hr key={`hr-${p.id}`} className="regua-dupla mx-6 border-0" />)
    const s = SENTIDOS[Math.floor(i / 2)]
    if ((i % 2 === 1 || i === POSTS.length - 1) && s) {
      feed.push(<SentidoCard key={`s-${s.id}`} sentido={s} />)
    }
  })

  return (
    <div className="space-y-7 px-4 py-6 sm:px-5">
      <div className="px-1">
        <h1 className="titulo-secao">
          <span className="traco-mao">Mural da Vila</span>
        </h1>
        <p className="mt-2 text-[17px] leading-relaxed text-tinta-suave">
          Folheie o álbum da vila. Se uma foto acordar uma lembrança, marque um carimbo ou conte para a gente.
        </p>
      </div>

      <section aria-label="Vozes da Vila">
        <h2 className="mb-3 flex flex-wrap items-center gap-2 px-1 font-titulo text-[1.15rem] font-bold text-vagao">
          <BookOpen size={20} /> Vozes da Vila
          <span className="selo-ficticio">exemplos fictícios</span>
        </h2>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 pt-1 sm:-mx-5 sm:px-5">
          {RELATOS.map((r) => (
            <button key={r.id} onClick={() => setRelato(r)} className="flex min-h-[64px] w-[12.5rem] shrink-0 snap-start items-center gap-3 rounded-md border border-papel-borda bg-papel-claro p-2.5 text-left shadow-cartao hover:border-tijolo">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-dashed border-tijolo font-titulo text-[16px] font-extrabold text-tijolo" aria-hidden>{iniciais(r.personagem)}</div>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold leading-tight">{r.personagem}</span>
                <span className="block text-[13px] leading-tight text-tinta-suave">{r.relacao_com_a_vila}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {feed}

      <p className="pb-4 text-center font-mao text-[16px] text-tinta-suave">
        Fotos feitas pela equipe do projeto com moradores da vila. Onde ainda há desenho, procuramos uma foto: você tem alguma?
      </p>

      <Sheet open={!!relato} onClose={() => setRelato(null)} title={relato?.personagem || ''}>
        {relato && (
          <div className="space-y-4">
            <p className="flex flex-wrap items-center gap-2 text-base text-tinta-suave">
              {relato.idade} anos · {relato.relacao_com_a_vila} · {relato.decada_referida}
              <span className="selo-ficticio">relato fictício de demonstração</span>
            </p>
            <blockquote className="border-l-4 border-kraft pl-3 font-titulo text-[1.2rem] italic leading-relaxed text-tinta">“{relato.texto}”</blockquote>
            <p className="rounded-xl bg-papel-escuro p-3 text-sm text-tinta-suave">
              Este relato foi criado apenas para demonstrar o protótipo. Ele será substituído por depoimentos reais, colhidos com autorização em
              entrevistas com moradores e ex-ferroviários.
            </p>
          </div>
        )}
      </Sheet>
    </div>
  )
}
