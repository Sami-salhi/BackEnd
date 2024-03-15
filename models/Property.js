const mongoose= require("mongoose");
const Schema = mongoose.Schema


const PropertySchema = new Schema({
    nom: String,
    type: String,
    description: String,
    adresse:{
        region : String,
        ville :String,
        zone : String,
        gps : String,
    },
    photos: [String],
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
            raison : String,
            justification : String,
            dateSignal: String,
        }
    ],
    operation : String,
    IsLocation:{
        valueLoc : Boolean,
        season : String,
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
    proprietaireDetail:{
        idProp: String,
        nomComplet: String,
        imgProfil : String,
        tel: String,
        email: String,
    },
    DateCreation : String,
    prixGlobal: Number,
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