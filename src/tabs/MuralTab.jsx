import { useState } from 'react'
import { BookOpen, Info, MessageCircle, Send } from 'lucide-react'
import { POSTS, REACOES, RELATOS, SENTIDOS } from '../data/content'
import { useStore } from '../lib/store.jsx'
import Foto from '../components/Foto.jsx'
import { fotoDe } from '../data/imagens'
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

function Comment({ c }) {
  return (
    <li className="flex gap-2.5">
      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold ${c.origem === 'seed' ? 'bg-latao-claro/60 text-vagao-escuro' : 'bg-vagao text-papel'}`} aria-hidden>
        {iniciais(c.autor)}
      </div>
      <div className="min-w-0 flex-1 rounded-xl bg-papel-escuro px-3 py-2">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[14px] font-bold leading-tight">
          {c.autor}
          {c.idade && <span className="font-normal text-tinta-suave">{c.idade} anos</span>}
          {c.ficticio && <span className="selo-ficticio">relato fictício</span>}
        </p>
        {c.relacao && <p className="text-[12px] text-tinta-suave">{c.relacao}</p>}
        {c.texto && <p className="mt-1 text-[15px] leading-relaxed">{c.texto}</p>}
        {c.audio && <AudioPlayer audio={c.audio} />}
        <p className="mt-0.5 text-[11px] text-tinta-suave">{quando(c.ts)}</p>
      </div>
    </li>
  )
}

function Post({ post }) {
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
    toast('Obrigado! Sua memória foi guardada 💛')
  }

  return (
    <article className="cartao overflow-hidden">
      <div className="relative">
        <Foto lugar={`post:${post.id}`} ilustracao={post.ilustracao} titulo={post.titulo} className="block aspect-[400/220] w-full" />
        <span className="absolute bottom-2 left-2 rounded-full bg-papel/95 px-2.5 py-1 text-[12px] font-bold text-vagao shadow">📍 {post.local}</span>
        <button
          onClick={() => setInfo((v) => !v)}
          className="absolute bottom-2 right-2 flex min-h-[36px] items-center gap-1 rounded-full bg-vagao/90 px-3 text-[13px] font-bold text-papel shadow"
          aria-expanded={info}
        >
          <Info size={16} /> Você sabia?
        </button>
      </div>
      {info && <p className="border-b border-papel-borda bg-latao-claro/25 px-4 py-3 text-[15px] leading-relaxed">{post.curiosidade}</p>}
      <div className="px-4 pt-3">
        <h2 className="font-titulo text-[1.15rem] font-bold leading-snug text-vagao">{post.titulo}</h2>
        <p className="mt-1 text-[15px] leading-relaxed text-tinta">{post.legenda}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-3" role="group" aria-label="Reações afetivas">
        {REACOES.map((r) => {
          const on = !!mine[r.key]
          return (
            <button
              key={r.key}
              onClick={() => actions.toggleReaction(post.id, r.key)}
              aria-pressed={on}
              aria-label={`${r.label}: ${counts[r.key] || 0}`}
              className={`flex min-h-[64px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-1 py-1.5 text-center transition active:scale-[0.97] ${
                on ? 'border-tijolo bg-tijolo text-papel' : 'border-papel-borda bg-white text-tinta hover:border-tijolo'
              }`}
            >
              <span className="flex items-center gap-1 text-[15px] font-bold">
                <span aria-hidden>{r.emoji}</span>
                <span className="font-maquina">{counts[r.key] || 0}</span>
              </span>
              <span className={`text-[11.5px] font-bold leading-tight ${on ? 'text-papel' : 'text-tinta-suave'}`}>{r.label}</span>
            </button>
          )
        })}
      </div>

      <section className="border-t border-papel-borda px-4 py-3">
        <h3 className="mb-2 flex items-center gap-2 text-[15px] font-bold text-vagao">
          <MessageCircle size={18} /> Memórias dos moradores ({comments.length})
        </h3>
        {comments.length > 1 && !mostrarTodos && (
          <button onClick={() => setMostrarTodos(true)} className="mb-2 text-sm font-bold text-tijolo underline underline-offset-4">
            Ver todas as {comments.length} memórias
          </button>
        )}
        <ul className="space-y-2">
          {visiveis.map((c) => (
            <Comment key={c.id} c={c} />
          ))}
        </ul>

        {!aberto ? (
          <button onClick={() => setAberto(true)} className="btn-verde mt-3 w-full">
            ✍️ Contar a minha lembrança
          </button>
        ) : (
          <div className="mt-3 space-y-2.5">
            <p className="text-[15px] font-bold">Toque numa frase para começar ou escreva do seu jeito:</p>
            <div className="flex flex-wrap gap-2">
              {post.respostasRapidas.map((r) => (
                <button key={r} onClick={() => setTexto((t) => (t ? `${t} ${r}` : r))} className="rounded-full border-2 border-latao bg-latao-claro/20 px-3 py-1.5 text-left text-[13px] font-bold text-tinta">
                  “{r}”
                </button>
              ))}
            </div>
            <label htmlFor={`txt-${post.id}`} className="sr-only">
              Sua lembrança
            </label>
            <textarea id={`txt-${post.id}`} value={texto} onChange={(e) => setTexto(e.target.value)} rows={3} className="campo resize-none" placeholder="Escreva aqui a sua lembrança…" maxLength={1200} />
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
  return (
    <aside className="overflow-hidden rounded-2xl border-2 border-dashed border-vagao/40 bg-neblina-claro/60">
      {fotoDe(`sentido:${sentido.id}`) && <Foto lugar={`sentido:${sentido.id}`} titulo={sentido.titulo} className="block aspect-[400/180] w-full" />}
      <div className="p-4">
      <p className="font-maquina text-xs uppercase tracking-[0.2em] text-vagao">Sons e cheiros da Serra</p>
      <h2 className="mt-0.5 font-titulo text-lg font-bold text-vagao">
        <span aria-hidden>{sentido.emoji}</span> {sentido.titulo}
      </h2>
      <p className="mt-1 text-[15px] leading-relaxed">{sentido.texto}</p>
      {feito ? (
        <p className="mt-3 rounded-xl bg-vagao px-4 py-3 text-base font-bold text-papel">Lembrança guardada. Muito obrigado! 🌿</p>
      ) : (
        <div className="mt-3 space-y-2">
          <label htmlFor={`s-${sentido.id}`} className="rotulo !mb-1">
            {sentido.pergunta}
          </label>
          <textarea id={`s-${sentido.id}`} value={texto} onChange={(e) => setTexto(e.target.value)} rows={2} className="campo resize-none" placeholder="Conte em poucas palavras…" maxLength={800} />
          <button
            className="btn-verde w-full"
            disabled={!texto.trim()}
            onClick={() => {
              actions.addSensoryMemory(sentido.id, texto)
              setFeito(true)
              toast('Lembrança guardada 🌿')
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
    feed.push(<Post key={p.id} post={p} />)
    const s = SENTIDOS[Math.floor(i / 2)]
    if ((i % 2 === 1 || i === POSTS.length - 1) && s) {
      feed.push(<SentidoCard key={`s-${s.id}`} sentido={s} />)
    }
  })

  return (
    <div className="space-y-4 px-3 py-4 sm:px-4">
      <div className="px-1">
        <h1 className="titulo-secao">Mural da Vila</h1>
        <p className="mt-0.5 text-[15px] text-tinta-suave">Olhe as fotos, reaja e conte o que você lembra. Toda memória conta!</p>
      </div>

      <section aria-label="Vozes da Vila">
        <h2 className="mb-2 flex items-center gap-2 px-1 text-[15px] font-bold text-vagao">
          <BookOpen size={18} /> Vozes da Vila
          <span className="selo-ficticio">exemplos fictícios</span>
        </h2>
        <div className="-mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4">
          {RELATOS.map((r) => (
            <button key={r.id} onClick={() => setRelato(r)} className="flex w-[11.5rem] shrink-0 snap-start items-center gap-2.5 rounded-xl border-2 border-latao bg-white p-2.5 text-left hover:bg-papel-escuro">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tijolo font-titulo text-[15px] font-bold text-papel">{iniciais(r.personagem)}</div>
              <span className="min-w-0">
                <span className="block text-[14px] font-bold leading-tight">{r.personagem}</span>
                <span className="block text-[12px] leading-tight text-tinta-suave">{r.relacao_com_a_vila}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {feed}

      <p className="pb-4 text-center text-sm text-tinta-suave">
        As ilustrações são provisórias e serão trocadas por fotografias históricas do acervo do projeto.
      </p>

      <Sheet open={!!relato} onClose={() => setRelato(null)} title={relato?.personagem || ''}>
        {relato && (
          <div className="space-y-4">
            <p className="flex flex-wrap items-center gap-2 text-base text-tinta-suave">
              {relato.idade} anos · {relato.relacao_com_a_vila} · {relato.decada_referida}
              <span className="selo-ficticio">relato fictício de demonstração</span>
            </p>
            <blockquote className="border-l-4 border-latao pl-3 font-titulo text-lg italic leading-relaxed text-tinta">“{relato.texto}”</blockquote>
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
