document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('add-task-btn');
    const modal = document.getElementById('task-modal');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskDeadline = document.getElementById('task-deadline');
    const taskLists = document.querySelectorAll('.task-list');
  
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    const renderTasks = () => {
      taskLists.forEach(taskList => taskList.innerHTML = '');
      tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        if (new Date(task.deadline) < new Date()) {
          taskDiv.classList.add('overdue');
        } else if ((new Date(task.deadline) - new Date()) / (1000 * 3600 * 24) <= 3) {
          taskDiv.classList.add('near-deadline');
        }
  
        taskDiv.draggable = true;
        taskDiv.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.desc}</p>
          <p>Deadline: ${task.deadline}</p>
          <button class="delete-btn">Delete</button>
        `;
        const taskList = document.querySelector(`[data-status="${task.status}"]`);
        taskList.appendChild(taskDiv);
  
        taskDiv.querySelector('.delete-btn').addEventListener('click', () => {
          tasks = tasks.filter(t => t !== task);
          saveTasks();
          renderTasks();
        });
  
        taskDiv.addEventListener('dragstart', () => {
          taskDiv.classList.add('dragging');
        });
        
        taskDiv.addEventListener('dragend', () => {
          taskDiv.classList.remove('dragging');
        });
      });
    };
  
    taskLists.forEach(list => {
      list.addEventListener('dragover', e => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        list.appendChild(dragging);
      });
  
      list.addEventListener('drop', () => {
        const dragging = document.querySelector('.dragging');
        const taskIndex = tasks.findIndex(t => t.title === dragging.querySelector('h3').innerText);
        tasks[taskIndex].status = list.dataset.status;
        saveTasks();
      });
    });
  
    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };
  
    addTaskBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      const newTask = {
        title: taskTitle.value,
        desc: taskDesc.value,
        deadline: taskDeadline.value,
        status: 'not-started'
      };
      tasks.push(newTask);
      saveTasks();
      renderTasks();
      taskForm.reset();
      modal.style.display = 'none';
    });
  
    renderTasks();
  });
  