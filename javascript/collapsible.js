//Drop-down menu function
document.addEventListener('DOMContentLoaded', function() {
    const dropdownBtn = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.content');
    
    //Show / hide drop-down menu when click
    dropdownBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
    });
});
