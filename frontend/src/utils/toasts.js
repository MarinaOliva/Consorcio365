import toast from "react-hot-toast";

export function mostrarToastError(mensaje) {
  toast.error(mensaje, {
    duration: 5000,
    style: {
      background: "#fff1f2",
      color: "#7f1d1d",
      border: "1px solid #fda4af",
      borderRadius: "16px",
      boxShadow: "0 8px 22px rgba(127,29,29,0.12)",
      fontSize: "14px",
      fontWeight: 600,
      padding: "14px 16px",
    },
    iconTheme: {
      primary: "#dc2626",
      secondary: "#FFFFFF",
    },
  });
}

export function mostrarToastExito(mensaje) {
  toast.success(mensaje, {
    duration: 4000,
    style: {
      background: "#E7ECEF",
      color: "#1F2937",
      border: "1px solid #C8CBCF",
      borderRadius: "16px",
      boxShadow: "0 8px 22px rgba(7,40,48,0.18)",
      fontSize: "14px",
      fontWeight: 600,
      padding: "14px 16px",
    },
    iconTheme: {
      primary: "#582367",
      secondary: "#FFFFFF",
    },
  });
}

export function mostrarToastInfo(mensaje) {
  toast(mensaje, {
    duration: 4000,
    style: {
      background: "#FFFFFF",
      color: "#1F2937",
      border: "1px solid #C8CBCF",
      borderRadius: "16px",
      boxShadow: "0 8px 22px rgba(7,40,48,0.18)",
      fontSize: "14px",
      fontWeight: 600,
      padding: "14px 16px",
    },
  });
}