import { useEffect, useRef, useState } from 'react'
import { Mic, Pause, Play, Square, Trash2 } from 'lucide-react'

const MAX_SEGUNDOS = 60

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(blob)
  })

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function Waveform({ active = false, bars = 22, seed = 3 }) {
  return (
    <div className="flex h-8 flex-1 items-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 30 + ((Math.sin(i * 1.7 + seed) + 1) / 2) * 70
        return (
          <span
            key={i}
            className={`w-[4px] rounded-full ${active ? 'onda-barra bg-tijolo' : 'bg-vagao/60'}`}
            style={{ height: `${h}%`, animationDelay: `${(i % 7) * 0.09}s` }}
          />
        )
      })}
    </div>
  )
}

// Player para áudios reais (dataUrl) ou simulados (sem microfone).
export function AudioPlayer({ audio }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const timer = useRef(null)

  useEffect(() => () => clearInterval(timer.current), [])

  const toggle = () => {
    if (audio.dataUrl) {
      const el = ref.current
      if (!el) return
      if (playing) el.pause()
      else el.play().catch(() => setPlaying(false))
      return
    }
    // simulação visual
    if (playing) {
      clearInterval(timer.current)
      setPlaying(false)
      return
    }
    setPlaying(true)
    const start = Date.now() - t * 1000
    timer.current = setInterval(() => {
      const el = (Date.now() - start) / 1000
      if (el >= audio.duracao) {
        clearInterval(timer.current)
        setPlaying(false)
        setT(0)
      } else setT(el)
    }, 200)
  }

  return (
    <div className="mt-2 flex items-center gap-3 rounded-xl border border-papel-borda bg-papel-escuro px-3 py-2">
      <button onClick={toggle} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-vagao text-papel" aria-label={playing ? 'Pausar áudio' : 'Ouvir áudio de memória'}>
        {playing ? <Pause size={22} /> : <Play size={22} />}
      </button>
      <Waveform active={playing} seed={audio.duracao || 3} />
      <span className="w-12 text-right font-maquina text-sm text-tinta-suave">{mmss(playing ? t : audio.duracao || 0)}</span>
      {audio.dataUrl && (
        <audio
          ref={ref}
          src={audio.dataUrl}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false)
            setT(0)
          }}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
          preload="none"
        />
      )}
      {audio.simulado && <span className="selo-ficticio">simulado</span>}
    </div>
  )
}

// Gravador: usa MediaRecorder quando há microfone; senão, faz uma simulação visual.
export default function AudioRecorder({ value, onChange }) {
  const [status, setStatus] = useState('idle') // idle | recording | error
  const [secs, setSecs] = useState(0)
  const simulado = useRef(false)
  const [msg, setMsg] = useState('')
  const rec = useRef(null)
  const chunks = useRef([])
  const stream = useRef(null)
  const timer = useRef(null)
  const startedAt = useRef(0)

  useEffect(
    () => () => {
      clearInterval(timer.current)
      stream.current?.getTracks().forEach((t) => t.stop())
    },
    [],
  )

  const tick = (onLimit) => {
    startedAt.current = Date.now()
    setSecs(0)
    timer.current = setInterval(() => {
      const s = (Date.now() - startedAt.current) / 1000
      setSecs(s)
      if (s >= MAX_SEGUNDOS) onLimit()
    }, 250)
  }

  const start = async () => {
    setMsg('')
    const podeGravar = typeof window.MediaRecorder !== 'undefined' && navigator.mediaDevices?.getUserMedia
    if (podeGravar) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.current = s
        const mr = new MediaRecorder(s)
        chunks.current = []
        mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data)
        mr.onstop = async () => {
          const dur = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
          const blob = new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' })
          s.getTracks().forEach((t) => t.stop())
          try {
            const dataUrl = await blobToDataUrl(blob)
            onChange({ dataUrl, mime: blob.type, duracao: dur, simulado: false, tamanhoBytes: blob.size })
          } catch {
            onChange({ dataUrl: null, duracao: dur, simulado: true })
          }
          setStatus('idle')
        }
        rec.current = mr
        mr.start()
        simulado.current = false
        setStatus('recording')
        tick(() => stop())
        return
      } catch {
        setMsg('Não conseguimos usar o microfone. Fizemos uma gravação de demonstração.')
      }
    } else {
      setMsg('Este navegador não grava áudio. Fizemos uma gravação de demonstração.')
    }
    // Simulação
    simulado.current = true
    setStatus('recording')
    tick(() => stop(true))
  }

  const stop = (forceSim) => {
    clearInterval(timer.current)
    if (!forceSim && !simulado.current && rec.current && rec.current.state === 'recording') {
      rec.current.stop()
      return
    }
    const dur = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
    onChange({ dataUrl: null, duracao: dur, simulado: true })
    setStatus('idle')
  }

  if (value) {
    return (
      <div>
        <AudioPlayer audio={value} />
        <button onClick={() => onChange(null)} className="btn-fantasma mt-1 min-h-[44px] px-3 text-sm">
          <Trash2 size={18} /> Apagar gravação
        </button>
      </div>
    )
  }

  if (status === 'recording') {
    return (
      <div className="flex items-center gap-3 rounded-xl border-2 border-tijolo bg-tijolo/5 px-3 py-2" role="status">
        <span className="h-3 w-3 animate-pulse rounded-full bg-tijolo" aria-hidden />
        <Waveform active />
        <span className="font-maquina text-base text-tijolo">{mmss(secs)}</span>
        <button onClick={() => stop()} className="btn-primario min-h-[48px] px-4">
          <Square size={18} /> Parar
        </button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={start} className="btn-contorno w-full border-tijolo text-tijolo">
        <Mic size={24} /> 🎙️ Gravar Áudio de Memória
      </button>
      {msg && <p className="mt-2 text-sm text-tinta-suave">{msg}</p>}
    </div>
  )
}
