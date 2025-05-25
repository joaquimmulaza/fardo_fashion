import React, { Fragment, useState, useEffect, useContext } from "react";
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
  const [, setAlertq] = useState(false);
  const [wList, setWlist] = useState(JSON.parse(localStorage.getItem("wishList")));

  const [storeProducts, setStoreProducts] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    // Função para buscar todos os dados necessários
    const fetchData = async () => {
      dispatch({ type: "loading", payload: true });

      // Busca os detalhes do produto principal
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

      // Busca a lista de produtos no carrinho
      try {
        let cartData = await cartListProduct();
        if (cartData && cartData.Products) {
          layoutDispatch({ type: "cartProduct", payload: cartData.Products });
        }
      } catch (error) {
        console.log(error);
      }

      // Busca as lojas para comparação de preço
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
    };

    fetchData();
  }, [id, dispatch, layoutDispatch]);

  // Renderiza o estado de carregamento
  if (data.loading) {
    return (
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500"></div>
      </div>
    );
  }

  // Renderiza se nenhum produto for encontrado
  if (!sProduct) {
    return <div className="m-12 text-center">Produto não encontrado.</div>;
  }

  // Renderização principal do componente
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
        <div className="grid grid-cols-2 md:grid-cols-12">
          {/* Coluna de Imagens Pequenas */}
          <div className="hidden md:block md:col-span-1 md:flex md:flex-col md:space-y-4 md:mr-2">
            {pImages && pImages.length > 0 && pImages.map((img, index) => (
                <img
                    key={index}
                    onClick={() => slideImage(null, index, count, setCount, pImages)}
                    className={`${count === index ? "border-2 border-yellow-700" : "opacity-50"} cursor-pointer w-20 h-20 object-cover object-center`}
                    src={`${apiURL}/uploads/products/${img}`}
                    alt="pic"
                />
            ))}
          </div>

          {/* Imagem Principal */}
          <div className="col-span-2 md:col-span-7">
            <div className="relative">
              <img
                className="w-full h-auto object-cover"
                src={`${apiURL}/uploads/products/${sProduct.pImages[count]}`}
                alt="Product"
              />
              {/* Controles do slide */}
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="col-span-2 mt-8 md:mt-0 md:col-span-4 md:ml-6 lg:ml-12">
             {/* ... O seu código de detalhes do produto (nome, preço, descrição, botões) pode continuar aqui ... */}
             <div className="flex flex-col leading-8">
                <div className="text-2xl tracking-wider">{sProduct.pName}</div>
                <div className="flex justify-between items-center">
                    <span className="text-xl tracking-wider text-yellow-700">
                        {sProduct.pPrice}Kz
                    </span>
                    {/* Botão de Wishlist */}
                </div>
             </div>
             <div className="my-4 md:my-6 text-gray-600">
                {sProduct.pDescription}
             </div>
             {/* Botões de quantidade e "Adicionar ao Carrinho" */}
             {/* ... */}
          </div>
        </div>
      </section>

      {/* Tabela de Comparação de Preços */}
      <div className="mx-4 md:mx-12">
        <PriceComparison stores={storeProducts} loading={loadingStores} />
      </div>

      {/* Seção de detalhes adicionais */}
      <ProductDetailsSectionTwo />
    </Fragment>
  );
};

export default ProductDetailsSection;