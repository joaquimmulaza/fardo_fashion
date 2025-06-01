import {
  DashboardData,
  postUploadImage,
  getSliderImages,
  postDeleteImage,
  getStores,
  postAddStore,
  getStoreProducts,
  postAddStoreProduct,
  deleteStore as deleteStoreApi,
  updateStore as updateStoreApi,
  deleteStoreProduct as deleteStoreProductApi,
  updateStoreProduct as updateStoreProductApi,
} from "./FetchApi";
import { getAllOrder } from "../orders/FetchApi.js";

export const GetAllData = async (dispatch) => {
  let responseData = await DashboardData();
  if (responseData) {
    dispatch({ type: "totalData", payload: responseData });
  }
};

export const todayAllOrders = async (dispatch) => {
  let responseData = await getAllOrder();
  if (responseData) {
    dispatch({ type: "totalOrders", payload: responseData });
  }
};

export const sliderImages = async (dispatch) => {
  try {
    let responseData = await getSliderImages();
    if (responseData && responseData.Images) {
      dispatch({ type: "sliderImages", payload: responseData.Images });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteImage = async (id, dispatch) => {
  dispatch({ type: "imageUpload", payload: true });
  try {
    let responseData = await postDeleteImage(id);
    if (responseData && responseData.success) {
      setTimeout(function () {
        sliderImages(dispatch);
        dispatch({ type: "imageUpload", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const uploadImage = async (image, dispatch) => {
  dispatch({ type: "imageUpload", payload: true });
  let formData = new FormData();
  formData.append("image", image);
  console.log(formData.get("image"));
  try {
    let responseData = await postUploadImage(formData);
    if (responseData && responseData.success) {
      setTimeout(function () {
        dispatch({ type: "imageUpload", payload: false });
        sliderImages(dispatch);
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

// LOJAS
export const fetchStores = async (dispatch) => {
  try {
    let responseData = await getStores();
    if (responseData && responseData.stores) {
      dispatch({ type: "storesList", payload: responseData.stores });
    }
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

export const deleteStore = async (storeId, dispatch) => {
  try {
    let responseData = await deleteStoreApi(storeId);
    if (responseData && responseData.success) {
      dispatch({ type: "storeDeleteSuccess", payload: responseData.success });
      // Refresh stores list
      await fetchStores(dispatch);
    } else if (responseData && responseData.error) {
      dispatch({ type: "storeDeleteError", payload: responseData.error });
    }
    return responseData;
  } catch (error) {
    console.error("Error deleting store:", error);
    throw error;
  }
};

export const addStore = async (name, dispatch) => {
  try {
    let responseData = await postAddStore(name);
    if (responseData && responseData.success) {
      dispatch({ type: "storeAddSuccess", payload: responseData.success });
      // Refresh stores list
      await fetchStores(dispatch);
    } else if (responseData && responseData.error) {
      dispatch({ type: "storeAddError", payload: responseData.error });
    }
    return responseData;
  } catch (error) {
    console.error("Error adding store:", error);
    throw error;
  }
};

export const updateStore = async (storeId, name, dispatch) => {
  try {
    let responseData = await updateStoreApi(storeId, name);
    if (responseData && responseData.success) {
      dispatch({ type: "storeUpdateSuccess", payload: responseData.success });
      // Refresh stores list
      await fetchStores(dispatch);
    } else if (responseData && responseData.error) {
      dispatch({ type: "storeUpdateError", payload: responseData.error });
    }
    return responseData;
  } catch (error) {
    console.error("Error updating store:", error);
    throw error;
  }
};

// ASSOCIAÇÃO LOJA-PRODUTO
export const fetchStoreProducts = async (productId, dispatch) => {
  try {
    let responseData = await getStoreProducts(productId);
    if (responseData && responseData.stores) {
      dispatch({ type: "storeProductsList", payload: responseData.stores });
    }
    return responseData;
  } catch (error) {
    console.error("Error fetching store products:", error);
    throw error;
  }
};

export const addStoreProduct = async (data, dispatch) => {
  try {
    console.log("Sending data to API:", data);
    let responseData = await postAddStoreProduct(data);
    console.log("API Response:", responseData);
    
    if (responseData && responseData.success) {
      dispatch({ type: "storeProductAddSuccess", payload: responseData.success });
      // Refresh store products
      await fetchStoreProducts(data.productId, dispatch);
    } else if (responseData && responseData.error) {
      dispatch({ type: "storeProductAddError", payload: responseData.error });
    }
    return responseData;
  } catch (error) {
    console.error("Error adding store product:", error);
    throw error;
  }
};

export const deleteStoreProduct = async (storeId, productId, dispatch) => {
  try {
    let responseData = await deleteStoreProductApi(storeId, productId);
    if (responseData && responseData.success) {
      dispatch({ type: "storeProductDeleteSuccess", payload: responseData.success });
      // Refresh store products
      await fetchStoreProducts(productId, dispatch);
    } else if (responseData && responseData.error) {
      dispatch({ type: "storeProductDeleteError", payload: responseData.error });
    }
    return responseData;
  } catch (error) {
    console.error("Error deleting store product:", error);
    throw error;
  }
};

export const updateStoreProduct = async (storeId, productId, data, dispatch) => {
  try {
    let responseData = await updateStoreProductApi(storeId, productId, data);
    if (responseData && responseData.success) {
      dispatch({ type: "storeProductUpdateSuccess", payload: responseData.success });
      // Refresh store products
      await fetchStoreProducts(productId, dispatch);
    } else if (responseData && responseData.error) {
      dispatch({ type: "storeProductUpdateError", payload: responseData.error });
    }
    return responseData;
  } catch (error) {
    console.error("Error updating store product:", error);
    throw error;
  }
};