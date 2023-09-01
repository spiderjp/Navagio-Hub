const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const connection = mysql.createConnection(process.env.DATABASE_URL);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
  });

  

app.post('/submit-form', (req, res) => {

  const { name, phone, email } = req.body;

  // Verifique se todos os campos estão preenchidos
  if (!name || !phone || !email) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  // Verifique se o telefone contém apenas números
  if (!/^[0-9]+$/.test(phone)) {
    return res.status(400).send('O telefone deve conter apenas números.');
  }

  // Verifique se o e-mail contém '@'
  if (!email.includes('@')) {
    return res.status(400).send('O e-mail deve conter um "@".');
  }

  // Verifique se já existe um registro com o mesmo telefone ou e-mail
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

      // Se não houver duplicação, insira os dados na tabela
      connection.query(
        'INSERT INTO leads (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Erro no servidor.');
          }

          // Redirecione para a página de confirmação após a inserção bem-sucedida
          res.redirect('/html/confirmation_sendForm.html');
        }
      );
    }
  );
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
