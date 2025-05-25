const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const storeProductSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: "products",
      required: true,
    },
    store: {
      type: ObjectId,
      ref: "stores",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Criando um índice composto para garantir que a combinação de store e product seja única
storeProductSchema.index({ store: 1, product: 1 }, { unique: true });

const storeProductModel = mongoose.model("storeProducts", storeProductSchema);
module.exports = storeProductModel; 