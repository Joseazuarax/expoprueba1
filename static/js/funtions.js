
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".toggle-password-button");
    const passwordInput = document.querySelector(".password-input-wrapper input");
    const icon = toggleBtn.querySelector(".material-symbols-outlined");

    toggleBtn.addEventListener("click", function (e) {
        e.preventDefault(); // Evita que el form se envíe

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            icon.textContent = "visibility_off"; // Cambia el icono
        } else {
            passwordInput.type = "password";
            icon.textContent = "visibility";
        }
    });
});


// Función JavaScript para cambiar el módulo de la tarjeta de Siguiente Lección y el estilo activo uwu
        function selectModule(summaryElement) {
            // 1. Obtener los nuevos datos del módulo seleccionado
            const newTitle = summaryElement.getAttribute('data-module-title');
            const newDescription = summaryElement.getAttribute('data-module-description');
            const newUrl = summaryElement.getAttribute('data-module-url');
            const newImage = summaryElement.getAttribute('data-module-image'); // <-- OBTENEMOS LA RUTA DE LA IMAGEN

            // 2. Obtener los elementos de la tarjeta principal
            const titleElement = document.getElementById('current-lesson-title');
            const descriptionElement = document.getElementById('current-lesson-description');
            const continueButton = document.getElementById('continue-button');
            const imageElement = document.getElementById('current-lesson-image'); // <-- OBTENEMOS EL ELEMENTO <img>

            // 3. Actualizar el contenido, URL y la IMAGEN
            if (titleElement) {
                titleElement.textContent = newTitle;
            }
            if (descriptionElement) {
                descriptionElement.textContent = newDescription;
            }
            if (continueButton) {
                continueButton.href = newUrl;
            }
            
            // Lógica para cambiar la imagen (actualiza el atributo src)
            if (imageElement && newImage) { 
                // Añadimos la ruta base 'static/' ya que la carpeta 'img/' probablemente está dentro de 'static/' en Flask/Jinja
                // Si la carpeta 'img' está directamente en la raíz de tu proyecto, usa solo `newImage`.
                // Asumo la estructura típica: static/img/vec.png
                const fullImagePath = `static/${newImage}`; 
                imageElement.src = fullImagePath; 
                imageElement.alt = `Ilustración representativa de ${newTitle}`; // Actualiza el texto alternativo
            }

            // 4. Actualizar el estilo Activo
            document.querySelectorAll('.module-details summary').forEach(item => {
                item.classList.remove('module-active-style');
            });

            summaryElement.classList.add('module-active-style');
        }

        // Inicializar la tarjeta con el módulo 1 al cargar
        document.addEventListener('DOMContentLoaded', () => {
            const moduleOneSummary = document.querySelector('[data-module-title="Módulo 1: Ecuaciones"]');
            
            // Llama a la función para establecer el estado inicial (título, descripción, URL e IMAGEN)
            if (moduleOneSummary) {
                selectModule(moduleOneSummary);
            }
        });
