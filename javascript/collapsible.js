//Sidebar conntents
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
            const dropdownBtn = document.querySelector('.dropdown');
            const dropdownContent = document.querySelector('.content');
            const sidebarBtns = document.querySelectorAll('.sidebar-btn');
            const sidebar = document.getElementById('sidebar');
            const sidebarTitle = document.getElementById('sidebar-title');
            const sidebarContent = document.getElementById('sidebar-content');
            const closeSidebar = document.getElementById('close-sidebar');
            const sidebarOverlay = document.getElementById('sidebar-overlay');
            
            //Drop-down menu
            dropdownBtn.addEventListener('click', function() {
                dropdownContent.classList.toggle('show');
            });
            
            //Drop-down content
            window.addEventListener('click', function(event) {
                if (!event.target.matches('.dropdown') && !event.target.matches('.sidebar-btn')) {
                    if (dropdownContent.classList.contains('show')) {
                        dropdownContent.classList.remove('show');
                    }
                }
            });
            
            //Open sidebar list
            function openSidebar(type) {
                if (sidebarContents[type]) {
                    sidebarTitle.textContent = sidebarContents[type].title;
                    sidebarContent.innerHTML = sidebarContents[type].content;
                    sidebar.classList.add('active');
                }
            }
            
            //Sidebar list
            sidebarBtns.forEach(button => {
                button.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    openSidebar(type);
                });
            });

            //Sidebar close event
            closeSidebar.addEventListener('click', function() {
                sidebar.classList.remove('active');
            });
        });
