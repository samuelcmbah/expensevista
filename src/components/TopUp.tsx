import { useState } from "react";
import { initializeTopUp } from "../services/paystackService";

export default function TopUp() {
  const [amount, setAmount] = useState<number>(1000);
  const [email, setEmail] = useState<string>("test@example.com");

  const start = async () => {
    const url = await initializeTopUp(email, amount);
    // redirect user to Paystack checkout
    window.location.href = url;
  };

  return (
    <div>
      <h3>Top Up Wallet</h3>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
      <button onClick={start}>Pay with Paystack</button>
    </div>
  );
}
