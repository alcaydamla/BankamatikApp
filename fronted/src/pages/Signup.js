import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { Card, Input, Button, message } from "antd";

const Signup = () => {
    const { dispatch } = useAuthContext();
    const [phone, setPhone] = useState("");
    const [parola, setParola] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!phone || !parola) {
            message.warning("Lütfen telefon numaranızı ve parolanızı girin!");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            message.warning("Telefon numarası 10 haneli olmalıdır!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/kullanici/signup', { phone, parola });

            localStorage.setItem('kullanici', JSON.stringify(response.data));
            dispatch({ type: 'LOGIN', payload: response.data });
            message.success("Kayıt başarılı! Giriş yapıldı.");
        } catch (error) {
            message.error(error.response?.data?.hata || "Kayıt başarısız!");
        }
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <Card style={{ width: 450, textAlign: "center", borderRadius: 12 }}>
                <h2>📲 Üye Ol</h2>
                <Input placeholder="Telefon Numaranız" value={phone} onChange={e => setPhone(e.target.value)} style={{ marginBottom: 10 }} />
                <Input.Password placeholder="Parola" value={parola} onChange={e => setParola(e.target.value)} style={{ marginBottom: 10 }} />
                <Button type="primary" onClick={handleSignup} loading={loading} block>Kayıt Ol</Button>
            </Card>
        </div>
    );
};

export default Signup;
