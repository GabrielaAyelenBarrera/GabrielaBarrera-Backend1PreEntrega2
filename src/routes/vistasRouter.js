import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Página principal
router.get("/", async (req, res) => {
  try {
    // Obtén todos los productos
    const products = productManager.getAllProducts();

    // Renderiza la vista "home.handlebars" con los productos
    res.render("products", { products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos");
  }
});

// Página de producto aleatorio
router.get("/realTimeProducts", (req, res) => {
  let numero = Math.floor(
    Math.random() * productManager.getAllProducts().length
  );
  let producto = productManager.getProductById(numero + 1);
  res.status(200).render("realTimeProducts", {
    producto,
    estilo: "stylesProduct",
    titulo: "Formulario Page",
  });
});

export default router;
