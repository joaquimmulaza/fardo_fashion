import React, { Fragment, useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ProductDetailsContext } from "./index";
import { LayoutContext } from "../layout";
import Submenu from "./Submenu";
import ProductDetailsSectionTwo from "./ProductDetailsSectionTwo";
import { getSingleProduct, getStoreProducts } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";
import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { updateQuantity, slideImage, addToCart, cartList } from "./Mixins";
import { totalCost } from "../partials/Mixins";
import PriceComparison from './PriceComparison';

const apiURL = process.env.REACT_APP_API_URL;

const ProductDetailsSection = () => {
  let { id } = useParams();

  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);

  const sProduct = layoutData.singleProductDetail;
  const [pImages, setPimages] = useState(null);
  const [count, setCount] = useState(0);
  const [quantitiy, setQuantitiy] = useState(1);
  const [alertq, setAlertq] = useState(false);
  const [wList, setWlist] = useState(JSON.parse(localStorage.getItem("wishList")));

  const [storeProducts, setStoreProducts] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  // Função para obter o preço atual baseado na seleção
  const getCurrentPrice = () => {
    if (selectedStore) {
      return selectedStore.price;
    }
    return sProduct ? sProduct.pPrice : 0;
  };

  // Função para obter o estoque atual baseado na seleção
  const getCurrentStock = () => {
    if (selectedStore) {
      return selectedStore.stock;
    }
    return sProduct ? sProduct.pQuantity : 0;
  };

  // Função para obter o ID do produto para o carrinho
  const getProductIdForCart = () => {
    if (selectedStore) {
      // Se uma loja está selecionada, usamos um ID composto
      return `${sProduct._id}_store_${selectedStore._id}`;
    }
    return sProduct._id;
  };

  // Função para lidar com a seleção de loja
  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setQuantitiy(1); // Reset quantidade quando mudar de loja
    setAlertq(false);
  };

  const fetchData = useCallback(async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      if (responseData.Product) {
        layoutDispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
        setPimages(responseData.Product.pImages);
        layoutDispatch({ type: "inCart", payload: cartList() });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: "loading", payload: false });
    }

    try {
      let cartData = await cartListProduct();
      if (cartData && cartData.Products) {
        layoutDispatch({ type: "cartProduct", payload: cartData.Products });
      }
    } catch (error) {
      console.log(error);
    }

    setLoadingStores(true);
    try {
      const storeData = await getStoreProducts(id);
      if (storeData && storeData.stores) {
        setStoreProducts(storeData.stores);
      }
    } catch(error) {
      console.log(error);
    } finally {
      setLoadingStores(false);
    }
  }, [id, dispatch, layoutDispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (data.loading) {
    return (
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500"></div>
      </div>
    );
  }

  if (!sProduct) {
    return <div className="m-12 text-center">Produto não encontrado.</div>;
  }

  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory._id,
          product: sProduct.pName,
          category: sProduct.pCategory.cName,
        }}
      />
      <section className="m-4 md:mx-12 md:my-6">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6">
          {/* Coluna de Imagens Pequenas */}
          <div className="hidden md:block md:col-span-2 md:flex md:flex-col md:space-y-4">
            {pImages && pImages.length > 0 && pImages.map((img, index) => (
                <img
                    key={index}
                    onClick={() => setCount(index)}
                    className={`${count === index ? "border-2 border-yellow-700" : "opacity-50"} cursor-pointer w-24 h-24 object-cover object-center rounded-lg hover:opacity-100 transition-opacity duration-200`}
                    src={`${apiURL}/uploads/products/${img}`}
                    alt="pic"
                />
            ))}
          </div>

          {/* Imagem Principal */}
          <div className="col-span-2 md:col-span-6">
            <div className="relative bg-white rounded-lg shadow-sm p-4">
              <img
                className="w-full h-[500px] object-contain"
                src={`${apiURL}/uploads/products/${sProduct.pImages[count]}`}
                alt="Product"
              />
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="col-span-2 mt-8 md:mt-0 md:col-span-4 md:ml-6 lg:ml-12">
             <div className="flex flex-col leading-8 bg-white rounded-lg shadow-sm p-6">
                <div className="text-2xl font-medium tracking-wider">{sProduct.pName}</div>
                {sProduct.pSize && (
                    <div className="text-sm text-gray-600 mt-2">
                        Tamanho: {sProduct.pSize}
                    </div>
                )}
                {sProduct.pColor && (
                    <div className="text-sm text-gray-600 mt-2">
                        Cor: {sProduct.pColor}
                    </div>
                )}
                {sProduct.pBrand && (
                    <div className="text-sm text-gray-600 mt-2">
                        Marca: {sProduct.pBrand}
                    </div>
                )}
                
                {/* Indicador de loja selecionada */}
                {selectedStore && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <span className="text-sm text-yellow-800">
                            Produto selecionado da loja: <strong>{selectedStore.name}</strong>
                        </span>
                    </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-semibold tracking-wider text-yellow-700">
                        {getCurrentPrice()}Kz
                    </span>
                    <div className="flex items-center">
                        <button
                            onClick={(e) => {
                                if (isWish(sProduct._id, wList)) {
                                    unWishReq(e, sProduct._id, setWlist);
                                } else {
                                    isWishReq(e, sProduct._id, setWlist);
                                }
                            }}
                            className="text-gray-400 hover:text-yellow-700 focus:outline-none"
                        >
                            <svg
                                className={`w-6 h-6 ${
                                    isWish(sProduct._id, wList)
                                        ? "text-yellow-700"
                                        : "text-gray-400"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="my-6 text-gray-600 border-t border-gray-100 pt-4">
                    {sProduct.pDescription}
                </div>

                {/* Controles de Quantidade */}
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-gray-600">Quantidade:</span>
                    <div className="flex items-center border border-gray-300 rounded">
                        <button
                            onClick={() =>
                                updateQuantity(
                                    "decrease",
                                    getCurrentStock(),
                                    quantitiy,
                                    setQuantitiy,
                                    setAlertq
                                )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span className="px-4 py-1 text-gray-700">{quantitiy}</span>
                        <button
                            onClick={() =>
                                updateQuantity(
                                    "increase",
                                    getCurrentStock(),
                                    quantitiy,
                                    setQuantitiy,
                                    setAlertq
                                )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Alerta de quantidade */}
                {alertq && (
                    <div className="mb-4 text-red-500 text-sm">
                        Quantidade máxima disponível atingida
                    </div>
                )}

                {/* Botão Adicionar ao Carrinho */}
                <button
                    onClick={() =>
                        addToCart(
                            getProductIdForCart(),
                            quantitiy,
                            getCurrentPrice(),
                            layoutDispatch,
                            setQuantitiy,
                            setAlertq,
                            fetchData,
                            totalCost
                        )
                    }
                    disabled={getCurrentStock() === 0}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                        getCurrentStock() === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-700 hover:bg-yellow-800"
                    }`}
                >
                    {getCurrentStock() === 0 ? "Fora de Estoque" : "Adicionar ao Carrinho"}
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Tabela de Comparação de Preços */}
      <div className="mx-4 md:mx-12">
        <PriceComparison 
          stores={storeProducts} 
          loading={loadingStores} 
          selectedStore={selectedStore}
          onStoreSelect={handleStoreSelect}
        />
      </div>

      {/* Seção de detalhes adicionais */}
      <ProductDetailsSectionTwo />
    </Fragment>
  );
};

export default ProductDetailsSection;