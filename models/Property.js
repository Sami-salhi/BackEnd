const mongoose= require("mongoose");
const Schema = mongoose.Schema


const PropertySchema = new Schema({
    nom: String,
    type: String,
    CodeImmo : String,
    description: String,
    region : String,
    ville :String,
    zone : String,
    gps : String,
    photos: {
        imgPrincipal : String,
        imgSecondaire1 : String,
        imgSecondaire2 : String,
        imgSecondaire3 : String,
        imgSecondaire4 : String,
    },
    ImgDocCertificat: String,
    evaluer:{
        value: String,
        listeEvaluateurs:[
            {
                idClient: String,
                nomComplet : String,
                notation : String,
                dateRating : String,
            }
        ]
    },
    signaler:[
        {
            idClient :String,
            nomComplet : String,
            ImgClient : String,
            raison : String,
            justification : String,
            dateSignal: String,
        }
    ],
    operation : String,
    IsLocation:{
        valueLoc : Boolean,
        periode : String,
        prix: Number,
    },
    IsVendre : {
        valueVendre : Boolean,
        prix : Number,

    },
    features:{
        espace : String,
    },
    IsResidence:{
        ValueResid : Boolean,
        nbChambre: Number,
        specification:{
            bedRoom : Number,
            piscine : Boolean,
        }
    },
    idProprietaire: String,
    proprietaireDetail:{
        idProp: String,
        nomComplet: String,
        imgProfil : String,
        tel: String,
        email: String,
    },
    DateCreation : String,
    prixGlobal: Number,
    statutImmo: String,
    offreDemande:[
        {
            idDmd : String,
            idClient : String,
            nomComplet : String,
            prixPropose : Number,
            dateOffre : String,
            statut : String,
        }
    ]  
})


const Property = mongoose.model("Property" , PropertySchema)
module.exports = Property