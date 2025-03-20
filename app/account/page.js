"use client";
import { useLogin } from "@/context/LoginContext";
import { useState, useEffect } from "react";

export default function Account() {
  const [balance, setBalance] = useState(0);
  const { otp, setOtp } = useLogin(); // hämta istället i context
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(otp);

  async function fetchBalance() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      console.log("amount", data.amount);
      setBalance(data.amount);
      setError("");
    } catch (error) {
      setError("Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  }

  async function depositMoney() {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/me/accounts/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp, amount: Number(amount) }),
        }
      );
      const data = await response.json();
      setBalance(data.balance);
      setError("");
    } catch (error) {
      setError("Failed to deposit money");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (otp) {
      fetchBalance();
    }
  }, [otp]);

  return (
    <div>
      <h1>Kontosida</h1>
      <p>Saldo: {balance}</p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Engångslösenord"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="p-2 border rounded-md"
      />
      <input
        type="number"
        placeholder="Belopp att sätta in"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border rounded-md"
      />
      <button
        onClick={depositMoney}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Sätt in pengar
      </button>
    </div>
  );
}
