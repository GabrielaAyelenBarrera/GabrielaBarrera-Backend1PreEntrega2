import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
  constructor() {
    this.products = [];
    this.filePath = path.join(__dirname, "../data/products.json");
    this.loadProductsFromFile();
  }

  // Obtener todos los productos
  getAllProducts() {
    return this.products;
  }

  // Obtener producto por ID
  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  // Agregar un nuevo producto
  addProduct(product) {
    console.log("Intentando agregar producto:", product);

    // Asegúrate de que el ID y el precio sean números
    const id = Number(product.id);
    const price = Number(product.price);

    if (isNaN(id) || isNaN(price)) {
      throw new Error("El ID y el precio deben ser números válidos");
    }

    if (!product.name) {
      throw new Error("El producto debe tener un nombre");
    }

    // Verifica si el producto ya existe
    const existingProduct = this.products.find((p) => p.id === id);
    if (existingProduct) {
      throw new Error("El producto con este ID ya existe");
    }

    // Agrega el producto al array
    this.products.push({ ...product, id, price });
    console.log("Producto agregado con éxito:", product);

    this.saveProductsToFile();
  }

  // Actualizar un producto por ID
  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return false; // Producto no encontrado
    }
    this.products[index] = { ...this.products[index], ...updatedProduct };
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    return true; // Producto actualizado exitosamente
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }
    this.products.splice(productIndex, 1);
    this.saveProductsToFile();
  }

  // Guardar los productos en el archivo
  saveProductsToFile() {
    const filePath = path.join(__dirname, "../data/products.json");
    fs.writeFileSync(filePath, JSON.stringify(this.products, null, 2));
  }

  // Cargar los productos desde el archivo
  loadProductsFromFile() {
    try {
      const filePath = path.join(__dirname, "../data/products.json");
      const data = fs.readFileSync(filePath, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar los productos desde el archivo:", error);
      this.products = [];
    }
  }
}

export default ProductManager;
