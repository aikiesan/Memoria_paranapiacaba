import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Copy, Download, Share2, X } from 'lucide-react'
import { APP_URL, APRESENTACAO } from '../data/content'
import { useToast } from './Toast.jsx'

// Tela de apresentação (mobile): mostrar o QR de um celular para o outro.
// Mostra o que é a ferramenta, quem apresenta e o QR Code de acesso.
// Abre pelo botão de QR no topo ou pelo endereço .../#apresentacao
export default function Apresentacao({ open, onClose }) {
  const toast = useToast()
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closeRef.current?.()
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    // trava a rolagem do app por trás enquanto a apresentação está aberta
    const overflowAntes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflowAntes
    }
  }, [open])

  if (!open) return null

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL)
      toast?.('Link copiado!')
    } catch {
      window.prompt('Copie o link:', APP_URL)
    }
  }
  const compartilhar = async () => {
    const texto = `🚂 Trilhos da Memória — Paranapiacaba. Conte a sua história da vila ferroviária:\n${APP_URL}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Trilhos da Memória', text: texto, url: APP_URL })
        return
      } catch {
        /* cancelado: cai no WhatsApp */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
  }

  const endereco = APP_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return createPortal(
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Apresentação do Trilhos da Memória"
      className="papel-textura fixed inset-0 z-[2500] overflow-y-auto outline-none"
    >
      <button
        onClick={onClose}
        className="fixed right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-10 grid h-12 w-12 place-items-center rounded-full bg-papel-escuro text-tinta shadow-cartao hover:bg-papel-borda"
        aria-label="Fechar apresentação"
      >
        <X size={24} />
      </button>

      {/* Uma coluna só, pensada para o celular: QR primeiro, depois o que é a ferramenta */}
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+4.5rem)]">
        <div className="space-y-1 text-center">
          <p className="font-maquina text-[12px] uppercase tracking-[0.2em] text-tijolo">Paranapiacaba · Serra do Mar</p>
          <h1 className="font-titulo text-[2.2rem] font-extrabold leading-none text-vagao">Trilhos da Memória</h1>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-full max-w-[300px] rounded-lg border-[3px] border-tijolo bg-white p-3 shadow-foto">
            <img src={`${base}qrcode.svg`} alt={`QR Code para abrir ${endereco}`} className="block aspect-square w-full" />
          </div>
          <p className="font-mao text-[1.2rem] leading-tight text-tijolo">{APRESENTACAO.convite}</p>
          <p className="font-maquina text-[13px] text-tinta-suave">{endereco}</p>
          <div className="grid w-full grid-cols-2 gap-2">
            <button onClick={compartilhar} className="col-span-2 flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-vagao px-4 text-[16px] font-bold text-papel-claro active:bg-vagao-claro">
              <Share2 size={20} /> Compartilhar no WhatsApp
            </button>
            <button onClick={copiar} className="flex min-h-[48px] items-center justify-center gap-2 rounded-md border-2 border-papel-borda bg-papel-claro px-3 font-bold text-vagao">
              <Copy size={18} /> Copiar link
            </button>
            <a
              href={`${base}qrcode.png`}
              download="qrcode-trilhos-da-memoria.png"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-md border-2 border-papel-borda bg-papel-claro px-3 font-bold text-vagao"
            >
              <Download size={18} /> Baixar QR
            </a>
          </div>
        </div>

        {/* A ferramenta */}
        <div className="space-y-3">
          <p className="text-[16px] leading-snug text-tinta">
            Uma ferramenta para conversar com ferroviários, moradores e suas famílias e guardar as lembranças da vila ferroviária.
          </p>
          <ol className="space-y-2">
            {APRESENTACAO.ferramenta.map((f, i) => (
              <li key={f.titulo} className="rounded-md border border-papel-borda bg-papel-claro px-3.5 py-3 shadow-cartao">
                <p className="font-titulo text-[1.1rem] font-extrabold leading-tight text-vagao">
                  <span className="mr-1.5 font-maquina text-tijolo">{i + 1}.</span>
                  {f.titulo}
                </p>
                <p className="mt-0.5 text-[15px] leading-snug text-tinta-suave">{f.texto}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="border-l-4 border-tijolo pl-3">
          <p className="text-[13px] uppercase tracking-wider text-tinta-suave">Apresentação</p>
          <p className="font-titulo text-[1.4rem] font-extrabold leading-tight text-vagao">{APRESENTACAO.apresentador}</p>
          <p className="text-[15px] text-tinta-suave">{APRESENTACAO.papel}</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
