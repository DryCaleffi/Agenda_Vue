
# 📅 Agenda-vue: Sistema de Agendamento

## 🎯 Objetivo do Aplicativo

Este trabalho tem como objetivo utilizar o **framework Vue.js**, um framework que possibilita a construção de interfaces de usuário de forma **reativa** e **componentizada**.

O projeto demonstra a aplicação prática dos conceitos do Vue 3 para criar uma **Single Page Application (SPA)** de gerenciamento de agendamentos. A aplicação visa:
* **Aproveitar a reatividade** do Vue, onde as alterações de dados (ex: um novo agendamento) atualizam automaticamente a interface do usuário (DOM) sem manipulação manual.
* **Utilizar a Componentização** para dividir a interface (formulários, lista de itens, botões) em blocos reutilizáveis, tornando o código mais modular, limpo e de fácil manutenção.
* **Gerenciar o fluxo de navegação** entre as diferentes telas da agenda de forma fluida usando o Vue Router.

---

## ✨ Funcionalidades Principais

As funcionalidades centrais da aplicação de agenda são:

* **Realizar Agendamentos (Criação)**: Inserir novos compromissos no sistema, definindo data, hora , descrição, sua prioridade e por fim sua categoria.
* **Desmarcar Agendamentos (Exclusão)**: Remover compromissos existentes da lista.
* **Visualizar os compromissos (visualização)**: Visualizar na página incial todos os próximos eventos
* **Filtar Eventos por categorias**: Realizar um filtro que busque filtrar os eventos dependo da sua categoria, informada no momento do cadastro do evento
* **Importar eventos**: Utilizar de arquivos JSON para importar um evento
* **Visualizar total de eventos**: Ter visibilidade do total de eventos, e o próximo evento cadastrado
* **Temporizador para o próximo evento**: Um temporizador na tela inicial indicando o tempo restante antes do próximo eventos e o nome do eventos em questão.

---

## 💚 Tecnologias Fundamentais

### Vue.js (v^3.5.0)

**Vue.js** (pronuncia-se /vjuː/, como "view") é um **framework JavaScript progressivo** para a construção de interfaces de usuário.

* **Progressivo**: Pode ser adotado incrementalmente, sendo usado tanto em pequenas partes de um projeto existente quanto para construir grandes aplicações de página única (SPAs).
* **Reatividade**: Possui um poderoso sistema de reatividade que garante que o estado da aplicação esteja sempre sincronizado com o Document Object Model (DOM).
* **Baseado em Componentes**: Encoraja a divisão da interface em pequenos componentes reutilizáveis, facilitando o desenvolvimento e a escalabilidade.
* **Composition API**: (Assumindo Vue 3) A nova forma de escrever componentes que oferece uma sintaxe mais clara e facilita a organização e o reuso de lógica complexa.

### Vue Router (v^4.6.3)

O **Vue Router** é o gerenciador de rotas oficial do Vue.js. É essencial para o desenvolvimento de *Single Page Applications* (SPAs), pois permite que o usuário navegue entre diferentes "páginas" (componentes) sem recarregar a página inteira. No contexto desta agenda, ele é usado para transitar entre a tela de visualização (TELA 1), o formulário de criação (TELA 2) e a lista de gerenciamento (TELA 3).

---

## 🛠️ Ecossistema de Desenvolvimento

| Ferramenta | Categoria | Versão | Descrição Detalhada |
| :--- | :--- | :--- | :--- |
| **Vite** | Build Tool (Tooling) | `^5.4.21` | Ferramenta de build de *front-end* de última geração que se concentra em velocidade e simplicidade. O Vite (que significa "rápido" em francês) fornece um **servidor de desenvolvimento instantâneo** e um **Hot Module Replacement (HMR)** extremamente rápido, melhorando drasticamente a experiência do desenvolvedor. |
| **@vitejs/plugin-vue** | Plugin Vite | `^5.2.4` | Plugin oficial que habilita o suporte ao Vue Single-File Components (SFCs) dentro do ambiente Vite. |
| **Vue** | Framework | `^3.5.0` | O núcleo da aplicação. |
| **Vue Router** | Biblioteca | `^4.6.3` | O sistema de roteamento. |

---

## 🚀 Guia de Instalação e Execução

Para iniciar o projeto localmente, siga os passos abaixo. Certifique-se de ter o **Node.js** e o **npm** (ou yarn/pnpm) instalados.

### 1. Clonar o Repositório

