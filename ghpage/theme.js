// Обновляем функцию toggleTheme для новой кнопки
    function toggleTheme() {
        const body = document.body;
        const button = document.getElementById('themeToggle');
        const icon = button.querySelector('.theme-icon');
        
        body.classList.add('theme-transition');
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            icon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            icon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
        
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, 300);
    }
    
    // Обновляем инициализацию темы
    document.addEventListener('DOMContentLoaded', () => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const button = document.getElementById('themeToggle');
        const icon = button.querySelector('.theme-icon');
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
            icon.textContent = '☀️';
        } else if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            icon.textContent = '🌙';
        } else {
            icon.textContent = '🌙';
        }
    });