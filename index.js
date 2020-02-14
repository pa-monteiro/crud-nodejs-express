const express = require('express');

const server = express();

server.use(express.json())

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Paloma", "email": "paloma.l.monteiro@gmail.com" }

const users = ['Paloma', 'Rony', 'Vinicius'];

//Middleware global para saber qual rota está sendo acessada, método e tempo de requisição.
server.use((req, res, next) => {
    console.time('Request')
    console.log(`Método: ${req.method}; URL: ${req.url}`);
     next();

    console.timeEnd('Request')  
});

//Checa se o usuario existe
function checkUserExists(req, res, next){
    if(!req.body.name) {
        return res.status(400).json({error: 'User name is required'})
    }

    return next();
}

//Checa se o id do usuario está no array
function checkUserinArray(req, res, next){
    const user = users[req.params.id];
    if(!user){
        return res.status(400).json({error: 'User does not exists '})
    }

    req.user = user;

    return next();
}

//Listagem de Users (index)
server.get('/users', (req, res) => {
    return res.json(users);
})

//Listagem de um unico usuario (show)
server.get('/users/:id', checkUserinArray, (req, res) => {
    // const { nome } = req.query; //pegar filtros
    const { id } = req.params; //pegar id

    return res.json(users[id])
});

//Criar usuario(store)
server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;

    users.push(name);

    return res.status(201).json(users);
});

//Update Atualizar(update)
server.put('/users/:id', checkUserExists, checkUserinArray, (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    users[id] = name;

    return res.json(users)
});

//Delete user(delete)
server.delete('/users/:id', checkUserinArray, (req, res) => {
    const { id } = req.params;
    
    users.splice(id, 1);

    return res.json(users);
})

server.listen(3000);