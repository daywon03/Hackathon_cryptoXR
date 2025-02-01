import { web3, DUST_AMOUNT } from '@alephium/web3' 
import { testNodeWallet } from '@alephium/web3-test' 
import { deployToDevnet } from '@alephium/cli' 
import {PaymentLink } from '../../contracts/'

describe('PaymentLink Contract', () => {
  let contract: InstanceType<typeof PaymentLink> 
  let signer: Awaited<ReturnType<typeof testNodeWallet>> 

  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch) 
    signer = await testNodeWallet() 

    const deployments = await deployToDevnet() 
    contract = deployments.getInstance(PaymentLink, 0) 
    if (!contract) throw new Error('Le contrat PaymentLink n’a pas été déployé.') 
  }) 

  it('should allow a merchant to create a payment request', async () => {
    const merchant = (await signer.getAccounts())[0] 
    await signer.setSelectedAccount(merchant.address) 

    const paymentId = 12345n 
    const amount = 1000n 

    // Créer un paiement
    await contract.transact.createPayment({
      signer,
      attoAlphAmount: DUST_AMOUNT, // Frais de transaction
      args: { paymentId, amount },
    }) 

    // Vérifier que le paiement a été enregistré
    const merchantAddress = await contract.methods.getMerchant({ args: { paymentId } }) 
    const paymentAmount = await contract.methods.getAmount({ args: { paymentId } }) 

    expect(merchantAddress).toEqual(merchant.address) 
    expect(paymentAmount).toEqual(amount) 
  }) 

  it('should allow a customer to pay and complete the transaction', async () => {
    const accounts = await signer.getAccounts() 
    const merchant = accounts[0] 
    const customer = accounts[1] 

    const paymentId = 12345n 
    const amount = 1000n 

    // Créer un paiement (simuler le commerçant)
    await signer.setSelectedAccount(merchant.address) 
    await contract.transact.createPayment({
      signer,
      attoAlphAmount: DUST_AMOUNT,
      args: { paymentId, amount },
    }) 

    // Payer (simuler le client)
    await signer.setSelectedAccount(customer.address) 
    await contract.transact.pay({
      signer,
      attoAlphAmount: amount, // Montant exact du paiement
      args: { paymentId },
    }) 

    // Vérifier que le paiement a été supprimé
    const merchantAddress = await contract.methods.getMerchant({ args: { paymentId } }) 
    const paymentAmount = await contract.methods.getAmount({ args: { paymentId } }) 

    expect(merchantAddress).toEqual('0x0')  // Paiement supprimé
    expect(paymentAmount).toEqual(0n) 
  }) 
}) 