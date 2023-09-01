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



//SENDING DATAS TO LEADS TABLE

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit-form', (req, res) => {
    
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
            return res.redirect(`/public/html/confirmation-sendForm.html?name=${name}`);
        }
    });
});



//  SEARCHING ALL REGISTERS IN LEADS TABLE

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



//  SEARCHING ONE REGISTER IN LEADS TABLE

app.get('/leads/search', (req, res) => {
    const { name } = req.query;
    const selectLeadsByNameQuery = `
        SELECT * FROM leads WHERE name = ?
    `;

    connection.query(selectLeadsByNameQuery, [name], (error, results) => {
        if (error) {
            console.error('Erro ao consultar dados:', error);
            return res.status(500).json({ error: 'Erro ao processar a requisição.' });
        } else {
            return res.status(200).json(results);
        }
    });
});



//  DELETING ONE REGISTER IN LEADS TABLE

app.delete('/leads/:id', (req, res) => {
    const { id } = req.params;
    const deleteLeadQuery = `
        DELETE FROM leads WHERE id = ?
    `;

    connection.query(deleteLeadQuery, [id], (error, results) => {
        if (error) {
            console.error('Erro ao excluir registro:', error);
            return res.status(500).json({ error: 'Erro ao processar a requisição.' });
        } else {
            return res.status(200).json({ message: 'Registro excluído com sucesso.' });
        }
    });
});


app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000.');
});


