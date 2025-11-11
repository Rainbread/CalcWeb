//More sidebar contents
const sidebarContents = {
            history: {
                title: "CalcWeb History",
                content: `
                    
                `
            },
            tutorial: {
                title: "CalcWeb Tutorial",
                content: `
                    <p><strong>Operators:</strong></p>
                    <p><strong>Basic:</strong> Contain basic arithmetic function (e.g. +, -).</p>
                    <p><strong>Advance:</strong> Contain advance arithmetic function (e.g. sin(), log(), !, etc).</p>
                    <hr>
                    <p><strong>Basic Arithmetic Operators:</strong></p>
                    <p><strong>AC:</strong> Clear inputs and outputs on the display.</p>
                    <p><strong>+:</strong> Adding two or more numbers togerther to obtain their sum.</p>
                    <p><strong>-:</strong> Subtract two or more numbers to obtain their difference.</p>
                    <p><strong>x:</strong> Mutiply two or more numbers to obtain their mutiplication.</p>
                    <p><strong>/:</strong> Divide two numbers to obtain their division.</p>
                    <p><strong>%:</strong> Modulo two or more number to obtain their result.</p>
                    <p><strong>():</strong> Operation inside the parenthese will be calculated first.</p>
                    <p><strong>=:</strong> The result after the operations.</p>
                    <hr>
                    <p><strong>Advance Arithmetic Operators:</strong></p>
                    <p><strong>UPCOMING SOON!</strong></p>
                `
            },
            about: {
                title: "About CalcWeb",
                content: `
                    <p><strong>Developer:</strong> Mingwei You, Rafael Carrilllo</p>
                    <p><strong>Why Developed:</strong> Just for fun and learn :-P</p>
                    <p><strong>Why are the Color so Bad:</strong> idk</p>
                    <hr>
                    <p><strong>Date Created:</strong> 10/9/2025</p>
                    <p><strong>Date Updated:</strong> 10/21/2025</p>
                `
            }
        };  

        //Define variables
        document.addEventListener('DOMContentLoaded', function() {
            const dropdownBtn = document.querySelectorAll('.dropdown');
            const dropdownContent = document.querySelectorAll('.content');
            const sidebarBtn = document.querySelectorAll('.sidebar-btn');
            const sidebar = document.getElementById('sidebar');
            const sidebarTitle = document.getElementById('sidebar-title');
            const sidebarContent = document.getElementById('sidebar-content');
            const closeSidebar = document.getElementById('close-sidebar');
            const sidebarOverlay = document.getElementById('sidebar-overlay');
            const themeBtn = document.querySelectorAll('.theme-option');
            const savedTheme = localStorage.getItem('web-theme') || 'default';
            setTheme(savedTheme);
            const advancedToggle = document.getElementById('advanced-toggle');
            const advancedContent = document.getElementById('advanced-content');

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
            
            //Open sidebar
            function openSidebar(type) {
                if (sidebarContents[type]) {
                    sidebarTitle.textContent = sidebarContents[type].title;
                    sidebarContent.innerHTML = sidebarContents[type].content;
                    sidebar.classList.add('active');
                    sidebarOverlay.classList.add('active');
                }
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
        });
