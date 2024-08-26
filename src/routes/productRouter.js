import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = productManager.getAllProducts();
    console.log("Productos obtenidos:", products); // Mostrar productos en consola
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al recuperar los productos:", error);
    res.status(500).json({ error: "Error al recuperar los productos" });
  }
});

// Obtener producto por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = productManager.getProductById(parseInt(id, 10));
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al recuperar el producto:", error);
    res.status(500).json({ error: "Error al recuperar el producto" });
  }
});

// Agregar un producto
router.post("/", (req, res) => {
  const newProduct = req.body;
  console.log("Datos recibidos del formulario:", newProduct);
  const io = req.socket; // Usa el socket del request

  try {
    productManager.addProduct(newProduct);
    io.emit("nuevoProducto", newProduct); // Emitir evento a todos los clientes conectados
    console.log("Producto agregado con éxito:", newProduct); // Mostrar en consola
    res.status(201).json({ message: "Producto agregado con éxito" });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto por ID
router.put("/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedProduct = req.body;
  const io = req.socket; // Usa el socket del request

  try {
    const result = productManager.updateProduct(productId, updatedProduct);
    if (result) {
      io.emit("productoActualizado", { id: productId, updatedProduct }); // Emitir evento a todos los clientes conectados
      console.log(`Producto con ID ${productId} actualizado con éxito.`); // Mostrar en consola
      res.status(200).json({ message: "Producto actualizado con éxito" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
});

// Eliminar un producto por ID
router.delete("/:id?", (req, res) => {
  // Primero intentamos obtener el ID desde el cuerpo de la solicitud
  let id = req.body.id ? parseInt(req.body.id, 10) : null;

  // Si no se encontró en el cuerpo, lo intentamos obtener de los parámetros de la URL
  if (!id) {
    id = req.params.id ? parseInt(req.params.id, 10) : null;
  }

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID inválido o no proporcionado" });
  }
  console.log(`ID recibido para eliminar: ${id}`);
  const io = req.socket; // Usa el socket del request

  try {
    productManager.deleteProduct(id);
    io.emit("productoEliminado", id); // Emitir evento a todos los clientes conectados
    console.log(`Producto con ID ${id} eliminado con éxito.`); // Mostrar en consola
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    res.status(404).json({ error: error.message });
  }
});

export default router;
