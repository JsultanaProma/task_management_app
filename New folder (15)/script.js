// Mock user data for demonstration
const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'employee1', password: 'emp123', role: 'employee' },
    { username: 'employee2', password: 'emp123', role: 'employee' },
    { username: 'employee3', password: 'emp123', role: 'employee' },
    { username: 'employee4', password: 'emp123', role: 'employee' }
];

// Mock tasks data
let tasks = [
    { id: 1, title: 'Complete Project Proposal', description: 'Write a detailed project proposal for the new client', assignedTo: 'employee1', status: 'pending', dueDate: '2024-02-01' }
];

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        redirectToDashboard(currentUser.role);
        return;
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }

    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password && 
        u.role === role
    );

    if (user) {
        try {
            // Store user info in session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            // Store initial tasks in localStorage if not exists
            if (!localStorage.getItem('tasks')) {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            redirectToDashboard(role);
        } catch (error) {
            showError('An error occurred during login. Please try again.');
            console.error('Login error:', error);
        }
    } else {
        showError('Invalid credentials. Please try again.');
    }
}

// Redirect to appropriate dashboard
function redirectToDashboard(role) {
    if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else if (role === 'employee') {
        window.location.href = 'employee-dashboard.html';
    } else {
        showError('Invalid role');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const loginForm = document.querySelector('.login-form');
    const existingError = loginForm.querySelector('.error-message');
    
    if (existingError) {
        existingError.remove();
    }
    
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
    
    // Force reflow to trigger animation
    errorDiv.offsetHeight;
    errorDiv.style.display = 'block';
    errorDiv.style.opacity = '1';
    errorDiv.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}