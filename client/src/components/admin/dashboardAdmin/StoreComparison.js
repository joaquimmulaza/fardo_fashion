import React, { useContext, useEffect, useState, useCallback } from "react";
import { DashboardContext } from "./index";
import {
  fetchStores,
  addStore,
  fetchStoreProducts,
  addStoreProduct,
} from "./Action";
import { getAllProduct } from "../products/FetchApi";

const StoreComparison = () => {
  const { data, dispatch } = useContext(DashboardContext);
  const [storeName, setStoreName] = useState("");
  // Inicializamos com null para forçar a seleção e evitar valores indesejados como ""
  // Ou podemos usar "" e confiar na validação `required` e `if(!id)`
  const [productId, setProductId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const responseData = await getAllProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "productsList", payload: responseData.Products });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Erro ao carregar produtos");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStores(dispatch);
    fetchProducts();
  }, [dispatch, fetchProducts]);

  // Buscar associações ao informar um productId
  const handleFetchAssociations = async () => {
    if (!productId) { // Adicionado verificação para garantir productId
      setError("Por favor, selecione um produto para ver as associações.");
      return;
    }
    try {
      setLoading(true);
      setError(null); // Limpar erro antes de tentar buscar
      await fetchStoreProducts(productId, dispatch);
    } catch (error) {
      console.error("Error fetching store products:", error);
      setError("Erro ao buscar associações da loja");
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova loja
  const handleAddStore = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) { // Garante que o nome não é apenas espaços
      setError("O nome da loja é obrigatório.");
      return;
    }
    try {
      setLoading(true);
      setError(null); // Limpar erro antes de tentar adicionar
      await addStore(storeName, dispatch);
      setStoreName("");
    } catch (error) {
      console.error("Error adding store:", error);
      setError("Erro ao adicionar loja");
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova associação
  const handleAddAssociation = async (e) => {
    e.preventDefault();

    // Validação rigorosa dos campos antes de enviar
    if (!productId) {
      setError("Por favor, selecione um produto.");
      return;
    }
    if (!storeId) {
      setError("Por favor, selecione uma loja.");
      return;
    }
    if (price === "" || isNaN(Number(price)) || Number(price) < 0) { // Verifica se price é vazio ou inválido
      setError("Por favor, insira um preço válido.");
      return;
    }
    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) { // Verifica se stock é vazio ou inválido
      setError("Por favor, insira um estoque válido.");
      return;
    }

    // Log para depuração: ver o que está a ser enviado ANTES da chamada da API
    console.log("Valores prestes a serem enviados para a API:", {
      productId,
      storeId,
      price: Number(price),
      stock: Number(stock),
    });

    try {
      setLoading(true); // Ativa o loading
      setError(null); // Limpa qualquer erro anterior

      const result = await addStoreProduct(
        { productId, storeId, price: Number(price), stock: Number(stock) },
        dispatch
      );

      console.log("Resposta completa da API após addStoreProduct:", result); // Log mais detalhado
      
      if (result && result.error) { // Verifica se há um campo 'error' na resposta
        setError(result.error);
      } else if (result && result.success) { // Verifica se há um campo 'success'
        setPrice("");
        setStock("");
        // Opcional: resetar os seletores se quiser forçar uma nova seleção
        // setProductId("");
        // setStoreId("");
        
        // Refresh store products after adding new association
        // Certifique-se de que o productId está presente para esta chamada
        await handleFetchAssociations(); // Chama para atualizar a lista
      } else {
        // Caso a resposta não tenha 'success' nem 'error', mas não deu erro na chamada
        setError("Resposta inesperada da API. Verifique os logs do backend.");
      }
    } catch (error) {
      console.error("Erro ao adicionar associação de produto:", error);
      // Extrai a mensagem de erro do backend se disponível, caso contrário, uma mensagem genérica
      setError(error.response?.data?.error || "Erro ao adicionar associação. Verifique o console.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Seção de Gerenciamento de Lojas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gerenciar Lojas</h2>
        <form onSubmit={handleAddStore} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nome da loja"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adicionando..." : "Adicionar Loja"}
            </button>
          </div>
          {data.storeAddSuccess && (
            <p className="mt-2 text-green-600">{data.storeAddSuccess}</p>
          )}
          {data.storeAddError && (
            <p className="mt-2 text-red-600">{data.storeAddError}</p>
          )}
        </form>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Lojas Cadastradas</h3>
          <ul className="space-y-2">
            {data.storesList && data.storesList.length > 0 ? (
              data.storesList.map((store) => (
                <li
                  key={store._id}
                  className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
                >
                  <span className="text-gray-800">{store.name}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">Nenhuma loja cadastrada.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Seção de Associação Loja-Produto */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Associação Loja-Produto</h2>
        <form onSubmit={handleAddAssociation} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o produto</option>
              {data.productsList && data.productsList.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.pName}
                </option>
              ))}
            </select>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione a loja</option>
              {data.storesList && data.storesList.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Estoque"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Associando..." : "Associar Produto à Loja"}
          </button>
          {data.storeProductAddSuccess && (
            <p className="mt-2 text-green-600">{data.storeProductAddSuccess}</p>
          )}
          {data.storeProductAddError && (
            <p className="mt-2 text-red-600">{data.storeProductAddError}</p>
          )}
        </form>

        <div className="mb-4">
          <button
            onClick={handleFetchAssociations}
            disabled={!productId || loading}
            className={`px-6 py-2 rounded-md transition-colors ${
              productId && !loading
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Carregando..." : "Ver associações deste produto"}
          </button>
        </div>

        {data.storeProductsList && data.storeProductsList.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.storeProductsList.map((sp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sp.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       {sp.price.toFixed(2)} KZ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sp.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreComparison;