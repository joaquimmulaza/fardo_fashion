const storeModel = require("../models/storeModel");
const storeProductModel = require("../models/storeProductModel");
const productModel = require("../models/products");
const mongoose = require("mongoose");

class StoreController {
  async createStore(req, res) {
    const { name } = req.body;
    if (!name) {
      return res.json({ error: "O nome da loja é obrigatório." });
    }
    try {
      // Verifica se já existe uma loja com esse nome
      const existingStore = await storeModel.findOne({ name });
      if (existingStore) {
        return res.json({ error: "Já existe uma loja com esse nome." });
      }
      const newStore = new storeModel({ name });
      await newStore.save();
      return res.json({ success: "Loja cadastrada com sucesso." });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao cadastrar loja." });
    }
  }

  async addStoreProduct(req, res) {
    const { productId, storeId, price, stock } = req.body;

    // Robust validation
    if (!productId || !storeId) {
      return res.status(400).json({ 
        error: "Product ID and Store ID are required.",
        details: {
          productId: !productId ? "Product ID is missing" : null,
          storeId: !storeId ? "Store ID is missing" : null
        }
      });
    }

    if (price === undefined || stock === undefined) {
      return res.status(400).json({ 
        error: "Price and stock are required.",
        details: {
          price: price === undefined ? "Price is missing" : null,
          stock: stock === undefined ? "Stock is missing" : null
        }
      });
    }

    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(storeId)) {
        return res.status(400).json({ 
          error: "Invalid ID format",
          details: {
            productId: !mongoose.Types.ObjectId.isValid(productId) ? "Invalid product ID format" : null,
            storeId: !mongoose.Types.ObjectId.isValid(storeId) ? "Invalid store ID format" : null
          }
        });
      }

      // Verifica se o produto existe
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      // Verifica se a loja existe
      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.status(404).json({ error: "Store not found." });
      }

      // Verifica se já existe associação
      const exists = await storeProductModel.findOne({ product: productId, store: storeId });
      if (exists) {
        return res.status(409).json({ error: "This product is already associated with this store." });
      }

      // Cria associação
      const newStoreProduct = new storeProductModel({
        product: productId,
        store: storeId,
        price,
        stock
      });
      await newStoreProduct.save();
      return res.json({ success: "Product successfully associated with store." });
    } catch (err) {
      console.error("Error in addStoreProduct:", err);
      
      if (err.code === 11000) {
        return res.status(409).json({ error: "This product is already associated with this store." });
      }
      
      if (err.name === 'ValidationError') {
        return res.status(400).json({ 
          error: "Validation error",
          details: Object.values(err.errors).map(e => e.message)
        });
      }

      return res.status(500).json({ error: "Error associating product with store." });
    }
  }

  async getStoreProducts(req, res) {
    const { productId } = req.params;
    if (!productId) {
      return res.json({ error: "O ID do produto é obrigatório." });
    }
    try {
      const storeProducts = await storeProductModel.find({ product: productId })
        .populate("store", "name")
        .select("store price stock");
      if (!storeProducts || storeProducts.length === 0) {
        return res.json({ stores: [] });
      }
      // Formata a resposta para conter apenas os campos necessários
      const result = storeProducts.map((sp) => ({
        name: sp.store.name,
        price: sp.price,
        stock: sp.stock,
      }));
      return res.json({ stores: result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao buscar lojas do produto." });
    }
  }

  async getAllStores(req, res) {
    try {
      const stores = await storeModel.find({});
      return res.json({ stores });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao buscar lojas." });
    }
  }
}

const storeController = new StoreController();
module.exports = storeController; 