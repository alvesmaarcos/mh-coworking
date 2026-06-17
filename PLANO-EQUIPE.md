# Plano de Divisão da Equipe — Coworking Landing Page

> O link do Stitch no README está protegido por login, mas o README também traz os **prints de
> cada tela** (`image.png` a `image-4.png`), que já foram analisados e estão descritos abaixo,
> seção por seção. O nome da marca no design é **"ProSpace Coworking"** — atualizar o `.brand` da
> navbar (hoje "Coworking") em todas as páginas, e o `<title>`.

### Mapa imagem → página → pessoa

| Imagem        | Tela         | Arquivo            | Pessoa |
| ------------- | ------------ | ------------------ | ------ |
| `image-4.png` | Início       | `index.html`       | 1      |
| `image-3.png` | Salas        | `salas.html`       | 2      |
| `image.png`   | Depoimentos  | `avaliacoes.html`  | 3      |
| `image-2.png` | FAQ          | `faq.html`         | 4      |
| `image-1.png` | Localização  | `localizacao.html` | 4      |

A navbar do design tem 5 itens: **Home, Rooms, Testimonials, FAQ, Location** (em português:
Início, Salas, Depoimentos, Perguntas Frequentes, Localização — já é o que está nos arquivos
atuais) + botão preto "Book Now" (`Agende agora`, já existe como `.btn-primary`).

A paleta é minimalista preto/branco/cinza, compatível com as variáveis já existentes em
`css/main.css` (`--primary` preto, `--surface`/`--surface-container-*` cinzas claros). O verde
dos botões de WhatsApp já está definido em `--whatsapp-green`.

## 1. Premissa

O projeto está dividido em **5 páginas `.html`** distribuídas entre **4 pessoas**. A Pessoa 4
fica com FAQ e Localização — as duas tarefas mais simples (sem Firebase, sem JS complexo),
equilibrando o peso total entre os integrantes:

```
index.html        → Pessoa 1  (Hero + preview de salas)
salas.html        → Pessoa 2  (Firebase + modal + WhatsApp) ← tarefa mais pesada
avaliacoes.html   → Pessoa 3  (Depoimentos — estático)
faq.html          → Pessoa 4  (Accordion)
localizacao.html  → Pessoa 4  (Mapa embed + seção de contato)
```

Todas compartilham `css/main.css` e a mesma navbar (já replicada em cada arquivo, mudando apenas
qual link recebe `class="nav-link active"`).

**Arquivo de entrada (o que "roda tudo"): `index.html`.** Para testar com o Firebase funcionando
corretamente, abrir o projeto via servidor local (ex.: extensão Live Server do VS Code ou
`python3 -m http.server`), não direto pelo `file://`.

---

## 2. Divisão de papéis e requisitos

### Pessoa 1 — `index.html` (Apresentação / Hero) — `image-4.png`
**Requisitos:** RF05 (estrutura de navegação — já implementada), item "Apresentação" do sitemap.

Conteúdo do print:

- Tag pequena: "AMBIENTE PROFISSIONAL"
- Título (H1): "Espaços de Trabalho que Impulsionam sua Produtividade"
- Parágrafo: "A infraestrutura premium que sua empresa precisa, combinada com a flexibilidade que
  você deseja. Foco, conforto e networking em um só lugar."
- Dois botões: "VER SALAS" (preto, `.btn-primary`, link para `salas.html`) e
  "FALAR COM CORRETOR" (outline/secundário — abre WhatsApp)
- Imagem grande à direita (foto de escritório/ambiente)
- Seção "Espaços sob medida": subtítulo "Design funcional e moderno para atender desde
  profissionais autônomos a grandes equipes." + link "VER TODAS AS OPÇÕES →" (para `salas.html`)
- Grid com **3 cards de preview de salas**:
  - "Sala Privativa" — tag CONFERÊNCIA/PRIVADO — R$ 1.800/mês
  - "Sala de Reunião" — R$ 120/hora
  - "Mesa Compartilhada" — R$ 80/dia
  - cada card com imagem, título, descrição curta, preço e seta/link

Tarefas:
- Implementar Hero e a seção "Espaços sob medida" com os 3 cards (pode ser estático — os dados
  dinâmicos via Firebase ficam em `salas.html`, responsabilidade da Pessoa 2).
- Ajustar a navbar: trocar marca para "ProSpace Coworking" e manter `Início` com `active`.
- Responsável por criar o **Footer padrão** (ver seção 4) que as outras páginas vão replicar.
  No print: "ProSpace Coworking" + copyright + links (Contact Us, Privacy Policy, Terms of
  Service, LinkedIn, Instagram).

---

### Pessoa 2 — `salas.html` (Nossas Salas) — `image-3.png`
**Requisitos:** RF01, RF02, RF03, RF04 (tarefa mais pesada — envolve Firebase e JS).

