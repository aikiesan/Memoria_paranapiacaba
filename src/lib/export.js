import { LIGACOES, PALAVRAS, POSTS, QUIZ, REACOES, SENTIDOS } from '../data/content'

export function computeStats(state) {
  const userComments = Object.entries(state.comments).flatMap(([postId, list]) =>
    list.filter((c) => c.origem === 'usuario').map((c) => ({ ...c, postId })),
  )
  const audios = userComments.filter((c) => c.audio)
  const userPins = state.pins.filter((p) => p.origem === 'usuario')
  const quizIds = Object.keys(state.quiz)
  const quizCorretas = quizIds.filter((k) => state.quiz[k].acertou)
  const palavras = Object.keys(state.wordFinds)
  const reacoesPorLocal = POSTS.map((p) => {
    const r = state.reactions[p.id] || {}
    const total = REACOES.reduce((acc, x) => acc + (r[x.key] || 0), 0)
    const minhas = REACOES.filter((x) => state.myReactions[p.id]?.[x.key]).length
    return { id: p.id, titulo: p.titulo, total, minhas, porTipo: r }
  }).sort((a, b) => b.total - a.total)
  const minhasReacoes = reacoesPorLocal.reduce((acc, x) => acc + x.minhas, 0)
  const relatosUsuario =
    userComments.length + state.quizMemories.length + state.sensoryMemories.length + userPins.length +
    Object.values(state.wordFinds).filter((w) => w.comentario?.trim()).length
  const sentimentos = {}
  Object.values(state.wordFinds).forEach((w) => {
    if (w.sentimento) sentimentos[w.sentimento] = (sentimentos[w.sentimento] || 0) + 1
  })
  return {
    relatosUsuario,
    comentariosUsuario: userComments.length,
    audios: audios.length,
    relatosSeed: Object.values(state.comments).flat().filter((c) => c.origem === 'seed').length,
    pinsTotal: state.pins.length,
    pinsUsuario: userPins.length,
    quizRespondidas: quizIds.length,
    quizCorretas: quizCorretas.length,
    quizTotal: QUIZ.length,
    memoriasQuiz: state.quizMemories.length,
    memoriasSentidos: state.sensoryMemories.length,
    palavras: palavras.length,
    palavrasTotal: PALAVRAS.length,
    palavrasLista: palavras,
    sentimentos,
    reacoesPorLocal,
    minhasReacoes,
    compartilhamentos: state.shares.length,
  }
}

const fmt = (iso) => (iso ? new Date(iso).toLocaleString('pt-BR') : '')
const ligacaoLabel = (key) => LIGACOES.find((l) => l.key === key)?.label || key || ''

export function buildExport(state) {
  return {
    projeto: 'Estação de Memória — Paranapiacaba (protótipo FAPESP / PUC-Campinas)',
    geradoEm: new Date().toISOString(),
    versaoEsquema: state.version,
    participanteId: state.participantId,
    aviso:
      'Registros com "ficticio": true são dados de demonstração (seed) e NÃO são depoimentos reais. Os demais foram inseridos neste navegador durante o teste do protótipo.',
    estatisticas: computeStats(state),
    perfil: state.profile,
    reacoes: state.reactions,
    minhasReacoes: state.myReactions,
    comentarios: state.comments,
    quiz: state.quiz,
    memoriasQuiz: state.quizMemories,
    cacaPalavras: state.wordFinds,
    memoriasSentidos: state.sensoryMemories,
    pinsMapa: state.pins,
    compartilhamentos: state.shares,
  }
}

const CSV_COLS = [
  'tipo',
  'id',
  'data_hora',
  'origem',
  'ficticio',
  'local_ou_tema',
  'autor',
  'texto',
  'sentimento',
  'oficio',
  'periodo_ou_decada',
  'ligacao_com_a_vila',
  'latitude',
  'longitude',
  'tem_audio',
  'valor',
]

