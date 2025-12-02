//Calculation History
class CalculationHistory {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('calcweb-history')) || [];
        this.maxList = 30;
    }
            
    addRecord(expression, result) {
        const record = {
            id: Date.now(),
            expression: expression,
            result: result
        };
                
        this.history.unshift(record);
        if (this.history.length > this.maxList) {
            this.history = this.history.slice(0, this.maxList);
        }
        this.saveToStorage();
        this.updateDisplay();
    }
            
    saveToStorage() {
        localStorage.setItem('calcweb-history', JSON.stringify(this.history));
    }
            
    updateDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
                
        if (this.history.length === 0) {
            historyList.innerHTML = '<p>No Calculation Yet!</p>';
            return;
        }
                
        let html = '';
        this.history.forEach(record => {
            html += `
                <div class="history-item">
                    <div class="history-expression">${this.escapeHtml(record.expression)}</div>
                    <div class="history-result">= ${this.escapeHtml(record.result.toString())}</div>
                    <button class="history-use-btn" onclick="useHistoryRecord('${this.escapeHtml(record.expression).replace(/'/g, "\\'")}')">Use</button>
                    <button class="history-delete-btn" onclick="deleteHistoryRecord(${record.id})">Delete</button>
                </div>
            `;
        });
        historyList.innerHTML = html;
    }
            
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
            
    clearHistory() {
        this.history = [];
        this.saveToStorage();
        this.updateDisplay();
    }
            
    deleteRecord(id) {
        this.history = this.history.filter(record => record.id !== id);
        this.saveToStorage();
        this.updateDisplay();
    }
}

//Global variable
const calcHistory = new CalculationHistory();

document.addEventListener('DOMContentLoaded', function() {
    const dropdownBtn = document.querySelectorAll('.dropdown');
    const dropdownContent = document.querySelectorAll('.content');
    const sidebarBtn = document.querySelectorAll('.sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const themeBtn = document.querySelectorAll('.theme-option');
    const savedTheme = localStorage.getItem('web-theme') || 'default';
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedContent = document.getElementById('advanced-content');
    const display = document.getElementById('display');
            
    //Color theme
    function setTheme(theme) {
        document.body.classList.remove('default-theme', 'dark-theme', 'hurt-theme', 'dripGoku-theme');
        if (theme !== 'default') {
            document.body.classList.add(theme + '-theme');
        } else {
            document.body.classList.add('default-theme');
        }
        localStorage.setItem('web-theme', theme);
    }
    setTheme(savedTheme);
            
    //Advanced function
    if (advancedToggle && advancedContent) {
        advancedToggle.addEventListener('click', function() {
            advancedContent.classList.toggle('active');
            if (advancedContent.classList.contains('active')) {
                this.innerHTML = 'Advanced Function ▲';
            } else {
                this.innerHTML = 'Advanced Function ▼';
            }
        });
    }

    //Drop-down click event
    dropdownBtn.forEach(button => {
        button.addEventListener('click', function() {
            const menuType = this.getAttribute('data-menu');
                
            dropdownContent.forEach(content => {
                if (content.getAttribute('data-menu') !== menuType) {
                    content.classList.remove('show');
                }
            });
                    
            const currentContent = document.querySelector(`.content[data-menu="${menuType}"]`);
            currentContent.classList.toggle('show');
        });
    });
            
    //Sidebar click event
    sidebarBtn.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            openSidebar(type);
            dropdownContent.forEach(content => {
                content.classList.remove('show');
            });
        });
    });
            
