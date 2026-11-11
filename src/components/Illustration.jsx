// Ilustrações vetoriais originais em estilo "gravura de caderneta ferroviária".
// Servem como placeholder até a inclusão de fotografias históricas licenciadas.

const C = {
  papel: '#F7F3E8',
  papel2: '#EDE5D0',
  tijolo: '#8B261D',
  vagao: '#1E3F20',
  vagao2: '#2E5A31',
  latao: '#C59B27',
  neblina: '#D9DCD8',
  cinza: '#8C928E',
  tinta: '#2A2420',
  madeira: '#7A5A3A',
}

function Serra({ fog = true }) {
  return (
    <>
      <rect width="400" height="220" fill={C.papel} />
      <path d="M0 120 L50 70 L95 105 L150 48 L210 100 L260 60 L320 108 L370 72 L400 92 L400 220 L0 220Z" fill={C.vagao2} opacity="0.35" />
      <path d="M0 150 L60 110 L120 140 L185 96 L250 138 L310 104 L400 140 L400 220 L0 220Z" fill={C.vagao} opacity="0.55" />
      {fog && (
        <g opacity="0.75">
          <ellipse cx="80" cy="118" rx="120" ry="12" fill="#fff" />
          <ellipse cx="300" cy="102" rx="140" ry="10" fill="#fff" />
        </g>
      )}
    </>
  )
}

function Fog({ y = 175 }) {
  return (
    <g opacity="0.8">
      <ellipse cx="90" cy={y} rx="140" ry="14" fill="#fff" />
      <ellipse cx="320" cy={y + 12} rx="150" ry="12" fill="#fff" />
    </g>
  )
}

function Trilhos({ y = 200 }) {
  return (
    <g>
      <rect x="0" y={y} width="400" height="20" fill={C.tinta} opacity="0.85" />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={i * 21 + 2} y={y + 2} width="10" height="16" fill={C.madeira} />
      ))}
      <rect x="0" y={y + 4} width="400" height="3" fill={C.cinza} />
      <rect x="0" y={y + 13} width="400" height="3" fill={C.cinza} />
    </g>
  )
}

