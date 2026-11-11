import { useMemo, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import { LocateFixed, MapPin, Plus, X } from 'lucide-react'
import { CENTRO_VILA, OFICIOS } from '../data/content'
import { useStore } from '../lib/store.jsx'
import Sheet from '../components/Sheet.jsx'
import { useToast } from '../components/Toast.jsx'

const corPorOficio = (oficio = '') => {
  const o = oficio.toLowerCase()
  if (/maquinista|foguista|cabineiro|freio|pátio|patio|manobra/.test(o)) return '#8B261D'
  if (/oficina|máquina|maquina|manuten/.test(o)) return '#1E3F20'
  if (/estação|estacao/.test(o)) return '#5B615D'
  return '#8A6A12'
}

const escapeHtml = (s = '') => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])

function pinIcon(pin, novo = false) {
  const cor = corPorOficio(pin.oficio)
  const inicial = escapeHtml((pin.sobrenome || '?').replace(/^(da|de|do|dos|das)\s+/i, '').charAt(0).toUpperCase())
  return L.divIcon({
    className: 'pin-familia',
    iconSize: [44, 56],
    iconAnchor: [22, 54],
    popupAnchor: [0, -50],
    html: `<svg width="44" height="56" viewBox="0 0 44 56" aria-hidden="true">
      <path d="M22 54 C22 54 4 32 4 20 A18 18 0 0 1 40 20 C40 32 22 54 22 54Z" fill="${cor}" stroke="#C59B27" stroke-width="3"/>
      <circle cx="22" cy="20" r="12" fill="#F7F3E8"/>
      <text x="22" y="26" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="16" fill="${cor}">${inicial}</text>
      ${novo ? '<circle cx="36" cy="8" r="6" fill="#C59B27" stroke="#F7F3E8" stroke-width="2"/>' : ''}
    </svg>`,
  })
}

const tempIcon = L.divIcon({
  className: 'pin-familia',
  iconSize: [44, 56],
  iconAnchor: [22, 54],
  html: `<svg width="44" height="56" viewBox="0 0 44 56"><path d="M22 54 C22 54 4 32 4 20 A18 18 0 0 1 40 20 C40 32 22 54 22 54Z" fill="#C59B27" stroke="#1E3F20" stroke-width="3" stroke-dasharray="4 3"/><text x="22" y="27" text-anchor="middle" font-size="18" font-weight="700" fill="#1E3F20">+</text></svg>`,
})

function ClickCapture({ active, onPick }) {
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng)
    },
  })
  return null
}

const vazio = { sobrenome: '', parente: '', oficio: '', periodo: '', lembranca: '' }

