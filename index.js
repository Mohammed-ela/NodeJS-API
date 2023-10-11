// console.log("Bienvenue sur Node");

// const { createServer } = require('http') // Chargement du module http inclus dans Node

// const server = createServer((request, response) => {  // Création d’un serveur HTTP
//     response.end('Hello Node depuis un serveur HTTP')
// });

// server.listen(3000, () => console.log('Serveur lancé sur le port 3000')) // Lancement du serveur sur le port 3000 de l’ordinateur
require('dotenv').config()
const { PORT } = process.env

const express = require('express')

const app = express()


const signupMiddleware = (req,res,next)=>{
    console.log('la requête est passée par le middleware')
    next()

}
app.post('/admin/signup', signupMiddleware, (req,res) => {
//recuperer le JSON du body de la requête

    res.status(201).json({message:'tout va bien'})

})

app.listen(PORT, () => 
console.log(`Application lancée sur le port ${PORT} !!!`)

)