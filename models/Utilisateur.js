const mongoose= require("mongoose");
const Schema = mongoose.Schema

const UserSchema = new Schema({
    nom: String,
    prenom: String,
    DateNaissance: String,
    ComeQui :String,
    Cin: String,
    NumTel: String,
    userName: String,
    auth: {
        email : String,
        password: String,
        dateModification: String
    },
    ImgProfil: String,
    EtatCompte: String,
    isActive:{
        status: Boolean,
        codeActivation: String,
        codeConfirmation: String,
    },
    myFavorite:{
        idProperty: String,
        nomProperty: String,
        typePropeerty: String,
        dateFavorise: String,
    },
    isAdmin : {
        type : Boolean,
        default : false,
    }
})


const Utilisateurs = mongoose.model("Utilisateurs" , UserSchema)
module.exports = Utilisateurs