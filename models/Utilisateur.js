const mongoose= require("mongoose");
const Schema = mongoose.Schema

const UserSchema = new Schema({
    nom: String,
    prenom: String,
    DateNaissance: String,
    ComeQui :String,
    Cin: String,
    NumTel: String,
    auth: {
        email : String,
        password: String,
        dateModification: String
    },
    ImgProfil: String,
    EtatCompte: String
})


const Utilisateurs = mongoose.model("Utilisateurs" , UserSchema)
module.exports = Utilisateurs