const cartBody = document.getElementById('cartBody');
const totalEl = document.getElementById('total');
const btnCheckout = document.getElementById('btnCheckout');
const metodoPagoEl = document.getElementById('metodo_pago');

function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

function render() {
  const cart = getCart();
  cartBody.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    const subtotal = Number(item.precio_venta) * Number(item.cantidad);
    total += subtotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.producto}</td>
      <td>$${Number(item.precio_venta).toFixed(2)}</td>
      <td><input type="number" min="1" value="${item.cantidad}" data-idx="${idx}" class="qty" style="width:64px" /></td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button data-idx="${idx}" class="remove">Eliminar</button></td>
    `;
    cartBody.appendChild(tr);
  });
  totalEl.textContent = total.toFixed(2);

  // eventos de cantidad y eliminar
  document.querySelectorAll('.qty').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = e.target.dataset.idx;
      const v = Math.max(1, Number(e.target.value));
      const cart = getCart();
      cart[idx].cantidad = v;
      saveCart(cart);
      render();
    });
  });
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.dataset.idx;
      const cart = getCart();
      cart.splice(idx, 1);
      saveCart(cart);
      render();
    });
  });
}

btnCheckout.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para pagar');
    window.location.href = '/pages/login.html';
    return;
  }
  const cart = getCart();
  if (cart.length === 0) { alert('Carrito vacío'); return; }

  // preparar payload de items
  const items = cart.map(i => ({ product_id: i.id, cantidad: Number(i.cantidad) }));
  const metodo_pago = metodoPagoEl.value;

  try {
    const resp = await fetch('http://localhost:3000/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items, metodo_pago })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.message || 'Error al pagar');
    // éxito: limpiar carrito y notificar
    localStorage.removeItem('cart');
    alert('Pago exitoso. Venta ID: ' + data.ventaId);
    window.location.href = '/pages/catalogo.html';
  } catch (err) {
    alert('Error al procesar pago: ' + err.message);
  }
});

render();

