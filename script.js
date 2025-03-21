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
function createSectionTitle(sectionId, sectionName) {
    const newSection = document.createElement("h4");
    newSection.classList.add("section-title");
    newSection.setAttribute("id", `section-${sectionId}`);

    const sectionText = document.createTextNode(sectionName);
    const arrowImg = document.createElement("img");
    arrowImg.src = "assets/img/arrowdown.png";
    arrowImg.classList.add("arrow");
    arrowImg.setAttribute("id", `arrow-${sectionId}`);

    newSection.appendChild(sectionText);
    newSection.appendChild(arrowImg);

    return { newSection, arrowImg };
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
function setupSectionEvents(sectionTitle, taskList, arrowImg) {
    sectionTitle.addEventListener("click", function () {
        taskList.classList.toggle("show");
        arrowImg.classList.toggle("rotate");
    });
}

//FUNCION PARA AGREGAR SECCION
function addSection() {
    const sectionName = inputSection.value.trim();
    
    if (sectionName === "") {
        alert("El campo se encuentra vacío, ingrese el nombre de su nueva sección");
        return;
    }

    const sectionId = sectionName.replace(/\s+/g, '-').toLowerCase();
    
    // Crear elementos de la sección
    const { newSection, arrowImg } = createSectionTitle(sectionId, sectionName);
    const taskListOl = createTaskList(sectionId);
    const sectionContainer = createSectionContainer(newSection, taskListOl);
    
    // Agregar la sección al DOM
    taskList.appendChild(sectionContainer);
    
    // Agregar opción al select
    addSectionToSelect(sectionName, sectionId);
    
    // Configurar eventos
    setupSectionEvents(newSection, taskListOl, arrowImg);
    
    // Limpiar input
    //inputSection.value = "";
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
    const newTask = document.createElement("li");
    newTask.textContent = taskText;
    return newTask;
}
//FUNCIÓN PARA CONFIGURAR LOS EVENTOS DE LA TAREA
function setupTaskEvents(taskElement) {
    taskElement.addEventListener("click", function() {
        this.classList.toggle("completed");
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
    }
});

saveSection.addEventListener("click", () => {
    const prevCount = sectionCount;
    
    limitSection();
    
    if (sectionCount > prevCount) {
        showSnackbar("✅ ¡Sección guardada correctamente!");
    }
});
