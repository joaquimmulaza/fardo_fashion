const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: true,
    },
    userType: {
      type: String,
      default: "partner",
    },
    password: {
      type: String,
      required: function() { return this.userType === 'partner'; },
    },
  },
  { timestamps: true }
);

const storeModel = mongoose.model("stores", storeSchema);
module.exports = storeModel; 