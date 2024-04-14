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
            cuisine : Number,
            terrasse : Number,
            salleDeBains : Number,
            salans : Number,
            jardin : Boolean,
            garage : Boolean,
            immeuble : Boolean,
            environnement : {
                mer : Boolean,
                parking : Boolean,
            }
        }
    },
    IsIndustriel : {
        ValueIndustrie : Boolean,
        content:{
            Bureaux : Boolean,
            sanitaires : Boolean,
            parking : Boolean,
            situeZoneIndustrie : Boolean,
        }
    },
    IsZoneTouristique : {
        ValueTouristique : Boolean,
        content :{
            plage : Boolean,
        },
        offre:{
            hotel : Boolean,
            restaurant : Boolean,
            bars : Boolean,
            centreCommerciaux : Boolean,
            activitySportives : Boolean,
        }
    },
    IsStudio :{
        ValueStudio : Boolean,
        content : {
            NbrePersoneMax : Number,
            meublé : Boolean,
            spacieux : Boolean,
            lumineux : Boolean,
            specification : {
                cuisine : Boolean,
                salleDeBain : Boolean,
                terrace : Boolean,
            },
        }
    },
    IsTerrain : {
        ValueTerrain : Boolean,
        content : {
            espaceEnHectare : Number,
            plat : Boolean,
            fertile : Boolean,
            irriguéParPuits : Boolean,
            routeGoudronnée : Boolean,
            terrainBoisé : Boolean,
            typeArbres : String,
        },
    },
    isLocalCommercial : {
        ValueLocalCommercial : Boolean,
        content : {
                ZoneCommAchalandee : Boolean,
                transportPublic : Boolean,
                parking : Boolean,
                lumineux : Boolean,
                spacieux : Boolean,
        },
    },
    IsBureau : {
        ValueBureau : Boolean,
        content : {
            ApprocheTransportPublic : Boolean,
            ApprocheAdministrations : Boolean,
            lumineux : Boolean,
            spacieux : Boolean,
            ImmeubleRecent : Boolean,
            specification : {
                kitchenette : Boolean,
                salleAttente : Boolean,
                sanitaire : Boolean,
            },
        },
    },
    idProprietaire : String,
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