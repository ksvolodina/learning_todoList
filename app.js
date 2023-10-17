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
    else {
        alertError(new Error('All fields are required'))
    }
}

function handleTodoChange() {
    const todoID = this.id
    const completed = this.checked

    toggleTodoComplete(todoID, completed)
}

function handleClose() {
    const todoId = this.parentElement.dataset.id

    deleteTodo(todoId)
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
    status.addEventListener('change', handleTodoChange)

    const close = document.createElement('span')
    close.className = 'close'
    close.innerHTML = '&times;'
    close.addEventListener('click', handleClose)

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

function removeTodoFromDOM(todoId) {
    todos = todos.filter(todo => todo.id !== todoId)

    const todo = todoList.querySelector(`[data-id = '${todoId}']`)
    todo.querySelector('.close').removeEventListener('click', handleClose)
    todo.querySelector('input').removeEventListener('change', handleTodoChange)
    todo.remove()
}

function alertError(error) {
    alert(error.message)
}

// Async logic
async function getAllTodos() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
        return await response.json()
    } catch (error) {
        alertError(error)
    }

}

async function getAllUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5')
        return await response.json()
    } catch (error) {
        alertError(error)
    }
}

async function createTodo(todo) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const todoId = await response.json()
        printTodo({id: todoId.id, ...todo})
    } catch (error) {
        alertError(error)
    }
}

async function toggleTodoComplete(todoId, completed){
    try{
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
            throw new Error('Failed to connect with the server. Please try later')
        }
    } catch (error) {
        alertError(error)
    }
}

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const data = await response.json()
        console.log(data)

        if (response.ok) {
            removeTodoFromDOM(todoId)
        } else {
            throw new Error('Failed to connect with the server. Please try later')
        }
    } catch (error) {
        alertError(error)
    }
}