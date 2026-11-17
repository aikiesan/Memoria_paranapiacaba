import { useMemo, useState } from 'react'
import { ChevronLeft, Copy, HardHat, House, Mountain, Pencil, Share2, Ticket as IconeBilhete, Users } from 'lucide-react'
import { DECADAS, LIGACOES, OFICIOS } from '../data/content'
import { useStore } from '../lib/store.jsx'
import { computeStats } from '../lib/export'
import { useToast } from '../components/Toast.jsx'
import Foto from '../components/Foto.jsx'

const ICONE_LIGACAO = { 'ex-ferroviario': HardHat, descendente: Users, morador: House, apaixonado: Mountain }

const APP_URL = 'https://aikiesan.github.io/Memoria_paranapiacaba/'

export function shareText(p) {
  const lig = LIGACOES.find((l) => l.key === p.ligacao)
  return [
    '🚂 *Bilhete de Memória — São Paulo Railway*',
    `Passageiro(a): ${p.nome || 'Família da Serra'}`,
    lig ? `Ligação com os trilhos: ${lig.label}` : null,
    p.decada ? `Década que marcou minha história: ${p.decada}` : null,
    p.oficio ? `Ofício lembrado: ${p.oficio}` : null,
    'Destino: Paranapiacaba, Serra do Mar',
    '',
    'Conte você também a sua história na Estação de Memória:',
    APP_URL,
  ]
    .filter((x) => x !== null)
    .join('\n')
}

