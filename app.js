// Globals
const todoList = document.getElementById('todo-list')
const userTodo = document.getElementById('user-todo')
let todos = []
let users = []

// Event attach
document.addEventListener('DOMContentLoaded', initApp)

// Event logic
function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then(values => {
        [todos, users] = values

        todos.forEach(todo => printTodo(todo))
        users.forEach(user => printUser(user))
    })
}

// Basic logic
function getUserName(userId) {
    const user = users.find(user => user.id === userId)
    return user.name
}

function printTodo({id, userId, title, completed}) {
    const li = document.createElement('li')
    li.className = 'todo-item'
    li.dataset.id = id
    li.innerHTML = `<label for="${id}">${title} by <b>${getUserName(userId)}</b></label>`

    const status = document.createElement('input')
    status.type = 'checkbox'
    status.checked = completed
    status.id = id

    const close = document.createElement('span')
    close.className = 'close'
    close.innerHTML = '&times;'

    todoList.prepend(li)
    li.prepend(status)
    li.append(close)
}

function printUser({id, name}) {
    const option = document.createElement('option')
    option.value = id
    option.innerText = `${name}`

    userTodo.append(option)
}

// Async logic
async function getAllTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    const data = await response.json()

    return data
}

async function getAllUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()

    return data
}