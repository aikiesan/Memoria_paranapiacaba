# Trilhos da Memória — Paranapiacaba

Protótipo funcional de um WebApp **mobile-first** para conversar com moradores, ferroviários e seus familiares sobre a vida na
Vila Ferroviária de Paranapiacaba, resgatando a memória da São Paulo Railway (SPR) enquanto **coleta relatos, reações e lembranças
geolocalizadas**.

Faz parte do projeto **FAPESP / PUC-Campinas** de apoio à candidatura de Paranapiacaba a Patrimônio da Humanidade (UNESCO).

**Acesse:** https://aikiesan.github.io/Memoria_paranapiacaba/

<img src="public/qrcode.png" alt="QR Code do Trilhos da Memória" width="180" />

**Apresentação (telão + QR Code):** https://aikiesan.github.io/Memoria_paranapiacaba/#apresentacao.
Também abre pelo botão de QR no topo do app. O QR em alta para imprimir fica em
[`public/qrcode.png`](public/qrcode.png) (no site: `/Memoria_paranapiacaba/qrcode.png`).

> ⚠️ **Versão de demonstração.** Os relatos, comentários, contagens de reações e famílias do mapa que vêm pré-carregados são
> **fictícios** (marcados com o selo “fictício” no app e `ficticio: true` nos dados exportados). Eles existem só para ilustrar
> o funcionamento e **não devem ser apresentados como depoimentos reais**.

---

## O que o protótipo faz

| Aba | Para quê | O que é coletado |
| --- | --- | --- |
| 🪪 **Meu Bilhete** | Acolhida: “Qual a sua ligação com os trilhos?”, nome/sobrenome, década e ofício lembrado. Gera na hora um *Bilhete Histórico da SPR* com botão **Compartilhar no WhatsApp**. O bilhete ganha carimbos conforme a pessoa participa das outras abas. | Perfil do participante (ligação, década, ofício) |
| 📸 **Mural da Vila** | Feed com 9 locais de memória (Relógio, Locobreque, Casas de madeira, Lyra-Serrano, Passarela, Funicular, Castelinho, Mercado, Escola). Cada card tem 3 reações afetivas com contador, comentários, frases prontas para começar e **gravação de áudio** (MediaRecorder; sem microfone, faz uma gravação simulada). Entre os cards, perguntas sobre *sons e cheiros da Serra*. | Reações, comentários escritos, áudios, memórias sensoriais |
| ⚙️ **Jogos da Ferrovia** | **Quiz “Engenhocas e Ofícios da Serra”** (8 perguntas, com foto quando houver). Ao acertar: *“Você desbloqueou essa memória! Alguém da sua família contava histórias sobre isso? Conta pra gente!”*. **Caça-palavras 10×10** (tocar primeira e última letra, ou arrastar): cada palavra encontrada mostra uma curiosidade e pergunta o sentimento da pessoa. | Acertos, memórias do quiz, palavras e sentimentos |
| 📍 **Mapa de Sobrenomes** | Mapa Leaflet centrado na vila (`-23.7780, -46.2995`, zoom 17) com pins de famílias ferroviárias. Botão **“+ Cravar Memória da Minha Família no Mapa”**: toca-se no mapa, preenche sobrenome, parente, ofício e uma lembrança, e o pin aparece na hora. | Pins geolocalizados (lat/lng) com relato |
| 📊 **Painel do Pesquisador** (topo) | Estatísticas em tempo real, reações por local, sentimentos, download **.json** e **.csv** e botão **Resetar dados de demonstração**. | — |

### Identidade visual: álbum de família + bilhete da SPR

O app imita um álbum de família folheado junto com o bilhete Edmondson da São Paulo Railway: papel de linho com grão,
fotos como cópias de papel presas por cantoneiras, legendas escritas à mão, carimbos de borracha para as reações,
recados colados com fita para as memórias dos moradores e a barra de navegação com borda picotada de bilhete.
Os estilos ficam em [`src/index.css`](src/index.css) (`.impressa`, `.cantoneira`, `.carimbo-*`, `.recado`, `.fita`,
`.picote-topo`, `.campo-pautado`) e as cores e fontes em [`tailwind.config.js`](tailwind.config.js).

