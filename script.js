//variables globales
let sectionCount = 0;
const maxSection = 16;
let snackbarBox = document.getElementById("snackbar");
//RECUPERAR ELEMENTOS DEL DOM
//tareas
const listOptionsSection = document.getElementById("select-option-section");
const inputTask = document.getElementById("task-name");
const saveTask = document.getElementById("save-task");
//secciones
const inputSection = document.getElementById("input-section");
const saveSection = document.getElementById("save-section");
const taskList = document.getElementById("task-list");



//FUNCIONES AUXILIARES PARA CREAR SECCIÓN
function createBasicSection(sectionId, sectionName) {
    const newSection = document.createElement("h4");
    newSection.classList.add("section-title");
    newSection.setAttribute("id", `section-${sectionId}`);
    newSection.appendChild(document.createTextNode(sectionName));
    return newSection;
}

function createArrowIcon(sectionId) {
    const arrowImg = document.createElement("img");
    arrowImg.src = "assets/img/arrowdown.png";
    arrowImg.classList.add("arrow");
    arrowImg.setAttribute("id", `arrow-${sectionId}`);
    return arrowImg;
}

function createOptionsIcon(sectionId) {
    const optionsImg = document.createElement("img");
    optionsImg.src = "assets/img/options.png";
    optionsImg.classList.add("options-icon");
    optionsImg.setAttribute("id", `options-${sectionId}`);
    return optionsImg;
}

function createOptionMenuItem(text, className) {
    const option = document.createElement("div");
    option.textContent = text;
    option.classList.add("option-item", className);
    return option;
}

function createOptionsMenu(sectionId) {
    const optionsMenu = document.createElement("div");
    optionsMenu.classList.add("options-menu");
    optionsMenu.setAttribute("id", `menu-${sectionId}`);
    
    const optionsItems = [
        { text: "Editar sección", class: "edit-section" },
        { text: "Eliminar sección", class: "delete-section" }
    ];
    
    optionsItems.forEach(item => {
        optionsMenu.appendChild(createOptionMenuItem(item.text, item.class));
    });
    
    return optionsMenu;
}

function createIconsContainer(arrowImg, optionsImg, optionsMenu) {
    const iconsContainer = document.createElement("div");
    iconsContainer.classList.add("section-icons");
    iconsContainer.appendChild(arrowImg);
    iconsContainer.appendChild(optionsImg);
    iconsContainer.appendChild(optionsMenu);
    return iconsContainer;
}

