// Globals
const todoList = document.getElementById('todo-list')
const userTodo = document.getElementById('user-todo')
const form = document.querySelector('form')
let todos = []
let users = []

// Event attach
document.addEventListener('DOMContentLoaded', initApp)
form.addEventListener('submit', handleSubmit)

// Event logic
function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then(values => {
        [todos, users] = values

        todos.forEach(todo => printTodo(todo))
        users.forEach(user => printUser(user))
    })
}

function handleSubmit(event) {
    event.preventDefault()
    if (form.todo.value && form.user.value){
        createTodo({
            userId: Number(form.user.value),
            title: form.todo.value,
            completed: false
        })
    }
    // else {
    //     const errorText = document.createElement('span')
    //     errorText.className = 'error'
    //     errorText.innerText = 'All fields are required'
    // }
}

function handleTodoChange() {
    const todoID = this.id
    const completed = this.checked

    console.log(this.id)
    console.log(this.checked)

    toggleTodoComplete(todoID, completed)
}

function handleClose() {}

// Basic logic
function getUserName(userId) {
    const user = users.find(user => user.id === userId)
    return user.name
}

function printTodo({id, userId, title, completed}) {
    const li = document.createElement('li')
    li.className = 'todo-item'
    // li.dataset.id = id
    li.innerHTML = `<label for="${id}">${title} by <b>${getUserName(userId)}</b></label for="${id}">`

    const status = document.createElement('input')
    status.type = 'checkbox'
    status.checked = completed
    status.id = id
    status.addEventListener('change', handleTodoChange)

    const close = document.createElement('span')
    close.className = 'close'
    close.innerHTML = '&times;'
    // close.addEventListener('click', handleClose)

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
    return await response.json()
}

async function getAllUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    return await response.json()
}

async function createTodo(todo) {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const todoId = await response.json()
    printTodo({id: todoId.id, ...todo})
}

async function toggleTodoComplete(todoId, completed){
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({completed: completed}),
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const data = await response.json()
    console.log(data)

    if (!response.ok){
        // error
        // throw new Error
    }
}