function csvCell(v) {
  if (v === null || v === undefined) return ''
  const s = String(v).replace(/\r?\n/g, ' ')
  return /[";]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function buildCsv(state) {
  const rows = []
  const push = (o) => rows.push(CSV_COLS.map((c) => csvCell(o[c])))
  const p = state.profile

  if (p) {
    push({
      tipo: 'perfil_bilhete',
      id: p.numero,
      data_hora: fmt(p.updatedAt),
      origem: 'usuario',
      ficticio: 'nao',
      autor: p.nome,
      oficio: p.oficio,
      periodo_ou_decada: p.decada,
      ligacao_com_a_vila: ligacaoLabel(p.ligacao),
    })
  }

  POSTS.forEach((post) => {
    REACOES.forEach((r) => {
      push({
        tipo: 'reacao_agregada',
        id: `${post.id}:${r.key}`,
        local_ou_tema: post.titulo,
        texto: r.label,
        valor: state.reactions[post.id]?.[r.key] || 0,
        origem: state.myReactions[post.id]?.[r.key] ? 'seed+usuario' : 'seed',
      })
    })
    ;(state.comments[post.id] || []).forEach((c) => {
      push({
        tipo: 'comentario_mural',
        id: c.id,
        data_hora: fmt(c.ts),
        origem: c.origem,
        ficticio: c.ficticio ? 'sim' : 'nao',
        local_ou_tema: post.titulo,
        autor: c.autor,
        texto: c.texto,
        oficio: c.perfil?.oficio,
        periodo_ou_decada: c.perfil?.decada,
        ligacao_com_a_vila: c.relacao || ligacaoLabel(c.perfil?.ligacao),
        tem_audio: c.audio ? (c.audio.simulado ? 'simulado' : 'sim') : 'nao',
      })
    })
  })

  Object.entries(state.quiz).forEach(([qid, q]) => {
    const item = QUIZ.find((x) => x.id === qid)
    push({
      tipo: 'quiz_resposta',
      id: qid,
      data_hora: fmt(q.ts),
      origem: 'usuario',
      ficticio: 'nao',
      local_ou_tema: item?.termo,
      texto: q.acertou ? 'acertou' : 'errou',
      valor: q.tentativas,
    })
  })

  state.quizMemories.forEach((m) =>
    push({
      tipo: 'memoria_quiz',
      id: m.id,
      data_hora: fmt(m.ts),
      origem: 'usuario',
      ficticio: 'nao',
      local_ou_tema: m.termo,
      autor: m.perfil?.nome,
      texto: m.texto,
      oficio: m.perfil?.oficio,
      periodo_ou_decada: m.perfil?.decada,
      ligacao_com_a_vila: ligacaoLabel(m.perfil?.ligacao),
    }),
  )

  Object.entries(state.wordFinds).forEach(([palavra, w]) =>
    push({
      tipo: 'caca_palavras',
      id: palavra,
      data_hora: fmt(w.ts),
      origem: 'usuario',
      ficticio: 'nao',
      local_ou_tema: palavra,
      texto: w.comentario,
      sentimento: w.sentimento,
    }),
  )

  state.sensoryMemories.forEach((m) =>
    push({
      tipo: 'memoria_sentidos',
      id: m.id,
      data_hora: fmt(m.ts),
      origem: 'usuario',
      ficticio: 'nao',
      local_ou_tema: SENTIDOS.find((x) => x.id === m.tema)?.titulo || m.tema,
      autor: m.perfil?.nome,
      texto: m.texto,
      ligacao_com_a_vila: ligacaoLabel(m.perfil?.ligacao),
    }),
  )

  state.pins.forEach((pin) =>
    push({
      tipo: 'pin_mapa',
      id: pin.id,
      data_hora: fmt(pin.ts),
      origem: pin.origem,
      ficticio: pin.ficticio ? 'sim' : 'nao',
      local_ou_tema: `Família ${pin.sobrenome}`,
      autor: pin.parente,
      texto: pin.lembranca,
      oficio: pin.oficio,
      periodo_ou_decada: pin.periodo,
      latitude: pin.lat?.toFixed(6),
      longitude: pin.lng?.toFixed(6),
    }),
  )

  // Separador ";" e BOM UTF-8 para abrir corretamente no Excel em português.
  return '﻿' + [CSV_COLS.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n')
}

export function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const stamp = () => new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')
