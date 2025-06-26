import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { createProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

const AddProductDetail = ({ categories }) => {
  const { data, dispatch } = useContext(ProductContext);

  const alert = (msg, type) => (
    <div className={`bg-${type}-200 py-2 px-4 w-full`}>{msg}</div>
  );

  const [fData, setFdata] = useState({
    pName: "",
    pDescription: "",
    pStatus: "Active",
    pImage: null,
    pCategory: "",
    pPrice: "",
    pOffer: 0,
    pQuantity: "",
    pSize: "",
    pColor: "",
    pBrand: "",
    success: false,
    error: false,
  });

  const fetchData = async () => {
    let responseData = await getAllProduct();
    setTimeout(() => {
      if (responseData && responseData.Products) {
        dispatch({
          type: "fetchProductsAndChangeState",
          payload: responseData.Products,
        });
      }
    }, 1000);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    e.target.reset();

    if (!fData.pImage) {
      setFdata({ ...fData, error: "Please upload at least 2 image" });
      setTimeout(() => {
        setFdata({ ...fData, error: false });
      }, 2000);
      return;
    }

    try {
      let formData = new FormData();
      formData.append("pName", fData.pName);
      formData.append("pDescription", fData.pDescription);
      formData.append("pPrice", fData.pPrice);
      formData.append("pQuantity", fData.pQuantity);
      formData.append("pCategory", fData.pCategory);
      formData.append("pOffer", fData.pOffer);
      formData.append("pStatus", fData.pStatus);
      formData.append("pSize", fData.pSize);
      formData.append("pColor", fData.pColor);
      formData.append("pBrand", fData.pBrand);

      if (fData.pImage && fData.pImage.length > 0) {
        for (let i = 0; i < fData.pImage.length; i++) {
          formData.append("pImage", fData.pImage[i]);
        }
      }

      let responseData = await createProduct(formData);
      if (responseData.success) {
        fetchData();
        setFdata({
          pName: "",
          pDescription: "",
          pImage: "",
          pStatus: "Active",
          pCategory: "",
          pPrice: "",
          pQuantity: "",
          pOffer: 0,
          pSize: "",
          pColor: "",
          pBrand: "",
          success: responseData.success,
          error: false,
        });
        setTimeout(() => {
          setFdata((prev) => ({
            ...prev,
            success: false,
            error: false,
          }));
        }, 2000);
      } else if (responseData.error) {
        setFdata({ ...fData, success: false, error: responseData.error });
        setTimeout(() => {
          setFdata((prev) => ({ ...prev, success: false, error: false }));
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        onClick={() => dispatch({ type: "addProductModal", payload: false })}
        className={`${
          data.addProductModal ? "" : "hidden"
        } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
      />
      {/* Modal Start */}
      <div
        className={`${
          data.addProductModal ? "" : "hidden"
        } fixed inset-0 z-30 flex items-center justify-center px-2 md:px-0 overflow-auto`}
      >
        <div className="relative bg-white w-full max-w-3xl max-h-screen md:max-h-[90vh] overflow-y-auto shadow-lg flex flex-col space-y-4 px-4 py-4 md:px-8 rounded-md">
          {/* Header */}
          <div className="flex items-center justify-between w-full sticky top-0 bg-white z-10 pt-4">
            <span className="text-left font-semibold text-2xl tracking-wider">
              Adicionar Produto
            </span>
            <span
              style={{ background: "#303031" }}
              onClick={() =>
                dispatch({ type: "addProductModal", payload: false })
              }
              className="cursor-pointer text-gray-100 py-2 px-2 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>

          {fData.error ? alert(fData.error, "red") : ""}
          {fData.success ? alert(fData.success, "green") : ""}

          <form className="w-full" onSubmit={submitForm}>
            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                <label htmlFor="name">Nome do Produto *</label>
                <input
                  value={fData.pName}
                  onChange={(e) =>
                    setFdata({ ...fData, pName: e.target.value, success: false, error: false })
                  }
                  className="px-4 py-2 border focus:outline-none"
                  type="text"
                />
              </div>
              <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                <label htmlFor="price">Preço do produto *</label>
                <input
                  value={fData.pPrice}
                  onChange={(e) =>
                    setFdata({ ...fData, pPrice: e.target.value, success: false, error: false })
                  }
                  type="number"
                  className="px-4 py-2 border focus:outline-none"
                  id="price"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="description">Descrição do produto *</label>
              <textarea
                value={fData.pDescription}
                onChange={(e) =>
                  setFdata({ ...fData, pDescription: e.target.value, success: false, error: false })
                }
                className="px-4 py-2 border focus:outline-none"
                rows={2}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="image">Imagem do produto *</label>
              <span className="text-gray-600 text-xs">Precisa de pelo menos 2 imagens</span>
              <input
                onChange={(e) =>
                  setFdata({ ...fData, pImage: [...e.target.files], success: false, error: false })
                }
                type="file"
                accept=".jpg, .jpeg, .png"
                className="px-4 py-2 border focus:outline-none"
                id="image"
                multiple
              />
            </div>

            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Status do produto *</label>
                <select
                  value={fData.pStatus}
                  onChange={(e) =>
                    setFdata({ ...fData, pStatus: e.target.value, success: false, error: false })
                  }
                  className="px-4 py-2 border focus:outline-none"
                >
                  <option value="Active">Ativar</option>
                  <option value="Disabled">Desativar</option>
                </select>
              </div>
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Categoria do produto *</label>
                <select
                  value={fData.pCategory}
                  onChange={(e) =>
                    setFdata({ ...fData, pCategory: e.target.value, success: false, error: false })
                  }
                  className="px-4 py-2 border focus:outline-none"
                >
                  <option disabled value="">
                    Selecionar Categoria
                  </option>
                  {categories.length > 0 &&
                    categories.map((elem) => (
                      <option value={elem._id} key={elem._id}>
                        {elem.cName}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Tamanho</label>
                <input
                  value={fData.pSize}
                  onChange={(e) =>
                    setFdata({ ...fData, pSize: e.target.value, success: false, error: false })
                  }
                  type="text"
                  className="px-4 py-2 border focus:outline-none"
                  placeholder="Ex: 42, G, M, etc"
                />
              </div>
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Cor</label>
                <input
                  value={fData.pColor}
                  onChange={(e) =>
                    setFdata({ ...fData, pColor: e.target.value, success: false, error: false })
                  }
                  type="text"
                  className="px-4 py-2 border focus:outline-none"
                  placeholder="Ex: Preto, Azul, etc"
                />
              </div>
            </div>

            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Marca</label>
                <input
                  value={fData.pBrand}
                  onChange={(e) =>
                    setFdata({ ...fData, pBrand: e.target.value, success: false, error: false })
                  }
                  type="text"
                  className="px-4 py-2 border focus:outline-none"
                  placeholder="Ex: Nike, Adidas, etc"
                />
              </div>
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Quantidade *</label>
                <input
                  value={fData.pQuantity}
                  onChange={(e) =>
                    setFdata({ ...fData, pQuantity: e.target.value, success: false, error: false })
                  }
                  type="number"
                  className="px-4 py-2 border focus:outline-none"
                />
              </div>
            </div>

            <div className="py-4">
              <label>Promoção do Produto (%) *</label>
              <input
                value={fData.pOffer}
                onChange={(e) =>
                  setFdata({ ...fData, pOffer: e.target.value, success: false, error: false })
                }
                type="number"
                className="px-4 py-2 border focus:outline-none w-full"
              />
            </div>

            <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
              <button
                style={{ background: "#303031" }}
                type="submit"
                className="rounded-full bg-gray-800 text-gray-100 text-lg font-medium py-2"
              >
                Criar produto
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

const AddProductModal = () => {
  const [allCat, setAllCat] = useState([]);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      setAllCat(responseData.Categories);
    }
  };

  return (
    <Fragment>
      <AddProductDetail categories={allCat} />
    </Fragment>
  );
};

export default AddProductModal;
