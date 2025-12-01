// main.js - Sistema de Autenticación y Navegación Dinámica para ConectaBarrio

// CONSTANTES Y CONFIGURACIÓN
const USER_TYPES = {
    VISITOR: 'visitor',
    CLIENT: 'client',
    BUSINESS: 'business'
};

const PAGES = {
    PUBLIC: ['index.html', 'how-it-works.html', 'commerce-list.html', 'commerce-profile.html', 
             'events.html', 'offers.html', 'about.html', 'faq.html', 'support.html', 'contact.html'],
    AUTH: ['login.html', 'register.html', 'forgot-password.html'],
    CLIENT: ['user-dashboard.html', 'user-orders.html', 'user-reviews.html', 'user-favorites.html', 
             'user-profile.html', 'cart.html', 'checkout.html', 'order-confirmed.html'],
    BUSINESS: ['business-dashboard.html', 'business-orders.html', 'business-products.html', 
               'business-reviews.html', 'business-analytics.html', 'business-profile.html']
};

// ESTADO GLOBAL
let currentUser = null;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// FUNCIONES PRINCIPALES
function initializeApp() {
    loadUserState();
    initializeNavigation();
    setupAuthListeners();
    protectRoutes();
    updateUI();
}

// GESTIÓN DE AUTENTICACIÓN
function loadUserState() {
    const userData = localStorage.getItem('conectabarrio_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        console.log('Usuario cargado:', currentUser);
    } else {
        currentUser = {
            type: USER_TYPES.VISITOR,
            isLoggedIn: false
        };
    }
}

