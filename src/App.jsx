import { useEffect, useState } from 'react'
import { ChartColumn, Gamepad2, Images, MapPin, Ticket, Type } from 'lucide-react'
import { useStore } from './lib/store.jsx'
import { ToastProvider } from './components/Toast.jsx'
import ResearcherPanel from './components/ResearcherPanel.jsx'
import BilheteTab from './tabs/BilheteTab.jsx'
import MuralTab from './tabs/MuralTab.jsx'
import JogosTab from './tabs/JogosTab.jsx'
import MapaTab from './tabs/MapaTab.jsx'

const TABS = [
  { id: 'bilhete', label: 'Bilhete', icon: Ticket },
  { id: 'mural', label: 'Mural', icon: Images },
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

  useEffect(() => {
    try {
      window.localStorage.setItem(TAB_KEY, tab)
    } catch {
      /* armazenamento indisponível: segue sem lembrar a aba */
    }
    window.scrollTo({ top: 0 })
  }, [tab])

  const isMapa = tab === 'mapa'

  return (
    <ToastProvider>
      {/* Site responsivo: tela cheia em qualquer aparelho, rolagem natural da página */}
      <div className={`flex flex-col ${isMapa ? 'h-[100dvh]' : 'min-h-[100dvh]'}`}>
        <header className="sticky top-0 z-[1100] bg-vagao pt-[env(safe-area-inset-top)] text-papel shadow-md">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
            <div className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-latao bg-vagao-escuro font-titulo text-[13px] font-bold text-latao min-[400px]:grid" aria-hidden>
              EM
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-titulo text-[16px] font-bold leading-tight sm:text-xl">Estação de Memória</p>
              <p className="truncate text-[11px] text-papel/75 sm:text-sm">
                Paranapiacaba<span className="hidden sm:inline"> · Serra do Mar</span>
              </p>
            </div>
            <button
              onClick={actions.toggleLargeText}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 ${state.prefs.largeText ? 'border-latao bg-latao text-vagao-escuro' : 'border-papel/30 text-papel'}`}
              aria-pressed={state.prefs.largeText}
              aria-label="Aumentar o tamanho das letras"
              title="Letras maiores"
            >
              <Type size={20} />
            </button>
            <button
              onClick={() => setPanelOpen(true)}
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-latao px-3 text-[14px] font-bold text-vagao-escuro hover:bg-latao-claro"
              aria-label="Abrir Painel do Pesquisador e exportar dados"
            >
              <ChartColumn size={18} />
              Painel<span className="hidden sm:inline"> do Pesquisador</span>
            </button>
          </div>
        </header>

        {storageWarning && <div className="bg-tijolo px-4 py-2 text-center text-sm font-bold text-papel">{storageWarning}</div>}

        <main className={`relative flex-1 ${isMapa ? 'min-h-0' : ''}`}>
          {isMapa ? (
            <MapaTab />
          ) : (
            <div className="mx-auto w-full max-w-2xl">
              {tab === 'bilhete' && <BilheteTab goTo={setTab} />}
              {tab === 'mural' && <MuralTab goTo={setTab} />}
              {tab === 'jogos' && <JogosTab />}
            </div>
          )}
        </main>

        <nav className="sticky bottom-0 z-[1100] border-t-4 border-latao bg-vagao pb-[env(safe-area-inset-bottom)]" aria-label="Navegação principal">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-4">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 text-[12px] font-bold leading-tight transition sm:min-h-[64px] sm:text-[14px] ${
                    active ? 'bg-vagao-escuro text-latao' : 'text-papel/80 hover:text-papel'
                  }`}
                >
                  <Icon size={22} strokeWidth={active ? 2.6 : 2} />
                  <span className="text-center">{label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
      <ResearcherPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </ToastProvider>
  )
}
