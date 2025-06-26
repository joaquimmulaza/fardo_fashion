import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllProduct = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/product/all-product`);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { Products: [] };
  }
};

export const createPorductImage = async ({ pImage }) => {
  /* Most important part for uploading multiple image  */
  let formData = new FormData();
  for (const file of pImage) {
    formData.append("pImage", file);
  }
  /* Most important part for uploading multiple image  */
};

export const createProduct = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/add-product`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editProduct = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/edit-product`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (pId) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/delete-product`, { pId });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const productByCategory = async (catId) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/product-by-category`, {
      catId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const productByPrice = async (price) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/product-by-price`, {
      price,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