//Color theme event
themeBtn.forEach(button => {
    button.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        setTheme(theme);
        const themeContent = document.querySelector('.content[data-menu="theme"]');
                themeContent.classList.remove('show');
            });
        });
            
        //Clear all calculation history
        document.addEventListener('click', function(e) {
            if (e.target.id === 'clearHistory') {
                if (confirm('Are You Sure You Want to Clear All History?')) {
                    calcHistory.clearHistory();
                }
            }
        });
            
        //Open sidebar
        function openSidebar(type) {
            const sidebarTitle = document.getElementById('sidebar-title');
            document.getElementById('history-content').style.display = 'none';
            document.getElementById('tutorial-content').style.display = 'none';
            document.getElementById('about-content').style.display = 'none';
                
            switch(type) {
                case 'history':
                    sidebarTitle.textContent = "CalcWeb History";
                    document.getElementById('history-content').style.display = 'block';
                    calcHistory.updateDisplay();
                    break;
                case 'tutorial':
                    sidebarTitle.textContent = "CalcWeb Tutorial";
                    document.getElementById('tutorial-content').style.display = 'block';
                    break;
                case 'about':
                    sidebarTitle.textContent = "About CalcWeb";
                    document.getElementById('about-content').style.display = 'block';
                    break;
            }
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        }
            
        //Close sidebar
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });

        //Keyboard (calc-display) allowed keys
        display.addEventListener('keydown', function(e) {
            const allowedKeys = [
                '0','1','2','3','4','5','6','7','8','9',
                '+','-','*','/','%','(',')','.',
                'Backspace','Enter','Escape','Tab',
                's','S','c','C','t','T','l','L','n','N',
                'p','P','e','E','^'
            ];
                
            if (e.ctrlKey) return;
                
            if (!allowedKeys.includes(e.key) && !e.ctrlKey) {
                e.preventDefault();
                return;
            }
            
            if (e.key === 'Enter') {
                e.preventDefault();
                calculate();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                clearDisplay();
            } else if (e.key === 'Backspace' || e.key === 'Tab') {
                return;
            } else if (e.key === '^') {
                e.preventDefault();
                appendToDisplay('^');
            } else if (e.key === 's' || e.key === 'S') {
                if (!e.ctrlKey) {
                    e.preventDefault();
                    appendFunction('sin');
                }
            } else if (e.key === 'c' || e.key === 'C') {
                if (!e.ctrlKey) {
                    e.preventDefault();
                    appendFunction('cos');
                }
            } else if (e.key === 't' || e.key === 'T') {
                if (!e.ctrlKey) {
                    e.preventDefault();
                    appendFunction('tan');
                }
            } else if (e.key === 'l' || e.key === 'L') {
                if (!e.ctrlKey) {
                    e.preventDefault();
                    appendFunction('log');
                }
            } else if (e.key === 'n' || e.key === 'N') {
                if (!e.ctrlKey) {
                    e.preventDefault();
                    appendFunction('ln');
                }
            } else if (e.key === 'p' || e.key === 'P') {
                if (!e.ctrlKey) {
                    e.preventDefault();
                    appendToDisplay('π');
                }
            } else if (e.key === 'e' || e.key === 'E') {
                if (!e.ctrlKey) {
                    e.preventDefault();
                    appendToDisplay('e');
                }
            }
        });
            
        document.addEventListener('keydown', (e) => {
            if (!fractionActive) return;
            const numInput = document.getElementById('fraction-num');
            const denInput = document.getElementById('fraction-den');
                
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                if (fractionTarget === 'den') {
                    numInput.focus();
                }
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                if (fractionTarget === 'num') {
                        denInput.focus();
                    }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                confirmFraction();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelFraction();
            }
        });
            calcHistory.updateDisplay();
        });

        //Calculation hisotry (Use)
        function useHistoryRecord(expression) {
            const display = document.getElementById('display');
            display.textContent = expression;
        }

        //Calculation hisotry (Delete single record)
        function deleteHistoryRecord(id) {
            calcHistory.deleteRecord(id);
        }

        //Global scope
        window.appendFunction = appendFunction;
        window.appendFactorial = appendFactorial;
        window.appendToDisplay = appendToDisplay;
        window.clearDisplay = clearDisplay;
        window.calculate = calculate;
        window.showFractionEditor = showFractionEditor;
        window.cancelFraction = cancelFraction;
        window.confirmFraction = confirmFraction;
        window.useHistoryRecord = useHistoryRecord;
        window.deleteHistoryRecord = deleteHistoryRecord;
        window.calcHistory = calcHistory;
