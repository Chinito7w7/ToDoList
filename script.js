// RECUPERAR DATOS DEL DOM
const listSection = document.getElementById("sections-task");
const inputSection = document.getElementById("input-section");
const saveSection = document.getElementById("save-section");
const taskList = document.getElementById("task-list");
// De las tareas
const inputTask = document.getElementById("task-name");
const saveTask = document.getElementById("save-task");

// FUNCIÓN PARA AGREGAR UNA SECCIÓN
function addSection() {
    if (inputSection.value.trim() === "") {
        alert("El campo se encuentra vacío, ingrese el nombre de su nueva sección");
        return;
    }

    // Normalizar el nombre de la sección para el ID (reemplazar espacios por guiones y convertir a minúsculas)
    const sectionId = inputSection.value.trim().replace(/\s+/g, '-').toLowerCase();

    // Crear el H4 con el nombre de la sección
    const newSection = document.createElement("h4");
    newSection.classList.add("section-title");
    newSection.setAttribute("id", `section-${sectionId}`); // ID único para cada título de sección

    // Crear el nodo de texto con el nombre de la sección
    const sectionText = document.createTextNode(inputSection.value);

    // Crear la imagen de la flecha
    const arrowImg = document.createElement("img");
    arrowImg.src = "assets/img/arrowdown.png"; // Asegúrate de que la ruta es correcta
    arrowImg.classList.add("arrow");
    arrowImg.setAttribute("id", `arrow-${sectionId}`); // ID único para la flecha

    // Agregar el texto y la imagen dentro del H4
    newSection.appendChild(sectionText);
    newSection.appendChild(arrowImg);

    // Crear el OL para las tareas
    const taskListOl = document.createElement("ol");
    taskListOl.classList.add("task-list");
    taskListOl.setAttribute("id", sectionId);

    // Agregar la sección y la lista de tareas al DOM
    taskList.appendChild(newSection);
    taskList.appendChild(taskListOl);

    // Agregar la nueva sección como opción en el select
    const newOption = document.createElement("option");
    newOption.textContent = inputSection.value;
    newOption.value = sectionId;
    listSection.appendChild(newOption);

    // Evento para desplegar el menú de la sección
    newSection.addEventListener("click", function () {
        taskListOl.classList.toggle("show");
        arrowImg.classList.toggle("rotate");
    });

    // Limpiar el input después de agregar la sección
    inputSection.value = "";
}

// FUNCIÓN PARA AGREGAR UNA TAREA
function addTask() {
    if (inputTask.value.trim() === "") {
        alert("Debes agregar una tarea");
        return;
    }

    if (listSection.value === "0") {
        alert("Elige una sección para tu tarea");
        return;
    }

    // Obtener la lista de tareas correcta usando el ID del select
    const selectedTaskList = document.getElementById(listSection.value);

    if (!selectedTaskList) {
        alert("Error: No se encontró la sección seleccionada.");
        return;
    }

    // Crear la tarea (li)
    const newTask = document.createElement("li");
    newTask.textContent = inputTask.value;
    newTask.classList.add("bx");

    // Agregar la tarea al <ol> correspondiente
    selectedTaskList.appendChild(newTask);

    // Limpiar el input de tareas
    inputTask.value = "";
}

// Agregar evento al botón para guardar tareas
saveTask.addEventListener("click", addTask);

// Agregar evento al botón para guardar secciones
saveSection.addEventListener("click", addSection);
