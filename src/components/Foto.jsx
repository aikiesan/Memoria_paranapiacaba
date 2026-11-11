import { useState } from 'react'
import Illustration from './Illustration.jsx'
import { fotoDe } from '../data/imagens'

// Mostra a fotografia licenciada do lugar, com crédito; sem foto, usa a ilustração.
export default function Foto({ lugar, ilustracao, titulo, className = '', credito = true }) {
  const foto = fotoDe(lugar)
  const [falhou, setFalhou] = useState(false)

  if (!foto || falhou) return <Illustration name={ilustracao} title={titulo} className={className} />

  return (
    <figure className="relative m-0">
      <img
        src={foto.url}
        alt={foto.alt}
        width={foto.width}
        height={foto.height}
        loading="lazy"
        decoding="async"
        onError={() => setFalhou(true)}
        className={`${className} bg-neblina-claro object-cover`}
      />
      {credito && (
        <figcaption className="absolute left-0 top-0 max-w-[85%] rounded-br-lg bg-tinta/60 px-2 py-0.5 text-[11px] leading-tight text-papel">
          Foto:{' '}
          <a href={foto.page} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {foto.author}
          </a>{' '}
          ·{' '}
          <a href={foto.license_url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {foto.license}
          </a>{' '}
          · recortada
        </figcaption>
      )}
    </figure>
  )
}