Conteúdo do print:

- Título (H1): "Nossas Salas"
- Subtítulo: "Ambientes projetados para foco, colaboração e produtividade. Escolha o espaço
  ideal para o seu momento profissional."
- Grid com 3 cards (cada um vira 1 documento no Firestore, ver seção 5):
  1. **Estação de Trabalho** — tags "Wifi Alta Velocidade", "Café Ilimitado", "Cadeiras
     Ergonômicas" — "A PARTIR DE R$ 50/dia · R$ 15/hora" — botão verde "Reservar via WhatsApp"
  2. **Sala Executiva** — tags "TV 65\" 4K", "Quadro Branco", "Isolamento Acústico" —
     "VALOR FIXO R$ 80/hora" — botão verde "Reservar via WhatsApp"
  3. **Escritório Privativo** — tags "Acesso 24/7", "Endereço Comercial", "Armários" —
     "A PARTIR DE R$ 1800/mês" — botão verde "Consultar Disponibilidade"

Tarefas:

- RF01: grid carregado dinamicamente do Firebase — bate com os 3 cards acima.
- RF02: ao clicar numa sala, expandir/abrir modal com descrição completa + galeria de fotos.
- RF03: consumir os dados via Firestore em tempo real (sem dados "chumbados" no HTML).
- RF04: botão de WhatsApp (verde, `--whatsapp-green`) na visualização expandida/modal, com link
  direto `https://wa.me/<numero>` (sem formulário).
- Cria e mantém `js/firebase-config.js` e `js/salas.js` (busca + renderização + modal).
- **Define o schema da coleção Firestore `salas`** (ver seção 5) — combinar com a equipe antes
  de começar, pois a Pessoa 1 replica um resumo dos dados no `index.html`.

---

### Pessoa 3 — `avaliacoes.html` (Depoimentos) — `image.png`
**Requisitos:** RF06.

Conteúdo do print:

- Tag pequena: "COMUNIDADE PROSPACE"
- Título (H1): "Confiado por Profissionais Excepcionais"
- Subtítulo: "Descubra como empresas inovadoras e profissionais de alto desempenho utilizando
  nossos espaços para focar, colaborar e escalar seus negócios."
