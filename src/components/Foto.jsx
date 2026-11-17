import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Illustration from './Illustration.jsx'
import { fotosDe } from '../data/imagens'

// Crédito curto debaixo da cópia: autor e licença, com link quando houver página de origem.
function Credito({ foto }) {
  return (
    <p className="mt-1 text-[12px] leading-tight text-tinta-suave">
      Foto:{' '}
      {foto.page ? (
        <a href={foto.page} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {foto.author}
        </a>
      ) : (
        foto.author
      )}{' '}
      ·{' '}
      <a href={foto.license_url} target="_blank" rel="noreferrer" className="whitespace-nowrap underline underline-offset-2">
        {foto.license}
      </a>
    </p>
  )
}

/**
 * Foto do lugar como uma cópia de papel colada no álbum.
 * - Várias fotos para o mesmo lugar viram uma pilha que se folheia (botões ou arrastar).
 * - Sem foto, mostra a ilustração provisória na mesma moldura.
 * `moldura={false}` mostra só a imagem (usado em cartões menores).
 */
export default function Foto({ lugar, ilustracao, titulo, legenda, giro = 0, moldura = true, proporcao = 'aspect-[3/2]' }) {
  const fotos = fotosDe(lugar)
  const [i, setI] = useState(0)
  const [falhas, setFalhas] = useState({})
  const toque = useRef(null)
  const validas = fotos.filter((f) => !falhas[f.slug])
  const foto = validas[i % Math.max(validas.length, 1)]
  const varias = validas.length > 1

  const ir = (d) => setI((x) => (x + d + validas.length) % validas.length)

  const imagem = foto ? (
    <img
      key={foto.slug}
      src={foto.url}
      alt={foto.alt}
      width={foto.width}
      height={foto.height}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFalhas((f) => ({ ...f, [foto.slug]: true }))}
      className={`anim-revelar block w-full ${proporcao} bg-papel-escuro object-cover`}
    />
  ) : ilustracao ? (
    // os desenhos são 400 x 220: mantém a proporção deles para não cortar textos nas bordas
    <Illustration name={ilustracao} title={titulo} className="block aspect-[400/220] w-full" />
  ) : null

  if (!imagem) return null
  if (!moldura) return imagem

  const texto = foto?.caption || legenda

  return (
    <figure className="m-0 px-1.5 pt-1.5">
      <div className={`relative isolate ${varias ? 'pilha' : ''}`}>
      <div
        className="impressa"
        style={{ '--giro': `${giro}deg` }}
        onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (!varias || toque.current === null) return
          const dx = e.changedTouches[0].clientX - toque.current
          if (Math.abs(dx) > 45) ir(dx < 0 ? 1 : -1)
          toque.current = null
        }}
      >
        <span className="cantoneira c1" aria-hidden />
        <span className="cantoneira c2" aria-hidden />
        <span className="cantoneira c3" aria-hidden />
        <span className="cantoneira c4" aria-hidden />
        {imagem}
        {texto && <figcaption className="legenda-mao px-1 pt-1.5">{texto}</figcaption>}
      </div>
      </div>

      <div className="mt-2 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0 flex-1">{foto ? <Credito foto={foto} /> : <p className="mt-1 text-[12px] text-tinta-suave">Desenho provisório: ainda procuramos uma foto deste lugar.</p>}</div>
        {varias && (
          <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Folhear as fotos">
            <button onClick={() => ir(-1)} className="grid h-11 w-11 place-items-center rounded-full border-2 border-papel-borda bg-papel-claro text-vagao hover:border-vagao" aria-label="Foto anterior">
              <ChevronLeft size={22} />
            </button>
            <span className="min-w-[3.2rem] text-center font-maquina text-[13px]" aria-live="polite">
              {(i % validas.length) + 1} de {validas.length}
            </span>
            <button onClick={() => ir(1)} className="grid h-11 w-11 place-items-center rounded-full border-2 border-papel-borda bg-papel-claro text-vagao hover:border-vagao" aria-label="Próxima foto">
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </figure>
  )
}
