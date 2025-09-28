// Ambil elemen
const addTaskBtn = document.getElementById("addTaskBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskModal = document.getElementById("taskModal");
const cancelBtn = document.getElementById("cancelBtn");
const taskForm = document.getElementById("taskForm");
const taskContainer = document.getElementById("taskContainer");
const modalTitle = document.getElementById("modalTitle");

const filterCategory = document.getElementById("filterCategory");
const filterPriority = document.getElementById("filterPriority");

// Statistik
const totalStat = document.getElementById("total");
const doneStat = document.getElementById("done");
const pendingStat = document.getElementById("pending");
const deadlineStat = document.getElementById("deadline");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

// Fungsi render daftar tugas
function renderTasks() {
  taskContainer.innerHTML = "";

  if (tasks.length === 0) {
    taskContainer.innerHTML = `<li class="empty">Belum ada tugas. Mulai tambahkan tugas pertama Anda!</li>`;
    updateStats();
    return;
  }

  const categoryFilter = filterCategory.value;
  const priorityFilter = filterPriority.value;

  tasks.forEach((task, index) => {
    if (
      (categoryFilter === "all" || task.category === categoryFilter) &&
      (priorityFilter === "all" || task.priority === priorityFilter)
    ) {
      const li = document.createElement("li");

      li.innerHTML = `
        <div>
          <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})">
          <strong style="text-decoration:${task.completed ? "line-through" : "none"}">
            ${task.title}
          </strong>
          <p>${task.desc || ""}</p>
          <span class="badge cat">${task.category}</span>
          <span class="badge pri ${task.priority.toLowerCase()}">${task.priority}</span>
          <span class="badge date">${task.deadline || "Tanpa Deadline"}</span>
        </div>
        <div>
          <button onclick="editTask(${index})">✏️</button>
          <button onclick="deleteTask(${index})">🗑️</button>
        </div>
      `;

      taskContainer.appendChild(li);
    }
  });

  updateStats();
}

// Update statistik
function updateStats() {
  totalStat.textContent = tasks.length;
  doneStat.textContent = tasks.filter((t) => t.completed).length;
  pendingStat.textContent = tasks.filter((t) => !t.completed).length;

  const today = new Date();
  const upcoming = tasks.filter((t) => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 2; // deadline 2 hari ke depan
  }).length;

  deadlineStat.textContent = upcoming;
}

// Tambah / simpan tugas
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTask = {
    title: document.getElementById("taskTitle").value,
    desc: document.getElementById("taskDesc").value,
    category: document.getElementById("taskCategory").value,
    priority: document.getElementById("taskPriority").value,
    deadline: document.getElementById("taskDeadline").value,
    completed: false,
  };

  if (editIndex !== null) {
    tasks[editIndex] = newTask;
    editIndex = null;
  } else {
    tasks.push(newTask);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  closeModal();
  renderTasks();
  taskForm.reset();
});

// Hapus semua
clearAllBtn.addEventListener("click", () => {
  if (confirm("Hapus semua tugas?")) {
    tasks = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
});

// Modal kontrol
addTaskBtn.addEventListener("click", () => {
  modalTitle.textContent = "Tambah Tugas Baru";
  taskForm.reset();
  taskModal.classList.remove("hidden");
});
cancelBtn.addEventListener("click", closeModal);

function closeModal() {
  taskModal.classList.add("hidden");
}

// Toggle selesai
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Edit tugas
function editTask(index) {
  modalTitle.textContent = "Edit Tugas";
  const t = tasks[index];
  document.getElementById("taskTitle").value = t.title;
  document.getElementById("taskDesc").value = t.desc;
  document.getElementById("taskCategory").value = t.category;
  document.getElementById("taskPriority").value = t.priority;
  document.getElementById("taskDeadline").value = t.deadline;

  editIndex = index;
  taskModal.classList.remove("hidden");
}

// Hapus tugas
function deleteTask(index) {
  if (confirm("Hapus tugas ini?")) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}

// Filter
filterCategory.addEventListener("change", renderTasks);
filterPriority.addEventListener("change", renderTasks);

// Render awal
renderTasks();