### Acessibilidade e linguagem

- Botões com no mínimo 48–52 px de altura, texto do corpo ≥ 16 px, alto contraste e ícones grandes (Lucide).
- Botão **“T”** no topo aumenta as letras de todo o app (preferência salva no aparelho).
- Fonte **Atkinson Hyperlegible** (desenhada para baixa visão) no corpo; *Alegreya* nos títulos, *Kalam* (letra de mão) nas legendas das fotos e *Special Elite* (máquina de escrever) no bilhete.
- Linguagem de conversa, sem termos acadêmicos. Respeita `prefers-reduced-motion`.
- Site responsivo: abre em tela cheia em qualquer celular, tablet ou computador (basta compartilhar o link). O conteúdo fica centralizado em telas grandes e a navegação fica sempre ao alcance do polegar.

## Como os dados são guardados (protótipo)

- Tudo fica no `localStorage` **do próprio navegador** (chave `estacao-memoria-paranapiacaba-v1`). Não há servidor.
- Na primeira visita, os dados de exemplo (seed) são carregados. O botão **Resetar** volta a esse estado.
- Cada aparelho recebe um **ID anônimo de participante**, que acompanha cada registro exportado.
- **Exportação JSON**: todos os dados estruturados, incluindo os áudios gravados (em base64) e as estatísticas.
- **Exportação CSV**: uma tabela única (uma linha por registro) com as colunas
  `tipo; id; data_hora; origem; ficticio; local_ou_tema; autor; texto; sentimento; oficio; periodo_ou_decada; ligacao_com_a_vila; latitude; longitude; tem_audio; valor`.
  Usa `;` como separador e BOM UTF-8, para abrir direto no Excel/LibreOffice em português.
- Tipos de registro no CSV: `perfil_bilhete`, `reacao_agregada`, `comentario_mural`, `quiz_resposta`, `memoria_quiz`,
  `caca_palavras`, `memoria_sentidos`, `pin_mapa`.

> Para uso em campo com participantes reais será preciso um backend (ex.: Supabase/Firebase) e um **Termo de Consentimento
> Livre e Esclarecido** aprovado pelo Comitê de Ética, sobretudo para áudios e nomes de familiares.

## Conteúdo e fontes

Definições e curiosidades vêm do documento-base do projeto, apoiado em:

