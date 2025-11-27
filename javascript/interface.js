//Calculation history (DO NOT MOVE THIS)
class CalculationHistory {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('calcweb-history')) || [];
        this.maxList = 30;
    }
    
    //Add new calculation to history
    addRecord(expression, result) {
        const record = {
            id: Date.now(),
            expression: expression,
            result: result
        };
        
        //Limit the history max records
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
    
    //Escape function
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    //Clear hisotry
    clearHistory() {
        this.history = [];
        this.saveToStorage();
        this.updateDisplay();
    }
    
    //Delete single record
    deleteRecord(id) {
        this.history = this.history.filter(record => record.id !== id);
        this.saveToStorage();
        this.updateDisplay();
    }
}

//Global variable
const calcHistory = new CalculationHistory(); 

//Define variables
document.addEventListener('DOMContentLoaded', function() {
    const dropdownBtn = document.querySelectorAll('.dropdown');
    const dropdownContent = document.querySelectorAll('.content');
    const sidebarBtn = document.querySelectorAll('.sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const themeBtn = document.querySelectorAll('.theme-option');
    const savedTheme = localStorage.getItem('web-theme') || 'default';
    setTheme(savedTheme);
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedContent = document.getElementById('advanced-content');
    const display = document.getElementById('display');
    

    //Drop-down list for advanced functions
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

    //Event for all drop-down button
    dropdownBtn.forEach(button => {
        button.addEventListener('click', function() {
            const menuType = this.getAttribute('data-menu');
            
            //Close other menu
            dropdownContent.forEach(content => {
                if (content.getAttribute('data-menu') !== menuType) {
                    content.classList.remove('show');
                }
            });
            
            //Switch current menu
            const currentContent = document.querySelector(`.content[data-menu="${menuType}"]`);
            currentContent.classList.toggle('show');
        });
    });
    
    //Event for sidebar
    sidebarBtn.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            openSidebar(type);
            //Close all menu
            dropdownContent.forEach(content => {
                content.classList.remove('show');
            });
        });
    });
    
    //Event for color theme
    themeBtn.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            //Close theme content
            const themeContent = document.querySelector('.content[data-menu="theme"]');
            themeContent.classList.remove('show');
        });
    });
    
    //Event for clear history
    document.addEventListener('click', function(e) {
        if (e.target.id === 'clearHistory') {
            if (confirm('Are You Sure You Want to Clear All History?')) {
                calcHistory.clearHistory();
            }
        }
    });
    
    //Open Sidebar
    function openSidebar(type) {
        const sidebarTitle = document.getElementById('sidebar-title');
        document.getElementById('history-content').style.display = 'none';
        document.getElementById('tutorial-content').style.display = 'none';
        document.getElementById('about-content').style.display = 'none';
        //Switch to correspond content
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
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    }
    
    //Switch color theme
    function setTheme(theme) {
        document.body.classList.remove('default', 'dark-theme', 'hurt-theme', 'dripGoku-theme');
        if (theme !== 'default') {
            document.body.classList.add(theme + '-theme');
        }
        //Save color theme to local storage
        localStorage.setItem('web-theme', theme);
    }
    
    //Close sidebar
    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
    
    //Close content when clicked
    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });

    //Event for display input
    display.addEventListener('keydown', function(e) {
        //Allowed keys to be input
        const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','%','(',')','.','Backspace','Enter','Escape'];
        if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
            return;
        }
        //Special keys
        if (e.key === 'Enter') {
            e.preventDefault();
            calculate();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            clearDisplay();
        } else if (e.key === 'Backspace') {
            return;
        }
    });
    calcHistory.updateDisplay();
});

//Use history calculation
function useHistoryRecord(expression) {
    const display = document.getElementById('display');
    display.textContent = expression;
}

//delete single record
function deleteHistoryRecord(id) {
    calcHistory.deleteRecord(id);
}
