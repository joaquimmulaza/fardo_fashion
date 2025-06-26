import React from "react";

const PriceComparison = ({ stores, loading, selectedStore, onStoreSelect }) => {
  if (loading) {
    return <div className="my-8">A carregar preços das lojas...</div>;
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="my-8">
        <h3 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2">Outras Lojas</h3>
        <p className="mt-4 text-gray-600">Nenhuma outra loja oferece este produto no momento.</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h3 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2">Outras Lojas</h3>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left text-sm font-bold text-gray-600 uppercase">Selecionar</th>
              <th className="py-3 px-4 border-b text-left text-sm font-bold text-gray-600 uppercase">Loja</th>
              <th className="py-3 px-4 border-b text-left text-sm font-bold text-gray-600 uppercase">Preço</th>
              <th className="py-3 px-4 border-b text-left text-sm font-bold text-gray-600 uppercase">Estoque</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 border-t">
                <td className="py-3 px-4">
                  <input
                    type="radio"
                    name="storeSelection"
                    id={`store-${index}`}
                    checked={selectedStore && selectedStore._id === item._id}
                    onChange={() => onStoreSelect(item)}
                    className="w-4 h-4 text-yellow-700 bg-gray-100 border-gray-300 focus:ring-yellow-700 focus:ring-2"
                  />
                </td>
                <td className="py-3 px-4 font-medium text-gray-700">{item.name}</td>
                <td className="py-3 px-4 text-green-600 font-semibold">AOA {item.price.toFixed(2)}</td>
                <td className={`py-3 px-4 font-medium ${item.stock > 0 ? 'text-gray-700' : 'text-red-500'}`}>
                    {item.stock > 0 ? `${item.stock} em estoque` : "Sem estoque"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Opção para desmarcar seleção */}
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="radio"
          name="storeSelection"
          id="store-none"
          checked={!selectedStore}
          onChange={() => onStoreSelect(null)}
          className="w-4 h-4 text-yellow-700 bg-gray-100 border-gray-300 focus:ring-yellow-700 focus:ring-2"
        />
        <label htmlFor="store-none" className="text-sm text-gray-600 cursor-pointer">
          Usar preço padrão da loja
        </label>
      </div>
    </div>
  );
};

export default PriceComparison;