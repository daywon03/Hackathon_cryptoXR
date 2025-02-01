// PaymentPage.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react';
import { getAddressBalance } from '../services/alephiumService'; // You can use your service to get balance if needed

const PaymentPage = () => {
    const location = useLocation();
    const { account, connectionStatus, connect, disconnect } = useWallet();

    const [amount, setAmount] = useState<number>(0);
    const [paymentAddress, setPaymentAddress] = useState<string>('');

    // Extract amount and address from the URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const amountParam = queryParams.get('amount');
        const addressParam = queryParams.get('address');

        if (amountParam && addressParam) {
            setAmount(parseFloat(amountParam));
            setPaymentAddress(addressParam);
        }
    }, [location.search]);

    // Handle the payment logic
    const handlePayment = async () => {
        if (!account) {
            alert('Please connect your wallet first!');
            return;
        }

        if (!paymentAddress || amount <= 0) {
            alert('Invalid address or amount.');
            return;
        }

        try {
            // Initiate the payment transaction here using the Alephium SDK
            // Example: await sendPayment(paymentAddress, amount)
            console.log(`Sending ${amount} ALPH to ${paymentAddress} from ${account.address}`);
            alert('Payment successful!');
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed!');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Payment Page</h1>

            {!account ? (
                <div>
                    <AlephiumConnectButton />
                </div>
            ) : (
                <div>
                    <p>Connected to wallet: {account.address}</p>
                    <p>Pay {amount} ALPH to: {paymentAddress}</p>
                    <button onClick={handlePayment}>Send Payment</button>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
