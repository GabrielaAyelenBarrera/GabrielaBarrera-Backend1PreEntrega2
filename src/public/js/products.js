document.addEventListener('DOMContentLoaded', function () {
  Swal.fire({
    title: '¡Bienvenido a Bella Aura!',
    text: 'Explora nuestros productos y aprovecha las ofertas exclusivas.',
    icon: 'info',
    width: 600,
    padding: '3em',
    color: '#716add'
  });

  // Conectar al servidor Socket.IO
  const socket = io("http://localhost:8080");

  // Manejar el evento de saludo
  socket.on("saludo", (mensaje) => {
    console.log("Mensaje de saludo del servidor:", mensaje);
  });

  // Manejar eventos de conexión y desconexión
  socket.on("connect", () => {
    console.log("Conectado al servidor de Socket.IO con ID:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Desconectado del servidor de Socket.IO");
  });

  // Manejar la recepción de productos actualizados
  socket.on("productosActualizados", (productos) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpiar la lista existente
    productos.forEach(producto => {
      const li = document.createElement('li');
      li.textContent = `${producto.name} - $${producto.price}`;
      productList.appendChild(li);
    });
  });

  // Manejar el envío del formulario para agregar un producto
  document.getElementById('add-product-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      id: formData.get('id'),
      name: formData.get('name'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      price: formData.get('price')
    };
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => {
        Swal.fire('Producto agregado', data.message, 'success');
      }).catch(error => {
        Swal.fire('Error', 'No se pudo agregar el producto', 'error');
      });
  });

  // Manejar el envío del formulario para eliminar un producto
  document.getElementById('delete-product-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = formData.get('id');
    fetch(`/api/products/delete-product?_method=DELETE`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(response => response.json())
      .then(data => {
        Swal.fire('Producto eliminado', data.message, 'success');
      }).catch(error => {
        Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
      });
  });
});
