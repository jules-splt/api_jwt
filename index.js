import express from 'express';
import pool from './db.js';

const app = express();
const port = 3000;

app.use(express.json());

// Accueil
app.get('/', (req, res) => {
  res.send('H');
});

// Inscription
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email === "string" && typeof password === "string") {
    try {
      await pool.query('INSERT INTO users (email, pass) VALUES ($1, $2)', [email, password]);
      res.status(201).json({ message: "User created" });
    } catch (err) {
      console.error(err);
      res.status(409).json({ message: "User already exists or conflict" });
    }
  } else {
    res.status(400).json({ message: "Bad Request: email and password required" });
  }
});

// Connexion
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email === "string" && typeof password === "string") {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result.rows[0];
      if (user.pass !== password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ message: "Login successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "Bad Request: email and password required" });
  }
});

// Profil
app.get('/profile', (req, res) => {
  const token = req.headers.authorization;

  if (!token || token !== "token-exemple") {
    return res.status(401).json({ message: "Unauthorized: token missing or invalid" });
  }

  res.status(200).json({ email: "user@example.com", profile: "standard" });
});

// Atricle
app.get('/articles', async (req, res) => {
  let articles = {}
  let dbdata = await pool.query(`select id, auteur, titre, contenu, datePubli from Articles`)
  if (dbdata.rowCount <=0) {res.status(404).json({message:"not found"})}
  dbdata.rows.forEach(element => {
      articles[element.id]={
          auteur: element.auteur,
          titre: element.titre,
          contenu: element.contenu,
          datepubli: element.datepubli,
      }
  });
  res.status(200).json({message:articles})
});

// Article{id}
app.get('/articles/:id', async (req, res) => { // info de l'utilisateur
  let dbdata = await pool.query(`select id, auteur, titre, contenu, datePubli from Articles where Articles.id=$1`,[req.params.id])
  if (dbdata.rowCount <=0) {res.status(404).json({message:"not found"})}
  res.status(200).json({
      id: dbdata.rows[0].id,
      auteur: dbdata.rows[0].auteur,
      titre: dbdata.rows[0].titre,
      contenu: dbdata.rows[0].contenu,
      datepubli: dbdata.rows[0].datepubli,
  });
});

// Middleware de gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