function Ticket({ profile, stamps = [], live = false }) {
  const lig = LIGACOES.find((l) => l.key === profile.ligacao)
  const numero = profile.numero || '1867-____'
  return (
    <div className="relative mx-auto w-full max-w-[360px]" aria-label="Bilhete Histórico da São Paulo Railway">
      <div className="relative overflow-hidden rounded-md border-[3px] border-tijolo bg-[#F3E7C6] shadow-foto" style={{ backgroundImage: 'var(--grao)' }}>
        {/* furos laterais */}
        <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-papel ring-[3px] ring-tijolo" />
        <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-papel ring-[3px] ring-tijolo" />
        <div className="bg-tijolo px-4 py-2 text-center text-papel">
          <p className="font-maquina text-[0.7rem] uppercase tracking-[0.25em]">The São Paulo Railway Co.</p>
          <p className="font-titulo text-lg font-bold">Bilhete de Memória</p>
        </div>
        <div className="space-y-2 px-6 py-4 font-maquina text-tinta">
          <div className="flex justify-between text-xs">
            <span>Nº {numero}</span>
            <span>1ª CLASSE DA MEMÓRIA</span>
          </div>
          <div className="border-y-2 border-dashed border-tijolo/40 py-2 text-center">
            <p className="text-xs uppercase">Passageiro(a)</p>
            <p className="break-words font-titulo text-xl font-bold leading-tight text-vagao">{profile.nome?.trim() || 'Seu nome aqui'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-[0.7rem] uppercase text-tinta-suave">Partida</p>
              <p className="font-bold">{profile.decada || '— década —'}</p>
            </div>
            <div className="text-right">
              <p className="text-[0.7rem] uppercase text-tinta-suave">Destino</p>
              <p className="font-bold">Paranapiacaba</p>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase text-tinta-suave">Ofício lembrado</p>
              <p className="font-bold">{profile.oficio || '—'}</p>
            </div>
            <div className="text-right">
              <p className="text-[0.7rem] uppercase text-tinta-suave">Ligação</p>
              <p className="font-bold">{lig ? lig.label : '—'}</p>
            </div>
          </div>
          <p className="pt-1 text-center text-[0.7rem] uppercase tracking-wider text-tinta-suave">Via Serra do Mar · Sistema Funicular · Estação Alto da Serra</p>
        </div>
        {/* carimbos */}
        <div className="pointer-events-none absolute right-4 top-[6.4rem] flex flex-col items-end gap-1">
          {!live && (
            <div className="anim-carimbo rounded-full border-[3px] border-double border-vagao/70 px-3 py-1 font-maquina text-xs font-bold uppercase text-vagao/80">
              Emitido
            </div>
          )}
        </div>
        {stamps.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 border-t-2 border-dashed border-tijolo/40 bg-[#EFE0B8] px-4 py-3">
            {stamps.map((s) => (
              <span key={s.label} className={`rounded-md border-2 px-2 py-1 font-maquina text-[0.7rem] uppercase ${s.ok ? 'anim-carimbo border-tijolo text-tijolo' : 'border-dashed border-tinta/25 text-tinta/40'}`}>
                {s.ok ? '✔ ' : ''}
                {s.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Onboarding({ initial, onDone }) {
  const [step, setStep] = useState(initial?.ligacao ? 1 : 0)
  const [form, setForm] = useState({
    ligacao: initial?.ligacao || '',
    nome: initial?.nome || '',
    decada: initial?.decada || '',
    oficio: initial?.oficio || '',
  })
  const [oficioOutro, setOficioOutro] = useState(initial?.oficio && !OFICIOS.includes(initial.oficio) ? initial.oficio : '')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const oficioFinal = form.oficio === 'Outro' ? oficioOutro : form.oficio

  if (step === 0) {
    return (
      <div className="space-y-5 px-4 py-6">
        <Foto lugar="capa:bilhete" titulo="O pátio ferroviário de Paranapiacaba" giro={-0.8} />
        <div className="space-y-2 px-1">
          <p className="font-mao text-[18px] text-tijolo">Bem-vindo(a) a bordo!</p>
          <h1 className="font-titulo text-[1.7rem] font-extrabold leading-[1.12] text-vagao sm:text-[2rem]">Qual a sua ligação com os trilhos de Paranapiacaba?</h1>
          <p className="text-[16px] text-tinta-suave">Passo 1 de 2. Toque na opção que mais combina com você.</p>
        </div>
        <div className="grid gap-2.5">
          {LIGACOES.map((l) => {
            const Icone = ICONE_LIGACAO[l.key] || House
            const on = form.ligacao === l.key
            return (
            <button
              key={l.key}
              onClick={() => {
                set('ligacao', l.key)
                setStep(1)
              }}
              className={`flex min-h-[68px] items-center gap-3.5 rounded-md border-2 px-3.5 py-2.5 text-left transition active:translate-y-px ${
                on ? 'border-vagao bg-vagao text-papel-claro' : 'border-papel-borda bg-papel-claro shadow-cartao hover:border-vagao'
              }`}
            >
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-dashed ${on ? 'border-papel-claro/60' : 'border-tijolo text-tijolo'}`} aria-hidden>
                <Icone size={22} />
              </span>
              <span>
                <span className="block text-[17px] font-bold leading-tight">{l.label}</span>
                <span className={`block text-[14px] ${on ? 'text-papel-claro/80' : 'text-tinta-suave'}`}>{l.descricao}</span>
              </span>
            </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 px-4 py-4">
      <button onClick={() => setStep(0)} className="btn-fantasma -ml-2 min-h-[40px] px-2">
        <ChevronLeft size={22} /> Voltar
      </button>
      <div>
        <h1 className="titulo-secao">Vamos montar seu bilhete</h1>
        <p className="mt-1 text-[16px] text-tinta-suave">Passo 2 de 2. O bilhete se forma enquanto você preenche.</p>
      </div>

      <Ticket profile={{ ...form, oficio: oficioFinal, numero: initial?.numero }} live />

      <div>
        <label htmlFor="nome" className="rotulo">
          Seu nome ou o sobrenome da família
        </label>
        <input id="nome" className="campo" value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Ex.: Família Bianchi" autoComplete="name" maxLength={60} />
      </div>

      <fieldset>
        <legend className="rotulo">Que década marcou a sua história?</legend>
        <div className="flex flex-wrap gap-2">
          {DECADAS.map((d) => (
            <button key={d} type="button" onClick={() => set('decada', d)} className={form.decada === d ? 'chip-on' : 'chip-off'} aria-pressed={form.decada === d}>
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="rotulo">Qual ofício você lembra?</legend>
        <div className="flex flex-wrap gap-2">
          {[...OFICIOS, 'Outro'].map((o) => (
            <button key={o} type="button" onClick={() => set('oficio', o)} className={form.oficio === o ? 'chip-on' : 'chip-off'} aria-pressed={form.oficio === o}>
              {o}
            </button>
          ))}
        </div>
        {form.oficio === 'Outro' && (
          <input className="campo mt-3" value={oficioOutro} onChange={(e) => setOficioOutro(e.target.value)} placeholder="Qual ofício?" aria-label="Outro ofício" maxLength={50} />
        )}
      </fieldset>

      <button
        className="btn-primario sticky bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-10 w-full shadow-lg"
        disabled={!form.nome.trim()}
        onClick={() =>
          onDone({
            ...form,
            nome: form.nome.trim(),
            oficio: oficioFinal.trim(),
            ligacaoLabel: LIGACOES.find((l) => l.key === form.ligacao)?.label,
          })
        }
      >
        <IconeBilhete size={22} /> Emitir meu bilhete
      </button>
      {!form.nome.trim() && <p className="-mt-3 text-center text-base text-tinta-suave">Escreva um nome para emitir o bilhete.</p>}
    </div>
  )
}

export default function BilheteTab({ goTo }) {
  const { state, actions } = useStore()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const stats = useMemo(() => computeStats(state), [state])
  const p = state.profile

  if (!p || editing) {
    return (
      <Onboarding
        initial={p}
        onDone={(data) => {
          actions.saveProfile(data)
          setEditing(false)
          toast('Bilhete emitido! Boa viagem pela memória.')
        }}
      />
    )
  }

  const stamps = [
    { label: 'Mural', ok: stats.minhasReacoes + stats.comentariosUsuario > 0 },
    { label: 'Quiz', ok: stats.quizCorretas > 0 },
    { label: 'Caça-palavras', ok: stats.palavras > 0 },
    { label: 'Mapa', ok: stats.pinsUsuario > 0 },
  ]
  const text = shareText(p)

  const shareWhatsApp = () => {
    actions.logShare('whatsapp')
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Meu Bilhete de Memória — Paranapiacaba', text })
        actions.logShare('web-share')
      } catch {
        /* usuário cancelou */
      }
    } else {
      try {
        await navigator.clipboard.writeText(text)
        actions.logShare('copiar')
        toast('Texto do bilhete copiado!')
      } catch {
        toast('Não foi possível copiar neste navegador.')
      }
    }
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <div className="text-center">
        <p className="font-mao text-[18px] text-tijolo">Seu bilhete histórico</p>
        <h1 className="titulo-secao mt-1">Que bom ter você a bordo, {/^fam[íi]lia\s/i.test(p.nome) ? p.nome : p.nome.split(' ')[0]}!</h1>
      </div>

      <Ticket profile={p} stamps={stamps} />

      <div className="grid gap-3">
        <button className="btn-whatsapp w-full" onClick={shareWhatsApp}>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
          </svg>
          Compartilhar no WhatsApp
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-contorno" onClick={shareNative}>
            {navigator.share ? <Share2 size={22} /> : <Copy size={22} />}
            {navigator.share ? 'Compartilhar' : 'Copiar texto'}
          </button>
          <button className="btn-contorno" onClick={() => setEditing(true)}>
            <Pencil size={22} /> Editar
          </button>
        </div>
      </div>

      <section className="cartao space-y-3 p-4" aria-labelledby="proximas">
        <h2 id="proximas" className="font-titulo text-[1.3rem] font-extrabold text-vagao">
          Próximas estações da sua viagem
        </h2>
        <p className="text-[15px] text-tinta-suave">Cada estação visitada ganha um carimbo no seu bilhete.</p>
        {/* linha férrea com as estações */}
        <ol className="relative ml-4 border-l-[3px] border-dashed border-vagao/40">
          {[
            { tab: 'mural', t: 'Mural da Vila', d: 'Folheie as fotos e conte uma lembrança', ok: stamps[0].ok },
            { tab: 'jogos', t: 'Jogos da Ferrovia', d: 'Quiz das engenhocas e caça-palavras', ok: stamps[1].ok || stamps[2].ok },
            { tab: 'mapa', t: 'Mapa de Sobrenomes', d: 'Marque no mapa onde a sua família viveu', ok: stamps[3].ok },
          ].map(({ tab, t, d, ok }) => (
            <li key={tab} className="relative pb-2 pl-6 last:pb-0">
              <span
                className={`absolute -left-[11px] top-[18px] h-5 w-5 rounded-full border-[3px] ${ok ? 'border-tijolo bg-tijolo' : 'border-vagao bg-papel-claro'}`}
                aria-hidden
              />
              <button onClick={() => goTo(tab)} className="flex min-h-[56px] w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left hover:bg-papel-escuro">
                <span>
                  <span className="block text-[17px] font-bold leading-tight">{t}</span>
                  <span className="block text-[14px] text-tinta-suave">{d}</span>
                </span>
                <span className={`shrink-0 font-mao text-[15px] ${ok ? 'text-tijolo' : 'text-vagao'}`}>{ok ? 'carimbado' : 'ir agora'}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-center text-sm text-tinta-suave">
        Seus dados ficam guardados apenas neste aparelho e servem à pesquisa do projeto FAPESP / PUC-Campinas.
      </p>
    </div>
  )
}
