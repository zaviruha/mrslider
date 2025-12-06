// Демо-функции
function getDemo1Values() {
    const slider = document.getElementById('demo1');
    const values = slider.getCurrentValues();
    document.getElementById('globalLogOutput').textContent = 
        `Значения: [${values.map(v => v.toFixed(2)).join(', ')}]`;
}

function addDemo1Thumb() {
    const slider = document.getElementById('demo1');
    const index = slider.addThumb();
    getDemo1Values();
}

function removeDemo1Thumb() {
    const slider = document.getElementById('demo1');
    const values = slider.getCurrentValues();
    if (values.length > 2) {
        slider.removeThumb(values.length - 1);
        getDemo1Values();
    } else {
        alert('Должно быть минимум 2 бегунка');
    }
}

function changeDemo2Colors() {
    const colors = [
        ['#ff6b6b', '#ff6b6b'],
        ['#4ecdc4', '#4ecdc4'],
        ['#45b7d1', '#45b7d1'],
        ['#96ceb4', '#96ceb4'],
        ['#ffeaa7', '#ffeaa7']
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const slider = document.getElementById('demo2');
    slider.style.setProperty('--range-color', randomColor[0]);
    slider.style.setProperty('--thumb-border-color', randomColor[1]);
}

function toggleDemo2Disabled() {
    const slider = document.getElementById('demo2');
    if (slider.isDisabled) {
        slider.enable();
        document.getElementById('globalLogOutput').textContent = 'Слайдер включен';
    } else {
        slider.disable();
        document.getElementById('globalLogOutput').textContent = 'Слайдер выключен';
    }
}

function demo2Random() {
    const slider = document.getElementById('demo2');
    const min = parseInt(slider.getAttribute('min'));
    const max = parseInt(slider.getAttribute('max'));
    const count = slider.getCurrentValues().length;
    
    const randomValues = Array.from({ length: count }, () => 
        Math.round(Math.random() * (max - min) + min)
    );
    
    slider.setValues(randomValues);
    document.getElementById('globalLogOutput').textContent = 
        `Значения: [${randomValues.join(', ')}]`;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = [];
    
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('price[')) {
            values.push(value);
        }
    }
    
    values.sort((a, b) => a - b);
    document.getElementById('globalLogOutput').textContent = 
        `Отправленные значения: ${values.join(', ')}`;
}

function resetDemo3() {
    const slider = document.getElementById('demo3');
    slider.reset();
    document.getElementById('globalLogOutput').textContent = 'Слайдер сброшен';
}

const eventLog = [];
const maxLogEntries = 10;

function addLog(source, eventType, values) {
    const time = new Date().toLocaleTimeString('ru-RU');
    const valuesStr = values.map(v => v.toFixed(2)).join(', ');
    
    const entry = `${time} | ${source} → ${eventType}: [${valuesStr}]`;
    eventLog.push(entry);
    
    // Оставляем только последние записи
    if (eventLog.length > maxLogEntries) {
        eventLog.shift();
    }
    
    updateLogDisplay();
}

function updateLogDisplay() {
    const logContainer = document.getElementById('globalLogOutput');
    
    if (eventLog.length === 0) {
        logContainer.innerHTML = 'Перемещайте бегунки, чтобы увидеть события...';
        return;
    }
    
    logContainer.innerHTML = eventLog
        .map(entry => `<div class="log-entry">${entry}</div>`)
        .reverse()
        .join('');
        
    // Автоскролл к новым записям
    logContainer.scrollTop = 0;
}

function clearLog() {
    eventLog.length = 0;
    updateLogDisplay();
}

function copyLog() {
    const logText = eventLog.join('\n');
    navigator.clipboard.writeText(logText)
        .then(() => alert('Лог скопирован в буфер обмена'))
        .catch(() => alert('Не удалось скопировать лог'));
}

// Подписываемся на события слайдеров
document.addEventListener('DOMContentLoaded', () => {
    ['demo1', 'demo2', 'demo3'].forEach(id => {
        const slider = document.getElementById(id);
        if (slider) {
            slider.addEventListener('input', (e) => {
                const demoName = `Демо ${id.slice(-1)}`;
                addLog(demoName, 'input', e.detail.values);
            });
            slider.addEventListener('change', (e) => {
                const demoName = `Демо ${id.slice(-1)}`;
                addLog(demoName, 'change', e.detail.values);
            });
        }
    });
});

// Табы
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}
