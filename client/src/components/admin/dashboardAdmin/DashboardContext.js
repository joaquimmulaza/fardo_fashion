export const dashboardState = {
  totalData: [],
  totalOrders: [],
  uploadSliderBtn: true,
  imageUpload: false,
  sliderImages: [],
  storesList: [],
  storeAddSuccess: null,
  storeAddError: null,
  storeDeleteSuccess: null,
  storeDeleteError: null,
  storeUpdateSuccess: null,
  storeUpdateError: null,
  storeProductsList: [],
  storeProductAddSuccess: null,
  storeProductAddError: null,
  storeProductDeleteSuccess: null,
  storeProductDeleteError: null,
  storeProductUpdateSuccess: null,
  storeProductUpdateError: null,
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
    case "storeDeleteSuccess":
      return {
        ...state,
        storeDeleteSuccess: action.payload,
        storeDeleteError: null,
      };
    case "storeDeleteError":
      return {
        ...state,
        storeDeleteError: action.payload,
        storeDeleteSuccess: null,
      };
    case "storeUpdateSuccess":
      return {
        ...state,
        storeUpdateSuccess: action.payload,
        storeUpdateError: null,
      };
    case "storeUpdateError":
      return {
        ...state,
        storeUpdateError: action.payload,
        storeUpdateSuccess: null,
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
    case "storeProductDeleteSuccess":
      return {
        ...state,
        storeProductDeleteSuccess: action.payload,
        storeProductDeleteError: null,
      };
    case "storeProductDeleteError":
      return {
        ...state,
        storeProductDeleteError: action.payload,
        storeProductDeleteSuccess: null,
      };
    case "storeProductUpdateSuccess":
      return {
        ...state,
        storeProductUpdateSuccess: action.payload,
        storeProductUpdateError: null,
      };
    case "storeProductUpdateError":
      return {
        ...state,
        storeProductUpdateError: action.payload,
        storeProductUpdateSuccess: null,
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
