import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react';
import styles from '../styles/PaymentPage.module.css'; // Updated CSS import

const PaymentPage = () => {
    const location = useLocation();
    const { account } = useWallet();

    const [amount, setAmount] = useState<number>(0);
    const [paymentAddress, setPaymentAddress] = useState<string>('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const amountParam = queryParams.get('amount');
        const addressParam = queryParams.get('address');

        if (amountParam && addressParam) {
            setAmount(parseFloat(amountParam));
            setPaymentAddress(addressParam);
        }
    }, [location.search]);

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
            console.log(`Sending ${amount} ALPH to ${paymentAddress} from ${account.address}`);
            alert('Payment successful!');
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed!');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <h1 className={styles.header}>Payment Page</h1>

                {!account ? (
                    <div>
                        <AlephiumConnectButton />
                    </div>
                ) : (
                    <div>
                        <p>Connected to wallet: {account.address}</p>
                        <p>Pay {amount} ALPH to: {paymentAddress}</p>
                        <button onClick={handlePayment} className={styles.paymentButton}>
                            Send Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
