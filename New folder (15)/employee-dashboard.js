// Check if user is logged in and is employee
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'employee') {
    window.location.href = 'index.html';
}

// Get tasks from storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

function displayTasks() {
    const tasksContainer = document.getElementById('tasksList');
    tasksContainer.innerHTML = '';
    
    const employeeTasks = tasks.filter(task => task.assignedTo === currentUser.username);
    
    employeeTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card';
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-meta">
                <span>Due: ${task.dueDate}</span>
                <span class="task-priority priority-${task.priority}">Priority: ${task.priority === 'level1' ? 'High' : task.priority === 'level2' ? 'Medium' : 'Low'}</span>
                <select class="task-status status-${task.status}" onchange="updateTaskStatus(${task.id}, this.value)">
                    <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
        `;
        tasksContainer.appendChild(taskElement);
    });
}

function updateTaskStatus(taskId, newStatus) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}

// Initial display of tasks
displayTasks();