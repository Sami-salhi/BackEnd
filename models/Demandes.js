const mongoose= require("mongoose");
const Schema = mongoose.Schema


const DemandeSchema = new Schema({
    idProperty: String,
    type: String,
    idClient: String,
    CinClient: String,
    operation :String,
    InfoClient:{
        nom: String,
        nomArab: String,
        prenom: String,
        prenomArab: String
    },
    Coordonnées :{
        NumeroTel : String,
        gmail: String
    },
    IsLocation : {
        valueLoc : Boolean,
        periodeRequise : String,
        DateDebut : String,
        DateFin : String
    },
    IsAchat : {
        valueAchat : Boolean,
        montantPropose : String
    },
    idConcernéProprietaire: String,
    CinProprietaire:String,
    infoProprietaire:{
        nom : String,
        prenom : String,
        NumeroTel : String,
        gmail: String
    },
    dateDemande: String,
    decision:{
        valueDec : String,
        dateDec : String
    }
})


const Demandes = mongoose.model("Demandes" , DemandeSchema)
module.exports = Demandes