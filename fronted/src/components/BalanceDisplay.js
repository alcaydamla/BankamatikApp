import { useState, useEffect } from 'react';
import axios from 'axios';

const BalanceDisplay = ({ userId }) => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        axios.get(`/api/banka/balance/${userId}`)
            .then(res => setBalance(res.data.balance))
            .catch(err => console.error(err));
    }, []);

    return <h2>Bakiyeniz: {balance} TL</h2>;
};

export default BalanceDisplay;
