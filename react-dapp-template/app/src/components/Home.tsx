import { useState, useEffect } from 'react'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react'
import { getAddressBalance } from '../services/alephiumService'
// import { tokenFaucetConfig } from '../services/utils'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { connectionStatus, account } = useWallet()
  const [amount, setAmount] = useState<number>(0)
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy') // State for the button text

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value))
  }

  // Generate payment URI
  const paymentURI = account && account.address && amount > 0
    ? `http://localhost:5173/payment?address=${account.address}&amount=${amount}`
    : ''

  // Copy to clipboard function
  const copyToClipboard = async () => {
    if (paymentURI) {
      try {
        await navigator.clipboard.writeText(paymentURI)
        setCopyButtonText('Copied!') // Change the button text to "Copied!"
        setTimeout(() => setCopyButtonText('Copy'), 2000) // Revert back to "Copy" after 2 seconds
      } catch (error) {
        console.error('Failed to copy text:', error)
      }
    }
  }

  return (
    <div className={styles.container}>
      <AlephiumConnectButton />

      {connectionStatus === 'connected' && (

        <div className={styles.main}>
          <div className={styles.paymentSection}>
            <h2 className={styles.header}>Payment Request</h2>
            <p className={styles.address}>Address: {account.address}</p>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount in ALPH"
              className={styles.amountInput}
            />
            {paymentURI && (
              <div className={styles.paymentLink}>
                <p className={styles.linkDescription}>Use this link to make the payment:</p>
                <input
                  type="text"
                  value={paymentURI}
                  readOnly
                  className={styles.paymentInput}
                />
                <div className={styles.copyContainer}>
                  <button onClick={copyToClipboard} className={styles.copyButton}>
                    {copyButtonText} {/* Display "Copy" or "Copied!" based on state */}
                  </button>
                </div>
                <a href={paymentURI} target="_blank" rel="noopener noreferrer" className={styles.paymentButton}>
                  Open Link
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
