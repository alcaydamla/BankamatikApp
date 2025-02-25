import { useEffect } from "react";
import NotDetay from "../components/NotDetay";
import NotForm from "../components/NotForm";
import { useNotContext } from "../hooks/useNotContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Layout, Row, Col, Card, Typography } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

function Home() {
    const { notlar, dispatch } = useNotContext();
    const { kullanici } = useAuthContext();

    useEffect(() => {
        const fetchNotlar = async () => {
            const response = await fetch('/api/notlar', {
                headers: {
                    'Authorization': `Bearer ${kullanici.token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'NOT_DOLDUR', payload: json });
            }
        };

        if (kullanici) {
            fetchNotlar();
        }

    }, [dispatch, kullanici]);

    console.log("Gönderilen Token:", kullanici.token);

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
            <Header style={{ background: "#E60012", color: "white", textAlign: "center", fontSize: "24px" }}>
                Not Defterim
            </Header>
            <Content style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
                <Card style={{ padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)" }}>
                    <Title level={3} style={{ textAlign: "center" }}>Yeni bir not ekle</Title>
                    <NotForm />
                </Card>

                <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
                    {notlar && notlar.length > 0 ? (
                        notlar.map((not) => (
                            <Col key={not._id} xs={24} sm={12} md={8}>
                                <NotDetay not={not} />
                            </Col>
                        ))
                    ) : (
                        <Title level={4} style={{ textAlign: "center", color: "#888", width: "100%" }}>Henüz not eklenmedi.</Title>
                    )}
                </Row>
            </Content>
        </Layout>
    );
}

export default Home;
