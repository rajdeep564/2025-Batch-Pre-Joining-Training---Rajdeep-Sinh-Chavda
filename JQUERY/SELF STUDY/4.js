// Storage functions
const storage = {
    local: {
      set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
      get: (key) => JSON.parse(localStorage.getItem(key)),
      remove: (key) => localStorage.removeItem(key),
    },
    session: {
      set: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
      get: (key) => JSON.parse(sessionStorage.getItem(key)),
      remove: (key) => sessionStorage.removeItem(key),
    },
    cookie: {
      set: (key, value, days) => {
        const date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        const expires = "expires=" + date.toUTCString()
        document.cookie = key + "=" + value + ";" + expires + ";path=/"
      },
      get: (key) => {
        const name = key + "="
        const decodedCookie = decodeURIComponent(document.cookie)
        const ca = decodedCookie.split(";")
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i]
          while (c.charAt(0) === " ") {
            c = c.substring(1)
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
          }
        }
        return ""
      },
      remove: (key) => {
        document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      },
    },
  }
  
  // Task management
  let tasks = storage.local.get("tasks") || []
  const currentSession = storage.session.get("currentSession") || { startTime: new Date().toISOString(), taskCount: 0 }
  
  function renderTasks() {
    const taskList = document.getElementById("taskList")
    taskList.innerHTML = ""
    tasks.forEach((task, index) => {
      const li = document.createElement("li")
      li.className = `list-group-item task-item priority-${task.priority}`
      li.innerHTML = `
              <span>${task.text}</span>
              <div class="task-buttons">
                  <button class="btn btn-sm btn-warning" onclick="editTask(${index})">Edit</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Delete</button>
              </div>
          `
      taskList.appendChild(li)
    })
  }
  
  function addTask(text, priority) {
    tasks.push({ text, priority })
    storage.local.set("tasks", tasks)
    currentSession.taskCount++
    storage.session.set("currentSession", currentSession)
    renderTasks()
  }
  
  function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text)
    if (newText !== null) {
      tasks[index].text = newText
      storage.local.set("tasks", tasks)
      renderTasks()
    }
  }
  
  function deleteTask(index) {
    tasks.splice(index, 1)
    storage.local.set("tasks", tasks)
    renderTasks()
  }
  
  function clearAllTasks() {
    tasks = []
    storage.local.remove("tasks")
    renderTasks()
  }
  
  // Event listeners
  document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const taskInput = document.getElementById("taskInput")
    const prioritySelect = document.getElementById("prioritySelect")
    addTask(taskInput.value, prioritySelect.value)
    taskInput.value = ""
  })
  
  document.getElementById("clearAll").addEventListener("click", clearAllTasks)
  
  document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")
    const isDarkTheme = document.body.classList.contains("dark-theme")
    storage.cookie.set("darkTheme", isDarkTheme, 30)
  })
  
  // Initialize
  renderTasks()
  
  // Set theme from cookie
  if (storage.cookie.get("darkTheme") === "true") {
    document.body.classList.add("dark-theme")
  }
  
  // Log session info
  console.log("Session started at:", currentSession.startTime)
  console.log("Tasks added this session:", currentSession.taskCount)
  
  