function saveUserState() {
    if (currentUser && currentUser.isLoggedIn) {
        localStorage.setItem('conectabarrio_user', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('conectabarrio_user');
    }
}

function login(userData) {
    currentUser = {
        ...userData,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
    };
    saveUserState();
    updateUI();
    
    // Redirigir según tipo de usuario
    setTimeout(() => {
        if (currentUser.type === USER_TYPES.CLIENT) {
            window.location.href = '../user/user-dashboard.html';
        } else if (currentUser.type === USER_TYPES.BUSINESS) {
            window.location.href = '../business/business-dashboard.html';
        }
    }, 1000);
}

function logout() {
    currentUser = {
        type: USER_TYPES.VISITOR,
        isLoggedIn: false
    };
    saveUserState();
    updateUI();
    window.location.href = '../index.html';
}

// NAVEGACIÓN DINÁMICA
function initializeNavigation() {
    const navContainer = document.getElementById('dynamic-navbar');
    if (!navContainer) return;

    const navHTML = generateNavigationHTML();
    navContainer.innerHTML = navHTML;
    
    // Añadir event listeners después de renderizar
    setupNavigationListeners();
}

function generateNavigationHTML() {
    const basePath = getBasePath();
    
    if (currentUser.type === USER_TYPES.VISITOR) {
        return `
            <nav class="navbar">
                <a href="${basePath}index.html" class="nav-brand">
                    <img src="${basePath}assets/logo.png" alt="ConectaBarrio">
                </a>
                
                <div class="nav-links" id="navLinks">
                    <a href="${basePath}index.html">Inicio</a>
                    <a href="${basePath}commerce/commerce-list.html">Comercios</a>
                    <a href="${basePath}features/events.html">Eventos</a>
                    <a href="${basePath}features/offers.html">Ofertas</a>
                    <a href="${basePath}info/about.html">Sobre Nosotros</a>
                    <a href="${basePath}info/how-it-works.html">Cómo Funciona</a>
                    <a href="${basePath}auth/login.html" class="login-btn">Iniciar Sesión</a>
                </div>
                
                <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>
            </nav>
        `;
    }
    
    if (currentUser.type === USER_TYPES.CLIENT) {
        return `
            <nav class="navbar">
                <a href="${basePath}index.html" class="nav-brand">
                    <img src="${basePath}assets/logo.png" alt="ConectaBarrio">
                </a>
                
                <div class="nav-links" id="navLinks">
                    <a href="${basePath}index.html">Inicio</a>
                    <a href="${basePath}commerce/commerce-list.html">Comercios</a>
                    <a href="${basePath}features/events.html">Eventos</a>
                    <a href="${basePath}features/offers.html">Ofertas</a>
                    <a href="${basePath}info/about.html">Sobre Nosotros</a>
                    
                    <div class="nav-dropdown">
                        <button class="dropdown-toggle">
                            👤 Mi Cuenta
                        </button>
                        <div class="dropdown-menu">
                            <a href="${basePath}user/user-dashboard.html">Mi Dashboard</a>
                            <a href="${basePath}user/user-orders.html">Mis Pedidos</a>
                            <a href="${basePath}user/user-reviews.html">Mis Reseñas</a>
                            <a href="${basePath}user/user-favorites.html">Favoritos</a>
                            <a href="${basePath}user/user-profile.html">Mi Perfil</a>
                            <a href="${basePath}features/notifications.html">Notificaciones</a>
                            <hr>
                            <a href="#" onclick="logout()" class="logout-btn">Cerrar Sesión</a>
                        </div>
                    </div>
                </div>
                
                <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>
            </nav>
        `;
    }
    
    if (currentUser.type === USER_TYPES.BUSINESS) {
        return `
            <nav class="navbar">
                <a href="${basePath}index.html" class="nav-brand">
                    <img src="${basePath}assets/logo.png" alt="ConectaBarrio">
                </a>
                
                <div class="nav-links" id="navLinks">
                    <a href="${basePath}index.html">Inicio</a>
                    <a href="${basePath}commerce/commerce-list.html">Comercios</a>
                    <a href="${basePath}features/events.html">Eventos</a>
                    <a href="${basePath}features/offers.html">Ofertas</a>
                    <a href="${basePath}info/about.html">Sobre Nosotros</a>
                    
                    <div class="nav-dropdown">
                        <button class="dropdown-toggle">
                            🏪 Mi Negocio
                        </button>
                        <div class="dropdown-menu">
                            <a href="${basePath}business/business-dashboard.html">Dashboard</a>
                            <a href="${basePath}business/business-orders.html">Pedidos</a>
                            <a href="${basePath}business/business-products.html">Productos</a>
                            <a href="${basePath}business/business-reviews.html">Reseñas</a>
                            <a href="${basePath}business/business-analytics.html">Analytics</a>
                            <a href="${basePath}business/business-profile.html">Configuración</a>
                            <hr>
                            <a href="#" onclick="logout()" class="logout-btn">Cerrar Sesión</a>
                        </div>
                    </div>
                </div>
                
                <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>
            </nav>
        `;
    }
}

function setupNavigationListeners() {
    // Menú móvil
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Dropdown menus
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('active');
            
            // Cerrar otros dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('active');
                }
            });
        });
    });
    
    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
}

// PROTECCIÓN DE RUTAS
function protectRoutes() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Si el usuario no está logueado y trata de acceder a páginas protegidas
    if (!currentUser.isLoggedIn && 
        (PAGES.CLIENT.includes(currentPage) || PAGES.BUSINESS.includes(currentPage))) {
        window.location.href = '../auth/login.html';
        return;
    }
    
    // Si el usuario está logueado pero trata de acceder a páginas de auth
    if (currentUser.isLoggedIn && PAGES.AUTH.includes(currentPage)) {
        redirectToDashboard();
        return;
    }
    
    // Verificar permisos según tipo de usuario
    if (currentUser.isLoggedIn) {
        if (currentUser.type === USER_TYPES.CLIENT && PAGES.BUSINESS.includes(currentPage)) {
            window.location.href = '../user/user-dashboard.html';
            return;
        }
        
        if (currentUser.type === USER_TYPES.BUSINESS && PAGES.CLIENT.includes(currentPage)) {
            window.location.href = '../business/business-dashboard.html';
            return;
        }
    }
}

function redirectToDashboard() {
    if (currentUser.type === USER_TYPES.CLIENT) {
        window.location.href = '../user/user-dashboard.html';
    } else if (currentUser.type === USER_TYPES.BUSINESS) {
        window.location.href = '../business/business-dashboard.html';
    } else {
        window.location.href = '../index.html';
    }
}

