import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let userIds = 1;
let balanceIds = 1;
let sessionIds = 1;

let users = [];
let sessions = [];
let balances = [];

//skapar användaren
app.post("/users", (req, res) => {
  const { username, password } = req.body;

  const userId = userIds++;

  const user = { id: userId, username, password };
  users.push(user);

  const balance = { id: balanceIds++, userId: userId, amount: 100 };

  balances.push(balance);

  console.log(users);

  res.status(201).json({ message: "User created succesfully" });
});

//login som chekar array
app.post("/sessions", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const otp = Math.floor(10000 + Math.random() * 900000);
    sessions.push({ id: sessionIds++, userId: user.id, otp });
    res.json({ otp });
  } else {
    res.status(400).json({ message: "invalid credentials" });
  }
});

//kollar på kontots summa
app.post("/accounts", (req, res) => {
  const { otp } = req.body;

  const session = sessions.find((session) => session.otp === parseInt(otp));

  if (session) {
    const username = sessions.username;

    const userId = session.userId;

    const balance = balances.find((balance) => balance.userId == userId);

    res.json(400).json({ amount: balance.amount });
  } else {
    res.json(400).json({ message: "invalid OTP" });
  }
});

//skickar pengar till användarkonto
app.post("/me/accounts/transactions", (req, res) => {
  const { otp, amount } = req.body;
  const sessions = sessions.find((s) => s.otp === parseInt(otp));

  if (sessions) {
    const username = sessions.username;
    balances[username] += amount;
    res.json({ balances: balances[username] });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
