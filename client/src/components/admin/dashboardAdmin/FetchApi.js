import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const DashboardData = async () => {
  try {
    let res = await axios.post(`${apiURL}/api/customize/dashboard-data`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSliderImages = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/customize/get-slide-image`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const postUploadImage = async (formData) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/customize/upload-slide-image`,
      formData
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const postDeleteImage = async (id) => {
  try {
    let res = await axios.post(`${apiURL}/api/customize/delete-slide-image`, {
      id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// LOJAS
export const getStores = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/stores`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postAddStore = async (name) => {
  try {
    let res = await axios.post(`${apiURL}/api/stores`, { name });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ASSOCIAÇÃO LOJA-PRODUTO
export const getStoreProducts = async (productId) => {
  try {
    let res = await axios.get(`${apiURL}/api/stores/store-products/${productId}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postAddStoreProduct = async (data) => {
  // Validate data before making the request
  if (!data.productId || !data.storeId) {
    console.error("Missing required fields:", { productId: data.productId, storeId: data.storeId });
    throw new Error("Product ID and Store ID are required");
  }

  // Validate ObjectId format
  if (!data.productId.match(/^[0-9a-fA-F]{24}$/) || !data.storeId.match(/^[0-9a-fA-F]{24}$/)) {
    console.error("Invalid ObjectId format:", { productId: data.productId, storeId: data.storeId });
    throw new Error("Invalid ID format");
  }

  if (typeof data.price !== 'number' || typeof data.stock !== 'number') {
    console.error("Invalid numeric values:", { price: data.price, stock: data.stock });
    throw new Error("Price and stock must be numbers");
  }

  try {
    // Log the exact data being sent
    console.log("Making API request with data:", JSON.stringify(data, null, 2));
    
    // Ensure the data is properly formatted
    const requestData = {
      productId: data.productId.trim(),
      storeId: data.storeId.trim(),
      price: Number(data.price),
      stock: Number(data.stock)
    };

    let res = await axios.post(`${apiURL}/api/stores/store-products`, requestData);
    console.log("API response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error in postAddStoreProduct:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      
      // Enhance error message based on status code
      if (error.response.status === 409) {
        throw new Error("Este produto já está associado a esta loja");
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.error || "Dados inválidos");
      }
    }
    throw error;
  }
};

export const deleteStore = async (storeId) => {
  try {
    const response = await axios.delete(`${apiURL}/api/stores/${storeId}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteStore API call:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

export const updateStore = async (storeId, name) => {
  try {
    const response = await axios.put(`${apiURL}/api/stores/${storeId}`, { name });
    return response.data;
  } catch (error) {
    console.error("Error in updateStore API call:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

export const deleteStoreProduct = async (storeId, productId) => {
  try {
    const response = await axios.delete(`${apiURL}/api/stores/store-products/${storeId}/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteStoreProduct API call:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

export const updateStoreProduct = async (storeId, productId, data) => {
  try {
    const response = await axios.put(`${apiURL}/api/stores/store-products/${storeId}/${productId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error in updateStoreProduct API call:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

export const approvePartner = async (storeId) => {
  try {
    const response = await axios.put(`${apiURL}/api/stores/${storeId}/approve`);
    return response.data;
  } catch (error) {
    console.error("Error in approvePartner API call:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

export const denyPartner = async (storeId) => {
  try {
    const response = await axios.put(`${apiURL}/api/stores/${storeId}/deny`);
    return response.data;
  } catch (error) {
    console.error("Error in denyPartner API call:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};