document.addEventListener('DOMContentLoaded', () => {
    
    // Lista de IDs de los componentes a inicializar
    const components = [
        'grupo', 
        'turno', 
        'especialidad'
    ];

    // Itera sobre cada componente e inicializa su lógica
    components.forEach(id => {
        initializeCustomSelect(id);
    });

    /**
     * Inicializa la lógica de un campo de selección personalizado.
     * @param {string} baseId El prefijo del ID (ej: 'grupo').
     */
    function initializeCustomSelect(baseId) {
        const input = document.getElementById(`${baseId}-input`);
        const optionsContainer = document.getElementById(`${baseId}-options`);
        const options = optionsContainer.querySelectorAll('.option-item');
        const wrapper = input.closest('.input-select-wrapper');

        if (!input || !optionsContainer || !wrapper) return;

        let isSelecting = false;

        function showOptions() {
            optionsContainer.classList.add('show');
            input.classList.add('open');
        }

        function hideOptions() {
            optionsContainer.classList.remove('show');
            input.classList.remove('open');
        }

        // 1. Mostrar al recibir foco
        input.addEventListener('focus', () => {
            if (!isSelecting) {
                showOptions();
            }
        });

        // 2. Lógica de Filtrado al Escribir
        input.addEventListener('input', () => {
            const searchText = input.value.toLowerCase();
            showOptions(); 

            options.forEach(option => {
                const optionText = option.textContent.toLowerCase();
                if (optionText.includes(searchText)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });

        // 3. Lógica de Selección de Opción
        options.forEach(option => {
            option.addEventListener('mousedown', (event) => {
                // Detener el cambio de foco normal para evitar reapertura
                event.preventDefault(); 
                
                isSelecting = true; 
                
                const selectedValue = option.getAttribute('data-value');
                input.value = selectedValue; 
                
                hideOptions(); 
                input.blur();
                
                // Permitir el foco de nuevo después de un breve momento
                setTimeout(() => {
                    isSelecting = false;
                }, 100); 
            });
        });

        // 4. Ocultar el menú cuando se hace clic fuera del componente completo
        document.addEventListener('click', (event) => {
            // Si el clic NO fue dentro del wrapper, oculta.
            if (!wrapper.contains(event.target)) {
                hideOptions();
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('semestre-input');
    const optionsContainer = document.getElementById('semestre-options');
    const options = optionsContainer.querySelectorAll('.option-item');
    // El 'wrapper' es el contenedor principal que contiene el input y la lista
    const wrapper = input.closest('.input-select-wrapper'); 

    let isSelecting = false; // Nueva bandera para evitar conflictos de foco

    // --- Funciones de control de visibilidad ---

    function showOptions() {
        optionsContainer.classList.add('show');
        input.classList.add('open');
    }

    function hideOptions() {
        optionsContainer.classList.remove('show');
        input.classList.remove('open');
    }

    // --- 1. Mostrar/Ocultar con Foco/Clic Fuera ---

    // Mostrar al recibir foco
    input.addEventListener('focus', () => {
        // Solo muestra si no estamos en medio de una selección
        if (!isSelecting) {
            showOptions();
        }
    });

    // Ocultar al hacer clic fuera del componente completo
    document.addEventListener('click', (event) => {
        // Si el clic NO fue dentro del wrapper
        if (!wrapper.contains(event.target)) {
            hideOptions();
        }
    });

    // --- 2. Lógica de Filtrado al Escribir ---
    
    input.addEventListener('input', () => {
        const searchText = input.value.toLowerCase();
        showOptions(); 

        options.forEach(option => {
            const optionText = option.textContent.toLowerCase();
            if (optionText.includes(searchText)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    });

    // --- 3. Lógica de Selección de Opción (CORRECCIÓN CLAVE) ---

    options.forEach(option => {
        option.addEventListener('mousedown', (event) => {
            // **Punto de corrección 1: Usamos 'mousedown'** // Esto ocurre antes de que el input pierda el foco (blur) por el clic.
            // Esto previene que el input se re-enfoque y reabra la lista.
            event.preventDefault(); 
            
            // **Punto de corrección 2: Bloquear temporalmente el foco**
            isSelecting = true; 
            
            const selectedValue = option.getAttribute('data-value');
            input.value = selectedValue; 
            
            // Oculta la lista
            hideOptions(); 
            
            // Opcional, para simular la finalización de la selección
            input.blur();
            
            // Permitir el foco de nuevo después de un breve momento
            setTimeout(() => {
                isSelecting = false;
            }, 100); 
        });
    });
});
// recuperar contraseña 
document.addEventListener('DOMContentLoaded', () => {
// Obtener referencias a los elementos del DOM
const form = document.getElementById('recovery-form');
const formState = document.getElementById('form-state');
const successState = document.getElementById('success-state');
const headerIcon = document.getElementById('header-icon');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');

form.addEventListener('submit', (e) => {
    // 1. Evitar que el formulario recargue la página
    e.preventDefault();

    // 2. UX: Deshabilitar el botón y mostrar estado de carga
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';
    
    // Opcional: simular una pequeña espera (como si conectara a una API)
    // Si tuvieras un backend real, el código de abajo iría dentro del "then" de tu fetch/axios.
    setTimeout(() => {
        // 3. Transición de salida del formulario
        formState.classList.add('opacity-0');

        // Esperar a que termine la transición de opacidad (300ms)
        setTimeout(() => {
            // 4. Ocultar el formulario completamente
            formState.classList.add('hidden');
            
            // 5. Cambiar el icono principal (de llave a email check)
            headerIcon.textContent = 'mark_email_read';

            // 6. Mostrar el mensaje de éxito
            successState.classList.remove('hidden');
        }, 300); // Este tiempo coincide con 'duration-300' en el CSS

    }, 1500); // Tiempo de espera simulado (1.5 segundos)
});
});

// session 
document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const togglePasswordBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('passwordInput');
        const eyeIcon = document.getElementById('eyeIcon');

        // --- SOLUCIÓN PARA LA FLECHA DE ATRÁS ---
        // Este evento se dispara cada vez que la página se muestra, incluso desde el caché (atrás/adelante)
        window.addEventListener('pageshow', (event) => {
            // Reseteamos el botón a su estado original
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            btnText.textContent = "Iniciar Sesión";
            loadingSpinner.style.display = "none";
        });

        // Lógica del envío (Submit)
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            btnText.textContent = "Verificando...";
            loadingSpinner.style.display = "block";

            setTimeout(() => {
                loginForm.submit();
            }, 1100); 
        });

        // Ver contraseña
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            eyeIcon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    });