function createSectionTitle(sectionId, sectionName) {
    const newSection = createBasicSection(sectionId, sectionName);
    const arrowImg = createArrowIcon(sectionId);
    const optionsImg = createOptionsIcon(sectionId);
    const optionsMenu = createOptionsMenu(sectionId);
    const iconsContainer = createIconsContainer(arrowImg, optionsImg, optionsMenu);
    
    newSection.appendChild(iconsContainer);
    return { newSection, arrowImg, optionsImg, optionsMenu };
}
//FUNCIÓN PARA CREAR LA LISTA DE TAREAS
function createTaskList(sectionId) {
    const taskListOl = document.createElement("ol");
    taskListOl.classList.add("task-list");
    taskListOl.setAttribute("id", sectionId);
    return taskListOl;
}
//FUNCIÓN PARA CREAR EL CONTENIDO DE LA SECCION
function createSectionContainer(sectionTitle, taskList) {
    const sectionContainer = document.createElement("div");
    sectionContainer.classList.add("section-container");
    sectionContainer.appendChild(sectionTitle);
    sectionContainer.appendChild(taskList);
    return sectionContainer;
}
//FUNCIÓN PARA AGREGAR LA SECCION AL SELECT
function addSectionToSelect(sectionName, sectionId) {
    const newOption = document.createElement("option");
    newOption.textContent = sectionName;
    newOption.value = sectionId;
    listOptionsSection.appendChild(newOption);
}
//FUNCIÓN PARA CONFIGURAR LOS EVENTOS DE LA SECCION
function setupSectionEvents(sectionTitle, taskList, arrowImg, optionsImg, optionsMenu) {
    // Evento para mostrar/ocultar tareas
    sectionTitle.addEventListener("click", function(e) {
        if (!e.target.classList.contains('options-icon')) {
            taskList.classList.toggle("show");
            arrowImg.classList.toggle("rotate");
        }
    });

    // Evento para mostrar/ocultar menú de opciones
    optionsImg.addEventListener("click", function(e) {
        e.stopPropagation();
        optionsMenu.classList.toggle("show-menu");
        
        // Cerrar otros menús de opciones abiertos
        document.querySelectorAll('.options-menu.show-menu').forEach(menu => {
            if (menu !== optionsMenu) {
                menu.classList.remove('show-menu');
            }
        });
    });

    // Cerrar menú de opciones al hacer clic fuera
    document.addEventListener("click", function(e) {
        if (!optionsImg.contains(e.target)) {
            optionsMenu.classList.remove("show-menu");
        }
    });

    // Configurar eventos del menú de opciones
    optionsMenu.querySelector('.edit-section').addEventListener('click', function(e) {
        e.stopPropagation();
        const sectionText = sectionTitle.firstChild;
        const newName = prompt("Ingrese el nuevo nombre para la sección:", sectionText.textContent);
        if (newName && newName.trim()) {
            sectionText.textContent = newName.trim();
            // Actualizar el nombre en el select
            const sectionId = sectionTitle.id.replace('section-', '');
            const option = listOptionsSection.querySelector(`option[value="${sectionId}"]`);
            if (option) option.textContent = newName.trim();
        }
        optionsMenu.classList.remove("show-menu");
    });

    optionsMenu.querySelector('.delete-section').addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm("¿Está seguro que desea eliminar esta sección y todas sus tareas?")) {
            const sectionId = sectionTitle.id.replace('section-', '');
            // Eliminar la sección del DOM
            sectionTitle.parentElement.remove();
            // Eliminar la opción del select
            const option = listOptionsSection.querySelector(`option[value="${sectionId}"]`);
            if (option) option.remove();
            showSnackbar("🗑️ Sección eliminada");
        }
        optionsMenu.classList.remove("show-menu");
    });

    optionsMenu.querySelector('.move-up').addEventListener('click', function(e) {
        e.stopPropagation();
        const container = sectionTitle.parentElement;
        const previousContainer = container.previousElementSibling;
        if (previousContainer) {
            taskList.parentElement.insertBefore(container, previousContainer);
        }
        optionsMenu.classList.remove("show-menu");
    });

    optionsMenu.querySelector('.move-down').addEventListener('click', function(e) {
        e.stopPropagation();
        const container = sectionTitle.parentElement;
        const nextContainer = container.nextElementSibling;
        if (nextContainer) {
            taskList.parentElement.insertBefore(nextContainer, container);
        }
        optionsMenu.classList.remove("show-menu");
    });
}

//FUNCION PARA AGREGAR SECCION
function addSection() {
    const sectionName = inputSection.value.trim();
    
    if (sectionName === "") {
        showSnackbar("🔴 El campo se encuentra vacío");
        return;
    }

    const sectionId = sectionName.replace(/\s+/g, '-').toLowerCase();
    
    // Crear elementos de la sección
    const { newSection, arrowImg, optionsImg, optionsMenu } = createSectionTitle(sectionId, sectionName);
    const taskListOl = createTaskList(sectionId);
    const sectionContainer = createSectionContainer(newSection, taskListOl);
    
    // Agregar la sección al DOM
    taskList.appendChild(sectionContainer);
    
    // Agregar opción al select
    addSectionToSelect(sectionName, sectionId);
    
    // Configurar eventos
    setupSectionEvents(newSection, taskListOl, arrowImg, optionsImg, optionsMenu);
    
    // Limpiar input y mostrar notificación
    inputSection.value = "";
    showSnackbar("✅ Sección creada exitosamente");
}

// ⬇⬇ FUNCIONES AUXILIARES PARA AGREGAR TAREA ⬇⬇ 


