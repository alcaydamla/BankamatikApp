import { useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ userId }) => {
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState('deposit');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/banka/${type}`, { userId, amount });
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Miktar: </label>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
            
            <select onChange={(e) => setType(e.target.value)}>
                <option value="deposit">Para Yatır</option>
                <option value="withdraw">Para Çek</option>
            </select>

            <button type="submit">Gönder</button>
        </form>
    );
};

export default TransactionForm;
