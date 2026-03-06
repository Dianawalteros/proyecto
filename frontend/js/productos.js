const API_URL = "http://localhost:3000/api/productos";

const listaProductos = document.getElementById("listaProductos");
const form = document.getElementById("productoForm");

// Modal y sus inputs
const modal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeModal = document.getElementById("closeModal");

const editId = document.getElementById("editId");
const editProducto = document.getElementById("editProducto");
const editDescripcion = document.getElementById("editDescripcion");
const editPrecioCompra = document.getElementById("editPrecioCompra");
const editPrecioVenta = document.getElementById("editPrecioVenta");
const editStock = document.getElementById("editStock");
const editImagenUrl = document.getElementById("editImagenUrl");
const editFechaCompra = document.getElementById("editFechaCompra");

// Cache local
let productosCache = [];

// Utilidad: fecha "YYYY-MM-DD"
function toISODateOnly(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value.length >= 10) return value.slice(0, 10);
  return value;
}

// Cargar productos
async function cargarProductos() {
  const res = await fetch(API_URL);
  const data = await res.json();
  productosCache = data;

  listaProductos.innerHTML = "";
  data.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.producto}</td>
      <td>${p.descripcion || ""}</td>
      <td>${p.precio_compra}</td>
      <td>${p.precio_venta}</td>
      <td>${p.stock ?? 0}</td>
      <td>${p.imagen_url ? `<img src="${p.imagen_url}" width="50" />` : ""}</td>
      <td>${toISODateOnly(p.fecha_compra)}</td>
      <td>
        <button onclick="editProduct(${p.id})">Editar</button>
        <button onclick="deleteProduct(${p.id})">Eliminar</button>
      </td>
    `;
    listaProductos.appendChild(tr);
  });
}

// Crear producto
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  const producto = {
    producto: document.getElementById("producto").value,
    descripcion: document.getElementById("descripcion").value,
    precio_compra: document.getElementById("precio_compra").value,
    precio_venta: document.getElementById("precio_venta").value,
    stock: document.getElementById("stock").value,
    imagen_url: document.getElementById("imagen_url").value,
    fecha_compra: document.getElementById("fecha_compra").value,
  };

  const resp = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(producto),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    alert("❌ Error al crear: " + (err.error || resp.statusText));
    return;
  }

  form.reset();
  await cargarProductos();
});

// Eliminar producto
async function deleteProduct(id) {
  if (confirm("⚠️ ¿Seguro que deseas eliminar este producto?")) {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (resp.ok) {
      alert("Producto eliminado ❌");
      cargarProductos();
    } else {
      const err = await resp.json().catch(() => ({}));
      alert("❌ No se pudo eliminar: " + (err.message || resp.statusText));
    }
  }
}
window.deleteProduct = deleteProduct;

// Abrir modal para editar
function editProduct(id) {
  const p = productosCache.find((x) => Number(x.id) === Number(id));
  if (!p) return;

  editId.value = p.id;
  editProducto.value = p.producto || "";
  editDescripcion.value = p.descripcion || "";
  editPrecioCompra.value = p.precio_compra ?? "";
  editPrecioVenta.value = p.precio_venta ?? "";
  editStock.value = p.stock ?? 0;
  editImagenUrl.value = p.imagen_url || "";
  editFechaCompra.value = toISODateOnly(p.fecha_compra);

  modal.style.display = "flex";
}
window.editProduct = editProduct;

// Guardar cambios (PUT)
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const id = editId.value;

  const updated = {
    producto: editProducto.value,
    descripcion: editDescripcion.value,
    precio_compra: editPrecioCompra.value,
    precio_venta: editPrecioVenta.value,
    stock: editStock.value,
    imagen_url: editImagenUrl.value,
    fecha_compra: editFechaCompra.value,
  };

  const resp = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updated),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    alert("❌ Error al actualizar: " + (err.error || resp.statusText));
    return;
  }

  modal.style.display = "none";
  await cargarProductos();
});

// Cerrar modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cargar al inicio
cargarProductos();

