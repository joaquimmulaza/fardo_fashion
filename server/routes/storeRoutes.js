const express = require("express");
const router = express.Router();
const storeController = require("../controller/storeController");

// Rota para cadastrar uma nova loja (apenas admin)
router.post("/", storeController.createStore);

// Rota para listar todas as lojas
router.get("/", storeController.getAllStores);

// Rota para deletar uma loja
router.delete("/:storeId", storeController.deleteStore);

// Rota para atualizar uma loja
router.put("/:storeId", storeController.updateStore);

// Rota para associar produto a loja (apenas admin)
router.post("/store-products", storeController.addStoreProduct);

// Rota para buscar lojas associadas a um produto
router.get("/store-products/:productId", storeController.getStoreProducts);

// Rota para deletar associação produto-loja
router.delete("/store-products/:storeId/:productId", storeController.deleteStoreProduct);

// Rota para atualizar associação produto-loja
router.put("/store-products/:storeId/:productId", storeController.updateStoreProduct);

// Rota para cadastro de parceiro
router.post("/partner-signup", storeController.partnerSignup);

// Rota para admin aprovar parceiro
router.put("/:storeId/approve", storeController.approvePartner);

// Rota para admin negar parceiro
router.put("/:storeId/deny", storeController.denyPartner);

module.exports = router;