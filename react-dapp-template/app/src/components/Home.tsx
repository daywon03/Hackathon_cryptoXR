// Home.tsx
import styles from '../styles/Home.module.css'
import { TokenDapp } from './TokenDapp'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react'
import { useState, useEffect } from 'react'
import { tokenFaucetConfig } from '../services/utils'
import { getAddressBalance } from '../services/alephiumService'

export default function Home() {
  const { connectionStatus, account } = useWallet()
  const [amount, setAmount] = useState<number>(0)
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    if (account) {
      fetchBalance(account.address)
    }
  }, [account])

  const fetchBalance = async (address: string) => {
    try {
      const balanceData = await getAddressBalance(address)
      setBalance(balanceData.balance) // Assuming response contains 'balance'
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value))
  }

  // Generate a copiable payment link (includes both address and amount)
  const paymentURI = account && account.address && amount > 0
    ? `http://localhost:5173/payment?address=${account.address}&amount=${amount}` // Dev link for local development
    // : `https://your-domain.com/payment?address=${account.address}&amount=${amount}` // Uncomment this for production
    : '';

  return (
    <div className={styles.container}>
      <AlephiumConnectButton />

      {connectionStatus === 'connected' && (
        <>
          <TokenDapp config={tokenFaucetConfig} />

          <div>
            <h2>Demande de Paiement</h2>
            <p>Adresse : {account.address}</p>
            <p>Solde : {balance} ALPH</p>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Montant en ALPH"
            />
            {paymentURI && (
              <div>
                <p>Utilisez ce lien pour effectuer le paiement :</p>
                <input
                  type="text"
                  value={paymentURI}
                  readOnly
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
                <p>
                  <a href={paymentURI} target="_blank" rel="noopener noreferrer">Ouvrir le lien</a>
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
