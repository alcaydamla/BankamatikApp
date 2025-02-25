import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { Card, Input, Button, message } from "antd";

const Login = () => {
    const { dispatch } = useAuthContext();
    const [phone, setPhone] = useState("");
    const [parola, setParola] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!phone || !parola) {
            message.warning("Lütfen telefon numaranızı ve parolanızı girin!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/kullanici/login', { phone, parola });

            localStorage.setItem('kullanici', JSON.stringify(response.data));
            dispatch({ type: 'LOGIN', payload: response.data });
            message.success("Başarıyla giriş yapıldı!");
        } catch (error) {
            message.error(error.response?.data?.hata || "Giriş başarısız!");
        }
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <Card style={{ width: 450, textAlign: "center", borderRadius: 12 }}>
                <h2>📲 Giriş Yap</h2>
                <Input placeholder="Telefon Numaranız" value={phone} onChange={e => setPhone(e.target.value)} style={{ marginBottom: 10 }} />
                <Input.Password placeholder="Parola" value={parola} onChange={e => setParola(e.target.value)} style={{ marginBottom: 10 }} />
                <Button type="primary" onClick={handleLogin} loading={loading} block>Giriş</Button>
            </Card>
        </div>
    );
};

export default Login;
