import { createContext, useCallback, useContext, useState } from 'react'

const ToastCtx = createContext(() => {})

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null)
  const show = useCallback((text) => {
    setMsg({ text, id: Date.now() })
    setTimeout(() => setMsg((m) => (m && Date.now() - m.id >= 2600 ? null : m)), 2800)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && (
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[2100] flex justify-center px-6" role="status" aria-live="polite">
          <div key={msg.id} className="anim-subir rounded-2xl border-2 border-latao bg-vagao px-5 py-3 text-center text-base font-bold text-papel shadow-2xl">
            {msg.text}
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
