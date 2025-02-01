// src/components/PaymentRequest.tsx
import React, { useState } from 'react';
import { getAddressBalance } from '../services/alephiumService';

const PaymentRequest: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [address, setAddress] = useState<string>(''); // Replace with generated address

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value));
    };

    const paymentURI = `alephium:${address}?amount=${amount}`;

    return (
        <div>
            <h2>Demande de Paiement</h2>
            <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Montant en ALPH"
            />
            {address && amount > 0 && (
                <div>
                    <p>Utilisez ce lien pour effectuer le paiement : <a href={paymentURI} target="_blank" rel="noopener noreferrer">{paymentURI}</a></p>
                </div>
            )}
        </div>
    );
};

export default PaymentRequest;
