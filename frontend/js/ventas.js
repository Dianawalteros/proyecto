const API_URL = 'http://localhost:3000/api';
const ventasTable = document.getElementById('ventasTable');
const token = localStorage.getItem('token');

// Función para cargar ventas
async function loadVentas() {
  try {
    const response = await fetch(`${API_URL}/ventas`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Error al cargar ventas');

    const ventas = await response.json();
    displayVentas(ventas);
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar las ventas');
  }
}

// Función para mostrar ventas en la tabla
function displayVentas(ventas) {
  const tbody = ventasTable.getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  ventas.forEach(venta => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${venta.id}</td>
      <td>${venta.user_name}</td>
      <td>${new Date(venta.fecha).toLocaleDateString()}</td>
      <td>$${venta.total.toFixed(2)}</td>
      <td>
        <button onclick="verDetalles(${venta.id})" class="btn-detalles">
          Ver Detalles
        </button>
      </td>
    `;
  });
}

// Función para ver detalles de una venta
async function verDetalles(ventaId) {
  try {
    const response = await fetch(`${API_URL}/ventas/${ventaId}/detalles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Error al cargar detalles');

    const detalles = await response.json();
    mostrarModalDetalles(detalles);
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar los detalles de la venta');
  }
}

// Función para mostrar modal con detalles
function mostrarModalDetalles(detalles) {
  const modal = document.getElementById('detallesModal');
  const detallesContent = document.getElementById('detallesContent');
  
  let html = `
    <table class="detalles-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
  `;

  detalles.forEach(item => {
    html += `
      <tr>
        <td>${item.producto_nombre}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio_unitario.toFixed(2)}</td>
        <td>$${(item.cantidad * item.precio_unitario).toFixed(2)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  detallesContent.innerHTML = html;
  modal.style.display = 'block';
}

// Cerrar modal
document.querySelector('.close-modal')?.addEventListener('click', () => {
  document.getElementById('detallesModal').style.display = 'none';
});

// Filtrar ventas por fecha
document.getElementById('fechaInicio')?.addEventListener('change', filtrarVentas);
document.getElementById('fechaFin')?.addEventListener('change', filtrarVentas);

async function filtrarVentas() {
  const fechaInicio = document.getElementById('fechaInicio').value;
  const fechaFin = document.getElementById('fechaFin').value;

  if (!fechaInicio || !fechaFin) return;

  try {
    const response = await fetch(
      `${API_URL}/ventas/filtrar?inicio=${fechaInicio}&fin=${fechaFin}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) throw new Error('Error al filtrar ventas');

    const ventas = await response.json();
    displayVentas(ventas);
  } catch (error) {
    console.error('Error:', error);
    alert('Error al filtrar las ventas');
  }
}

// Exportar a Excel
document.getElementById('exportExcel')?.addEventListener('click', async () => {
  try {
    const response = await fetch(`${API_URL}/ventas/export`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Error al exportar');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error:', error);
    alert('Error al exportar las ventas');
  }
});

// Cargar ventas al iniciar
document.addEventListener('DOMContentLoaded', loadVentas);