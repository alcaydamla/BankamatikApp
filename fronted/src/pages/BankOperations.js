import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { Card, Input, Button, message, Typography, List } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const BankOperations = () => {
    const { kullanici } = useAuthContext();
    const [amount, setAmount] = useState(""); 
    const [transactions, setTransactions] = useState([]); 
    const [balance, setBalance] = useState(null); 

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`/api/banka/transactions/${kullanici._id}`, {
                headers: { Authorization: `Bearer ${kullanici.token}` }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error("İşlem geçmişi alınamadı:", error);
            message.error("İşlem geçmişi alınırken hata oluştu.");
        }
    };

    const fetchBalance = async () => {
        try {
            const response = await axios.get(`/api/banka/balance/${kullanici._id}`, {
                headers: { Authorization: `Bearer ${kullanici.token}` }
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Bakiye alınamadı:", error);
            message.error("Bakiye alınırken hata oluştu.");
        }
    };

    const handleTransaction = async (type) => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            message.warning("Lütfen geçerli bir miktar girin!");
            return;
        }

        const apiEndpoint = type === "deposit" 
            ? `/api/banka/deposit/${kullanici._id}` 
            : `/api/banka/withdraw/${kullanici._id}`;
        const successMessage = type === "deposit" ? "Para yatırıldı!" : "Para çekildi!";

        try {
            const response = await axios.post(
                apiEndpoint, 
                { amount: Number(amount) },
                { headers: { Authorization: `Bearer ${kullanici.token}` } } 
            );

            message.success(successMessage);
            setBalance(response.data.balance);
            setAmount(""); 
            fetchTransactions(); 
        } catch (error) {
            console.error("İşlem Hatası:", error);
            message.error(error.response?.data?.message || "İşlem başarısız!");
        }
    };
    
    useEffect(() => {
        if (kullanici) {
            fetchBalance();
            fetchTransactions();
        }
    }, [kullanici]);

    return (
        <Card style={{ width: 400, margin: "auto", marginTop: 50, textAlign: "center" }}>
            <Title level={4}>💸 Para İşlemleri</Title>

            <Input
                placeholder="Miktar girin"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                style={{ marginBottom: 10 }}
            />

            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => handleTransaction("deposit")} style={{ marginBottom: 10, width: "100%" }}>
                Para Yatır
            </Button>

            <Button type="danger" icon={<MinusCircleOutlined />} onClick={() => handleTransaction("withdraw")} style={{ width: "100%" }}>
                Para Çek
            </Button>

            <Title level={4} style={{ marginTop: "20px" }}>İşlem Geçmişi</Title>
            <List
                dataSource={transactions}
                renderItem={item => (
                    <List.Item>
                        <Text>{new Date(item.date).toLocaleString()}</Text>
                        <Text>{item.type === "deposit" ? "Para Yatırıldı" : "Para Çekildi"}</Text>
                        <Text strong>{item.amount} TL</Text>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default BankOperations;
