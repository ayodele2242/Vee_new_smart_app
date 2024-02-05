import { toast } from 'react-toastify';

export const notifyInfo = (msg: any, delay = 3000) => {
    toast.info(msg, {
        position: "top-right",
        autoClose: delay,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
       
    });
};