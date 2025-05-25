export const dashboardState = {
  totalData: [],
  totalOrders: [],
  uploadSliderBtn: true,
  imageUpload: false,
  sliderImages: [],
  storesList: [],
  storeAddSuccess: null,
  storeAddError: null,
  storeProductsList: [],
  storeProductAddSuccess: null,
  storeProductAddError: null,
  productsList: [],
};

export const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "totalData":
      return {
        ...state,
        totalData: action.payload,
      };
    case "totalOrders":
      return {
        ...state,
        totalOrders: action.payload,
      };
    case "uploadSliderBtn":
      return {
        ...state,
        uploadSliderBtn: action.payload,
      };
    case "imageUpload":
      return {
        ...state,
        imageUpload: action.payload,
      };
    case "sliderImages":
      return {
        ...state,
        sliderImages: action.payload,
      };
    case "storesList":
      return {
        ...state,
        storesList: action.payload,
      };
    case "storeAddSuccess":
      return {
        ...state,
        storeAddSuccess: action.payload,
        storeAddError: null,
      };
    case "storeAddError":
      return {
        ...state,
        storeAddError: action.payload,
        storeAddSuccess: null,
      };
    case "storeProductsList":
      return {
        ...state,
        storeProductsList: action.payload,
      };
    case "storeProductAddSuccess":
      return {
        ...state,
        storeProductAddSuccess: action.payload,
        storeProductAddError: null,
      };
    case "storeProductAddError":
      return {
        ...state,
        storeProductAddError: action.payload,
        storeProductAddSuccess: null,
      };
    case "productsList":
      return {
        ...state,
        productsList: action.payload,
      };
    default:
      return state;
  }
};
