// Fotografias reais (licenças abertas) que substituem as ilustrações provisórias.
//
// Como funciona: basta colocar o arquivo .webp em src/assets/imagens/ com o nome
// indicado em `creditos.json`. No próximo deploy a foto aparece automaticamente;
// enquanto o arquivo não existir, o app continua usando a ilustração vetorial.
import manifesto from '../assets/imagens/creditos.json'

const arquivos = import.meta.glob('../assets/imagens/*.webp', { eager: true, query: '?url', import: 'default' })
const urlDe = (nome) => arquivos[`../assets/imagens/${nome}`] || null

// Onde cada foto do manifesto aparece no app.
const USO = {
  mural_relogio: ['post:relogio', 'quiz:q-relogio'],
  mural_locobreque: ['post:locobreque', 'quiz:q-locobreque'],
  mural_casas: ['post:casas'],
  mural_passarela: ['post:passarela'],
  mural_oficinas: ['post:funicular'],
  mural_castelinho: ['post:castelinho'],
  mural_mercado: ['post:mercado'],
  quiz_casa_de_maquinas: ['quiz:q-maquinas'],
  // Foto de neblina intensa na vila: usada no cartão "A neblina no meio da tarde".
  sons_mata_umida: ['sentido:neblina'],
}

// Itens do manifesto que NÃO são usados, com o motivo (revisar com a equipe).
export const IMAGENS_EXCLUIDAS = {
  quiz_patamar:
    'A foto mostra uma locomotiva diesel da MRS (2003), não um patamar; e a licença indicada (PD-old) não é compatível com uma foto de 2003.',
  sons_neblina:
    'O arquivo entregue mostra um poço/túnel de tijolos visto de baixo, e não a “vista da vila na neblina” descrita no manifesto.',
}

const porLugar = {}
for (const a of manifesto.assets) {
  const url = urlDe(a.webp || a.filename)
  if (!url || IMAGENS_EXCLUIDAS[a.slug]) continue
  for (const lugar of USO[a.slug] || []) porLugar[lugar] = { ...a, url }
}

export const fotoDe = (lugar) => porLugar[lugar] || null

export const creditosEmUso = () => {
  const vistos = new Map()
  Object.values(porLugar).forEach((a) => vistos.set(a.slug, a))
  return [...vistos.values()]
}
