import { useMemo, useState } from 'react'
import { ChartColumn, FileJson, FileSpreadsheet, RotateCcw } from 'lucide-react'
import { FONTES, LIGACOES, SENTIMENTOS } from '../data/content'
import { useStore } from '../lib/store.jsx'
import { buildCsv, buildExport, computeStats, downloadFile, stamp } from '../lib/export'
import Sheet from './Sheet.jsx'
import { useToast } from './Toast.jsx'

function Tile({ valor, rotulo, detalhe }) {
  return (
    <div className="rounded-2xl border border-papel-borda bg-white p-3">
      <p className="font-titulo text-3xl font-bold leading-none text-vagao">{valor}</p>
      <p className="mt-1 text-sm font-bold leading-tight text-tinta">{rotulo}</p>
      {detalhe && <p className="text-xs text-tinta-suave">{detalhe}</p>}
    </div>
  )
}

export default function ResearcherPanel({ open, onClose }) {
  const { state, actions } = useStore()
  const toast = useToast()
  const [confirmar, setConfirmar] = useState(false)
  const s = useMemo(() => computeStats(state), [state])
  const maxReacao = Math.max(1, ...s.reacoesPorLocal.map((r) => r.total))
  const lig = LIGACOES.find((l) => l.key === state.profile?.ligacao)

  return (
    <Sheet open={open} onClose={onClose} tall title="Painel PUC-Campinas / FAPESP" icon={<ChartColumn className="text-tijolo" size={28} />}>
      <div className="space-y-6">
        <p className="text-base text-tinta-suave">
          Dados coletados <strong>neste aparelho</strong> durante a demonstração. Use os botões abaixo para baixar tudo e enviar à equipe de pesquisa.
        </p>

        <section aria-label="Resumo">
          <div className="grid grid-cols-2 gap-2">
            <Tile valor={s.relatosUsuario} rotulo="Relatos coletados" detalhe={`+ ${s.relatosSeed} fictícios de exemplo`} />
            <Tile valor={s.minhasReacoes} rotulo="Reações feitas" detalhe="no Mural da Vila" />
            <Tile valor={s.pinsUsuario} rotulo="Pins novos no mapa" detalhe={`${s.pinsTotal} no total`} />
            <Tile valor={`${s.palavras}/${s.palavrasTotal}`} rotulo="Palavras desbloqueadas" detalhe="Caça-palavras" />
            <Tile valor={`${s.quizCorretas}/${s.quizTotal}`} rotulo="Memórias do quiz" detalhe={`${s.memoriasQuiz} ${s.memoriasQuiz === 1 ? 'relato escrito' : 'relatos escritos'}`} />
            <Tile valor={s.audios} rotulo="Áudios gravados" detalhe={`${s.compartilhamentos} compartilhamentos`} />
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="font-titulo text-lg font-bold text-vagao">Perfil do participante</h3>
          {state.profile ? (
            <p className="rounded-xl bg-white p-3 text-base">
              <strong>{state.profile.nome}</strong> · {lig?.label || '—'} · {state.profile.decada || '—'} · {state.profile.oficio || '—'}
            </p>
          ) : (
            <p className="rounded-xl bg-white p-3 text-base text-tinta-suave">Ainda não emitiu o bilhete.</p>
          )}
          <p className="font-maquina text-xs text-tinta-suave">ID anônimo: {state.participantId}</p>
        </section>

        <section className="space-y-2">
          <h3 className="font-titulo text-lg font-bold text-vagao">Reações por local (total)</h3>
          <ul className="space-y-2">
            {s.reacoesPorLocal.map((r) => (
              <li key={r.id} title={`${r.titulo}: ${r.total} reações (${r.minhas} deste aparelho)`}>
                <div className="flex justify-between gap-2 text-sm">
                  <span className="truncate font-bold">{r.titulo.split(' — ')[0]}</span>
                  <span className="shrink-0 font-maquina text-tinta-suave">
                    {r.total}
                    {r.minhas > 0 && <span className="text-tijolo"> (+{r.minhas})</span>}
                  </span>
                </div>
                <div className="mt-1 h-3 rounded-r bg-papel-escuro">
                  <div className="h-full rounded-r bg-vagao" style={{ width: `${(r.total / maxReacao) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-tinta-suave">Totais incluem contagens fictícias de exemplo. Entre parênteses: reações feitas neste aparelho.</p>
        </section>

        {Object.keys(s.sentimentos).length > 0 && (
          <section className="space-y-2">
            <h3 className="font-titulo text-lg font-bold text-vagao">Sentimentos no caça-palavras</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(s.sentimentos).map(([k, n]) => {
                const st = SENTIMENTOS.find((x) => x.key === k)
                return (
                  <span key={k} className="rounded-full border border-papel-borda bg-white px-3 py-1 text-base">
                    {st?.emoji} {st?.label || k}: <strong>{n}</strong>
                  </span>
                )
              })}
            </div>
          </section>
        )}

        <section className="space-y-2">
          <h3 className="font-titulo text-lg font-bold text-vagao">Baixar dados</h3>
          <div className="grid gap-2">
            <button
              className="btn-verde w-full"
              onClick={() => {
                downloadFile(`estacao-memoria_${stamp()}.json`, JSON.stringify(buildExport(state), null, 2), 'application/json')
                toast('Arquivo JSON baixado')
              }}
            >
              <FileJson size={22} /> Baixar tudo em .json
            </button>
            <button
              className="btn-verde w-full"
              onClick={() => {
                downloadFile(`estacao-memoria_${stamp()}.csv`, buildCsv(state), 'text/csv;charset=utf-8')
                toast('Planilha CSV baixada')
              }}
            >
              <FileSpreadsheet size={22} /> Baixar planilha .csv
            </button>
          </div>
          <p className="text-xs text-tinta-suave">CSV separado por ponto e vírgula (abre direto no Excel/LibreOffice em português). O JSON inclui os áudios gravados.</p>
        </section>

        <section className="space-y-2 rounded-2xl border-2 border-tijolo/30 p-4">
          <h3 className="font-titulo text-lg font-bold text-tijolo">Resetar dados de demonstração</h3>
          <p className="text-sm text-tinta-suave">Apaga tudo o que foi inserido neste aparelho e volta aos dados de exemplo.</p>
          {confirmar ? (
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-fantasma" onClick={() => setConfirmar(false)}>
                Cancelar
              </button>
              <button
                className="btn-primario"
                onClick={() => {
                  actions.resetAll()
                  setConfirmar(false)
                  toast('Dados de demonstração restaurados')
                }}
              >
                Sim, apagar
              </button>
            </div>
          ) : (
            <button className="btn-contorno w-full border-tijolo text-tijolo" onClick={() => setConfirmar(true)}>
              <RotateCcw size={20} /> Resetar dados
            </button>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="font-titulo text-lg font-bold text-vagao">Fontes do conteúdo</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {FONTES.map((f) => (
              <li key={f.id}>
                <a href={f.url} target="_blank" rel="noreferrer" className="text-vagao underline underline-offset-2">
                  {f.titulo}
                </a>
              </li>
            ))}
          </ol>
          <p className="text-xs text-tinta-suave">
            Relatos, comentários e famílias marcados como “fictício” são dados de demonstração e não devem ser apresentados como depoimentos reais.
          </p>
        </section>
      </div>
    </Sheet>
  )
}
