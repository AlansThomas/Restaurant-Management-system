import { toast } from "react-toastify";


export default function Toaster(message, id, type) {
  toast[type](message, {
    position: "top-right",
    toastId: id,
    autoClose: 7000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

