//variables globales
let sectionCount = 0;
const maxSection = 15; // Cambiado a 15 porque el contador empieza en 0

//RECUPERAR ELEMENTOS DEL DOM
//tareas
const listOptionsSection = document.getElementById("select-option-section");
const inputTask = document.getElementById("task-name");
const saveTask = document.getElementById("save-task");
//secciones
const inputSection = document.getElementById("input-section");
const saveSection = document.getElementById("save-section");
const taskList = document.getElementById("task-list");

//FUNCION PARA LIMITAR SECCIONES
function limitSection(){
    if (sectionCount < maxSection){
        addSection();
        sectionCount++;
    }else{
        alert("No puedes agregar más secciones, el límite es 16");
    }
}

//FUNCION PARA AGREGAR SECCION
function addSection() {
    if (inputSection.value.trim() === "") {
        alert("El campo se encuentra vacío, ingrese el nombre de su nueva sección");
        return;
    }

    const sectionId = inputSection.value.trim().replace(/\s+/g, '-').toLowerCase();

    const newSection = document.createElement("h4");
    newSection.classList.add("section-title");
    newSection.setAttribute("id", `section-${sectionId}`);

    const sectionText = document.createTextNode(inputSection.value);

    const arrowImg = document.createElement("img");
    arrowImg.src = "assets/img/arrowdown.png";
    arrowImg.classList.add("arrow");
    arrowImg.setAttribute("id", `arrow-${sectionId}`);

    newSection.appendChild(sectionText);
    newSection.appendChild(arrowImg);

    const taskListOl = document.createElement("ol");
    taskListOl.classList.add("task-list");
    taskListOl.setAttribute("id", sectionId);

    const sectionContainer = document.createElement("div");
    sectionContainer.classList.add("section-container");
    sectionContainer.appendChild(newSection);
    sectionContainer.appendChild(taskListOl);

    taskList.appendChild(sectionContainer);

    const newOption = document.createElement("option");
    newOption.textContent = inputSection.value;
    newOption.value = sectionId;
    listOptionsSection.appendChild(newOption);

 
    newSection.addEventListener("click", function () {
        taskListOl.classList.toggle("show");
        arrowImg.classList.toggle("rotate");
    });

    inputSection.value = "";
}

// FUNCIÓN PARA AGREGAR UNA TAREA
function addTask() {
    if (inputTask.value.trim() === "") {
        alert("Debes agregar una tarea");
        return;
    }

    if (listOptionsSection.value === "0") {
        alert("Elige una sección para tu tarea");
        return;
    }

    const selectedTaskList = document.getElementById(listOptionsSection.value);

    if (!selectedTaskList) {
        alert("Error: No se encontró la sección seleccionada.");
        return;
    }

    const newTask = document.createElement("li");
    newTask.textContent = inputTask.value;
    newTask.classList.add("bx");

    newTask.addEventListener("click", function() {
        this.classList.toggle("completed");
    });

    selectedTaskList.appendChild(newTask);
    inputTask.value = "";
}

// AGREGAR EVENTO PARA GUARDAR LA TAREA
saveTask.addEventListener("click", addTask);
saveSection.addEventListener("click", limitSection);

console.log(listOptionsSection.value)
document.getElementById(listOptionsSection.value);