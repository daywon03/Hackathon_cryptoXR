import { AlephiumWalletProvider } from '@alephium/web3-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PaymentPage from './components/PaymentPage';
import { tokenFaucetConfig } from './services/utils';

function App() {
  return (
    <AlephiumWalletProvider
      theme='web95'
      network={tokenFaucetConfig.network}
      addressGroup={tokenFaucetConfig.groupIndex}
    >
      <Router>
        <Routes>
          {/* Home route */}
          <Route path="/" element={<Home />} />
          {/* Payment route */}
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </Router>
    </AlephiumWalletProvider>
  );
}

export default App;
