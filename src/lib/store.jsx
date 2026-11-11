import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PINS_SEED, POSTS, REACOES } from '../data/content'

const STORAGE_KEY = 'estacao-memoria-paranapiacaba-v1'
const SCHEMA_VERSION = 1

export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

function buildSeedState() {
  const reactions = {}
  const myReactions = {}
  const comments = {}
  POSTS.forEach((p) => {
    reactions[p.id] = { ...p.reacoesSeed }
    myReactions[p.id] = Object.fromEntries(REACOES.map((r) => [r.key, false]))
    comments[p.id] = p.comentariosSeed.map((c) => ({ ...c }))
  })
  return {
    version: SCHEMA_VERSION,
    participantId: uid('participante'),
    createdAt: new Date().toISOString(),
    profile: null,
    reactions,
    myReactions,
    comments,
    quiz: {},
    quizMemories: [],
    wordFinds: {},
    sensoryMemories: [],
    pins: PINS_SEED.map((p) => ({ ...p })),
    shares: [],
    prefs: { largeText: false },
  }
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildSeedState()
    const parsed = JSON.parse(raw)
    if (parsed?.version !== SCHEMA_VERSION) return buildSeedState()
    // Garante que novos locais do mural existam em estados antigos
    const base = buildSeedState()
    return {
      ...base,
      ...parsed,
      reactions: { ...base.reactions, ...parsed.reactions },
      myReactions: { ...base.myReactions, ...parsed.myReactions },
      comments: { ...base.comments, ...parsed.comments },
      prefs: { ...base.prefs, ...parsed.prefs },
    }
  } catch {
    return buildSeedState()
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [storageWarning, setStorageWarning] = useState(null)
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      setStorageWarning(null)
    } catch {
      setStorageWarning(
        'O armazenamento do navegador está cheio. Exporte os dados no Painel do Pesquisador para não perder nada.',
      )
    }
  }, [state])

  useEffect(() => {
    document.documentElement.classList.toggle('texto-grande', !!state.prefs.largeText)
  }, [state.prefs.largeText])

  const perfilResumo = useCallback(
    (s) =>
      s.profile
        ? { nome: s.profile.nome, ligacao: s.profile.ligacao, decada: s.profile.decada, oficio: s.profile.oficio }
        : null,
    [],
  )

  const actions = useMemo(
    () => ({
      saveProfile(profile) {
        setState((s) => ({
          ...s,
          profile: {
            ...profile,
            numero: s.profile?.numero || `${1867}-${String(Math.floor(1000 + Math.random() * 9000))}`,
            createdAt: s.profile?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }))
      },
      clearProfile() {
        setState((s) => ({ ...s, profile: null }))
      },
      toggleReaction(postId, key) {
        setState((s) => {
          const mine = !!s.myReactions[postId]?.[key]
          return {
            ...s,
            myReactions: { ...s.myReactions, [postId]: { ...s.myReactions[postId], [key]: !mine } },
            reactions: {
              ...s.reactions,
              [postId]: { ...s.reactions[postId], [key]: Math.max(0, (s.reactions[postId]?.[key] || 0) + (mine ? -1 : 1)) },
            },
          }
        })
      },
      addComment(postId, { texto, audio }) {
        setState((s) => {
          const nome = s.profile?.nome?.trim()
          const comment = {
            id: uid('comentario'),
            autor: nome ? nome : 'Visitante',
            relacao: s.profile?.ligacaoLabel || null,
            texto: texto?.trim() || '',
            audio: audio || null,
            ts: new Date().toISOString(),
            origem: 'usuario',
            ficticio: false,
            participantId: s.participantId,
            perfil: perfilResumo(s),
          }
          return { ...s, comments: { ...s.comments, [postId]: [...(s.comments[postId] || []), comment] } }
        })
      },
      answerQuiz(qid, acertou) {
        setState((s) => {
          const prev = s.quiz[qid]
          return {
            ...s,
            quiz: {
              ...s.quiz,
              [qid]: {
                acertou: prev?.acertou || acertou,
                tentativas: (prev?.tentativas || 0) + 1,
                primeiraTentativaCorreta: prev ? prev.primeiraTentativaCorreta : acertou,
                ts: new Date().toISOString(),
              },
            },
          }
        })
      },
      addQuizMemory(qid, termo, texto) {
        setState((s) => ({
          ...s,
          quizMemories: [
            ...s.quizMemories,
            { id: uid('memoria-quiz'), qid, termo, texto: texto.trim(), ts: new Date().toISOString(), participantId: s.participantId, perfil: perfilResumo(s) },
          ],
        }))
      },
      saveWordFind(palavra, data) {
        setState((s) => ({
          ...s,
          wordFinds: {
            ...s.wordFinds,
            [palavra]: { ...s.wordFinds[palavra], ...data, ts: s.wordFinds[palavra]?.ts || new Date().toISOString() },
          },
        }))
      },
      resetWordSearch() {
        setState((s) => ({ ...s, wordFinds: {} }))
      },
      resetQuiz() {
        setState((s) => ({ ...s, quiz: {} }))
      },
      addSensoryMemory(tema, texto) {
        setState((s) => ({
          ...s,
          sensoryMemories: [
            ...s.sensoryMemories,
            { id: uid('memoria-sentidos'), tema, texto: texto.trim(), ts: new Date().toISOString(), participantId: s.participantId, perfil: perfilResumo(s) },
          ],
        }))
      },
      addPin(pin) {
        setState((s) => ({
          ...s,
          pins: [
            ...s.pins,
            { ...pin, id: uid('pin'), ts: new Date().toISOString(), origem: 'usuario', ficticio: false, participantId: s.participantId, perfil: perfilResumo(s) },
          ],
        }))
      },
      logShare(canal) {
        setState((s) => ({ ...s, shares: [...s.shares, { canal, ts: new Date().toISOString() }] }))
      },
      toggleLargeText() {
        setState((s) => ({ ...s, prefs: { ...s.prefs, largeText: !s.prefs.largeText } }))
      },
      resetAll() {
        setState(() => buildSeedState())
      },
    }),
    [perfilResumo],
  )

  const value = useMemo(() => ({ state, actions, storageWarning }), [state, actions, storageWarning])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore precisa estar dentro de <StoreProvider>')
  return ctx
}