//FUNCIÓN PARA VALIDAR EL INGRESO DE LA TAREA
function validateTaskInput(taskText) {
    if (taskText.trim() === "") {
        alert("Debes agregar una tarea");
        return false;
    }
    return true;
}
//FUNCIÓN PARA VALIDAR LA SECCION DE LA TAREA
function validateTaskSection(selectedSection) {
    if (selectedSection === "0") {
        alert("Elige una sección para tu tarea");
        return false;
    }
    return true;
}
//FUNCIÓN PARA OBTENER LA LISTA DE TAREAS DE LA SECCION SELECCIONADA
function getSelectedTaskList(sectionId) {
    const selectedTaskList = document.getElementById(sectionId);
    if (!selectedTaskList) {
        alert("Error: No se encontró la sección seleccionada.");
        return null;
    }
    return selectedTaskList;
}
//FUNCIÓN PARA CREAR UNA TAREA
function createTaskElement(taskText) {
    const taskContainer = document.createElement("li");
    const taskSpan = document.createElement("span");
    const crossImg = document.createElement("img");
    
    taskSpan.textContent = taskText;
    crossImg.src = "assets/img/cross.png";
    crossImg.classList.add("cross");
    
    taskContainer.appendChild(taskSpan);
    taskContainer.appendChild(crossImg);
    
    return taskContainer;
}
//FUNCIÓN PARA CONFIGURAR LOS EVENTOS DE LA TAREA
function setupTaskEvents(taskElement) {
    const taskSpan = taskElement.querySelector("span");
    const crossImg = taskElement.querySelector(".cross");
    
    taskSpan.addEventListener("click", function() {
        taskElement.classList.toggle("completed");
    });
    
    crossImg.addEventListener("click", function() {
        taskElement.remove();
        showSnackbar("🗑️ Tarea eliminada");
    });
}
// FUNCIÓN PARA AGREGAR UNA TAREA
function addTask() {
    const taskText = inputTask.value.trim();
    const selectedSection = listOptionsSection.value;

    // --Validaciones
    if (!validateTaskInput(taskText)) return;
    if (!validateTaskSection(selectedSection)) return;

    const selectedTaskList = getSelectedTaskList(selectedSection);
    if (!selectedTaskList) return;

    //--Crear y configurar la tarea
    const newTask = createTaskElement(taskText);
    setupTaskEvents(newTask);

    //--Agregar al DOM
    selectedTaskList.appendChild(newTask);

    //--Limpiar input
    inputTask.value = "";
}

// ⬇⬇ FUNCIONES PARA MOSTRAR NOTIFICACIONES ⬇⬇
function showSnackbar(message) {
    // Crear el elemento del mensaje
    const snack = document.createElement("div");
    snack.classList.add("snackbar-message");
    snack.textContent = message;
    
    snackbarBox.appendChild(snack);
    
    setTimeout(() => {
        snack.classList.add("show");
    }, 100);
    
    setTimeout(() => {
        snack.classList.remove("show");
        setTimeout(() => {
            snack.remove();
        }, 300);
    }, 2000);
}

//FUNCION PARA LIMITAR SECCIONES
function limitSection() {
    const sectionText = inputSection.value.trim();
    
    if (sectionText === "") {
        showSnackbar("🔴 El campo de sección está vacío");
        return;
    }
    
    if (sectionCount >= maxSection) {
        showSnackbar("🔴 No puedes agregar más secciones, el límite es 16");
        return;
    }
    
    addSection();
    sectionCount++;
}

// AGREGAR EVENTO PARA GUARDAR LA TAREA Y SECCION
saveTask.addEventListener("click", () => {
    const taskText = inputTask.value.trim();
    const selectedSection = listOptionsSection.value;
    
    if (taskText !== "" && selectedSection !== "0") {
        addTask();
        showSnackbar("✅ ¡Tarea guardada correctamente en " + selectedSection + "!");
    }else{
        showSnackbar("🔴 No puedes agregar una tarea vacía");
    }
});

saveSection.addEventListener("click", () => {
    const prevCount = sectionCount;
    
    limitSection();
    
    if (sectionCount > prevCount) {
        showSnackbar("✅ ¡Sección guardada correctamente!");
    }
});
