// Espera todo o conteúdo da página ser carregado para executar o script
document.addEventListener("DOMContentLoaded", () => {
    
    // =================================================================
    // BANCO DE DADOS SIMULADO (usando localStrage)
    // =================================================================
    
    // Configuração inicial com dados de exemplo
    const initialDatabase = {
        users: [], 
        userData: {},
        stock: [
           { nome: 'Arroz (Saco 5kg)', qtd: 15, status: 'ok' },
           { nome: 'Frango (Peito, kg)', qtd: 8, status: 'ok' },
           { nome: 'Tomate (Caixa)', qtd: 3, status: 'baixo' },
           { nome: 'Leite (Caixa 1L)', qtd: 20, status: 'baixo' }
        ],
        ingredients: [
           { nome: 'Arroz (Saco 5kg)', fornecedor: 'Fornecedor A', compra: '20/03/2024', qtd: '10 sacos' },
           { nome: 'Frango (Peito, kg)', fornecedor: 'Fornecedor B', compra: 'N/A', qtd: '50 kg' }
        ],
        purchases: [
           { data: '20/03/2024', fornecedor: 'Fornecedor A', ingrediente: 'Arroz', qtd: '10 sacos', valor: 750.00 }
        ],
        promotions: [
           { id: 1, titulo: '15% OFF no Almoço', desc: 'Válido para pedidos acima de R$30.', ativo: true },
           { id: 2, titulo: 'Sobremesa Grátis', desc: 'Na compra de qualquer prato principal.', ativo: true },
           { id: 3, titulo: 'FRETE GRÁTIS', desc: 'Apenas para pedidos acima de R$50.', ativo: false }
        ]
    };

    const loadDatabase = () => {
        const db = JSON.parse(localStorage.getItem('appDatabase'));
        if (!db) {
            localStorage.setItem('appDatabase', JSON.stringify(initialDatabase));
            return initialDatabase;
        }
        return db;
    };

    const saveDatabase = (db) => {
        localStorage.setItem('appDatabase', JSON.stringify(db));
    };

    // =================================================================
    // DADOS GLOBAIS (CARDÁPIO) - HARDCODED/FIXO
    // =================================================================
    // O cardápio permanece aqui, pois não está sendo editado pelo Admin
    const mockData = {
        menu: [
            { id: 1, nome: "Frango Assado com Batatas", desc: "Clássica suculenta assada de forno", preco: 15.40, categoria: "principais", imagem: "images/frango-assado.jpg" },
            { id: 2, nome: "Lasanha Bolonhesa", desc: "Massa fresca, molho à bolonhesa", preco: 14.00, categoria: "principais", imagem: "images/lasanha.jpg" },
            { id: 3, nome: "Strogonoff de Frango", desc: "Cubos de frango cremoso", preco: 14.80, categoria: "principais", imagem: "images/strogonoff.jpg" },
            { id: 4, nome: "Opção Vegetariana", desc: "Strogonoff de cogumelos", preco: 13.80, categoria: "principais", imagem: "images/vegetariano.jpg" },
            { id: 5, nome: "Pudim de Leite", desc: "Sobremesa cremosa", preco: 5.50, categoria: "sobremesas", imagem: "images/pudim.jpg" },
            { id: 6, nome: "Suco de Laranja", desc: "Natural, 500ml", preco: 4.00, categoria: "bebidas", imagem: "images/suco.jpg" },
        ],
    };

    // =================================================================
    // VARIÁVEIS DE SESSÃO
    // =================================================================
    let currentUser = null;
    let currentUserData = null;

    // Função para atualizar os dados do usuário no localStorage
    const updateUserData = () => {
        if (!currentUser) return;
        const db = loadDatabase();
        db.userData[currentUser.email] = currentUserData;
        saveDatabase(db);
    };

    // =================================================================
    // LÓGICA DE AUTENTICAÇÃO
    // =================================================================

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const db = loadDatabase();
            const foundUser = db.users.find(user => user.email === email && user.password === password);
            if (foundUser) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(foundUser));
                window.location.href = 'cardapio.html';
            } else {
                document.getElementById('error-message').textContent = 'Usuário não encontrado ou senha incorreta.';
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            // Corrigindo para garantir que se o campo não existir, seja false
            const isAdmin = document.getElementById('is-admin')?.checked || false; 

            const db = loadDatabase();
            if (db.users.find(user => user.email === email)) {
                document.getElementById('error-message').textContent = 'Este e-mail já está cadastrado.';
                return;
            }
            db.users.push({ name, email, password, isAdmin });
            
            // Inicializa dados do usuário, incluindo preferências (para notificações/recompensas)
            db.userData[email] = {
                cart: [],
                favorites: [],
                history: [],
                preferences: { points: 1250, promoNotifications: true, newItemsNotifications: false } // Default
            };
            
            saveDatabase(db);
            alert('Usuário cadastrado com sucesso! Faça o login.');
            window.location.href = 'index.html';
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            // Ajusta o caminho para a raiz, garantindo que saia da pasta /admin
            const path = window.location.pathname.includes('/admin/') ? '../index.html' : 'index.html';
            window.location.href = path; 
        });
    }

    // =================================================================
    // CONTROLE DE ACESSO E NAVEGAÇÃO
    // =================================================================
    
    if (document.querySelector('.mobile-container') || document.querySelector('.auth-body')) { 
        const loggedInUserString = sessionStorage.getItem('loggedInUser');
        const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('cadastro.html');

        if (!loggedInUserString && !isLoginPage) {
            const pathToIndex = window.location.pathname.includes('/admin/') ? '../index.html' : 'index.html';
            window.location.href = pathToIndex;
            return;
        }

        if (loggedInUserString) {
            currentUser = JSON.parse(loggedInUserString);
            const db = loadDatabase();
            if (!db.userData[currentUser.email]) {
                // Se por algum motivo o userData não existir
                db.userData[currentUser.email] = { cart: [], favorites: [], history: [], preferences: {} };
                saveDatabase(db);
            }
            currentUserData = db.userData[currentUser.email];
        }
        
        // Renderiza Navegação Inferior
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav && currentUser) {
            if (currentUser.isAdmin) {
                // Ajusta o caminho para a página de admin
                const adminPath = window.location.pathname.includes('/admin/') ? 'admin-promocoes.html' : 'admin/admin-promocoes.html';
                const adminNavButton = `<a href="${adminPath}" class="nav-item" id="nav-admin"><span class="material-icons">admin_panel_settings</span><span>Admin</span></a>`;
                bottomNav.innerHTML += adminNavButton;
            }
            // Ativa o item de navegação correto
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage.includes('cardapio')) document.getElementById('nav-cardapio')?.classList.add('active');
            if (currentPage.includes('favoritos')) document.getElementById('nav-favoritos')?.classList.add('active');
            if (currentPage.includes('historico')) document.getElementById('nav-historico')?.classList.add('active');
            if (currentPage.includes('perfil')) document.getElementById('nav-perfil')?.classList.add('active');
            if (currentPage.includes('admin')) document.getElementById('nav-admin')?.classList.add('active');
        }
    }

    // =================================================================
    // LÓGICA DE CARRINHO, FAVORITOS E CHECKOUT
    // =================================================================
    
    const addToCart = (itemId) => {
        if (!currentUserData) return;
        const itemToAdd = mockData.menu.find(item => item.id === itemId);
        const existingItem = currentUserData.cart.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            currentUserData.cart.push({ ...itemToAdd, quantity: 1 });
        }
        updateUserData(); 
        alert(`${itemToAdd.nome} foi adicionado ao carrinho!`);
    };
    
    const updateCartQuantity = (itemId, newQuantity) => {
        if (!currentUserData) return;
        let itemInCart = currentUserData.cart.find(item => item.id === itemId);
        if (newQuantity <= 0) {
            currentUserData.cart = currentUserData.cart.filter(item => item.id !== itemId);
        } else if (itemInCart) {
            itemInCart.quantity = newQuantity;
        }
        updateUserData(); 
        renderCartPage();
    };

    const toggleFavorite = (itemId) => {
        if (!currentUserData) return;
        const index = currentUserData.favorites.indexOf(itemId);
        if (index > -1) {
            currentUserData.favorites.splice(index, 1);
        } else {
            currentUserData.favorites.push(itemId);
        }
        updateUserData(); 
        const menuContainer = document.getElementById('menu-container');
        const favoritesContainer = document.getElementById('favorites-container');
        if (menuContainer) renderMenuItems();
        if (favoritesContainer) renderFavoritesPage(); // Atualiza se estiver na página de favoritos
    };

    const checkout = () => {
        if (!currentUserData || currentUserData.cart.length === 0) return;
        const subtotal = currentUserData.cart.reduce((sum, item) => sum + item.preco * item.quantity, 0);
        const tax = subtotal * 0.10;
        
        const newOrder = {
            id: `PEDIDO-${Date.now()}`,
            date: new Date().toLocaleDateString('pt-BR'),
            items: [...currentUserData.cart],
            total: subtotal + tax
        };
        currentUserData.history.unshift(newOrder);
        currentUserData.cart = [];
        updateUserData(); 
        alert('Compra finalizada com sucesso!');
        window.location.href = 'historico.html';
    };


    // =================================================================
    // FUNÇÕES DE RENDERIZAÇÃO
    // =================================================================

    // --- Cardápio (cardapio.html) ---
    const menuContainer = document.getElementById('menu-container');
    let currentFilter = 'principais';
    const renderMenuItems = () => {
        if (!menuContainer || !currentUserData) return;
        menuContainer.innerHTML = ''; 
        const filteredItems = mockData.menu.filter(item => item.categoria === currentFilter);
        
        filteredItems.forEach(item => {
            const isFavorite = currentUserData.favorites.includes(item.id);
            const favIconColor = isFavorite ? 'var(--danger-color)' : 'var(--border-color)';
            
            // Corrige o caminho para a imagem
            const imagePath = window.location.pathname.includes('/admin/') ? `../${item.imagem}` : item.imagem;
            
            const menuItemHTML = `
                <div class="list-item">
                    <img src="${imagePath}" alt="${item.nome}" class="menu-item-clickable" data-id="${item.id}">
                    <div class="list-item-content menu-item-clickable" data-id="${item.id}">
                        <h3>${item.nome}</h3><p>${item.desc}</p>
                    </div>
                    <div class="list-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                    <span class="material-icons favorite-icon" data-id="${item.id}" style="color:${favIconColor}; cursor:pointer;">favorite</span>
                </div>`;
            menuContainer.innerHTML += menuItemHTML;
        });
        document.querySelectorAll('.menu-item-clickable').forEach(el => el.addEventListener('click', (e) => addToCart(parseInt(e.currentTarget.dataset.id))));
        document.querySelectorAll('.favorite-icon').forEach(el => el.addEventListener('click', (e) => toggleFavorite(parseInt(e.currentTarget.dataset.id))));
    };
    if (menuContainer) {
        renderMenuItems(); 
        const filterButtons = document.querySelectorAll('.tab-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentFilter = button.getAttribute('data-filter');
                renderMenuItems();
            });
        });
    }

    // --- Meu Pedido (meu-pedido.html) ---
    const cartContainer = document.getElementById('cart-items-container');
    const renderCartPage = () => {
        if (!cartContainer || !currentUserData) return;
        cartContainer.innerHTML = ''; 
        let subtotal = 0;
        if (currentUserData.cart.length === 0) {
            cartContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        } else {
            currentUserData.cart.forEach(item => {
                subtotal += item.preco * item.quantity;
                const imagePath = window.location.pathname.includes('/admin/') ? `../${item.imagem}` : item.imagem;

                cartContainer.innerHTML += `<div class="list-item"><img src="${imagePath}" alt="${item.nome}"><div class="list-item-content"><h3>${item.nome}</h3><p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p></div><div style="display: flex; align-items: center; gap: 10px;"><button class="btn-quantity" data-id="${item.id}" data-change="-1">-</button><span>${item.quantity}</span><button class="btn-quantity" data-id="${item.id}" data-change="1">+</button></div></div>`;
            });
        }
        const tax = subtotal * 0.10;
        const total = subtotal + tax;
        document.getElementById('subtotal-value').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('tax-value').textContent = `R$ ${tax.toFixed(2).replace('.', ',')}`;
        document.getElementById('total-value').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        document.querySelectorAll('.btn-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const itemId = parseInt(button.dataset.id);
                const change = parseInt(button.dataset.change);
                const item = currentUserData.cart.find(i => i.id === itemId);
                if (item) updateCartQuantity(itemId, item.quantity + change);
            });
        });
    };
    if (cartContainer) renderCartPage();
    
    const finishPurchaseButtons = document.querySelectorAll('.btn-finish-purchase');
    if (finishPurchaseButtons) {
        finishPurchaseButtons.forEach(button => button.addEventListener('click', checkout));
    }

    // --- Favoritos (favoritos.html) ---
    const favoritesContainer = document.getElementById('favorites-container');
    const renderFavoritesPage = () => {
        if (!favoritesContainer || !currentUserData) return;
        
        favoritesContainer.innerHTML = '';
        const favoriteItems = mockData.menu.filter(item => currentUserData.favorites.includes(item.id));
        
        if (favoriteItems.length === 0) {
            favoritesContainer.innerHTML = '<p>Você ainda não tem itens favoritos.</p>';
        } else {
            favoriteItems.forEach(item => {
                const imagePath = window.location.pathname.includes('/admin/') ? `../${item.imagem}` : item.imagem;

                favoritesContainer.innerHTML += `<div class="list-item"><img src="${imagePath}" alt="${item.nome}"><div class="list-item-content"><h3>${item.nome}</h3><p>${item.desc}</p></div><span style="color: var(--danger-color); font-size: 24px;" class="favorite-icon" data-id="${item.id}">&#9733;</span></div>`;
            });
            document.querySelectorAll('.favorite-icon').forEach(el => el.addEventListener('click', (e) => toggleFavorite(parseInt(e.currentTarget.dataset.id))));
        }
    };
    if (favoritesContainer) renderFavoritesPage();
    
    // --- Histórico (historico.html) ---
    const historyContainer = document.getElementById('history-container');
    if (historyContainer && currentUserData) {
        historyContainer.innerHTML = '';
        if (currentUserData.history.length === 0) {
            historyContainer.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
        } else {
            currentUserData.history.forEach(pedido => {
                const itemsSummary = pedido.items.map(item => `${item.nome} (x${item.quantity})`).join(', ');
                historyContainer.innerHTML += `<div class="card"><h3>${pedido.id}</h3><p><strong>Data:</strong> ${pedido.date}</p><p><strong>Itens:</strong> ${itemsSummary}</p><p><strong>Total:</strong> R$ ${pedido.total.toFixed(2).replace('.', ',')}</p></div>`;
            });
        }
    }

    // --- Perfil (perfil.html) ---
    const perfilForm = document.querySelector('form');
    if (perfilForm && window.location.pathname.endsWith('perfil.html') && currentUser) {
        // Preenche os campos do formulário
        perfilForm.querySelector('input[type="text"]').value = currentUser.name;
        perfilForm.querySelector('input[type="email"]').value = currentUser.email;

        // Lógica de Salvar Alterações
        const saveButton = perfilForm.querySelector('.btn-save');
        saveButton.addEventListener('click', () => {
            const newName = perfilForm.querySelector('input[type="text"]').value;
            // A senha não é atualizada aqui, é apenas o nome
            if (newName === currentUser.name) {
                alert('Nenhuma alteração a ser salva.');
                return;
            }
            // Atualiza o usuário no banco
            const db = loadDatabase();
            const userIndex = db.users.findIndex(u => u.email === currentUser.email);
            if (userIndex > -1) {
                db.users[userIndex].name = newName;
                saveDatabase(db);
                // Atualiza a sessão para refletir a mudança
                currentUser.name = newName;
                sessionStorage.setItem('loggedInUser', JSON.stringify(currentUser));
                alert('Nome atualizado com sucesso!');
            }
        });
    }

    // --- Notificações (notificacoes.html) ---
    const notificationsContainer = document.getElementById('notifications-container');
    if (notificationsContainer && currentUserData) {
        // Lógica de Preferências de Notificação (Salva em userData.preferences)
        const promoToggle = document.querySelector('input[type="checkbox"][checked]');
        const newItemsToggle = document.querySelectorAll('.card input[type="checkbox"]')[1];
        
        const prefs = currentUserData.preferences || {};
        
        if (promoToggle) {
            promoToggle.checked = prefs.promoNotifications !== false;
        }
        if (newItemsToggle) {
            newItemsToggle.checked = prefs.newItemsNotifications === true;
        }

        const updatePreferences = () => {
            currentUserData.preferences = {
                ...currentUserData.preferences, 
                promoNotifications: promoToggle.checked,
                newItemsNotifications: newItemsToggle.checked
            };
            updateUserData(); 
        };
        
        if (promoToggle) promoToggle.addEventListener('change', updatePreferences);
        if (newItemsToggle) newItemsToggle.addEventListener('change', updatePreferences);
    }
    
    // --- Recompensas (recompensas.html) ---
    const rewardsContainer = document.getElementById('rewards-container');
    if (rewardsContainer && currentUserData) {
        // Lendo os pontos dos dados do usuário (se não tiver, usa o default de 1250)
        const currentPoints = (currentUserData.preferences && currentUserData.preferences.points) ? currentUserData.preferences.points : 1250;
        
        const pointsDisplay = document.querySelector('.card h2');
        if (pointsDisplay) {
            pointsDisplay.textContent = currentPoints.toLocaleString('pt-BR');
        }

        // Renderiza recompensas (Estático)
        rewardsContainer.innerHTML = `
            <div class="list-item card" style="display: block;">
                <h3>Sobremesa Grátis</h3>
                <p>Resgate por: <strong>500 pontos</strong></p>
                <button class="btn btn-secondary btn-small" style="margin-top: 10px; width: auto;">Resgatar</button>
            </div>
            <div class="list-item card" style="display: block;">
                <h3>R$ 5 OFF no Pedido</h3>
                <p>Resgate por: <strong>1000 pontos</strong></p>
                <button class="btn btn-secondary btn-small" style="margin-top: 10px; width: auto;">Resgatar</button>
            </div>`;
    }

    // --- Admin: Estoque (admin-estoque.html) ---
    const stockTableBody = document.getElementById('stock-table-body');
    if (stockTableBody) {
        const db = loadDatabase();
        stockTableBody.innerHTML = ''; // Limpa antes de preencher
        db.stock.forEach(item => {
            stockTableBody.innerHTML += `<tr><td>${item.nome}</td><td>${item.qtd}</td><td style="color: ${item.status === 'baixo' ? 'var(--danger-color)' : 'var(--success-color)'};">${item.status === 'baixo' ? 'Estoque Baixo!' : 'OK'}</td></tr>`;
        });
        // O botão SALVAR AINDA ESTÁ LÁ, mas não conectado. Requer edição embutida na tabela.
    }

    // --- Admin: Ingredientes (admin-ingredientes.html) ---
    const ingredientsTableBody = document.getElementById('ingredients-table-body');
    if (ingredientsTableBody) {
        const db = loadDatabase();
        ingredientsTableBody.innerHTML = '';
        db.ingredients.forEach(item => {
            ingredientsTableBody.innerHTML += `<tr><td>${item.nome}</td><td>${item.fornecedor}</td><td>${item.compra}</td><td>${item.qtd}</td></tr>`;
        });
        const purchasesTableBody = document.getElementById('purchases-table-body');
        purchasesTableBody.innerHTML = '';
        db.purchases.forEach(item => {
            purchasesTableBody.innerHTML += `<tr><td>${item.data}</td><td>${item.fornecedor}</td><td>${item.ingrediente}</td><td>${item.qtd}</td><td>R$ ${item.valor.toFixed(2).replace('.', ',')}</td></tr>`;
        });
    }

    // --- Admin: Permissões (admin-permissoes.html) - CORRIGIDO ---
    const usersListContainer = document.getElementById('users-list-container');
    if (usersListContainer) {
        const db = loadDatabase();
        usersListContainer.innerHTML = `<div style="display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 10px;"><span>Usuário</span><span>Admin</span></div>`;
        
        db.users.forEach(user => {
            usersListContainer.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid var(--border-color);">
                <div>
                    <h3 style="font-size: 15px;">${user.name}</h3>
                    <p style="font-size: 13px; color: var(--text-light);">${user.email}</p>
                </div>
                <label class="switch">
                    <input type="checkbox" class="permission-toggle" data-email="${user.email}" ${user.isAdmin ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>`;
        });

        // Lógica para Salvar PERMISSÕES
        const saveButton = document.querySelector('.btn-save');
        const permissionToggles = document.querySelectorAll('.permission-toggle');
        let changesToSave = {};

        permissionToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const email = e.target.dataset.email;
                const newIsAdmin = e.target.checked;
                changesToSave[email] = newIsAdmin;
            });
        });

        saveButton.addEventListener('click', () => {
            if (Object.keys(changesToSave).length === 0) {
                alert('Nenhuma mudança para salvar.');
                return;
            }
            
            const db = loadDatabase();
            db.users.forEach(user => {
                if (changesToSave[user.email] !== undefined) {
                    user.isAdmin = changesToSave[user.email];
                    // Se o usuário logado for alterado, atualiza a sessão
                    if (user.email === currentUser.email) {
                        currentUser.isAdmin = user.isAdmin;
                        sessionStorage.setItem('loggedInUser', JSON.stringify(currentUser));
                    }
                }
            });
            
            saveDatabase(db);
            alert('Permissões salvas com sucesso!');
            changesToSave = {};
        });
    }
    
    // --- Admin: Promoções (admin-promocoes.html) - CORRIGIDO ---
    const promotionsContainer = document.getElementById('promotions-container');
    if (promotionsContainer) {
        const db = loadDatabase();
        
        const renderPromotions = () => {
            promotionsContainer.innerHTML = '';
            db.promotions.forEach(promo => {
                promotionsContainer.innerHTML += `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="font-size: 16px;">${promo.titulo}</h3>
                        <p style="font-size: 14px; color: var(--text-light);">${promo.desc}</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" class="promotion-toggle" data-id="${promo.id}" ${promo.ativo ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>`;
            });
            
            // Adiciona listener
            document.querySelectorAll('.promotion-toggle').forEach(toggle => {
                toggle.addEventListener('change', (e) => {
                    const promoId = parseInt(e.target.dataset.id);
                    const newStatus = e.target.checked;
                    
                    const promoIndex = db.promotions.findIndex(p => p.id === promoId);
                    if (promoIndex > -1) {
                        db.promotions[promoIndex].ativo = newStatus;
                        saveDatabase(db);
                        //alert('Status da promoção atualizado!');
                    }
                });
            });
        };
        renderPromotions();
    }
});