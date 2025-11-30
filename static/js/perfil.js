function switchTab(evt, tabName) {
    // 1. Ocultar todos los contenidos de las pestañas
    var tabContents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // 2. Quitar la clase 'active' de todos los botones/pestañas
    var tabLinks = document.getElementsByClassName("tab-link");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
        // Si tienes estilos específicos para active en tu CSS, esto los quitará
        tabLinks[i].style.backgroundColor = "transparent"; 
        tabLinks[i].style.color = ""; // Volver al color original
        tabLinks[i].style.borderBottom = "none";
    }

    // 3. Mostrar el contenido de la pestaña actual
    document.getElementById(tabName).style.display = "block";

    // 4. Añadir la clase 'active' al botón pulsado
    evt.currentTarget.classList.add("active");
    
    // Estilos manuales para simular la clase active si no la tienes definida en CSS
    // Puedes borrar esto si tu CSS ya maneja la clase .active
    evt.currentTarget.style.borderBottom = "2px solid #753232";
    evt.currentTarget.style.color = "#753232";
    evt.currentTarget.style.fontWeight = "600";
}

// Inicializar: Asegurar que 'cursos' esté visible al cargar
document.addEventListener("DOMContentLoaded", function() {
    // Simular clic en la primera pestaña para cargar estilos iniciales
    document.querySelector('.tab-link.active').click();
});