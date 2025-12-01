import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind breakpoint: <640 = mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Toaster
      position={isMobile ? "bottom-center" : "top-right"}
      toastOptions={{
        duration: 5000,
        style: { fontSize: "0.9rem" },

        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },

        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
