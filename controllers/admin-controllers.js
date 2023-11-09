const User = require('../model/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const mailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

module.exports = {
    checkAuthPayload: (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Adresse e-mail ou mot de passe manquant' });
        }

        req.email = email;
        req.password = password;
        next();
    },

    checkEmailPayload: (req, res, next) => {
        const { email } = req;

        if (!mailPattern.test(email)) {
            return res.status(400).json({ message: 'Format d\'e-mail invalide' });
        }

        next();
    },

    checkPasswordPayload: (req, res, next) => {
        const { password } = req;

        if (!passwordPattern.test(password)) {
            const errors = [];

            if (!/(?=.*?[A-Z])/.test(password)) {
                errors.push("Le mot de passe doit contenir au moins une lettre majuscule.");
            }
            if (!/(?=.*?[a-z])/.test(password)) {
                errors.push("Le mot de passe doit contenir au moins une lettre minuscule.");
            }
            if (!/(?=.*?[0-9])/.test(password)) {
                errors.push("Le mot de passe doit contenir au moins un chiffre.");
            }
            if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
                errors.push("Le mot de passe doit contenir au moins un caractère spécial.");
            }
            if (password.length < 8) {
                errors.push("Le mot de passe doit avoir au moins 8 caractères.");
            }

            return res.status(400).json({ message: "Votre mot de passe n'est pas conforme", errors });
        }

        next();
    },

    signupResponse: async (req, res) => {
        try {
            const { email, password } = req;

            const newUser = new User({
                email,
                ingredients: [],
            });

            newUser.setPassword(password);

            const savedUser = await newUser.save();
            if (!savedUser) throw new Error("Erreur lors de l'enregistrement de l'utilisateur.");

            const token = savedUser.generateJWT();

            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error('Utilisateur déjà existant.');

            res.status(201).json({ message: 'Utilisateur enregistré avec succès.', token });
        } catch (error) {
            let status = 500;
            let message = 'Erreur inattendue.';
            if (error.message === 'Utilisateur déjà existant.') status = 400;

            console.error(new Date().toISOString(), 'controllers/admin-controllers.js > signupResponse > error ', error);

            return res.status(status).json({ message });
        }
    },
};
