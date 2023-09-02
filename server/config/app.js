const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const connection = mysql.createConnection(process.env.DATABASE_URL);


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.redirect('/public/html/index.html');
  });
  

app.post('/submit-form', (req, res) => {

  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  if (!/^[0-9]+$/.test(phone)) {
    return res.status(400).send('O telefone deve conter apenas números.');
  }

  if (!email.includes('@')) {
    return res.status(400).send('O e-mail deve conter um "@".');
  }

  connection.query(
    'SELECT * FROM leads WHERE phone = ? OR email = ?',
    [phone, email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro no servidor.');
      }

      if (results.length > 0) {
        return res.status(400).send('Este telefone ou e-mail já está cadastrado.');
      }

      console.log('Iniciando inserção no banco de dados...');
      connection.query(
        'INSERT INTO leads (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email],
        (err) => {
          if (err) {
            console.error('Erro na inserção:', err);
            return res.status(500).send('Erro no servidor.');
          }
          console.log('Inserção bem-sucedida.');
          res.redirect('../../public/html/successfulformsubmission.html');
        }
      );
    }
  );
});

