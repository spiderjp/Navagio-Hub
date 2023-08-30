require('dotenv').config();
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((error) => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } else {
        console.log('Conectado ao PlanetScale!');
    }
});



//CREATING TABLE IN DATABASE CONNECTED

/*const createLeadsTableQuery = `
    CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(255) NOT NULL
    )
`;

connection.query(createLeadsTableQuery, (error, results) => {
    if (error) {
        console.error('Erro ao criar tabela:', error);
    } else {
        console.log('Tabela "leads" criada ou já existe.');
    }
});*/



//SENDING DATAS TO LEADS TABLE

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Todos os campos devem ser preenchidos.' });
    }

    if (!/^\d+$/.test(phone)) {
        return res.status(400).json({ error: 'Campo telefone preenchido incorretamente, por favor arrume antes de enviar.' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Campo e-mail preenchido incorretamente, por favor arrume antes de enviar.' });
    }

    const insertLeadQuery = `
        INSERT INTO leads (name, phone, email)
        VALUES (?, ?, ?)
    `;

    connection.query(insertLeadQuery, [name, phone, email], (error, results) => {
        if (error) {
            console.error('Erro ao inserir dados:', error);
            return res.status(500).json({ error: 'Erro ao processar a requisição.' });
        } else {
            return res.status(200).json({ message: 'Dados inseridos com sucesso.' });
        }
    });
});



//SEARCHING IN LEADS TABLE ALL REGISTERS

app.get('/leads', (req, res) => {
    const selectLeadsQuery = `
        SELECT * FROM leads
    `;

    connection.query(selectLeadsQuery, (error, results) => {
        if (error) {
            console.error('Erro ao consultar dados:', error);
            return res.status(500).json({ error: 'Erro ao processar a requisição.' });
        } else {
            return res.status(200).json(results);
        }
    });
});



app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000.');
});