```bash
git clone [https://docs.github.com/pt/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github](https://docs.github.com/pt/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
cd agenda-vue
````

### 2\. Instalar as Dependências

Instala todas as bibliotecas listadas no `package.json` (Vue, Vue Router, Vite, etc.).

```bash
npm install
# ou yarn install
# ou pnpm install
```

### 3\. Executar o Servidor de Desenvolvimento

Inicia o servidor de desenvolvimento do Vite com *Hot Module Replacement (HMR)* ativado.

```bash
npm run dev
# O servidor será iniciado em http://localhost:5173 (ou porta similar).
```

### 4\. Compilar para Produção

Gera os arquivos estáticos otimizados (build) na pasta `dist/` para deployment.

```bash
npm run build
```

-----
## 🏗️ Arquitetura e Estrutura do Projeto

A organização do projeto **agenda-vue** segue as melhores práticas do ecossistema Vue 3 e Vite, utilizando uma arquitetura **componentizada** para garantir código modular, escalável e de fácil manutenção.

A estrutura de diretórios é fundamental para separar a lógica de apresentação (**Views**) da lógica reutilizável (**Components**) e da configuração central (**Router**).

### 📂 Estrutura de Pastas e Componentes

A pasta principal (`src/`) contém os seguintes elementos essenciais:

| Pasta/Arquivo | Descrição Breve |
| :--- | :--- |
| `src/main.js` | **Ponto de Entrada:** É o primeiro arquivo executado. Ele **inicializa a aplicação Vue**, monta o componente raiz (`App.vue`), e integra o **Vue Router**. |
| `src/App.vue` | **Componente Raiz:** Atua como o *container* principal. Define o **layout global** da aplicação (cabeçalhos, menu de navegação, etc.) e hospeda o **`<router-view>`**, onde os componentes de página (`views/`) são renderizados. |
| `src/views/` | **Componentes de Página (Telas):** Contém os componentes que representam uma **tela completa** da aplicação (ex: Dashboard, Formulário de Cadastro, Lista de Gerenciamento). Eles são mapeados diretamente pelas rotas. |
| `src/components/` | **Componentes Reutilizáveis:** Contém blocos menores e genéricos da UI que podem ser usados em múltiplas `views/` (ex: `CardAgendamento.vue`, botões, modais, `Temporizador.vue`). |
| `src/router/index.js` | **Gerenciamento de Rotas:** Configuração central que define o **mapa de URLs** da aplicação, ligando cada caminho (`path`) a um componente específico em `src/views/`. |
| `src/store/` | **Gerenciamento de Estado Global:** (Recomendado) Pasta reservada para arquivos de gerenciamento de estado (como Pinia ou Vuex). Aqui ficaria a lógica central para armazenar e manipular a lista de agendamentos acessível por qualquer componente. |
| `jsconfig.json` | **Configuração do VS Code/IDE:** Define atalhos de caminho como `@/` para `src/`, facilitando importações (ex: `import Componente from '@/components/Componente.vue'`). |

### 🧱 Componentização

A arquitetura se baseia na **separação de responsabilidades**:

* As **Views** orquestram e utilizam vários **Components** para construir a página completa.
* Os **Components** são focados em uma única funcionalidade (ex: renderizar um card de evento).

Essa abordagem permite que o código seja mais fácil de entender e que novos recursos sejam adicionados sem impactar todo o sistema, promovendo a **reutilização** de código.





----

## 📖 Guia de Usuário

Aqui está uma visão geral das principais interfaces da aplicação:

### TELA 1: Painel (Dashboard)

  * **Propósito**: Visão geral e ponto de entrada.
  * **Conteúdo**: Exibe um resumo dos próximos agendamentos, o total de agendamentos e uma lista dos agendamentos previamente cadastrados

  * **Ação Principal**: Botão claro de "Novo Evento" para acessar a TELA 2.

<img width="955" height="816" alt="image" src="https://github.com/user-attachments/assets/11c07040-6778-496c-b620-d4c0292727b0" />



### TELA 2: Formulário de Agendamento

  * **Propósito**: Criação de novos eventos.
  * **Conteúdo**: Formulário com campos de entrada para **Titulo**, **Data Hora**, **Categoria**, **Prioridade** e **Descrição**.
  * **Ação Principal**: Incluir informações sobre o eventos e clicar no botão "Salvar" que utiliza a reatividade do Vue para adicionar o novo item à lista.


<img width="956" height="867" alt="image" src="https://github.com/user-attachments/assets/67ec2f2e-76e7-4139-948e-4fa21d7efc4a" />



### TELA 3: Lista de Gerenciamento

  * **Propósito**: Visualização e manipulação completa dos agendamentos.
  * **Conteúdo**: Cards com os agendamentos
  * **Ação Principal**: Ícone de lixeira para "Desmarcar": 🗑️ para realizar a exclusão de um compromisso.
  E incone de Lapis para edição

<img width="929" height="287" alt="image" src="https://github.com/user-attachments/assets/4cc9be7d-53b7-42af-9b83-606a020f2ea2" />


### TELA 4: Exportar Agenda
* **Propósito**: Exportar agendas para outro aplicativos ou lugares
  * **Conteúdo**: Incone de Exportar: 📤
  * **Ação Principal**: Exportar em arquivo JSON a sua agenda
  

<img width="905" height="944" alt="image" src="https://github.com/user-attachments/assets/c713dd5f-7597-4d37-afa5-5bb905428f21" />


### TELA 5: Importar Agenda
* **Propósito**: Importar agendas em arquivo JSON de outro aplicativos ou lugares
  * **Conteúdo**: Incone de Importar: 📥
  * **Ação Principal**: Importar em arquivo JSON a sua agenda
  
<img width="960" height="961" alt="image" src="https://github.com/user-attachments/assets/efcf2465-8344-4b0a-8db0-569a9e694150" />

-----

## 👥 Colaboradores

  * [Adryelle Caroline de Souza Calefi](https://github.com/DryCaleffi)
  * [Guilherme Aleixo Garcia]()
  * [Leticia Cristima Leme](https://github.com/leticiaaleme)
  * [Murilo Camillo Martins](https://github.com/MuriloCamillo)
  * [Tabata Etiéle Roberto da Silva](https://github.com/TabataEtiele)

<!-- end list -->

```
