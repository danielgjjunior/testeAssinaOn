import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Função para exibir mensagem de sucesso
export const showToastSuccess = (message: string) => {
  toast.success(message);
};

// Função para exibir mensagem de erro
export const showToastError = (message: string) => {
  toast.error(message);
};

// Função para exibir mensagem de aviso
export const showToastWarning = (message: string) => {
  toast(<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    <strong>Caro Cliente</strong>
    <span>{message}</span>
    <a
      href="https://play.google.com/store/apps/details?id=br.com.mksolutions.mksac.onnet&pcampaignid=web_share"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "none",
        color: "#fff",
        backgroundColor: "#218838",
        padding: "8px 12px",
        borderRadius: "8px",
        textAlign: "center",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      Ir para
    </a>
  </div>,
    {
      closeButton: true,
      pauseOnHover: true,
      style: {
        width: "400px"
      },
    }
  );
};

const Toastify = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000} // O tempo padrão de fechamento
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default Toastify;
