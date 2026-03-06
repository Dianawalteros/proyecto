const API_URL = "http://localhost:3000/api/users";
const tableBody = document.querySelector("#userTable tbody");
const modal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeModal = document.getElementById("closeModal");

// 🔑 Obtener token del localStorage
const token = localStorage.getItem("token");

// Cargar usuarios
async function loadUsers() {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      alert("⚠️ Sesión expirada o no iniciada");
      window.location.href = "/pages/login.html";
      return;
    }
    alert("❌ Error al obtener usuarios");
    return;
  }

  const users = await res.json();
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.rol}</td>
      <td>
        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.rol}')">Editar</button>
        <button onclick="deleteUser(${user.id})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Eliminar usuario
async function deleteUser(id) {
  if (confirm("¿Seguro que deseas eliminar este usuario?")) {
    const resp = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resp.ok) {
      loadUsers();
    } else {
      alert("❌ Error al eliminar");
    }
  }
}

// Editar usuario (abrir modal)
function editUser(id, name, email, rol) {
  modal.style.display = "block";
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editRol").value = rol;
}

// Guardar cambios de edición
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value;
  const name = document.getElementById("editName").value;
  const email = document.getElementById("editEmail").value;
  const rol = document.getElementById("editRol").value;

  const resp = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, rol }),
  });

  if (resp.ok) {
    modal.style.display = "none";
    loadUsers();
  } else {
    alert("❌ Error al actualizar");
  }
});

// Cerrar modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cargar usuarios al inicio
loadUsers();
