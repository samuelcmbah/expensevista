import apiClient from "./apiClient";

export const getWalletBalance = async () => {
  const response = await apiClient.get("/wallet/balance");
  return response.data.balance as number;
}

export const getWalletTransactions = async () => {
  const res = await apiClient.get("/wallet/transactions");
  return res.data as any[];
}

export const initiateTransfer = async (recipientCode: string, amount: number, reason?: string) => {
  const res = await apiClient.post("/transfer/initiate", { recipientCode, amount, reason });
  return res.data;
}

export const createRecipient = async (name: string, accountNumber: string, bankCode: string) => {
  const res = await apiClient.post("//transfer/resolve", { name, accountNumber, bankCode });
  return res.data;
}