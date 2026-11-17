// Fotografias que substituem as ilustrações provisórias.
//
// Como funciona: basta colocar o arquivo .webp em src/assets/imagens/ com o nome
// indicado em `creditos.json`. No próximo deploy a foto aparece automaticamente;
// enquanto o arquivo não existir, o app continua usando a ilustração vetorial.
// As fotos do acervo do projeto são geradas por scripts/processar_fotos.py.
import manifesto from '../assets/imagens/creditos.json'

const arquivos = import.meta.glob('../assets/imagens/*.webp', { eager: true, query: '?url', import: 'default' })
const urlDe = (nome) => arquivos[`../assets/imagens/${nome}`] || null

// Onde cada lugar do app mostra fotos, na ordem do álbum (a primeira é a capa).
// Fotos do acervo do projeto vêm antes das de licença aberta da internet.
const USO = {
  'post:relogio': ['acervo_relogio', 'mural_relogio', 'acervo_patio_amanhecer'],
  'post:locobreque': ['mural_locobreque'],
  'post:casas': ['acervo_casas_1', 'acervo_casas_3', 'acervo_casas_2', 'acervo_casas_4', 'mural_casas'],
  'post:lyra': ['acervo_lyra'],
  'post:passarela': ['acervo_passarela', 'mural_passarela'],
  'post:funicular': ['acervo_funicular_arcos', 'acervo_funicular_galpao', 'acervo_vagao_neblina', 'mural_oficinas'],
  'post:castelinho': ['acervo_castelinho', 'mural_castelinho'],
  'post:mercado': ['acervo_mercado', 'mural_mercado'],
  'quiz:q-relogio': ['acervo_relogio', 'mural_relogio'],
  'quiz:q-locobreque': ['mural_locobreque'],
  'quiz:q-maquinas': ['acervo_casa_de_maquinas', 'quiz_casa_de_maquinas'],
  'sentido:neblina': ['acervo_neblina', 'sons_mata_umida'],
  'capa:bilhete': ['acervo_patio_amanhecer'],
}

// Itens do manifesto que NÃO são usados, com o motivo (revisar com a equipe).
export const IMAGENS_EXCLUIDAS = {
  quiz_patamar:
    'A foto mostra uma locomotiva diesel da MRS (2003), não um patamar; e a licença indicada (PD-old) não é compatível com uma foto de 2003.',
  sons_neblina:
    'O arquivo entregue mostra um poço/túnel de tijolos visto de baixo, e não a “vista da vila na neblina” descrita no manifesto.',
}

const porSlug = {}
for (const a of manifesto.assets) {
  const url = urlDe(a.webp || a.filename)
  if (url && !IMAGENS_EXCLUIDAS[a.slug]) porSlug[a.slug] = { ...a, url, acervoProprio: a.slug.startsWith('acervo_') }
}

const porLugar = Object.fromEntries(Object.entries(USO).map(([lugar, slugs]) => [lugar, slugs.map((s) => porSlug[s]).filter(Boolean)]))

export const fotosDe = (lugar) => porLugar[lugar] || []
export const fotoDe = (lugar) => fotosDe(lugar)[0] || null

export const creditosEmUso = () => {
  const vistos = new Map()
  Object.values(porLugar)
    .flat()
    .forEach((a) => vistos.set(a.slug, a))
  return [...vistos.values()]
}
