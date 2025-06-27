import React, { Fragment, useState } from "react";
import { partnerSignupReq } from "./fetchApi";
import { useSnackbar } from 'notistack';
const PartnerSignup = ({ onClose }) => {
  const [data, setData] = useState({
    name: "",
    storeName: "",
    email: "",
    password: "",
    cPassword: "",
    error: false,
    loading: false,
    success: false,
  });
  const alert = (msg, type) => (
    <div className={`text-sm text-${type}-500`}>{msg}</div>
  );
  const { enqueueSnackbar } = useSnackbar();
  const formSubmit = async () => {
    setData({ ...data, loading: true });
    if (data.cPassword !== data.password) {
      return setData({
        ...data,
        error: {
          cPassword: "A palavra-passe não corresponde",
          password: "A palavra-passe não corresponde",
        },
      });
    }
    try {
      let responseData = await partnerSignupReq({
        name: data.name,
        storeName: data.storeName,
        email: data.email,
        password: data.password,
        cPassword: data.cPassword,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
          cPassword: "",
        });
      } else if (responseData.success) {
        setData({
          success: responseData.success,
          name: "",
          storeName: "",
          email: "",
          password: "",
          cPassword: "",
          loading: false,
          error: false,
        })
        enqueueSnackbar('Cadastro enviado! Aguarde aprovação do admin.', { variant: 'success' })
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Fragment>
      <div className="text-center text-2xl mb-6">Cadastro de Parceiro</div>
      <form className="space-y-4">
        {data.success ? (
          <div className="text-green-600 text-center">
            Sua solicitação foi enviada! Aguarde o admin aprovar. Você receberá confirmação por email.
          </div>
        ) : ""}
        <div className="flex flex-col">
          <label htmlFor="name">
            Nome<span className="text-sm text-gray-600 ml-1">*</span>
          </label>
          <input
            onChange={(e) =>
              setData({
                ...data,
                success: false,
                error: {},
                name: e.target.value,
              })
            }
            value={data.name}
            type="text"
            id="name"
            className={`${data.error.name ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {!data.error ? "" : alert(data.error.name, "red")}
        </div>
        <div className="flex flex-col">
          <label htmlFor="storeName">
            Nome da Loja<span className="text-sm text-gray-600 ml-1">*</span>
          </label>
          <input
            onChange={(e) =>
              setData({
                ...data,
                success: false,
                error: {},
                storeName: e.target.value,
              })
            }
            value={data.storeName}
            type="text"
            id="storeName"
            className={`${data.error.storeName ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {!data.error ? "" : alert(data.error.storeName, "red")}
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">
            Email<span className="text-sm text-gray-600 ml-1">*</span>
          </label>
          <input
            onChange={(e) =>
              setData({
                ...data,
                success: false,
                error: {},
                email: e.target.value,
              })
            }
            value={data.email}
            type="email"
            id="email"
            className={`${data.error.email ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {!data.error ? "" : alert(data.error.email, "red")}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">
            Palavra-passe<span className="text-sm text-gray-600 ml-1">*</span>
          </label>
          <input
            onChange={(e) =>
              setData({
                ...data,
                success: false,
                error: {},
                password: e.target.value,
              })
            }
            value={data.password}
            type="password"
            id="password"
            className={`${data.error.password ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {!data.error ? "" : alert(data.error.password, "red")}
        </div>
        <div className="flex flex-col">
          <label htmlFor="cPassword">
            Confirmar palavra-passe
            <span className="text-sm text-gray-600 ml-1">*</span>
          </label>
          <input
            onChange={(e) =>
              setData({
                ...data,
                success: false,
                error: {},
                cPassword: e.target.value,
              })
            }
            value={data.cPassword}
            type="password"
            id="cPassword"
            className={`${data.error.cPassword ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {!data.error ? "" : alert(data.error.cPassword, "red")}
        </div>
        <div
          onClick={(e) => formSubmit()}
          style={{ background: "#303031" }}
          className="px-4 py-2 text-white text-center cursor-pointer font-medium"
        >
          Enviar Solicitação
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          Após aprovação, você poderá acessar o painel de parceiro normalmente.
        </div>
      </form>
    </Fragment>
  );
};
export default PartnerSignup; 