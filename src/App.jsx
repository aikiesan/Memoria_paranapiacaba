import { useEffect, useRef, useState } from 'react'
import { ChartColumn, Gamepad2, Images, MapPin, Ticket, Type } from 'lucide-react'
import { useStore } from './lib/store.jsx'
import { ToastProvider } from './components/Toast.jsx'
import ResearcherPanel from './components/ResearcherPanel.jsx'
import BilheteTab from './tabs/BilheteTab.jsx'
import MuralTab from './tabs/MuralTab.jsx'
import JogosTab from './tabs/JogosTab.jsx'
import MapaTab from './tabs/MapaTab.jsx'

const TABS = [
  { id: 'bilhete', label: 'Meu Bilhete', icon: Ticket },
  { id: 'mural', label: 'Mural da Vila', icon: Images },
  { id: 'jogos', label: 'Jogos', icon: Gamepad2 },
  { id: 'mapa', label: 'Mapa', icon: MapPin },
]

const TAB_KEY = 'estacao-memoria-aba'
const readTab = () => {
  try {
    const t = window.localStorage.getItem(TAB_KEY)
    return TABS.some((x) => x.id === t) ? t : 'bilhete'
  } catch {
    return 'bilhete'
  }
}

export default function App() {
  const { state, actions, storageWarning } = useStore()
  const [tab, setTab] = useState(readTab)
  const [panelOpen, setPanelOpen] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(TAB_KEY, tab)
    } catch {
      /* armazenamento indisponível: segue sem lembrar a aba */
    }
    scrollRef.current?.scrollTo({ top: 0 })
  }, [tab])

  return (
    <div className="flex min-h-[100dvh] items-center justify-center md:py-8">
      <div className="hidden max-w-xs flex-col gap-4 pr-14 text-papel lg:flex">
        <p className="font-maquina text-sm uppercase tracking-[0.3em] text-latao">São Paulo Railway · 1867</p>
        <h1 className="font-titulo text-5xl font-extrabold leading-[1.05]">Estação de Memória</h1>
        <p className="text-lg leading-relaxed text-papel/85">
          Um protótipo para conversar com moradores, ex-ferroviários e suas famílias sobre a vida na Vila de Paranapiacaba — e guardar essas lembranças
          para a candidatura a Patrimônio da Humanidade.
        </p>
        <p className="text-sm text-papel/60">Projeto FAPESP · PUC-Campinas — versão de demonstração.</p>
      </div>

      {/* Moldura de celular no desktop, tela cheia no celular */}
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-papel md:h-[min(900px,calc(100dvh-4rem))] md:w-[420px] md:rounded-[2.5rem] md:shadow-moldura">
        <ToastProvider>
          <header className="relative z-[1100] flex items-center gap-2 bg-vagao px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-papel shadow-md">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-latao bg-vagao-escuro font-titulo text-base font-bold text-latao" aria-hidden>
              EM
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-titulo text-[17px] font-bold leading-[1.1]">Estação de Memória</p>
              <p className="text-[12px] text-papel/75">Paranapiacaba</p>
            </div>
            <button
              onClick={actions.toggleLargeText}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 ${state.prefs.largeText ? 'border-latao bg-latao text-vagao-escuro' : 'border-papel/30 text-papel'}`}
              aria-pressed={state.prefs.largeText}
              aria-label="Aumentar o tamanho das letras"
              title="Letras maiores"
            >
              <Type size={24} />
            </button>
            <button
              onClick={() => setPanelOpen(true)}
              className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl bg-latao px-2.5 text-[14px] font-bold text-vagao-escuro hover:bg-latao-claro"
              aria-label="Abrir Painel do Pesquisador e exportar dados"
            >
              <ChartColumn size={20} />
              <span className="leading-tight">
                Painel
                <span className="block text-[11px] font-semibold">do Pesquisador</span>
              </span>
            </button>
          </header>

          {storageWarning && <div className="bg-tijolo px-4 py-2 text-sm font-bold text-papel">{storageWarning}</div>}

          <main ref={scrollRef} className={`papel-textura relative flex-1 ${tab === 'mapa' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            {tab === 'bilhete' && <BilheteTab goTo={setTab} />}
            {tab === 'mural' && <MuralTab goTo={setTab} />}
            {tab === 'jogos' && <JogosTab />}
            {tab === 'mapa' && <MapaTab />}
          </main>

          <nav className="relative z-[1100] grid grid-cols-4 border-t-4 border-latao bg-vagao pb-[env(safe-area-inset-bottom)]" aria-label="Navegação principal">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[72px] flex-col items-center justify-center gap-1 px-1 text-[13px] font-bold leading-tight transition ${
                    active ? 'bg-vagao-escuro text-latao' : 'text-papel/80 hover:text-papel'
                  }`}
                >
                  <Icon size={28} strokeWidth={active ? 2.6 : 2} />
                  <span className="text-center">{label}</span>
                </button>
              )
            })}
          </nav>

          {/* camada onde os modais (Sheet) são renderizados, cobrindo a "tela do celular" */}
          <div id="camada-modal" className="pointer-events-none absolute inset-0 z-[1200]" />
          <ResearcherPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
        </ToastProvider>
      </div>
    </div>
  )
}
