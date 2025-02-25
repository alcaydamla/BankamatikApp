import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
    const [hata, setHata] = useState(null);
    const [yukleniyor, setYukleniyor] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, parola) => {
        setYukleniyor(true);
        setHata(null);

        try {
            const response = await axios.post("/api/kullanici/login", { email, parola });
            const kullanici = response.data;
            
            const userData = {
                _id: kullanici._id,
                email: kullanici.email,
                balance: kullanici.balance,
                token: kullanici.token
            };

            localStorage.setItem("kullanici", JSON.stringify(userData));
            dispatch({ type: "LOGIN", payload: userData });

            setYukleniyor(false);
            return kullanici.balance;
        } catch (error) {
            setHata(error.response?.data?.message || "Bir hata oluştu.");
            setYukleniyor(false);
        }
    };

    return { login, yukleniyor, hata };
};
