# 📚 Sistema de Gestão para o Restaurante Universitário (SRS)

### 🎯 Visão Geral  
O **Sistema de Gestão para o Restaurante Universitário (SRS)** é uma aplicação **web** desenvolvida para **otimizar o atendimento** e **melhorar a experiência dos usuários** no restaurante universitário.  

O sistema permite que **estudantes e funcionários** realizem **pedidos online**, **consultem o cardápio** e participem de um **programa de recompensas**, tornando o processo de compra mais rápido e prático.  

Este **MVP (Produto Mínimo Viável)** foca no **Frontend**, utilizando o `localStorage` para simular um banco de dados e validar os principais fluxos de navegação e usabilidade.

---

## 🌐 Acesse o Projeto Online  
🔗 **Site Oficial:** [https://leogni.github.io/ProjetoEngenharia-Restaurante/index.html](https://leogni.github.io/ProjetoEngenharia-Restaurante/index.html)

🎥 **Demonstração em Vídeo:** *(link do YouTube será adicionado aqui)*  
> 💡 Insira aqui o link do vídeo mostrando o funcionamento do sistema.

---

## ⚙️ Status do Projeto
**Versão Atual:** MVP (Frontend com `localStorage`)  
**Tipo:** Protótipo funcional para validação de interface e experiência do usuário  

### 🧩 Tecnologias Utilizadas
- **HTML5** — Estrutura do conteúdo  
- **CSS3** — Estilo e responsividade  
- **JavaScript (Puro)** — Lógica e interatividade  
- **localStorage** — Simulação de persistência de dados  

---

## 🚀 Como Executar o Projeto Localmente

### 🔧 Pré-requisitos
- Navegador moderno (Google Chrome, Edge, Firefox, etc.)
- Extensão **Live Server** no **Visual Studio Code** (ou outro servidor local)

### ▶️ Passos para Execução

1. **Abrir o Projeto**  
   - Abra a pasta principal do projeto (`/trabalho`) no **VS Code**.

2. **Iniciar o Servidor Local**  
   - Clique com o botão direito em `index.html`.  
   - Selecione **“Open with Live Server”**.  

3. **Acessar o Sistema**  
   - O app será aberto automaticamente no navegador.  
   - URL padrão: [`http://127.0.0.1:5500/index.html`](http://127.0.0.1:5500/index.html)

---

## 🔑 Fluxos de Teste (Usuário e Administrador)

### 👤 Criar Conta de Usuário Comum
1. Acesse `cadastro.html`.  
2. Preencha os campos de cadastro.  
3. **Não** marque a opção “É Administrador?”.  
4. Faça login para acessar as funções de cliente:
   - Visualizar cardápio  
   - Adicionar itens ao carrinho  
   - Simular pedidos

### 🛠️ Criar Conta de Administrador
1. Acesse `cadastro.html`.  
2. Preencha os campos novamente.  
3. **Marque** a opção “É Administrador?”.  
4. Faça login com esta conta para acessar o painel de administração.

### 🧑‍💼 Testar Funções de Administrador
1. Após o login, acesse **Admin > Permissões** (`admin-permissoes.html`).  
2. Use o **toggle** para ativar/desativar usuários.  
3. As alterações são **salvas automaticamente no localStorage**.

---

## 📦 Estrutura de Pastas
/trabalho
├── index.html
├── cadastro.html
├── login.html
├── cardapio.html
├── carrinho.html
├── admin-permissoes.html
├── /css
│ └── style.css
├── /js
│ ├── main.js
│ ├── auth.js
│ ├── admin.js
│ └── storage.js
└── /assets
├── logo.png
└── icons/  


---

## 🧠 Próximos Passos
- 🔄 Implementar **backend real** (Node.js + MongoDB ou Firebase)  
- 💳 Adicionar **módulo de pagamentos simulados**  
- 🎁 Melhorar o **sistema de recompensas**  
- 📱 Otimizar o layout para **mobile e acessibilidade**  

---

## 👨‍💻 Equipe de Desenvolvimento
| Integrante |
|-------------|---------|
| **Pedro Schwank** | 
| **Felipe Falcon** | 
| **Matheus Concon** | 
| **Leonardo Guadagni** | 

---

## 🏁 Conclusão
O **SRS (Sistema de Gestão para o Restaurante Universitário)** busca simplificar o processo de atendimento e criar uma experiência digital prática e eficiente para a comunidade acadêmica.  

Mesmo em sua fase MVP, o projeto já valida com sucesso fluxos essenciais de **cadastro, login, pedidos e administração**, servindo como base sólida para futuras expansões **Full-Stack**.

---

📌 **Repositório:** [https://github.com/leogni/ProjetoEngenharia-Restaurante](https://github.com/leogni/ProjetoEngenharia-Restaurante)
