(function () {
  //URL
  const todosUrl = "https://jsonplaceholder.typicode.com/todos";
  const usersUrl = "https://jsonplaceholder.typicode.com/users";

  //Globals
  let todos = [];
  let users = [];
  const todoList = document.querySelector("#todo-list");
  const form = document.querySelector("form");

  //AttachEvent
  document.addEventListener("DOMContentLoaded", initApp);
  form.addEventListener("submit", handleSubmit);

  //Basig Logic
  function getUserName(userN) {
    const user = users.find((u) => u.id === userN);
    return user.name;
  }

  function printTodo({ userId, id, title, completed }) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span>`;

    const status = document.createElement("input");
    status.type = "checkbox";
    status.checked = completed;
    status.addEventListener("change", handleChangeStatus);

    const close = document.createElement("span");
    close.innerHTML = `&times;`;
    close.className = "close";
    close.addEventListener("click", handleClose);

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
  }

  function createUserOption(user) {
    const selectUser = document.querySelector("#user-todo");
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    selectUser.appendChild(option);
  }

  function removeTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);

    const todo = todoList.querySelector(`[data-id="${todoId}"]`);
    todo
      .querySelector("input")
      .removeEventListener("change", handleChangeStatus);
    todo.querySelector(".close").removeEventListener("click", handleClose);

    todo.remove();
  }

  function alertError(error) {
    alert(error.message);
  }

  //Event logic
  function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
      [todos, users] = values;

      todos.forEach((todo) => printTodo(todo));
      users.forEach((user) => createUserOption(user));
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    createTodo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
    });
  }

  function handleChangeStatus() {
    const todoId = this.parentElement.dataset.id; //status
    const completed = this.checked;

    toggleTodoComplete(todoId, completed);
  }

  function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
  }

  //Async logic
  async function getAllTodos() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=15"
      );
      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function getAllUsers() {
    try {
      const response = await fetch(usersUrl);
      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function createTodo(todo) {
    try {
      const response = await fetch(todosUrl, {
        method: "POST",
        body: JSON.stringify(todo), //что именно хотим поменять
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newTodo = await response.json();
      console.log(newTodo);

      printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
  }

  async function toggleTodoComplete(todoId, completed) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ completed: completed }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to connect with the server! Please try later!");
      }
    } catch (error) {
      alertError(error);
    }
  }

  async function deleteTodo(todoId) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        removeTodo(todoId);
      } else {
        throw new Error("Failed to connect with the server! Please try later!");
      }
    } catch (error) {
      alert(error);
    }
  }
})();
