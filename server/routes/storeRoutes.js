const express = require("express");
const router = express.Router();
const storeController = require("../controller/storeController");

// Rota para cadastrar uma nova loja (apenas admin)
router.post("/", storeController.createStore);

// Rota para listar todas as lojas
router.get("/", storeController.getAllStores);

// Rota para associar produto a loja (apenas admin)
router.post("/store-products", storeController.addStoreProduct);

// Rota para buscar lojas associadas a um produto
router.get("/store-products/:productId", storeController.getStoreProducts);

module.exports = router;