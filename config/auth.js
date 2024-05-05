const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")

// Model de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport){
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
        Usuario.findOne({ email: email }).then((usuario) => {
            if(!usuario){
                return done(null,false, {message: "Esta conta não existe"})
            }
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if(erro) {
                    return done(erro)
                }
                if(batem) {
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        }).catch(err => done(err));
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id)
            .then(usuario => {
                done(null, usuario);
            })
            .catch(err => {
                done(err, null);
            });
    })
}