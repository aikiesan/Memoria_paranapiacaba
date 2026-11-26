import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Copy, Download, Share2, X } from 'lucide-react'
import { APP_URL, APRESENTACAO } from '../data/content'
import { useToast } from './Toast.jsx'

// Tela de apresentação: para projetar no telão ou mostrar no celular.
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
    return () => window.removeEventListener('keydown', onKey)
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

      <div className="mx-auto grid min-h-full w-full max-w-6xl items-center gap-8 px-5 pb-12 pt-20 md:py-12 md:grid-cols-[1.15fr_1fr] md:gap-12 md:px-10">
        {/* Texto */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-maquina text-sm uppercase tracking-[0.25em] text-tijolo">Paranapiacaba · Serra do Mar</p>
            <h1 className="font-titulo text-[2.6rem] font-extrabold leading-[1.02] text-vagao sm:text-[3.4rem] lg:text-[4rem]">Trilhos da Memória</h1>
            <p className="max-w-xl text-[1.1rem] leading-snug text-tinta sm:text-[1.25rem]">
              Uma ferramenta para conversar com ferroviários, moradores e suas famílias e guardar as lembranças da vila ferroviária.
            </p>
          </div>

          <ol className="grid gap-3 sm:grid-cols-2">
            {APRESENTACAO.ferramenta.map((f, i) => (
              <li key={f.titulo} className="rounded-md border border-papel-borda bg-papel-claro p-3.5 shadow-cartao">
                <p className="font-titulo text-[1.15rem] font-extrabold leading-tight text-vagao">
                  <span className="mr-1.5 font-maquina text-tijolo">{i + 1}.</span>
                  {f.titulo}
                </p>
                <p className="mt-1 text-[15px] leading-snug text-tinta-suave">{f.texto}</p>
              </li>
            ))}
          </ol>

          <div className="border-l-4 border-tijolo pl-3">
            <p className="text-[13px] uppercase tracking-wider text-tinta-suave">Apresentação</p>
            <p className="font-titulo text-[1.5rem] font-extrabold leading-tight text-vagao">{APRESENTACAO.apresentador}</p>
            <p className="text-[15px] text-tinta-suave">{APRESENTACAO.papel}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="order-first flex flex-col items-center gap-4 text-center md:order-none">
          <div className="w-full max-w-[420px] rounded-lg border-[3px] border-tijolo bg-white p-4 shadow-foto">
            <img src={`${base}qrcode.svg`} alt={`QR Code para abrir ${endereco}`} className="block aspect-square w-full" />
          </div>
          <p className="font-mao text-[1.35rem] leading-tight text-tijolo">{APRESENTACAO.convite}</p>
          <p className="break-all font-maquina text-[15px] text-tinta sm:text-[17px]">{endereco}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={compartilhar} className="flex min-h-[48px] items-center gap-2 rounded-md bg-vagao px-4 font-bold text-papel-claro hover:bg-vagao-claro">
              <Share2 size={20} /> Compartilhar
            </button>
            <button onClick={copiar} className="flex min-h-[48px] items-center gap-2 rounded-md border-2 border-papel-borda bg-papel-claro px-4 font-bold text-vagao hover:border-vagao">
              <Copy size={20} /> Copiar link
            </button>
            <a
              href={`${base}qrcode.png`}
              download="qrcode-trilhos-da-memoria.png"
              className="flex min-h-[48px] items-center gap-2 rounded-md border-2 border-papel-borda bg-papel-claro px-4 font-bold text-vagao hover:border-vagao"
            >
              <Download size={20} /> QR para imprimir
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