// ACTUALIZACIÓN DE UI
function updateUI() {
    updateNavigation();
    updateAuthElements();
    updateUserInfo();
}

function updateNavigation() {
    // La navegación ya se genera dinámicamente en initializeNavigation()
}

function updateAuthElements() {
    // Actualizar botones de login/logout en páginas específicas
    const loginButtons = document.querySelectorAll('.auth-login-btn');
    const userInfoElements = document.querySelectorAll('.user-info');
    
    if (currentUser.isLoggedIn) {
        loginButtons.forEach(btn => {
            btn.style.display = 'none';
        });
        userInfoElements.forEach(element => {
            element.style.display = 'block';
            if (currentUser.firstName) {
                element.textContent = `Hola, ${currentUser.firstName}`;
            }
        });
    } else {
        loginButtons.forEach(btn => {
            btn.style.display = 'block';
        });
        userInfoElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

function updateUserInfo() {
    // Actualizar información del usuario en el dashboard
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElements = document.querySelectorAll('.user-email');
    
    if (currentUser.isLoggedIn) {
        userNameElements.forEach(element => {
            if (currentUser.firstName && currentUser.lastName) {
                element.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            }
        });
        
        userEmailElements.forEach(element => {
            if (currentUser.email) {
                element.textContent = currentUser.email;
            }
        });
    }
}

// INTEGRACIÓN CON FORMULARIOS DE LOGIN/REGISTER
function setupAuthListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;
    
    // Simular autenticación (en producción esto sería una llamada a la API)
    const loginSuccess = simulateLogin(email, password);
    
    if (loginSuccess) {
        showNotification('¡Inicio de sesión exitoso!', 'success');
        
        // En una aplicación real, obtendrías estos datos del servidor
        const userData = {
            type: email.includes('comercio') ? USER_TYPES.BUSINESS : USER_TYPES.CLIENT,
            email: email,
            firstName: email.split('@')[0],
            lastName: 'Usuario',
            phone: '(809) 123-4567',
            address: 'Dirección del usuario'
        };
        
        if (userData.type === USER_TYPES.BUSINESS) {
            userData.businessName = 'Mi Comercio';
            userData.businessType = 'restaurante';
        }
        
        login(userData);
    } else {
        showNotification('Credenciales incorrectas. Por favor intenta nuevamente.', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userType = document.querySelector('.user-type-btn.active')?.getAttribute('data-type') || 'user';
    
    // Validar formulario
    if (!validateRegisterForm()) {
        return;
    }
    
    // Simular registro exitoso
    const userData = {
        type: userType === 'commerce' ? USER_TYPES.BUSINESS : USER_TYPES.CLIENT,
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };
    
    if (userData.type === USER_TYPES.BUSINESS) {
        userData.businessName = document.getElementById('businessName').value;
        userData.businessType = document.getElementById('businessType').value;
        userData.businessAddress = document.getElementById('businessAddress').value;
        userData.businessPhone = document.getElementById('businessPhone').value;
    }
    
    showNotification('¡Cuenta creada exitosamente!', 'success');
    login(userData);
}

function validateRegisterForm() {
    // Implementar validación del formulario de registro
    // (similar a la que ya tienes en register.html)
    return true;
}

function simulateLogin(email, password) {
    // Simulación simple - en producción esto sería una llamada al backend
    const validUsers = [
        { email: 'ejemplo1@gmail.com', password: '12345', type: USER_TYPES.CLIENT },
        { email: 'ejemplo2@gmail.com', password: '12345', type: USER_TYPES.BUSINESS }
    ];
    
    return validUsers.some(user => 
        user.email === email && user.password === password
    );
}

// FUNCIONES UTILITARIAS
function getBasePath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/auth/') || currentPath.includes('/user/') || 
        currentPath.includes('/business/') || currentPath.includes('/commerce/') ||
        currentPath.includes('/shopping/') || currentPath.includes('/features/') ||
        currentPath.includes('/info/')) {
        return '../';
    }
    return './';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Hacer funciones disponibles globalmente
window.logout = logout;
window.showNotification = showNotification;