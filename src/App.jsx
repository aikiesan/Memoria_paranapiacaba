import { useEffect, useState } from 'react'
import { ChartColumn, Gamepad2, Images, MapPin, QrCode, Ticket, Type } from 'lucide-react'
import { useStore } from './lib/store.jsx'
import { ToastProvider } from './components/Toast.jsx'
import ResearcherPanel from './components/ResearcherPanel.jsx'
import Apresentacao from './components/Apresentacao.jsx'
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
  // Tela de apresentação + QR Code: abre também pelo link .../#apresentacao
  const [apresOpen, setApresOpen] = useState(() => window.location.hash === '#apresentacao')
  useEffect(() => {
    const onHash = () => setApresOpen(window.location.hash === '#apresentacao')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const fecharApres = () => {
    setApresOpen(false)
    if (window.location.hash === '#apresentacao') history.replaceState(null, '', window.location.pathname + window.location.search)
  }

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
        <header className="papel-textura sticky top-0 z-[1100] border-b border-papel-borda pt-[env(safe-area-inset-top)] shadow-[0_6px_14px_-12px_rgba(42,36,32,0.6)]">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
            <svg viewBox="0 0 40 40" className="hidden h-10 w-10 shrink-0 min-[440px]:block" aria-hidden>
              <circle cx="20" cy="20" r="18" fill="none" stroke="#8B261D" strokeWidth="2" />
              <circle cx="20" cy="20" r="14.5" fill="none" stroke="#8B261D" strokeWidth="1" strokeDasharray="2 2" />
              <text x="20" y="24.5" textAnchor="middle" fontFamily="Alegreya, Georgia, serif" fontWeight="800" fontSize="12.5" fill="#8B261D">SPR</text>
            </svg>
            <div className="min-w-0 flex-1">
              <p className="truncate font-titulo text-[1.05rem] font-extrabold leading-none text-vagao min-[360px]:text-[1.2rem] sm:text-[1.45rem]">Trilhos da Memória</p>
              <p className="mt-0.5 truncate font-mao text-[15px] leading-tight text-tijolo sm:text-[16px]">Paranapiacaba<span className="hidden min-[420px]:inline">, Serra do Mar</span></p>
            </div>
            <button
              onClick={() => setApresOpen(true)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 border-papel-borda bg-papel-claro text-vagao hover:border-vagao"
              aria-label="Apresentação e QR Code para compartilhar o app"
              title="Apresentação e QR Code"
            >
              <QrCode size={20} />
            </button>
            <button
              onClick={actions.toggleLargeText}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 ${state.prefs.largeText ? 'border-vagao bg-vagao text-papel-claro' : 'border-papel-borda bg-papel-claro text-vagao'}`}
              aria-pressed={state.prefs.largeText}
              aria-label="Aumentar o tamanho das letras"
              title="Letras maiores"
            >
              <Type size={20} />
            </button>
            <button
              onClick={() => setPanelOpen(true)}
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-md border-2 border-papel-borda bg-papel-claro px-3 text-[14px] font-bold text-vagao hover:border-vagao"
              aria-label="Abrir Painel do Pesquisador e exportar dados"
            >
              <ChartColumn size={18} />
              <span className="hidden min-[400px]:inline">
                Pesquisa<span className="hidden sm:inline"> e dados</span>
              </span>
            </button>
          </div>
        </header>

        {storageWarning && <div className="bg-tijolo px-4 py-2 text-center text-sm font-bold text-papel-claro">{storageWarning}</div>}

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

        <nav className="picote-topo sticky bottom-0 z-[1100] bg-[#EFE3C4] pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_14px_-10px_rgba(42,36,32,0.5)]" aria-label="Navegação principal">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-4 divide-x-2 divide-dashed divide-kraft/60 pt-1">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex min-h-[60px] flex-col items-center justify-center gap-0.5 px-1 text-[13px] font-bold leading-tight transition sm:min-h-[64px] sm:text-[15px] ${
                    active ? 'text-tijolo' : 'text-tinta-suave hover:text-vagao'
                  }`}
                >
                  <Icon size={23} strokeWidth={active ? 2.5 : 1.9} />
                  <span className={`text-center ${active ? 'font-titulo text-[15px] font-extrabold sm:text-[17px]' : ''}`}>{label}</span>
                  {active && <span className="absolute inset-x-[22%] bottom-1 h-[3px] rounded-full bg-tijolo" aria-hidden />}
                </button>
              )
            })}
          </div>
        </nav>
      </div>
      <ResearcherPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
      <Apresentacao open={apresOpen} onClose={fecharApres} />
    </ToastProvider>
  )
}
