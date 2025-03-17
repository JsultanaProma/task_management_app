// Check if user is logged in and is admin
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'index.html';
}

// Get tasks from storage or use default
let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    { id: 1, title: 'Complete Project Proposal', description: 'Write a detailed project proposal for the new client', assignedTo: 'employee1', status: 'pending', dueDate: '2024-02-01' }
];

// Handle task creation
document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newTask = {
        id: tasks.length + 1,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        assignedTo: document.getElementById('assignTo').value,
        status: 'pending',
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('dueDate').value
    };
    
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Reset form and refresh task list
    e.target.reset();
    displayTasks();
});

// Display all tasks
function displayTasks() {
    const tasksContainer = document.getElementById('tasksList');
    tasksContainer.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card';
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-meta">
                <span>Assigned to: ${task.assignedTo}</span>
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

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Initial display of tasks
displayTasks();