import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useSignup = () => {
    const { dispatch } = useAuthContext();

    const signup = async (email, parola) => {
        try {
            const response = await axios.post("/api/kullanici/signup", { email, parola });
            const kullanici = response.data;

            console.log("Signup Yanıtı:", kullanici);

            if (kullanici.balance === undefined) {
                console.error("Balance undefined geldi! Kullanıcı objesi:", kullanici);
            }

            localStorage.setItem("kullanici", JSON.stringify(kullanici));
            dispatch({ type: "LOGIN", payload: kullanici });

        } catch (error) {
            console.error("Kayıt hatası:", error);
        }
    };

    return { signup };
};
