console.log("Bienvenue sur Node");

const { createServer } = require('http') // Chargement du module http inclus dans Node

const server = createServer((request, response) => {  // Création d’un serveur HTTP
    response.end('Hello Node depuis un serveur HTTP')
});

server.listen(3000, () => console.log('Serveur lancé sur le port 3000')) // Lancement du serveur sur le port 3000 de l’ordinateur