- **Depoimento em destaque** (card grande, foto à esquerda): 5 estrelas + citação de
  Mariana Costa, CEO, Agência Nova ("A transição de nossa agência para o ProSpace foi um divisor
  de águas...")
- Seção "Mais Experiências" — grid de cards menores:
  - Rafael Campos, Engenheiro de Software
  - Lucas Mendes, Founder, TechSpace Labs (card com destaque — fundo escuro/diferente)
  - Elena Rodrigues, Consultora de Gestão Nova
  - Carlos R., Arquiteto
- CTA final: "Pronto para elevar seu ambiente de trabalho?" + dois botões:
  "Agendar uma Visita" (preto) e "Ver Planos" (outline)

Tarefas:

- Implementar título/subtítulo, card de depoimento em destaque, grid "Mais Experiências" e o
  CTA final com os 2 botões.
- Conteúdo estático em HTML ou array JS local — **não usa Firebase**.
- Replica o Footer padrão (seção 4) no final da página.

---

### Pessoa 4 — `faq.html` + `localizacao.html` (FAQ e Localização) — `image-2.png` + `image-1.png`
**Requisitos:** RF07 (FAQ) e RF08 (Localização).

#### `faq.html` — `image-2.png`

Conteúdo do print:

- Título (H1): "Perguntas Frequentes"
- Subtítulo: "Encontre respostas rápidas para as dúvidas mais comuns sobre o ProSpace Coworking."
- Accordion com 5 perguntas (chevron à direita, expande ao clicar):
  1. Quais são os horários de funcionamento?
  2. Preciso reservar com antecedência?
  3. O que está incluído no valor da diária?
  4. Posso receber clientes nas vossas instalações?
  5. Existe parque de estacionamento?
- Rodapé da seção: "Ainda tem dúvidas?" + link "Fale connosco →"

Tarefas:
- Implementar título/subtítulo e accordion com as 5 perguntas (respostas a combinar com a equipe).
- JS próprio (`js/faq.js`) controlando abrir/fechar, sem dependências externas (RNF01).
- "Fale connosco →": link para WhatsApp ou para `localizacao.html` — decidir em grupo.
- Replica o Footer padrão no final da página.

#### `localizacao.html` — `image-1.png`

Conteúdo do print:

- Título (H1): "Nossa Localização"
- Subtítulo: "O ProSpace Coworking está situado em uma das áreas mais valorizadas e dinâmicas de
  São Paulo. Facilidade de acesso, infraestrutura ao redor e ótimo prestígio para sua agência."
- Layout em duas colunas:
  - **Esquerda:** mapa interativo (`<iframe>` Google Maps)
  - **Direita:**
    - "Endereço": "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, CEP 01310-100"
    - "Contato": e-mail `contato@prospace.com.br`, telefone `+55 11 9999-8888`, botão verde WhatsApp
    - "Transporte Público": Metrô, Ônibus, Bicicletário (ícone + descrição curta cada)

Tarefas:
- Implementar título/subtítulo e layout de 2 colunas.
- RF08: mapa via `<iframe>` do Google Maps apontando para o endereço real (o do print é
  placeholder — confirmar com a equipe).
- Seções "Endereço", "Contato" e "Transporte Público".
- Manter os dados de contato (endereço, e-mail, telefone) iguais aos do Footer para não haver
  inconsistência.
- Replica o Footer padrão no final da página.

---

## 3. Requisitos não funcionais — quem fica de olho em quê

- **RNF01 (Vanilla only):** todos — proibido jQuery/Bootstrap/Tailwind/React etc. SDK do Firebase
  via `<script type="module">` é permitido (não é framework front-end).
- **RNF02 (Responsivo):** cada pessoa garante que a sua página funciona em mobile/tablet/desktop
  usando media queries em `css/main.css`.
- **RNF04 (Firebase só para salas):** só a Pessoa 2 usa Firebase; nenhuma outra página deve
  inicializar Firestore.
- **RNF05 (Design limpo/corporativo):** usar as variáveis de cor de `:root` (`--primary`,
  `--secondary`, `--surface`, etc.) — não hardcodar cores.

---

## 4. Recursos compartilhados (combinar ANTES de codar)

| Recurso | O quê | Quem define | Quem consome |
|---|---|---|---|
| `css/main.css` | Variáveis `:root`, `.navbar`, `.nav-link`, `.btn-primary` já existem — **não remover/renomear**, só adicionar classes novas no final | Já existe | Todos |
| Navbar | Markup já replicado em todas as páginas — manter os 5 links e o `active` correto em cada arquivo | Já existe | Todos |
| **Footer padrão** | HTML do rodapé (copyright, Contact Us, Privacy Policy, Terms of Service, LinkedIn, Instagram) | Pessoa 1 | Pessoas 2, 3, 4 (copiam) |
| Número/link do WhatsApp | `https://wa.me/55XXXXXXXXXXX` | Combinar em grupo | Pessoas 1, 2, 4 |
| Endereço do coworking | Texto + link Google Maps | Combinar em grupo | Pessoa 4 (mapa) e Pessoa 1 (Footer) |
| `js/firebase-config.js` | Credenciais do projeto Firebase | Pessoa 2 | Pessoa 2 (único consumidor) |

---

## 5. Esquema sugerido da coleção Firestore `salas` (RF03)

Definir antes de a Pessoa 2 começar — campos por documento:

```
salas/{id}
├── titulo            (string)
├── tags              (array de strings)  → ex: ["Wifi Alta Velocidade", "Café Ilimitado"]
├── descricaoCurta    (string)            → card do grid (RF01)
├── descricaoCompleta (string)            → modal expandido (RF02)
├── precoHora         (number | null)
├── precoDia          (number | null)
├── precoMes          (number | null)
├── labelPreco        (string)            → ex: "A PARTIR DE", "VALOR FIXO"
├── imagemPrincipal   (string, URL)       → card do grid
└── galeria           (array de strings, URLs) → modal expandido
```

---

## 6. Ordem de trabalho sugerida

1. **Reunião de kickoff (todos):** definir Footer, número do WhatsApp, endereço real e schema
   do Firestore (seção 5). Sem isso, as páginas ficam inconsistentes.
2. **Pessoa 2** cria o projeto Firebase e popula a coleção `salas` com os 3 documentos de teste
   o quanto antes — é o item de maior risco e do qual a Pessoa 1 depende para replicar os cards.
3. **Desenvolvimento em paralelo:** cada um trabalha nos seus arquivos `.html`.
4. **Integração final:** revisar navbar e Footer idênticos em todas as 5 páginas, e testar a
   navegação completa via servidor local.

---

## 7. Pendências a combinar em grupo (não vêm do print)

- **Dados de contato reais**: e-mail, telefone e número de WhatsApp (o print usa placeholders).
- **Endereço real** do coworking (o print usa "Av. Paulista, 1000" como placeholder).
- **Texto das respostas do FAQ** (o print só mostra as perguntas).
- **Links de redes sociais** (LinkedIn, Instagram) do Footer.
- **Imagens reais** — decidir se serão fotos reais do espaço ou de stock, e onde hospedar
  (Firebase Storage está fora do escopo por RNF04 — usar URLs externas ou pasta `assets/img/`).
- **Nome da marca**: trocar "Coworking" por "ProSpace Coworking" em todas as navbars e `<title>`.