1. [UNESCO — Cultural Landscape of Paranapiacaba (Lista Indicativa)](https://whc.unesco.org/en/tentativelists/5878/)
2. [Turismo Santo André — Pátio Ferroviário](https://www3.santoandre.sp.gov.br/turismosantoandre/mercado-6/)
3. [Turismo Santo André — Museu Castelo](https://www3.santoandre.sp.gov.br/turismosantoandre/museu-castelo/)
4. [Turismo Santo André — Vila de Paranapiacaba](https://www3.santoandre.sp.gov.br/turismosantoandre/vila-ferroviaria-paranapiacaba/)
5. [ANPUH — Oralidades em foco: estudos de uma vila ferroviária](https://www.snh2015.anpuh.org/resources/anais/39/1428342827_ARQUIVO_Oralidadesemfoco.pdf)
6. [IPHAN — Vilas ferroviárias e o mundo do trabalho](https://www.gov.br/iphan/pt-br/patrimonio-cultural/patrimonio-material/patrimonio-ferroviario/tematica-06-patrimonio-ferroviario-vilas-ferroviarias-e-o-mundo-de-trabalho-recuperacao-e-conservacao)

Pontos a validar com ferroviários antes de publicar: a nomenclatura exata de **cabineiro**; o termo “Fogo Paulista”
(propositalmente **não** usado no app); as posições dos pins de exemplo (aproximadas).

### Fotografias

**Acervo do projeto.** As fotos `acervo_*.webp` foram feitas pela equipe com moradores da vila e são creditadas como
*Acervo Trilhos da Memória (FAPESP/PUC-Campinas)*, CC BY 4.0. Os originais (HEIC/JPG) **não** entram no repositório.
Para converter fotos novas, acrescente uma linha em [`scripts/processar_fotos.py`](scripts/processar_fotos.py) (recorte 3:2,
ponto central e áreas a desfocar) e rode:

```bash
uv run --with pillow --with pillow-heif python scripts/processar_fotos.py "<pasta com os originais>"
```

O script corrige a orientação, recorta, desfoca rostos indicados, reduz para 1200 × 800 e grava WebP **sem metadados**
(remove o GPS e o modelo do celular). Quando um lugar tem várias fotos, o card vira uma pilha que se folheia.

**Fotos de licença aberta.** As demais fotos ficam em [`src/assets/imagens/`](src/assets/imagens/) e os créditos em `creditos.json`, na mesma pasta.
Para incluir uma foto nova, **basta colocar o arquivo `.webp` nessa pasta com o nome indicado no `creditos.json`**
(dá para fazer pelo próprio GitHub: *Add file → Upload files*). No próximo deploy a foto aparece sozinha, com o
crédito e a licença sob a imagem e na lista do Painel do Pesquisador. O app não usa desenhos: enquanto não houver
foto, o lugar aparece só com o texto (no Mural, com um convite para quem tiver uma foto antiga).

Onde cada foto aparece (e quais itens do acervo estão em revisão) é definido em [`src/data/imagens.js`](src/data/imagens.js).
O roteiro de coleta está em [`docs/PROMPT_COLETA_IMAGENS.md`](docs/PROMPT_COLETA_IMAGENS.md).

Para editar textos, perguntas do quiz, palavras do caça-palavras ou famílias de exemplo, altere apenas
[`src/data/content.js`](src/data/content.js).

## Rodar localmente

Requer Node.js 18+.

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # gera o QR Code (public/qrcode.*) e a pasta dist/
npm run qrcode    # só regenera o QR Code
npm run preview   # serve o build em http://localhost:4173/Memoria_paranapiacaba/
```

## Deploy (GitHub Pages)

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) roda a cada push na branch `main`
(ou manualmente em *Actions → Deploy no GitHub Pages → Run workflow*): instala, faz o build e publica com
`actions/upload-pages-artifact` + `actions/deploy-pages`.

**Configuração única no repositório:** *Settings → Pages → Build and deployment → Source: **GitHub Actions***.

O QR Code aponta para o endereço fixo do Pages (`APP_URL` em `src/data/content.js` e `scripts/gerar_qrcode.mjs`),
então o mesmo QR impresso continua funcionando depois de cada novo deploy. Se o endereço mudar (ex.: domínio próprio),
atualize os dois arquivos e rode `npm run qrcode`.

O `vite.config.js` usa `base: '/Memoria_paranapiacaba/'`. Se o repositório for renomeado, ajuste esse valor.

## Stack

React 18 · Vite 5 · Tailwind CSS 3 · Lucide React · Leaflet + React-Leaflet · localStorage.

```
src/
├── App.jsx                     # moldura, barra superior e navegação inferior
├── data/content.js             # todo o conteúdo (vocabulário, locais, quiz, palavras, relatos, pins)
├── lib/store.jsx               # estado global + persistência em localStorage
├── lib/export.js               # estatísticas e exportação JSON/CSV
├── components/                 # Foto (cópia de álbum), AudioRecorder, Quiz, WordSearch, ResearcherPanel, Sheet, Toast
└── tabs/                       # BilheteTab, MuralTab, JogosTab, MapaTab
scripts/processar_fotos.py      # converte as fotos do acervo para WebP sem metadados
```
