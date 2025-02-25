import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { Card, Input, InputNumber, Button, message, Typography, List, Spin } from "antd";
import { DollarCircleOutlined, UploadOutlined, DownloadOutlined, SwapOutlined, HistoryOutlined } from "@ant-design/icons";
import styles from "../styles/Dashboard.css";
import BankOperations from "./BankOperations";

const { Title, Text } = Typography;

const Dashboard = () => {
    const { kullanici } = useAuthContext();
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState(null);
    const [recipientPhone, setRecipientPhone] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showBankOperations, setShowBankOperations] = useState(false);

    useEffect(() => {
        if (!kullanici || !kullanici._id) {
            setLoading(false);
            setError("Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.");
            return;
        }

        axios.get(`/api/banka/balance/${kullanici._id}`, {
            headers: { Authorization: `Bearer ${kullanici.token}` }
        })
        .then(res => {
            if (res.data.balance !== undefined) {
                setBalance(res.data.balance);
            } else {
                setError("Bakiye alınamadı.");
            }
        })
        .catch(err => {
            setError("Bakiye alınırken bir hata oluştu.");
        })
        .finally(() => {
            setLoading(false);
        });

        axios.get(`/api/banka/transactions/${kullanici._id}`, {
            headers: { Authorization: `Bearer ${kullanici.token}` }
        })
        .then(res => {
            setTransactions(res.data);
        })
        .catch(err => {
            setError("İşlem geçmişi alınırken bir hata oluştu.");
        });

    }, [kullanici]);

    const handleTransfer = async () => {
        if (!amount || amount <= 0 || !recipientPhone) {
            message.warning("Lütfen geçerli bir miktar ve telefon numarası girin!");
            return;
        }

        setProcessing(true);
        try {
            const response = await axios.post(
                `/api/banka/transfer`,
                { userId: kullanici._id, recipientPhone, amount },
                { headers: { Authorization: `Bearer ${kullanici.token}` } }
            );

            setBalance(response.data.balance);
            setAmount(null);
            setRecipientPhone("");
            message.success(`Başarıyla ${amount} TL gönderildi!`);
        } catch (err) {
            message.error("Transfer başarısız! Lütfen bilgileri kontrol edin.");
        }
        setProcessing(false);
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card} title="🏦 Bankamatik Paneli">
                <Title level={3}><DollarCircleOutlined /> Bakiyeniz: {balance !== null ? `${balance} TL` : <Spin />}</Title>

                <Input 
                    placeholder="Alıcı Telefon No" 
                    value={recipientPhone} 
                    onChange={e => setRecipientPhone(e.target.value)} 
                    style={{ marginBottom: 10 }} 
                />
                <InputNumber 
                    min={1} 
                    placeholder="Miktar girin" 
                    value={amount} 
                    onChange={setAmount} 
                    style={{ width: "100%", marginBottom: 10 }} 
                />
                <Button type="primary" icon={<SwapOutlined />} onClick={handleTransfer} loading={processing} block>
                    Para Gönder
                </Button>
                <Button 
                    type="default" 
                    onClick={() => setShowBankOperations(!showBankOperations)} 
                    style={{ marginTop: 20, width: "100%" }}>
                    {showBankOperations ? "Banka İşlemlerini Kapat" : "Banka İşlemleri Aç"}
                </Button>
            </Card>

            {showBankOperations && <BankOperations />} {/* BankOperations'ı burada göster */}
            
            <Card className={styles.transactionCard} title="📜 İşlem Geçmişi" extra={<HistoryOutlined />}>
                <List
                    dataSource={transactions}
                    renderItem={item => (
                        <List.Item>
                            <Text>{new Date(item.date).toLocaleString()}</Text>
                            <Text>{item.type === "deposit" ? <UploadOutlined /> : item.type === "withdraw" ? <DownloadOutlined /> : <SwapOutlined />}</Text>
                            <Text strong>{item.amount} TL</Text>
                            {item.recipientPhone && <Text>(Gönderilen: {item.recipientPhone})</Text>}
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default Dashboard;
