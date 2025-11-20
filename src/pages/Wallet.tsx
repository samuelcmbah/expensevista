import  { useEffect, useState } from "react";
import { getWalletBalance, getWalletTransactions } from "../services/walletService";
import TopUp from "../components/TopUp";
import TransferForm from "../components/TransferForm";

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [txns, setTxns] = useState<any[]>([]);

  const load = async () => {
    setBalance(await getWalletBalance());
    setTxns(await getWalletTransactions());
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1>Wallet</h1>
      <div>Balance: ₦{balance}</div>
      <TopUp />
      <TransferForm />
      <h2>History</h2>
      <ul>
        {txns.map(t => (
          <li key={t.id}>
            {t.createdAt} - {t.type} - ₦{t.amount} - {t.source} - {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
