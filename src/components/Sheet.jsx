import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Folha modal que ocupa a "tela do celular" (posição absoluta dentro da moldura).
export default function Sheet({ open, onClose, title, children, tall = false, icon = null }) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closeRef.current?.()
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null
  const alvo = document.getElementById('camada-modal') || document.body
  return createPortal(
    <div className="pointer-events-auto absolute inset-0 z-[1200] flex items-end justify-center bg-tinta/60 backdrop-blur-[2px]" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`anim-subir papel-textura flex w-full flex-col rounded-t-3xl border-t-4 border-latao shadow-2xl outline-none ${
          tall ? 'h-[92%]' : 'max-h-[88%]'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-papel-borda px-5 py-4">
          {icon}
          <h2 className="flex-1 font-titulo text-xl font-bold leading-tight text-vagao">{title}</h2>
          <button onClick={onClose} className="grid h-12 w-12 place-items-center rounded-full bg-papel-escuro text-tinta hover:bg-papel-borda" aria-label="Fechar">
            <X size={26} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>,
    alvo,
  )
}
