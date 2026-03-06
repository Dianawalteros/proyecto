const token = localStorage.getItem('token');
if (!token) { alert('Inicia sesión'); window.location.href = '/pages/login.html'; }

const clienteSelect = document.getElementById('clienteSelect');
const productoSelect = document.getElementById('productoSelect');
const cantidadInput = document.getElementById('cantidad');
const btnAdd = document.getElementById('btnAdd');
const itemsBody = document.getElementById('itemsBody');
const adminTotalEl = document.getElementById('adminTotal');
const btnSubmit = document.getElementById('btnSubmit');
const historialDiv = document.getElementById('historial');
const adminMetodo = document.getElementById('admin_metodo_pago');
const oracledb = require('oracledb');


let items = [];
let productsCache = [];

// cargar usuarios (clientes) y productos
async function loadUsers() {
  const resp = await fetch('http://localhost:3000/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await resp.json();
  clienteSelect.innerHTML = data.map(u => `<option value="${u.id}">${u.name} (${u.email})</option>`).join('');
}

async function loadProducts() {
  const resp = await fetch('http://localhost:3000/api/productos');
  const data = await resp.json();
  productsCache = data;
  productoSelect.innerHTML = data.map(p => `<option value="${p.id}" data-price="${p.precio_venta}">${p.producto} — $${Number(p.precio_venta).toFixed(2)} (stock: ${p.stock})</option>`).join('');
}

function renderItems() {
  itemsBody.innerHTML = '';
  let total = 0;
  items.forEach((it, idx) => {
    const subtotal = it.precio_unitario * it.cantidad;
    total += subtotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${it.producto}</td>
      <td>${it.cantidad}</td>
      <td>$${Number(it.precio_unitario).toFixed(2)}</td>
      <td>$${Number(subtotal).toFixed(2)}</td>
      <td><button data-idx="${idx}" class="remove">Eliminar</button></td>
    `;
    itemsBody.appendChild(tr);
  });
  adminTotalEl.textContent = total.toFixed(2);

  document.querySelectorAll('.remove').forEach(b => {
    b.addEventListener('click', (e) => {
      const idx = e.target.dataset.idx;
      items.splice(idx, 1);
      renderItems();
    });
  });
}

btnAdd.addEventListener('click', () => {
  const pid = Number(productoSelect.value);
  const product = productsCache.find(p => Number(p.id) === pid);
  const qty = Math.max(1, Number(cantidadInput.value));
  if (!product) return alert('Producto no encontrado');
  if (qty > product.stock) return alert('Cantidad mayor al stock disponible');

  items.push({ product_id: pid, producto: product.producto, cantidad: qty, precio_unitario: Number(product.precio_venta) });
  renderItems();
});

btnSubmit.addEventListener('click', async () => {
  if (items.length === 0) return alert('Agrega items primero');
  const cliente_id = Number(clienteSelect.value);
  const metodo_pago = adminMetodo.value;
  const payload = { cliente_id, items: items.map(i => ({ product_id: i.product_id, cantidad: i.cantidad })), metodo_pago };

  try {
    const resp = await fetch('http://localhost:3000/api/ventas/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.message || 'Error al registrar la venta');
    alert('Venta registrada ID: ' + data.ventaId);
    items = [];
    await loadProducts();
    renderItems();
    loadHistorial();
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

async function loadHistorial() {
  const resp = await fetch('http://localhost:3000/api/ventas', { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await resp.json();
  // simple listing
  historialDiv.innerHTML = data.map(v => `
    <div style="border:1px solid #ddd; padding:8px; margin-bottom:8px;">
      <strong>ID ${v.id}</strong> Cliente: ${v.cliente_nombre || v.cliente_id} — Total: $${Number(v.total).toFixed(2)} — ${v.metodo_pago} — ${v.fecha}
      <button data-id="${v.id}" class="verDetalle">Ver detalle</button>
    </div>
  `).join('');

  document.querySelectorAll('.verDetalle').forEach(b => {
    b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const r = await fetch(`http://localhost:3000/api/ventas/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const j = await r.json();
      if (!r.ok) { alert(j.message || 'Error'); return; }
      // mostrar detalle
      alert('Detalle:\\n' + j.detalle.map(d => `${d.producto_nombre} x ${d.cantidad} = $${d.subtotal}`).join('\n'));
    });
  });
}

(async function init() {
  await loadUsers();
  await loadProducts();
  loadHistorial();
})();

