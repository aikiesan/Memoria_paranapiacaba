import { useState } from 'react'
import { BookOpen, Info, MessageCircle, Send } from 'lucide-react'
import { POSTS, REACOES, RELATOS, SENTIDOS } from '../data/content'
import { useStore } from '../lib/store.jsx'
import Illustration from '../components/Illustration.jsx'
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
    <li className="flex gap-3">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-bold ${c.origem === 'seed' ? 'bg-latao-claro/60 text-vagao-escuro' : 'bg-vagao text-papel'}`} aria-hidden>
        {iniciais(c.autor)}
      </div>
      <div className="min-w-0 flex-1 rounded-2xl bg-papel-escuro px-4 py-3">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-bold leading-tight">
          {c.autor}
          {c.idade && <span className="font-normal text-tinta-suave">{c.idade} anos</span>}
          {c.ficticio && <span className="selo-ficticio">relato fictício</span>}
        </p>
        {c.relacao && <p className="text-sm text-tinta-suave">{c.relacao}</p>}
        {c.texto && <p className="mt-1 text-base leading-relaxed">{c.texto}</p>}
        {c.audio && <AudioPlayer audio={c.audio} />}
        <p className="mt-1 text-xs text-tinta-suave">{quando(c.ts)}</p>
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
  const visiveis = mostrarTodos ? comments : comments.slice(-2)
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
      <header className="flex items-center gap-3 px-4 py-3">
        <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-latao bg-vagao font-titulo font-bold text-latao" aria-hidden>
          EM
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-titulo text-lg font-bold leading-tight text-vagao">{post.titulo}</h2>
          <p className="text-sm text-tinta-suave">📍 {post.local}</p>
        </div>
      </header>
      <div className="relative">
        <Illustration name={post.ilustracao} title={post.titulo} className="block aspect-[400/220] w-full" />
        <button
          onClick={() => setInfo((v) => !v)}
          className="absolute bottom-3 right-3 flex min-h-[44px] items-center gap-1 rounded-full bg-papel/95 px-3 text-sm font-bold text-vagao shadow"
          aria-expanded={info}
        >
          <Info size={18} /> Você sabia?
        </button>
      </div>
      {info && <p className="border-b border-papel-borda bg-latao-claro/25 px-4 py-3 text-base leading-relaxed">{post.curiosidade}</p>}
      <p className="px-4 pt-3 text-lg leading-relaxed">{post.legenda}</p>

      <div className="grid gap-2 px-4 py-3" role="group" aria-label="Reações afetivas">
        {REACOES.map((r) => {
          const on = !!mine[r.key]
          return (
            <button
              key={r.key}
              onClick={() => actions.toggleReaction(post.id, r.key)}
              aria-pressed={on}
              className={`flex min-h-[52px] items-center gap-3 rounded-xl border-2 px-4 text-left text-base font-bold transition active:scale-[0.99] ${
                on ? 'border-tijolo bg-tijolo text-papel' : 'border-papel-borda bg-white text-tinta hover:border-tijolo'
              }`}
            >
              <span className="text-2xl" aria-hidden>
                {r.emoji}
              </span>
              <span className="flex-1">{r.label}</span>
              <span className={`min-w-[2.5rem] rounded-full px-2 py-0.5 text-center font-maquina ${on ? 'bg-papel/20' : 'bg-papel-escuro'}`}>{counts[r.key] || 0}</span>
            </button>
          )
        })}
      </div>

      <section className="border-t border-papel-borda px-4 py-4">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-vagao">
          <MessageCircle size={20} /> Memórias dos moradores ({comments.length})
        </h3>
        {comments.length > 2 && !mostrarTodos && (
          <button onClick={() => setMostrarTodos(true)} className="mb-3 text-base font-bold text-tijolo underline underline-offset-4">
            Ver todas as {comments.length} memórias
          </button>
        )}
        <ul className="space-y-3">
          {visiveis.map((c) => (
            <Comment key={c.id} c={c} />
          ))}
        </ul>

        {!aberto ? (
          <button onClick={() => setAberto(true)} className="btn-verde mt-4 w-full">
            ✍️ Contar a minha lembrança
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-base font-bold">Toque numa frase para começar ou escreva do seu jeito:</p>
            <div className="flex flex-wrap gap-2">
              {post.respostasRapidas.map((r) => (
                <button key={r} onClick={() => setTexto((t) => (t ? `${t} ${r}` : r))} className="rounded-full border-2 border-latao bg-latao-claro/20 px-3 py-2 text-left text-sm font-bold text-tinta">
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
    <aside className="rounded-2xl border-2 border-dashed border-vagao/40 bg-neblina-claro/60 p-4">
      <p className="font-maquina text-xs uppercase tracking-[0.2em] text-vagao">Sons e cheiros da Serra</p>
      <h2 className="mt-1 font-titulo text-xl font-bold text-vagao">
        <span aria-hidden>{sentido.emoji}</span> {sentido.titulo}
      </h2>
      <p className="mt-1 text-base leading-relaxed">{sentido.texto}</p>
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
    <div className="space-y-5 px-4 py-5">
      <div>
        <h1 className="titulo-secao">Mural da Vila</h1>
        <p className="mt-1 text-lg text-tinta-suave">Olhe as fotos, reaja e conte o que você lembra. Toda memória conta!</p>
      </div>

      <section aria-label="Vozes da Vila">
        <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-vagao">
          <BookOpen size={20} /> Vozes da Vila
          <span className="selo-ficticio">exemplos fictícios</span>
        </h2>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
          {RELATOS.map((r) => (
            <button key={r.id} onClick={() => setRelato(r)} className="w-36 shrink-0 snap-start rounded-2xl border-2 border-latao bg-white p-3 text-left hover:bg-papel-escuro">
              <div className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-tijolo font-titulo text-lg font-bold text-papel">{iniciais(r.personagem)}</div>
              <p className="text-base font-bold leading-tight">{r.personagem}</p>
              <p className="text-sm text-tinta-suave">
                {r.idade} anos · {r.relacao_com_a_vila}
              </p>
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
            <blockquote className="border-l-4 border-latao pl-4 font-titulo text-xl italic leading-relaxed text-tinta">“{relato.texto}”</blockquote>
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