const scenes = {
  relogio: () => (
    <>
      <Serra />
      <rect x="170" y="40" width="60" height="160" fill={C.tijolo} />
      <path d="M162 40 L200 8 L238 40Z" fill={C.vagao} />
      <rect x="160" y="38" width="80" height="8" fill={C.tinta} />
      <circle cx="200" cy="82" r="24" fill={C.papel} stroke={C.latao} strokeWidth="5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6
        return <line key={i} x1={200 + Math.sin(a) * 17} y1={82 - Math.cos(a) * 17} x2={200 + Math.sin(a) * 20} y2={82 - Math.cos(a) * 20} stroke={C.tinta} strokeWidth="2" />
      })}
      <line x1="200" y1="82" x2="200" y2="66" stroke={C.tinta} strokeWidth="3" strokeLinecap="round" />
      <line x1="200" y1="82" x2="211" y2="88" stroke={C.tijolo} strokeWidth="3" strokeLinecap="round" />
      {[120, 150].map((y) => (
        <rect key={y} x="190" y={y} width="20" height="22" rx="10" fill={C.tinta} opacity="0.7" />
      ))}
      <Trilhos />
      <Fog y={150} />
    </>
  ),
  locobreque: () => (
    <>
      <Serra />
      <g transform="rotate(-12 200 170)">
        <rect x="-20" y="182" width="440" height="10" fill={C.tinta} />
        <line x1="-20" y1="178" x2="420" y2="178" stroke={C.cinza} strokeWidth="2" strokeDasharray="6 4" />
        <rect x="120" y="120" width="130" height="50" rx="6" fill={C.vagao} />
        <rect x="210" y="96" width="50" height="74" rx="4" fill={C.tijolo} />
        <rect x="220" y="104" width="30" height="20" fill={C.papel} opacity="0.9" />
        <rect x="140" y="100" width="18" height="22" fill={C.tinta} />
        <rect x="120" y="140" width="130" height="6" fill={C.latao} />
        {[150, 190, 230].map((x) => (
          <g key={x}>
            <circle cx={x} cy="176" r="14" fill={C.tinta} />
            <circle cx={x} cy="176" r="5" fill={C.latao} />
          </g>
        ))}
        <path d="M150 96 C140 70 170 66 160 46 C180 56 200 40 196 22" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85" />
      </g>
      <text x="16" y="208" fontFamily="Special Elite, monospace" fontSize="13" fill={C.papel}>LOCO-BRAKE · SPR</text>
    </>
  ),
  casas: () => (
    <>
      <Serra />
      {[20, 115, 210, 305].map((x, i) => (
        <g key={x}>
          <rect x={x} y="110" width="80" height="80" fill={[C.tijolo, C.vagao2, '#6E5A3A', C.tijolo][i]} />
          {Array.from({ length: 8 }).map((_, j) => (
            <line key={j} x1={x} y1={116 + j * 10} x2={x + 80} y2={116 + j * 10} stroke={C.tinta} strokeOpacity="0.25" />
          ))}
          <path d={`M${x - 8} 112 L${x + 40} 76 L${x + 88} 112Z`} fill={C.tinta} />
          <rect x={x + 10} y="128" width="20" height="22" fill={C.papel} />
          <line x1={x + 20} y1="128" x2={x + 20} y2="150" stroke={C.tinta} />
          <rect x={x + 46} y="140" width="22" height="50" fill={C.latao} />
          <text x={x + 34} y="100" fontFamily="Special Elite, monospace" fontSize="14" fill={C.papel}>{'ABCD'[i]}</text>
        </g>
      ))}
      <rect x="0" y="190" width="400" height="30" fill={C.cinza} />
      <Fog y={198} />
    </>
  ),
  lyra: () => (
    <>
      <Serra />
      <rect x="80" y="90" width="240" height="110" fill={C.vagao} />
      <path d="M70 92 L200 46 L330 92Z" fill={C.tijolo} />
      <rect x="110" y="66" width="180" height="20" fill={C.papel} opacity="0.95" />
      <text x="200" y="81" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="13" fill={C.tinta}>LYRA · SERRANO</text>
      {[105, 155, 225, 275].map((x) => (
        <rect key={x} x={x} y="112" width="22" height="40" rx="11" fill={C.latao} opacity="0.9" />
      ))}
      <rect x="182" y="140" width="36" height="60" fill={C.papel} />
      <g fill={C.tinta}>
        <text x="40" y="70" fontSize="30">♪</text>
        <text x="340" y="60" fontSize="34">♫</text>
        <text x="350" y="130" fontSize="24">♪</text>
      </g>
      <rect x="0" y="200" width="400" height="20" fill={C.cinza} />
    </>
  ),
  passarela: () => (
    <>
      <Serra />
      <Trilhos y={196} />
      <rect x="0" y="96" width="400" height="10" fill={C.tijolo} />
      <rect x="0" y="66" width="400" height="5" fill={C.tijolo} />
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={i} d={`M${i * 25} 71 L${i * 25 + 12.5} 96 L${i * 25 + 25} 71`} stroke={C.tijolo} strokeWidth="3" fill="none" />
      ))}
      {[60, 340].map((x) => (
        <g key={x}>
          <rect x={x - 8} y="106" width="16" height="92" fill={C.tijolo} />
          <path d={`M${x - 8} 120 L${x + 8} 150 M${x + 8} 120 L${x - 8} 150 M${x - 8} 160 L${x + 8} 190 M${x + 8} 160 L${x - 8} 190`} stroke={C.tinta} strokeWidth="2" />
        </g>
      ))}
      <g fill={C.tinta}>
        <circle cx="180" cy="52" r="6" />
        <rect x="175" y="58" width="10" height="16" rx="4" />
        <circle cx="215" cy="54" r="5" />
        <rect x="211" y="59" width="9" height="15" rx="4" />
      </g>
      <Fog y={130} />
    </>
  ),
  funicular: () => (
    <>
      <Serra fog={false} />
      <path d="M0 210 L400 70" stroke={C.tinta} strokeWidth="14" />
      <path d="M0 210 L400 70" stroke={C.cinza} strokeWidth="2" strokeDasharray="8 6" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={20 + i * 45} cy={203 - i * 15.75} r="4" fill={C.latao} />
      ))}
      <g transform="translate(150 132) rotate(-19)">
        <rect x="0" y="0" width="90" height="38" rx="4" fill={C.tijolo} />
        <rect x="8" y="7" width="16" height="14" fill={C.papel} />
        <rect x="30" y="7" width="16" height="14" fill={C.papel} />
        <rect x="52" y="7" width="16" height="14" fill={C.papel} />
        <circle cx="20" cy="42" r="7" fill={C.tinta} />
        <circle cx="70" cy="42" r="7" fill={C.tinta} />
      </g>
      <g transform="translate(330 40)">
        <circle r="30" fill="none" stroke={C.latao} strokeWidth="6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1="0" y1="0" x2={Math.cos((i * Math.PI) / 3) * 28} y2={Math.sin((i * Math.PI) / 3) * 28} stroke={C.latao} strokeWidth="3" />
        ))}
        <circle r="6" fill={C.tinta} />
      </g>
      <Fog y={190} />
    </>
  ),
  castelinho: () => (
    <>
      <Serra />
      <path d="M0 220 L0 170 C90 150 140 120 200 118 C260 120 320 150 400 170 L400 220Z" fill={C.vagao} />
      <rect x="140" y="58" width="120" height="66" fill={C.papel2} stroke={C.tinta} strokeWidth="2" />
      <path d="M130 60 L200 24 L270 60Z" fill={C.tijolo} />
      <rect x="236" y="20" width="12" height="26" fill={C.tijolo} />
      {[150, 172, 194, 216, 238].map((x) =>
        [70, 96].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="12" height="16" fill={C.vagao} />),
      )}
      <rect x="130" y="84" width="140" height="4" fill={C.madeira} />
      <Fog y={160} />
      <Trilhos y={204} />
    </>
  ),
  mercado: () => (
    <>
      <Serra />
      <rect x="70" y="90" width="260" height="110" fill={C.papel2} stroke={C.tinta} strokeWidth="2" />
      <path d="M60 92 L200 56 L340 92Z" fill={C.vagao} />
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M${70 + i * 26} 100 h26 v14 a13 13 0 0 1 -26 0Z`} fill={i % 2 ? C.tijolo : C.papel} stroke={C.tijolo} />
      ))}
      {[95, 165, 235].map((x) => (
        <g key={x}>
          <rect x={x} y="136" width="44" height="64" fill={C.madeira} />
          <circle cx={x + 12} cy="128" r="6" fill={C.latao} />
          <circle cx={x + 26} cy="128" r="6" fill={C.tijolo} />
          <circle cx={x + 38} cy="129" r="5" fill={C.vagao2} />
        </g>
      ))}
      <rect x="0" y="200" width="400" height="20" fill={C.cinza} />
    </>
  ),
  escola: () => (
    <>
      <Serra />
      <rect x="60" y="96" width="280" height="104" fill={C.tijolo} />
      <path d="M50 98 L200 60 L350 98Z" fill={C.tinta} />
      <rect x="170" y="70" width="60" height="18" fill={C.papel} />
      <text x="200" y="83" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="10" fill={C.tinta}>GRUPO ESCOLAR</text>
      {[80, 120, 250, 290].map((x) => (
        <rect key={x} x={x} y="116" width="26" height="34" fill={C.papel} stroke={C.latao} strokeWidth="3" />
      ))}
      <rect x="182" y="136" width="36" height="64" fill={C.vagao} />
      <line x1="200" y1="28" x2="200" y2="60" stroke={C.tinta} strokeWidth="3" />
      <rect x="200" y="28" width="30" height="18" fill={C.latao} />
      <rect x="0" y="200" width="400" height="20" fill={C.cinza} />
      <Fog y={190} />
    </>
  ),
  cabine: () => (
    <>
      <Serra />
      <rect x="130" y="110" width="140" height="90" fill={C.tijolo} />
      <rect x="120" y="60" width="160" height="54" fill={C.vagao} />
      {[132, 172, 212, 252].map((x) => (
        <rect key={x} x={x} y="70" width="28" height="34" fill={C.papel} opacity="0.9" />
      ))}
      <path d="M110 62 L200 30 L290 62Z" fill={C.tinta} />
      {[150, 170, 190, 210, 230, 250].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="104" x2={x + (i % 2 ? 8 : -8)} y2="84" stroke={i % 3 === 0 ? C.tijolo : C.latao} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <g transform="translate(340 60)">
        <rect x="-3" y="0" width="6" height="140" fill={C.tinta} />
        <rect x="0" y="10" width="34" height="10" fill={C.tijolo} />
        <circle cx="-14" cy="16" r="7" fill={C.latao} />
      </g>
      <Trilhos />
    </>
  ),
  apito: () => (
    <>
      <Serra />
      <g transform="translate(200 130)">
        <rect x="-18" y="-10" width="36" height="80" fill={C.latao} />
        <rect x="-28" y="-20" width="56" height="14" rx="4" fill={C.latao} stroke={C.latao} />
        <rect x="-10" y="20" width="20" height="10" fill={C.tinta} />
        <rect x="-26" y="66" width="52" height="12" fill={C.tinta} />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} fill="none" stroke={C.tijolo} strokeWidth="5" strokeLinecap="round">
          <path d={`M${150 - i * 22} ${110 - i * 6} q-14 -28 0 -56`} />
          <path d={`M${250 + i * 22} ${110 - i * 6} q14 -28 0 -56`} />
        </g>
      ))}
      <path d="M200 98 C185 74 215 62 200 36" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.9" />
    </>
  ),
  viradouro: () => (
    <>
      <rect width="400" height="220" fill={C.papel2} />
      <circle cx="200" cy="110" r="92" fill={C.cinza} />
      <circle cx="200" cy="110" r="86" fill={C.papel} stroke={C.tinta} strokeWidth="3" />
      <g transform="rotate(-25 200 110)">
        <rect x="100" y="100" width="200" height="20" fill={C.tinta} />
        <rect x="100" y="103" width="200" height="3" fill={C.cinza} />
        <rect x="100" y="114" width="200" height="3" fill={C.cinza} />
        <rect x="140" y="92" width="110" height="36" rx="6" fill={C.vagao} />
        <rect x="230" y="96" width="30" height="28" fill={C.tijolo} />
      </g>
      <path d="M300 40 A110 110 0 0 1 320 150" stroke={C.tijolo} strokeWidth="6" fill="none" markerEnd="url(#seta)" />
      <defs>
        <marker id="seta" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8Z" fill={C.tijolo} />
        </marker>
      </defs>
      <rect x="0" y="100" width="108" height="20" fill={C.tinta} opacity="0.75" />
      <rect x="292" y="100" width="108" height="20" fill={C.tinta} opacity="0.75" />
    </>
  ),
  casaMaquinas: () => (
    <>
      <Serra />
      <rect x="60" y="80" width="280" height="120" fill={C.tijolo} />
      <path d="M50 82 L200 40 L350 82Z" fill={C.tinta} />
      <rect x="290" y="20" width="20" height="50" fill={C.tijolo} />
      <g transform="translate(200 140)">
        <circle r="48" fill={C.papel} stroke={C.latao} strokeWidth="8" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="0" y1="0" x2={Math.cos((i * Math.PI) / 4) * 44} y2={Math.sin((i * Math.PI) / 4) * 44} stroke={C.tinta} strokeWidth="4" />
        ))}
        <circle r="9" fill={C.tinta} />
      </g>
      <path d="M248 140 L400 110" stroke={C.tinta} strokeWidth="4" />
      <path d="M300 30 C290 10 320 4 310 -10" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.85" />
    </>
  ),
  foguista: () => (
    <>
      <rect width="400" height="220" fill={C.tinta} />
      <rect x="110" y="40" width="180" height="140" rx="8" fill={C.vagao} />
      <rect x="150" y="80" width="100" height="70" rx="6" fill={C.tinta} stroke={C.latao} strokeWidth="6" />
      <path d="M160 150 C165 120 180 130 180 100 C195 118 200 96 205 84 C215 110 230 108 228 130 C238 124 240 140 240 150Z" fill={C.tijolo} />
      <path d="M180 150 C185 132 195 136 198 116 C206 130 214 128 216 150Z" fill={C.latao} />
      <g transform="translate(300 130) rotate(-30)">
        <rect x="0" y="-4" width="80" height="8" fill={C.madeira} />
        <path d="M-30 -16 L4 -10 L4 10 L-30 16Z" fill={C.cinza} />
      </g>
      {[30, 60, 340, 370].map((x, i) => (
        <circle key={x} cx={x} cy={180 + (i % 2) * 14} r="12" fill="#111" />
      ))}
    </>
  ),
  patamar: () => (
    <>
      <Serra fog={false} />
      <path d="M0 210 L90 210 L150 160 L210 160 L270 110 L330 110 L400 50" stroke={C.tinta} strokeWidth="10" fill="none" />
      {[
        [90, 196],
        [210, 146],
        [330, 96],
      ].map(([x, y]) => (
        <g key={x}>
          <rect x={x - 6} y={y - 30} width="54" height="30" fill={C.tijolo} />
          <path d={`M${x - 10} ${y - 30} L${x + 21} ${y - 46} L${x + 52} ${y - 30}Z`} fill={C.tinta} />
          <circle cx={x + 21} cy={y - 14} r="9" fill="none" stroke={C.latao} strokeWidth="3" />
        </g>
      ))}
      <Fog y={150} />
    </>
  ),
}

export default function Illustration({ name, className = '', title }) {
  const Scene = scenes[name] || scenes.relogio
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label={title || 'Ilustração'} preserveAspectRatio="xMidYMid slice">
      <Scene />
    </svg>
  )
}
