//More sidebar conntents
const sidebarContents = {
            history: {
                title: "CalcWeb History",
                content: `
                    
                `
            },
            tutorial: {
                title: "CalcWeb Tutorial",
                content: `
                    
                `
            },
            about: {
                title: "About CalcWeb",
                content: `
                    
                `
            }
        };  

        //Define variables
        document.addEventListener('DOMContentLoaded', function() {
            const body = document.body;
            const dropdownBtn = document.querySelectorAll('.dropdown');
            const dropdownContent = document.querySelectorAll('.content');
            const sidebarBtn = document.querySelectorAll('.sidebar-btn');
            const sidebar = document.getElementById('sidebar');
            const sidebarTitle = document.getElementById('sidebar-title');
            const sidebarContent = document.getElementById('sidebar-content');
            const closeSidebar = document.getElementById('close-sidebar');
            const sidebarOverlay = document.getElementById('sidebar-overlay');
            const themeBtn = document.querySelectorAll('.theme-option');
            
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
                    switchTheme(theme);
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
            function switchTheme(theme) {
                body.classList.remove('default-theme', 'dark-theme', 'hurt-theme');
                body.classList.add(theme);
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
