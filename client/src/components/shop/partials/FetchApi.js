import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const cartListProduct = async () => {
  let carts = JSON.parse(localStorage.getItem("cart"));
  let productArray = [];
  let idMapping = {}; // Mapeia IDs originais para IDs compostos
  
  if (carts) {
    for (const cart of carts) {
      if (cart.id.includes('_store_')) {
        const originalProductId = cart.id.split('_store_')[0];
        productArray.push(originalProductId);
        idMapping[originalProductId] = cart.id; // Mapeia ID original para ID composto
      } else {
        productArray.push(cart.id);
        idMapping[cart.id] = cart.id; // Mapeia ID original para ID original
      }
    }
  }
  
  if (productArray.length === 0) {
    return { Products: null };
  }
  
  try {
    let res = await axios.post(`${apiURL}/api/product/cart-product`, {
      productArray,
    });
    
    // Mapeia os produtos retornados com os IDs corretos do localStorage
    if (res.data && res.data.Products) {
      const mappedProducts = res.data.Products.map(product => ({
        ...product,
        _id: idMapping[product._id] || product._id // Usa o ID mapeado ou o original
      }));
      
      return { ...res.data, Products: mappedProducts };
    }
    
    return res.data;
  } catch (error) {
    console.log(error);
    return { Products: null };
  }
};
