import { useState } from "react";
import { createRecipient, initiateTransfer } from "../services/walletService";

export default function TransferForm() {
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [recipientCode, setRecipientCode] = useState("");

  const resolve = async () => {
    const res = await createRecipient(name, accountNumber, bankCode);
    setRecipientCode(res.recipient_code);
    alert("Recipient created: " + res.name);
  };

  const send = async () => {
    if (!recipientCode) return alert("Create or enter a recipient first");
    const res = await initiateTransfer(recipientCode, amount, `Transfer to ${recipientCode}`);
    alert("Transfer initiated: " + JSON.stringify(res));
  };

  return (
    <div>
      <h3>Send Money</h3>
      <div>
        <input placeholder="Recipient name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Account number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
        <input placeholder="Bank code" value={bankCode} onChange={e => setBankCode(e.target.value)} />
        <button onClick={resolve}>Create Recipient</button>
      </div>

      <hr/>

      <div>
        <input placeholder="Recipient code" value={recipientCode} onChange={e => setRecipientCode(e.target.value)} />
        <input type="number" placeholder="Amount (NGN)" value={amount} onChange={e => setAmount(Number(e.target.value))} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
