import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";
import { createOrder } from "./FetchApi";
import { fetchData } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
    paymentMethod: "", // "bank_transfer" or "cash_on_delivery"
  });

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handlePayment = async () => {
    if (!state.address) {
      setState({ ...state, error: "Por favor, forneça seu endereço" });
      return;
    }
    if (!state.phone) {
      setState({ ...state, error: "Por favor, forneça seu número de telefone" });
      return;
    }
    if (!state.paymentMethod) {
      setState({ ...state, error: "Por favor, selecione um método de pagamento" });
      return;
    }

    dispatch({ type: "loading", payload: true });

    try {
      // Obter o total correto do carrinho
      const cartTotal = totalCost();
      
      let orderData = {
        allProduct: JSON.parse(localStorage.getItem("cart")),
        user: JSON.parse(localStorage.getItem("jwt")).user._id,
        amount: cartTotal,
        paymentMethod: state.paymentMethod,
        address: state.address,
        phone: state.phone,
      };

      let responseData = await createOrder(orderData);
      if (responseData.success) {
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch({ type: "cartProduct", payload: null });
        dispatch({ type: "cartTotalCost", payload: null });
        dispatch({ type: "orderSuccess", payload: true });
        dispatch({ type: "loading", payload: false });
        
        if (state.paymentMethod === "bank_transfer") {
          // Show bank details
          alert("Detalhes bancários para transferência:\n\nBanco: [Nome do Banco]\nConta: [Número da Conta]\nTitular: [Nome do Titular]\n\nApós a transferência, seu pedido será processado.");
        }
        
        return history.push("/");
      } else if (responseData.error) {
        setState({ ...state, error: responseData.error });
      }
    } catch (error) {
      setState({ ...state, error: "Erro ao processar o pedido" });
    }
    dispatch({ type: "loading", payload: false });
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Aguarde até terminar
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2">Pedido</div>
        <div className="flex flex-col md:flex md:space-x-2 md:flex-row">
          <div className="md:w-1/2">
            <CheckoutProducts products={data.cartProduct} />
          </div>
          <div className="w-full order-first md:order-last md:w-1/2">
            <div className="p-4 md:p-8">
              {state.error ? (
                <div className="bg-red-200 py-2 px-4 rounded mb-4">
                  {state.error}
                </div>
              ) : null}
              
              <div className="flex flex-col py-2">
                <label htmlFor="address" className="pb-2">
                  Endereço de entrega
                </label>
                <input
                  value={state.address}
                  onChange={(e) =>
                    setState({
                      ...state,
                      address: e.target.value,
                      error: false,
                    })
                  }
                  type="text"
                  id="address"
                  className="border px-4 py-2"
                  placeholder="Endereço..."
                />
              </div>

              <div className="flex flex-col py-2">
                <label htmlFor="phone" className="pb-2">
                  Telefone
                </label>
                <input
                  value={state.phone}
                  onChange={(e) =>
                    setState({
                      ...state,
                      phone: e.target.value,
                      error: false,
                    })
                  }
                  type="number"
                  id="phone"
                  className="border px-4 py-2"
                  placeholder="+244"
                />
              </div>

              <div className="flex flex-col py-2">
                <label className="pb-2">Método de Pagamento</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={state.paymentMethod === "bank_transfer"}
                      onChange={(e) =>
                        setState({
                          ...state,
                          paymentMethod: e.target.value,
                          error: false,
                        })
                      }
                      className="form-radio"
                    />
                    <span>Transferência bancária direta</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={state.paymentMethod === "cash_on_delivery"}
                      onChange={(e) =>
                        setState({
                          ...state,
                          paymentMethod: e.target.value,
                          error: false,
                        })
                      }
                      className="form-radio"
                    />
                    <span>Pagamento na entrega</span>
                  </label>
                </div>
              </div>

              <div
                onClick={handlePayment}
                className="w-full px-4 py-2 text-center text-white font-semibold cursor-pointer mt-4"
                style={{ background: "#303031" }}
              >
                Finalizar Pedido - Total: {totalCost()}Kz
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  // Função para extrair informações da loja do ID do produto
  const getStoreInfo = (productId) => {
    if (productId.includes('_store_')) {
      const parts = productId.split('_store_');
      return {
        isFromStore: true,
        storeId: parts[1]
      };
    }
    return {
      isFromStore: false,
      storeId: null
    };
  };

  // Função para obter o preço correto do produto
  const getProductPrice = (productId) => {
    let carts = JSON.parse(localStorage.getItem("cart"));
    if (carts) {
      const cartItem = carts.find(item => item.id === productId);
      if (cartItem) {
        return cartItem.price;
      }
    }
    return 0;
  };

  return (
    <Fragment>
      <div className="grid grid-cols-2 md:grid-cols-1">
        {products !== null && products.length > 0 ? (
          products.map((product, index) => {
            const storeInfo = getStoreInfo(product._id);
            const productPrice = getProductPrice(product._id);
            
            return (
              <div
                key={index}
                className="col-span-1 m-2 md:py-6 md:border-t md:border-b md:my-2 md:mx-0 md:flex md:items-center md:justify-between"
              >
                <div className="md:flex md:items-center md:space-x-4">
                  <img
                    onClick={(e) => {
                      // Extrair o ID original do produto para navegação
                      const originalProductId = product._id.includes('_store_') 
                        ? product._id.split('_store_')[0] 
                        : product._id;
                      history.push(`/products/${originalProductId}`);
                    }}
                    className="cursor-pointer md:h-20 md:w-20 object-cover object-center"
                    src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                    alt="wishListproduct"
                  />
                  <div className="text-lg md:ml-6 truncate">
                    {product.pName}
                    {storeInfo.isFromStore && (
                      <div className="text-xs text-yellow-600 bg-yellow-100 px-1 rounded mt-1">
                        Produto de loja parceira
                      </div>
                    )}
                  </div>
                  <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                    Preço : {productPrice}Kz{" "}
                  </div>
                  <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                    Quantidade : {quantity(product._id)}
                  </div>
                  <div className="font-semibold text-gray-600 text-sm">
                    Subtotal : {subTotal(product._id)}Kz
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>Nenhum produto encontrado para finalização da compra</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;
