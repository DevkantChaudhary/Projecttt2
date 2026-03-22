// ===========================
// Authentication Management
// ===========================

/**
 * Initialize users storage with default value if empty
 */
function initializeUsersStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

/**
 * Get all users from localStorage
 */
function getAllUsers() {
    initializeUsersStorage();
    return JSON.parse(localStorage.getItem('users')) || [];
}

/**
 * Save users to localStorage
 */
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Check if email already exists
 */
function emailExists(email) {
    const users = getAllUsers();
    return users.some(user => user.email === email);
}

/**
 * Find user by email
 */
function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email === email);
}

/**
 * Get currently logged-in user
 */
function getLoggedInUser() {
    const userJSON = localStorage.getItem('currentUser');
    return userJSON ? JSON.parse(userJSON) : null;
}

/**
 * Set logged-in user
 */
function setLoggedInUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Clear logged-in user
 */
function clearLoggedInUser() {
    localStorage.removeItem('currentUser');
}

// ===========================
// Form Validation Functions
// ===========================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 */
function isValidPassword(password) {
    return password.length >= 6;
}

/**
 * Clear error messages
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
    });
    
    const inputElements = document.querySelectorAll('input');
    inputElements.forEach(el => {
        el.classList.remove('error');
    });
}

/**
 * Show error message for a field
 */
function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

/**
 * Show success/error message
 */
function showAuthMessage(message, isSuccess = true) {
    const messageElement = document.getElementById('authMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = 'auth-message ' + (isSuccess ? 'success' : 'error');
    }
}

// ===========================
// Registration Handler
// ===========================

function handleRegister(e) {
    e.preventDefault();
    clearErrors();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;
    
    // Validate name
    if (!name) {
        showError('name', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else if (emailExists(email)) {
        showError('email', 'Email already registered');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (!isValidPassword(password)) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate password confirmation
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    if (!isValid) {
        showAuthMessage('Please fix the errors above', false);
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
    };
    
    // Add user to storage
    const users = getAllUsers();
    users.push(newUser);
    saveUsers(users);
    
    // Show success message and redirect
    showAuthMessage('Account created successfully! Redirecting...', true);
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// ===========================
// Login Handler
// ===========================

function handleLogin(e) {
    e.preventDefault();
    clearErrors();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    // Validate email
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    }
    
    if (!isValid) {
        showAuthMessage('Please fix the errors above', false);
        return;
    }
    
    // Find user
    const user = findUserByEmail(email);
    
    if (!user) {
        showAuthMessage('Email not found. Please register first.', false);
        return;
    }
    
    // Check password
    if (user.password !== password) {
        showAuthMessage('Incorrect password. Please try again.', false);
        return;
    }
    
    // Login successful
    setLoggedInUser(user);
    showAuthMessage('Login successful! Redirecting...', true);
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);
}

// ===========================
// Logout Handler
// ===========================

function handleLogout() {
    clearLoggedInUser();
    window.location.href = 'index.html';
}

// ===========================
// Profile Management
// ===========================

function loadProfile() {
    const user = getLoggedInUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Populate profile information
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('nameDisplay').textContent = user.name;
    document.getElementById('emailDisplay').textContent = user.email;
    document.getElementById('memberSince').textContent = user.createdAt;
}

function loadEditProfile() {
    const user = getLoggedInUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Populate edit form with current data
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
}

function handleEditProfile(e) {
    e.preventDefault();
    clearErrors();
    
    const user = getLoggedInUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const newName = document.getElementById('name').value.trim();
    const newEmail = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    // Validate name
    if (!newName) {
        showError('name', 'Name is required');
        isValid = false;
    } else if (newName.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!newEmail) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(newEmail)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else if (newEmail !== user.email && emailExists(newEmail)) {
        showError('email', 'Email already registered');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('password', 'Current password is required');
        isValid = false;
    } else if (user.password !== password) {
        showError('password', 'Incorrect password');
        isValid = false;
    }
    
    if (!isValid) {
        showAuthMessage('Please fix the errors above', false);
        return;
    }
    
    // Update user
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
        users[userIndex].name = newName;
        users[userIndex].email = newEmail;
        saveUsers(users);
        
        // Update current user
        users[userIndex].createdAt = user.createdAt; // Preserve creation date
        setLoggedInUser(users[userIndex]);
        
        showAuthMessage('Profile updated successfully! Redirecting...', true);
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);
    }
}

// ===========================
// Navigation Management
// ===========================

function updateNavigation() {
    const user = getLoggedInUser();
    const navAuth = document.getElementById('nav-auth');
    
    if (!navAuth) return;
    
    if (user) {
        navAuth.innerHTML = `<a href="profile.html">👤 ${user.name}</a>`;
    } else {
        navAuth.innerHTML = '<a href="login.html">Login</a>';
    }
}

function checkAuthentication(currentPage) {
    const user = getLoggedInUser();
    
    // Pages that require authentication
    const protectedPages = ['profile.html', 'edit-profile.html'];
    
    if (protectedPages.includes(currentPage) && !user) {
        window.location.href = 'login.html';
    }
    
    // If logged in user tries to access auth pages, redirect to profile
    const authPages = ['login.html', 'register.html'];
    if (authPages.includes(currentPage) && user) {
        window.location.href = 'profile.html';
    }
}

// ===========================
// Initialize on Page Load
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializeUsersStorage();
    updateNavigation();
});

// Initialize sample data (optional - for testing)
function initializeSampleData() {
    const users = getAllUsers();
    if (users.length === 0) {
        const sampleUser = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            createdAt: 'January 2024'
        };
        saveUsers([sampleUser]);
    }
}

// Uncomment to use sample data for testing
// initializeSampleData();
