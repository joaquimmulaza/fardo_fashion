const storeModel = require("../models/storeModel");
const storeProductModel = require("../models/storeProductModel");
const productModel = require("../models/products");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

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
      return res.json({ success: "Produto associado com sucesso a loja." });
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
        storeId: sp.store._id,
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

  async deleteStore(req, res) {
    const { storeId } = req.params;
    
    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required." });
    }

    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(storeId)) {
        return res.status(400).json({ error: "Invalid store ID format." });
      }

      // Check if store exists
      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.status(404).json({ error: "Store not found." });
      }

      // Delete all store-product associations first
      await storeProductModel.deleteMany({ store: storeId });

      // Delete the store
      await storeModel.findByIdAndDelete(storeId);

      return res.json({ success: "Loja excluída com sucesso." });
    } catch (err) {
      console.error("Error in deleteStore:", err);
      return res.status(500).json({ error: "Erro ao excluir loja." });
    }
  }

  async updateStore(req, res) {
    const { storeId } = req.params;
    const { name } = req.body;

    if (!storeId) {
      return res.status(400).json({ error: "ID da loja é obrigatório." });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Nome da loja é obrigatório." });
    }

    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(storeId)) {
        return res.status(400).json({ error: "Formato de ID inválido." });
      }

      // Check if store exists
      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.status(404).json({ error: "Loja não encontrada." });
      }

      // Check if new name already exists for another store
      const existingStore = await storeModel.findOne({ 
        name: name.trim(),
        _id: { $ne: storeId } // Exclude current store from check
      });
      
      if (existingStore) {
        return res.status(409).json({ error: "Já existe uma loja com este nome." });
      }

      // Update store
      store.name = name.trim();
      await store.save();

      return res.json({ success: "Loja atualizada com sucesso." });
    } catch (err) {
      console.error("Error in updateStore:", err);
      return res.status(500).json({ error: "Erro ao atualizar loja." });
    }
  }

  async deleteStoreProduct(req, res) {
    const { storeId, productId } = req.params;

    if (!storeId || !productId) {
      return res.status(400).json({ error: "ID da loja e ID do produto são obrigatórios." });
    }

    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(storeId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Formato de ID inválido." });
      }

      // Check if association exists
      const association = await storeProductModel.findOne({ 
        store: storeId,
        product: productId
      });

      if (!association) {
        return res.status(404).json({ error: "Associação não encontrada." });
      }

      // Delete the association
      await storeProductModel.deleteOne({ 
        store: storeId,
        product: productId
      });

      return res.json({ success: "Produto desassociado da loja com sucesso." });
    } catch (err) {
      console.error("Error in deleteStoreProduct:", err);
      return res.status(500).json({ error: "Erro ao desassociar produto da loja." });
    }
  }

  async updateStoreProduct(req, res) {
    const { storeId, productId } = req.params;
    const { price, stock } = req.body;

    if (!storeId || !productId) {
      return res.status(400).json({ error: "ID da loja e ID do produto são obrigatórios." });
    }

    if (price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Preço e estoque são obrigatórios." });
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ error: "Preço inválido." });
    }

    if (isNaN(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ error: "Estoque inválido." });
    }

    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(storeId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Formato de ID inválido." });
      }

      // Check if association exists
      const association = await storeProductModel.findOne({ 
        store: storeId,
        product: productId
      });

      if (!association) {
        return res.status(404).json({ error: "Associação não encontrada." });
      }

      // Update the association
      association.price = Number(price);
      association.stock = Number(stock);
      await association.save();

      return res.json({ success: "Associação atualizada com sucesso." });
    } catch (err) {
      console.error("Error in updateStoreProduct:", err);
      return res.status(500).json({ error: "Erro ao atualizar associação." });
    }
  }

  async partnerSignup(req, res) {
    const { name, storeName, email, password, cPassword } = req.body;
    if (!name || !storeName || !email || !password || !cPassword) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    if (password !== cPassword) {
      return res.status(400).json({ error: "As senhas não coincidem." });
    }
    try {
      const existingStore = await storeModel.findOne({ name: storeName });
      if (existingStore) {
        return res.status(409).json({ error: "Já existe uma loja com esse nome." });
      }
      const existingEmail = await storeModel.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ error: "Já existe um parceiro com esse email." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newStore = new storeModel({
        name: storeName,
        ownerName: name,
        email,
        password: hashedPassword,
        approved: false,
        pending: true,
        userType: "partner",
      });
      await newStore.save();
      return res.json({ success: "Solicitação enviada! Aguarde aprovação do admin." });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao cadastrar parceiro." });
    }
  }

  async approvePartner(req, res) {
    const { storeId } = req.params;
    try {
      const store = await storeModel.findById(storeId);
      if (!store) return res.status(404).json({ error: "Loja/parceiro não encontrado." });
      store.approved = true;
      store.pending = false;
      await store.save();
      // Enviar email de confirmação
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // configure no .env
          pass: process.env.EMAIL_PASS, // configure no .env
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: store.email,
        subject: 'Sua solicitação de parceria foi aprovada!',
        text: `Olá ${store.ownerName},\n\nSua solicitação para ser parceiro da Fardo Fashion foi aprovada!\n\nAgora você pode acessar sua conta normalmente.\n\nAtenciosamente,\nEquipe Fardo Fashion`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar email:', error);
        } else {
          console.log('Email enviado:', info.response);
        }
      });
      return res.json({ success: "Parceiro aprovado com sucesso." });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao aprovar parceiro." });
    }
  }

  async denyPartner(req, res) {
    const { storeId } = req.params;
    try {
      const store = await storeModel.findById(storeId);
      if (!store) return res.status(404).json({ error: "Loja/parceiro não encontrado." });
      // Enviar email de recusa antes de deletar
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: store.email,
        subject: 'Solicitação de parceria recusada',
        text: `Olá ${store.ownerName},\n\nInfelizmente sua solicitação para ser parceiro da Fardo Fashion foi recusada.\n\nSe desejar, entre em contato para mais informações.\n\nAtenciosamente,\nEquipe Fardo Fashion`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar email de recusa:', error);
        } else {
          console.log('Email de recusa enviado:', info.response);
        }
      });
      await storeModel.findByIdAndDelete(storeId);
      return res.json({ success: "Solicitação de parceiro negada e removida." });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao negar parceiro." });
    }
  }
}

const storeController = new StoreController();
module.exports = storeController; 