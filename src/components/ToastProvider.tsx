import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { fontSize: "0.9rem" },
        success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
        error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
      }}
    />
  );
};

export default ToastProvider;
