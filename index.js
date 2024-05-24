const express = require("express");
const bodyParser = require("body-parser");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const path = require("path");
const app = express();
const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
const { auth } = require("firebase-admin");

// const signInWithEmailAndPassword = require("firebase/auth");
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Initialize Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const firebaseConfig = {
  apiKey: "AIzaSyAMuymXKCQ3qdCc0OoFLAJocB7OJAuqgaA",
  authDomain: "express-auth-71381.firebaseapp.com",
  projectId: "express-auth-71381",
  storageBucket: "express-auth-71381.appspot.com",
  messagingSenderId: "361663031242",
  appId: "1:361663031242:web:3010b4e632f20be7719133",
};

firebase.initializeApp(firebaseConfig);
// Handle POST request to /signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
    });
    res.status(201).json({ userId: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Handle POST request to /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const userId = userCredential.user.uid;
    res.status(200).json({ userId });
    // res.redirect("/dashboard");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// app.get("/dashboard", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "dashboard.html"));
// });
// app.get("/dashboard", async (req, res) => {
//   const userId = req.query.userId;
//   try {
//     // Retrieve user data from Firebase Admin SDK
//     const user = await firebaseAdmin.auth().getUser(userId);
//     const email = user.email;
//     res.send(`<h2>Welcome to Dashboard</h2><p>Email: ${email}</p>`);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const userCredential = await firebase
//       .auth()
//       .signInWithEmailAndPassword(email, password);
//     const userId = userCredential.user.uid;
//     res.redirect(`/dashboard?userId=${userId}`);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