export default function MapaTab() {
  const { state, actions } = useStore()
  const toast = useToast()
  const [modo, setModo] = useState('ver') // ver | escolher | form
  const [ponto, setPonto] = useState(null)
  const [form, setForm] = useState(vazio)
  const [map, setMap] = useState(null)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const icons = useMemo(() => Object.fromEntries(state.pins.map((p) => [p.id, pinIcon(p, p.origem === 'usuario')])), [state.pins])

  const iniciar = () => {
    const sobrenomePerfil = state.profile?.nome?.replace(/^fam[íi]lia\s+/i, '') || ''
    setForm({ ...vazio, sobrenome: sobrenomePerfil, oficio: state.profile?.oficio || '', periodo: state.profile?.decada || '' })
    setPonto(null)
    setModo('escolher')
  }
  const cancelar = () => {
    setModo('ver')
    setPonto(null)
  }
  const salvar = () => {
    actions.addPin({ ...form, sobrenome: form.sobrenome.trim(), parente: form.parente.trim(), lembranca: form.lembranca.trim(), lat: ponto.lat, lng: ponto.lng })
    toast(`Família ${form.sobrenome.trim()} cravada no mapa! 📍`)
    map?.flyTo([ponto.lat, ponto.lng], Math.max(map.getZoom(), 17), { duration: 0.6 })
    setModo('ver')
    setPonto(null)
  }

  const familias = new Set(state.pins.map((p) => p.sobrenome.toLowerCase())).size

  return (
    <div className="relative h-full">
      <MapContainer
        center={CENTRO_VILA}
        zoom={17}
        minZoom={14}
        maxZoom={19}
        className={`mapa-antigo h-full w-full ${modo === 'escolher' ? 'cursor-crosshair' : ''}`}
        ref={setMap}
        zoomControl={false}
        attributionControl
      >
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
        <ClickCapture
          active={modo === 'escolher'}
          onPick={(latlng) => {
            setPonto(latlng)
            setModo('form')
          }}
        />
        {state.pins.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={icons[p.id]} keyboard title={`Família ${p.sobrenome}`}>
            <Popup>
              <div className="min-w-[200px] space-y-1 text-tinta">
                <p className="font-titulo text-lg font-bold leading-tight text-vagao">Família {p.sobrenome}</p>
                <p className="text-base">
                  <strong>{p.parente}</strong>
                  {p.oficio ? ` — ${p.oficio}` : ''}
                  {p.periodo ? ` (${p.periodo})` : ''}
                </p>
                {p.lembranca && <p className="text-base italic">“{p.lembranca}”</p>}
                {p.ficticio && <span className="selo-ficticio">exemplo fictício</span>}
                {p.origem === 'usuario' && <span className="selo-ficticio !border-vagao/40 !bg-vagao/10 !text-vagao">nova memória</span>}
              </div>
            </Popup>
          </Marker>
        ))}
        {ponto && <Marker position={ponto} icon={tempIcon} />}
      </MapContainer>

      {/* cabeçalho flutuante */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-[1000] mx-auto max-w-md space-y-2">
        <div className="pointer-events-auto rounded-2xl border-2 border-latao bg-papel/95 px-4 py-3 shadow-cartao backdrop-blur">
          <h1 className="font-titulo text-xl font-bold leading-tight text-vagao">Mapa de Sobrenomes</h1>
          <p className="text-base text-tinta-suave">
            {state.pins.length} memórias de {familias} famílias na vila
          </p>
        </div>
        {modo === 'escolher' && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-tijolo px-4 py-3 text-papel shadow-cartao" role="status">
            <MapPin size={28} className="shrink-0" />
            <p className="flex-1 text-base font-bold leading-snug">Toque no mapa onde ficava a casa ou o trabalho da sua família.</p>
            <button onClick={cancelar} className="grid h-11 w-11 place-items-center rounded-full bg-papel/20" aria-label="Cancelar">
              <X size={24} />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => map?.flyTo(CENTRO_VILA, 17, { duration: 0.6 })}
        className="absolute bottom-24 right-3 z-[1000] grid h-14 w-14 place-items-center rounded-full border-2 border-latao bg-papel text-vagao shadow-cartao"
        aria-label="Voltar ao centro da vila"
      >
        <LocateFixed size={26} />
      </button>

      {modo === 'ver' && (
        <button onClick={iniciar} className="btn-primario absolute inset-x-3 bottom-4 z-[1000] mx-auto min-h-[60px] max-w-md border-2 border-latao text-lg">
          <Plus size={26} /> Cravar Memória da Minha Família no Mapa
        </button>
      )}

      <p className="pointer-events-none absolute bottom-[5.6rem] left-3 z-[1000] max-w-[60%] rounded-lg bg-papel/90 px-2 py-1 text-xs text-tinta-suave">
        Posições dos exemplos são aproximadas e fictícias.
      </p>

      <Sheet open={modo === 'form'} onClose={cancelar} title="Memória da minha família" icon={<MapPin className="text-tijolo" size={28} />}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (form.sobrenome.trim()) salvar()
          }}
        >
          <div>
            <label htmlFor="pin-sob" className="rotulo">
              Sobrenome da família *
            </label>
            <input id="pin-sob" className="campo" value={form.sobrenome} onChange={(e) => set('sobrenome', e.target.value)} placeholder="Ex.: Ferreira" required maxLength={50} />
          </div>
          <div>
            <label htmlFor="pin-par" className="rotulo">
              Nome do parente ou morador
            </label>
            <input id="pin-par" className="campo" value={form.parente} onChange={(e) => set('parente', e.target.value)} placeholder="Ex.: Seu Joaquim" maxLength={60} />
          </div>
          <div>
            <label htmlFor="pin-of" className="rotulo">
              Ofício
            </label>
            <input id="pin-of" className="campo" list="oficios-lista" value={form.oficio} onChange={(e) => set('oficio', e.target.value)} placeholder="Ex.: Maquinista do Plano Inclinado" maxLength={60} />
            <datalist id="oficios-lista">
              {OFICIOS.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="pin-per" className="rotulo">
              Período (opcional)
            </label>
            <input id="pin-per" className="campo" value={form.periodo} onChange={(e) => set('periodo', e.target.value)} placeholder="Ex.: 1958–1982 ou Anos 60" maxLength={30} />
          </div>
          <div>
            <label htmlFor="pin-lem" className="rotulo">
              Uma lembrança curta
            </label>
            <textarea id="pin-lem" rows={3} className="campo resize-none" value={form.lembranca} onChange={(e) => set('lembranca', e.target.value)} placeholder="Ex.: Da janela dava para ouvir o apito da oficina." maxLength={400} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="btn-fantasma" onClick={() => setModo('escolher')}>
              Mudar o ponto
            </button>
            <button type="submit" className="btn-primario" disabled={!form.sobrenome.trim()}>
              📍 Cravar no mapa
            </button>
          </div>
        </form>
      </Sheet>
    </div>
  )
}
