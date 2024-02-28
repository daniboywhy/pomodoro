//encontrar o botao adicionar tarefa
JSON
const addTaskBt = document.querySelector(".app__button--add-task");
const addTaskForm = document.querySelector(".app__form-add-task");
const textArea = document.querySelector('.app__form-textarea');
const ulTasks = document.querySelector('.app__section-task-list');
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const cancelBt = document.querySelector('.app__form-footer__button--cancel');
const taskDescriptionParagraph = document.querySelector('.app__section-active-task-description');
let selectedTask = null;
let liSelectedTask = null;


function updateTasks () {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function cancelAddTask () {
    textArea.value = '';
    addTaskForm.classList.add('hidden');
}

cancelBt.onclick = cancelAddTask;


function addElementTask(task) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragraph = document.createElement('p');
    paragraph.textContent = task.description;
    paragraph.classList.add('app__section-task-list-item-description');

    const button = document.createElement('button');
    button.classList.add('app_button-edit');
    
    button.onclick = () => {
        const newDesc = prompt("Rename: ");
        console.log("task's new description: ", newDesc);
        if (!newDesc || newDesc == '') {
            return;
        }
        paragraph.textContent = newDesc;
        task.description = newDesc;
        updateTasks();
        }

    const buttonImg = document.createElement('img');
    buttonImg.setAttribute('src', '/imagens/edit.png');
    button.append(buttonImg);

    li.append(svg);
    li.append(paragraph);
    li.append(button);

    if (task.complete) {
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled', 'true');
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(element => {
                element.classList.remove('app__section-task-list-item-active');
            })
            if (selectedTask == task) {
                taskDescriptionParagraph.textContent = '';
                selectedTask = null;
                liSelectedTask = null;
                return;
            }
                selectedTask = task;
                liSelectedTask = li;
            taskDescriptionParagraph.textContent = task.description;
            li.classList.add('app__section-task-list-item-active');
        }
    }


    return li;
}


addTaskBt.addEventListener('click', () => {
    addTaskForm.classList.toggle('hidden');

})

addTaskForm.addEventListener('submit', (event) => {
    if (textArea.value == '') {

    }

    event.preventDefault();
    const task = {
        description: textArea.value
    }
    tasks.push(task);
    const elementTask = addElementTask(task);
    ulTasks.append(elementTask);
    updateTasks();
    textArea.value = '';
    addTaskForm.classList.add('hidden');
})

tasks.forEach(task => {
    const elementTask = addElementTask(task);
    ulTasks.append(elementTask);
});

document.addEventListener('focusEnd', () => {
    if (selectedTask && liSelectedTask) {
        liSelectedTask.classList.remove('app__section-task-list-item-active');
        liSelectedTask.classList.add('app__section-task-list-item-complete');
        liSelectedTask.querySelector('button').setAttribute('disabled', 'true');
        taskDescriptionParagraph.textContent = '';
        selectedTask.complete = true;
        updateTasks();
    }
})