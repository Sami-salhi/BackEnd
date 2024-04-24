const express = require("express");
const mongoose = require("mongoose");
const {format} = require('date-fns');
const app = express();

const bodyParser = require('body-parser');

const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const cookieParsar = require("cookie-parser");

const cors = require("cors");


mongoose.connect("mongodb+srv://sami:sami21032000@myapp.mfxyigl.mongodb.net/?retryWrites=true&w=majority&appName=MyApp")
.then(()=>{
    console.log("dataBase Connect");
})
.catch((error)=>{
    console.log("connexion BD Failed",error);
})

const Utilisateurs =require("./models/Utilisateur");
const { sendConfirmationEmail } = require("./routes/nodemailer");
const Property = require("./models/Property");
const Demandes = require("./models/Demandes");
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParsar());
app.use(cors({
    origin :"http://localhost:3000" || "http://192.168.1.66:3000",
    methods:["GET", "POST", "PUT", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
}))


const jwt_Secret_Key = "8hEnPGeoBqGUT6zksxt4G95gW+uMdzwe7EVaRnp0xRI="
function generateCodeConfirmation() {
    const numberCode = "012345678";
    let activationCode ="";
    for(let i = 0;i<6;i++){
    activationCode += numberCode[Math.floor(Math.random()*numberCode.length)];
    }
 return activationCode;
}

function generateCodeActivation() {
    const numberCode = "012345678abcdefghijklmnopqrstuvwxyz";
    let activationCode ="";
    for(let i = 0;i<20;i++){
    activationCode += numberCode[Math.floor(Math.random()*numberCode.length)];
    }
 return activationCode;
}



app.get("/code",  (req,res)=>{
    let code =  generateCodeConfirmation();
    res.send(code);
})






app.post("/user",async (req,res)=>{
    const newUser = new Utilisateurs()
    newUser.nom="sami"
    newUser.prenom="salhi"
    newUser.DateNaissance="21/03/2000"
    newUser.ComeQui="client"
    newUser.Cin=""
    newUser.NumTel="95724408"
    newUser.auth.email="samisalhi@gmail.com"
    newUser.auth.password="fjsdjyfufsdf"
    newUser.auth.dateModification = "21/03/2000"
    newUser.ImgProfil="skfjkdshfksdhg.jpg"
    newUser.EtatCompte="Active"
    await newUser.save()

    res.send("created")
})



app.post("/Createuser",async (req,res)=>{
    
    const newUser = new Utilisateurs()

    const data = req.body;
    newUser.nom=data.nom
    newUser.prenom=data.prenom
    newUser.DateNaissance=data.naissance
    newUser.ComeQui=data.comme
    newUser.Cin=""
    newUser.NumTel=data.numeroTel
    newUser.auth.email=data.gmail
    newUser.auth.password=data.motDpasse
    newUser.auth.dateModification =data.dateMof
    newUser.ImgProfil=data.Img
    newUser.EtatCompte="Active"
    await newUser.save()

    res.send("created successfilly")
})










/* manipulation property */
/* ################### start function generate code immo ################### */
function generateCodeNewImmo() {
    const numberCode = "012345678abcdefghijklmnopqrstuvwxyz";
    let CodeImmo ="";
    for(let i = 0;i<8;i++){
        CodeImmo += numberCode[Math.floor(Math.random()*numberCode.length)];
    }
 return CodeImmo;
}
/* ################### end function tgenerate code immo ################### */

/* ################### start function testing is residsence ou non ################### */
function IsResidence(typeImmo) {
    switch (typeImmo) {
        case 'Appartement':
            return true;
            break;
        case 'Bureau':
            return false;
            break;
        case 'Local commercial':
            return false;
            break;
        case 'duplex':
            return true;
            break;
        case 'Ferme Agricole':
            return false;
            break;
        case 'Entrepot':
            return false;
            break;
        case 'Etage de villa':
            return true;
            break;
        case 'Local industriel':
            return false;
            break;
        case 'Immeuble':
            return true;
            break;
        case 'Maison':
            return true;
            break;
        case 'Studio':
            return false;
            break;
        case 'Terrain':
            return false;
            break;
        case 'Villa':
            return true;
            break;
        case "Maison d'hote":
            return true;
            break;
            
        default:
            return false;
    }
}
function PiscineIsExist(pis) {
    if(pis ==="Oui"){
        return true
    }else{
        return false
    }
    
}
function isIndustrielle(type) {
    if(type === "Local industriel"){
        return true
    }else{
        return false
    }   
}
function IsStudio(type) {
    if(type === "Studio"){
        return true
    }else{
        return false
    }   
}
function IsTerrain(type) {
    if(type === "Terrain" || type === "Ferme Agricole"){
        return true
    }else{
        return false
    } 
}
function IsZoneTouristique(type){
    if(type === "Zone touristique"){
        return true
    }else{
        return false
    } 
}
function IsLocalCommercial(type){
    if(type === "Local commercial"){
        return true
    }else{
        return false
    } 
}
function IsBureau(type) {
    if(type === "Bureau"){
        return true
    }else{
        return false
    }
}
function testNbre(value){
    if(value > 0){
        return true
    }else{
        return false
    }

}
function testValue(value){
    if(value === "oui"){
        return true
    }else{
        return false
    }
}
async function generateDescriptionImmo(typeImmo , data) {
    /* #################### start description for appartement #################### */
    var salleDeBains =""
    var bedRoom =""
    var cuisine =""
    var salans=""
    var terrasse =""
    var mer =""
    var resImmeuble =""
  if(testNbre(data.bain)){
        salleDeBains =data.bain+" salle de bain";
  }else{
        salleDeBains ="";
  }

  if(testNbre(data.bedRoom)){
        bedRoom =", "+data.bedRoom+" chambre à coucher ";
    }else{
        bedRoom ="";
    }

    if(testNbre(data.cuisine)){
        cuisine =", "+"une cuisine ";
    }else{
        cuisine ="";
    }

    if(data.salans == 1){
        salans =", un salans ";
    }else if(data.salans > 1){
        salans =", "+data.salans+" salans ";
    }
    else{
        salans ="";
    }

    if(testNbre(data.terrasse)){
        terrasse =", une terrasse avec un vue imprenable ";
    }else{
        terrasse ="";
    }
    if(testValue(data.mer)){
        mer=" sur la mer"
    }else{
        mer=""
    }
    if(testValue(data.resImmeuble)){
        resImmeuble=" , l'appartement est immeublé "
    }else{
        resImmeuble =""
    }
    /* #################### end description for appartement #################### */

     /* #################### start description for bureau #################### */
        var lumineux =""
        var spacieux =""
        var bureaulumineuxSpacieux=""
        var Approche =""
        var concat=""
        var ApprocheTransportPublicText =""
        var ApprocheAdministrationsText =""
        if(testValue(data.isBureauLumineux)){
            lumineux=" lumineux "
        }else{
            lumineux =""
        }
        if(testValue(data.isBureauSpacieux)){
            spacieux=" spacieux "
        }else{
            spacieux =""
        }
        if(testValue(data.isBureauSpacieux) || testValue(data.isBureauLumineux)){
            bureaulumineuxSpacieux=" . Le bureau est"
        }else{
            bureaulumineuxSpacieux =""
        }
        var complement =""
        if(bureaulumineuxSpacieux !=""){
            complement = ",avec un de grandes fenetres"
        }else{
            complement=""
        }

        if(testValue(data.isBureauApprocheTransportPublic) || testValue(data.isBureauApprocheAdministrations)){
            Approche=" à proximité "
        }else{
            Approche =""
        }
        if(testValue(data.isBureauApprocheTransportPublic) && testValue(data.isBureauApprocheAdministrations)){
            concat=" et"
        }else{
            concat =""
        }

        if(testValue(data.isBureauApprocheTransportPublic)){
            ApprocheTransportPublicText=" des transports en commun"
        }else{
            ApprocheTransportPublicText =""
        }
        if(testValue(data.isBureauApprocheAdministrations)){
            ApprocheAdministrationsText=" des administrations "
        }else{
            ApprocheAdministrationsText =""
        }

        var pieceBureau = 0
        var kitchenetteBureau=""
        var SalleAttenteBureau=""
        var SanitaireBureau =""
        if(testValue(data.isBureauSpecificationkitchenette)){
            pieceBureau=pieceBureau+1 ;
            kitchenetteBureau = " kitchenette";
        }
        if(testValue(data.isBureauSpecificationSalleAttente)){
            pieceBureau=pieceBureau+1 ;
            SalleAttenteBureau=" salle d'attente";
        }
        if(testValue(data.isBureauSpecificationSanitaire)){
            pieceBureau=pieceBureau+1 ;
            SanitaireBureau =" sanitaire"
        }
        var TextBureauPieces =""
        if(testValue(data.isBureauSpecificationkitchenette) || testValue(data.isBureauSpecificationSalleAttente) || testValue(data.isBureauSpecificationSanitaire)){
            TextBureauPieces=" dispose de "+pieceBureau+" pièces, d'une "
        }else{
            TextBureauPieces =""
        }

        var bureauImmeublé=""
        if(testValue(data.isBureauImmeubleRecent)){
            bureauImmeublé=". Situé dans un immeuble récent";
        }else{
            bureauImmeublé="";
        }
     /* #################### end description for bureau #################### */

     /* #################### start description for local commercial #################### */
        var ZoneCommAchalandeeText =""
        if(testValue(data.LocalCommZoneCommAchalandee)){
            ZoneCommAchalandeeText=". Le local est idéalement situé a zone commercante achanlandée ";
        }else{
            ZoneCommAchalandeeText="";
        }

        var proximité=""
        var TransportOublic=""
        var parking=""
        if(testValue(data.LocalCommTransportPublic) || testValue(data.LocalCommParking)){
            proximité=", à proximité";
        }else{
            proximité="";
        }

        var concatProximité =""
        if(testValue(data.LocalCommTransportPublic) && testValue(data.LocalCommParking)){
            concatProximité=" et ";
        }else{
            concatProximité="";
        }

        if(testValue(data.LocalCommTransportPublic)){
            TransportOublic=" des transports en commun ";
        }else{
            TransportOublic="";
        }
        if(testValue(data.LocalCommParking)){
            parking=" des parkings ";
        }else{
            parking="";
        }

        var LuniSpacieux =""
        if(testValue(data.LocalCommLumineux) || testValue(data.LocalCommSpacieux)){
            LuniSpacieux=". Il est";
        }else{
            LuniSpacieux="";
        }

        var ConcatLumiSpacieux =""
        if(testValue(data.LocalCommLumineux) && testValue(data.LocalCommSpacieux)){
            ConcatLumiSpacieux="et";
        }else{
            ConcatLumiSpacieux="";
        }

        var LocCommLumineux =""
        var LocCommSpacieux =""
        if(testValue(data.LocalCommLumineux)){
            LocCommLumineux=" lumineux ";
        }else{
            LocCommLumineux="";
        }
        if(testValue(data.LocalCommSpacieux)){
            LocCommSpacieux=" spacieux ";
        }else{
            LocCommSpacieux="";
        }
        var complement2=""
        if(LuniSpacieux !==""){
            complement2=", avec une grande vitrine et une surface de vente aménagée."
        }
     /* #################### end description for local commercial #################### */

     /* #################### start description for  duplex #################### */
        var packingResid =""
        if(testValue(data.parking)){
            packingResid=" un parking.";
        }else{
            packingResid="";
        }
        var merDuplex =""
        if(testValue(data.mer)){
            merDuplex=" la mer"
        }else{
            merDuplex=""
        }
        var merParking =""
        if(testValue(data.parking) || testValue(data.mer)){
            merParking="donnant sur";
        }else{
            merParking="";
        }

        var concatMerParking =""
        if(testValue(data.parking) && testValue(data.mer)){
            concatMerParking=", et";
        }else{
            concatMerParking="";
        }

        var piscineExist =""
        if(testValue(data.piscine)){
            piscineExist=" avec un piscine";
        }else{
            piscineExist="";
        }
        var jardinExist =""
        if(testValue(data.jardin)){
            jardinExist=" & comporte un jardin";
        }else{
            jardinExist="";
        }
     /* #################### end description for duplex #################### */

     /* #################### start description for local industrie #################### */
        var BureauxIndustrie =""
        var sanitairesIndustrie = ""
        var parkingIndustrie =""
        var situeZoneIndustrie =""
        if(testValue(data.BureauxContentIndustrie)){
            BureauxIndustrie=" de bureaux,";
        }else{
            BureauxIndustrie="";
        }

        if(testValue(data.sanitairesContentIndustrie)){
            sanitairesIndustrie=" de sanitaire, ";
        }else{
            sanitairesIndustrie="";
        }

        if(testValue(data.parkingContentIndustrie)){
            parkingIndustrie=" d'un parking,";
        }else{
            parkingIndustrie="";
        }

        if(testValue(data.situeZoneIndustrie)){
            situeZoneIndustrie=". Situé dans une zone industrielle accessible,";
        }else{
            situeZoneIndustrie="";
        }
     /* #################### end description for local industrie #################### */

      /* #################### start description for Maison #################### */
      var concatJardinCarage= ""
      if(jardinExist !="" && testValue(data.garage)){
        concatJardinCarage=" et"
      }
    var comporteMaison=""
      if(testValue(data.jardin) || testValue(data.garage)){
        comporteMaison=" comporte"
      }else{
        comporteMaison=""
      }
        var garage = ""
        if(testValue(data.garage)){
            garage=" un carage ";
        }else{
            garage="";
        }

        var jardin = ""
        if(testValue(data.jardin)){
            jardin=" un jardin ";
        }else{
            jardin="";
        }
       /* #################### end description for Maison #################### */

       /* #################### start description for studio #################### */
        var StudioMeuble =""
        if(testValue(data.StudioMeublé)){
            StudioMeuble="meublé";
        }else{
            StudioMeuble="";
        }
        var studioLumi = ""
        if(testValue(data.StudioLumineux)){
            studioLumi="lumineux";
        }else{
            studioLumi="";
        }

        var studioSpaciaux = ""
        if(testValue(data.StudioSpacieux)){
            studioSpaciaux="spacieux";
        }else{
            studioSpaciaux="";
        }

        var nbrePersonne = ""
        if(data.StudioNbrePersoneMax === 1){
            nbrePersonne="un personne";
        }else{
            nbrePersonne="de "+data.StudioNbrePersoneMax+" personne";
        }
        var contentStudio =""
        if(testValue(data.StudioSpacieux) || testValue(data.StudioLumineux)){
            contentStudio=". Le studio est ";
        }else{
            contentStudio="";
        }
        var speci =""
        if(contentStudio !="" ){
            speci=" et dispose d'une "
        }else{
            speci=""
        }
        var cuisineStudio =""
        var salleDeBainStudio =""
        var terraceStudio =""
        if(testValue(data.StudioSpecificationCuisine)){
            cuisineStudio="un cuisine équipée";
        }else{
            cuisineStudio="";
        }

        if(testValue(data.StudioSpecificationSalleDeBain)){
            salleDeBainStudio=" salle de bain";
        }else{
            salleDeBainStudio="";
        }

        if(testValue(data.StudioSpecificationTerrace)){
            terraceStudio=" un terrasse";
        }else{
            terraceStudio="";
        }
       /* #################### end description for studio #################### */

       /* #################### start description for Terrain #################### */
        var plattext =""
        var fertileText=""

        if(testValue(data.TerrainContentPlat)){
            plattext=" plat";
        }else{
            plattext="";
        }
        
        if(testValue(data.TerrainContentFertile)){
            fertileText=" fertile";
        }else{
            fertileText="";
        }

        var specTerrain =""
        if(testValue(data.TerrainContentFertile) || testValue(data.TerrainContentPlat)){
            specTerrain=". Le terrain est";
        }else{
            specTerrain="";
        }
        var concatPlatFertile =""
    
        if(testValue(data.TerrainContentFertile) && testValue(data.TerrainContentPlat)){
            concatPlatFertile=" et";
        }else{
            concatPlatFertile="";
        }

        var irrigueText =""
        var routeGoudronneText =""
        if(testValue(data.TerrainContentIrrigueParPuits)){
            irrigueText=", irrigué par un puits ";
        }else{
            irrigueText="";
        }

        if(testValue(data.TerrainContentRouteGoudronnee)){
            routeGoudronneText=", accessible par une route goudronnée .";
        }else{
            routeGoudronneText="";
        }
        var terrainBoiseText =""
        if(testValue(data.TerrainContentTerrainBoise)){
            terrainBoiseText=" Ce terrain est boisé ";
        }else{
            terrainBoiseText="";
        }
        var typeArbreText =""
        if(terrainBoiseText != ""){
            typeArbreText=" par des arbres de "+data.TerrainContentTypeArbre;
        }else{
            typeArbreText="";
        }
        /* #################### end description for Terrain #################### */

        /* #################### start description for villa #################### */
        var jardinPrive =""
        if(testValue(data.jardin)){
            jardinPrive=" un jardin aménagé ";
        }else{
            jardinPrive="";
        }

        var piscinePrive=""
        if(testValue(data.piscine)){
            piscinePrive=" une piscine privée ,";
        }else{
            piscinePrive="";
        }
        var carageVille =""
        if(testValue(data.garage)){
            carageVille=" un garage plus large";
        }else{
            carageVille="";
        }
        var concatJardinCrage =""
        if(testValue(data.jardin) && testValue(data.garage)){
            concatJardinCrage="et";
        }else{
            concatJardinCrage="";
        }

        var villaImmeble =""
        if(testValue(data.resImmeuble)){
            villaImmeble=". Entièrement meublée et équipé,";
        }else{
            villaImmeble="";
        }
        /* #################### end description for villa #################### */

        /* #################### start description for zone touristique #################### */
        var plageSable=""
        if(testValue(data.zoneTouristContentPlage)){
            plageSable=", ce immobiliers dispose un plages de sable fin,";
        }else{
            plageSable="";
        }
        var hotelOffre =""
        var restaurantOffre =""
        var barsOffre =""
        var centreCommerciauxOffre =""
        var activitySportivesxOffre =""

        if(testValue(data.zoneTouristOffreHotel)){
            hotelOffre="une large gamme d'hotels,";
        }else{
            hotelOffre="";
        }

        if(testValue(data.zoneTouristOffreRestaurant)){
            restaurantOffre=" de restaurants,";
        }else{
            restaurantOffre="";
        }

        if(testValue(data.zoneTouristOffreBars)){
            barsOffre=" de bars,";
        }else{
            barsOffre="";
        }

        if(testValue(data.zoneTouristOffreCentreCommerciaux)){
            centreCommerciauxOffre=" de centres commerciaux ";
        }else{
            centreCommerciauxOffre="";
        }

        if(testValue(data.zoneTouristOffreActivitySportives)){
            activitySportivesxOffre=". vous y trouvez également des activités sportives et nautiques pour tous les gouts.";
        }else{
            activitySportivesxOffre="";
        }
         /* #################### end description for zone touristique #################### */
    switch (typeImmo) {
        case 'Appartement':
             
            return typeImmo+" à "+data.region+" est un appartement moderne de "+data.espace+" m² située à ville "+data.ville+". L'appartement dispose de "+data.NbreChambre+" chambres , "+salleDeBains+bedRoom+
            cuisine+salans+terrasse+mer+resImmeuble+" Entiérement rénovée avec des matériaux traditionnels"+" , il est idéal pour un peronne/couple ou pour les vaccances";
            break;
        case 'Bureau':
           
            return typeImmo+lumineux+" à "+data.region+"  est un bureau de "+data.espace+" m² située à ville "+data.ville+" ,"+Approche+ApprocheTransportPublicText+concat+ApprocheAdministrationsText+
            bureaulumineuxSpacieux+lumineux+spacieux+complement+TextBureauPieces+kitchenetteBureau+SalleAttenteBureau+SanitaireBureau+bureauImmeublé+", il est idéal pour une profession libérale ou une petite entreprise.";
            break;
        case 'Local commercial':
          
            return typeImmo+" à "+data.region+" est un local commercial attractif de "+data.espace+" m² située à ville "+data.ville+ZoneCommAchalandeeText+proximité+TransportOublic+concatProximité+parking+
            LuniSpacieux+LocCommLumineux+ConcatLumiSpacieux+LocCommSpacieux+complement2+". Il est idéal pour une boutique, bureau ou un restaurant...";
            break;
        case 'duplex':
           
            return typeImmo+" moderne à "+data.region+" est un duplex moderne de "+data.espace+" m² située à ville "+data.ville+". Le duplex dispose de "+data.NbreChambre+" chambres , "+salleDeBains+bedRoom+
            cuisine+"équipée"+salans+terrasse+merParking+merDuplex+concatMerParking+packingResid+". Situé dans une résidence sécurisée"+piscineExist+jardinExist+". Il est idéal pour une famille ou pour des vacances.";
            break;
        case 'Entrepot':
           
            return typeImmo+" moderne à "+data.region+" L'efficase est un entrepot moderne de "+data.espace+" m² située à ville "+data.ville+". L'entrepot est construit en matériaux durables et dispose d'une grande surface de stockage,"+
            "des bureaux, de quais de déchargement et d'un parking."+" Il est idéal pour une activité de stockage, des distribution ou de logistique";
            break;
        case 'Etage de villa':
            
            return typeImmo+" moderne à "+data.region+" est un etage de villa moderne de "+data.espace+" m² située à ville "+data.ville+". L'etage de villa dispose de "+data.NbreChambre+" chambres , "+salleDeBains+bedRoom+
            cuisine+salans+terrasse+merParking+merDuplex+concatMerParking+packingResid+". Situé dans une ville sécurisée"+piscineExist+jardinExist+". Il est idéal pour une famille ou pour des vacances.";
            break;
        case 'Local industriel':
            
            return typeImmo+" moderne à "+data.region+" Le spaciaux est un Local industriel moderne de "+data.espace+" m² située à ville "+data.ville+". le local dispose d'un grand espace ouvert,"+BureauxIndustrie+sanitairesIndustrie+
            parkingIndustrie+situeZoneIndustrie+" Il est idéal pour une activité de production, de stockage ou de distribution.";
            break;
        case 'Immeuble':
            
            return typeImmo+" moderne à "+data.region+" Le complexe est un immeuble moderne de "+data.espace+" m² située à ville "+data.ville+". L'immeuble dispose de "+data.NbreChambre+" chambres , "+salleDeBains+bedRoom+
            cuisine+salans+terrasse+mer+". Il est idéal pour une famille ou pour des vacances.";
            break;
        case 'Maison':
        
            return typeImmo+" moderne à "+data.region+"  est un maison moderne de "+data.espace+" m² située à ville "+data.ville+". La maison dispose de "+data.NbreChambre+" chambres , "+salleDeBains+bedRoom+
            cuisine+salans+terrasse+". Situé dans une ville"+comporteMaison+jardin+concatJardinCarage+garage+". Il est idéal pour une famille ou pour des vacances.";
            break;
        case 'Studio':
          
            return typeImmo+" "+StudioMeuble+" à "+data.region+" charmant studio "+StudioMeuble+" de "+data.espace+" m² située à ville "+data.ville+". Ce studio est idéal pour "+nbrePersonne+
            ". Il est situé dans un quartier calme et proche de toutes les commodités"+contentStudio+studioLumi+studioSpaciaux+speci+cuisineStudio+salleDeBainStudio+terraceStudio;
            break;
        case 'Terrain':
         
            return typeImmo+" à "+data.region+" Le fertile est un terrain agricole de "+data.TerrainContentEspaceEnHectare+" hectares située à ville "+data.ville+", une region agricole de la tunisie"+
            specTerrain+plattext+concatPlatFertile+fertileText+irrigueText+routeGoudronneText+terrainBoiseText+typeArbreText+". Il est idéal pour la culture de céréales, d'oliviers, de légumes ou de fruits...";
            break;
        case 'Ferme Agricole':
         
            return typeImmo+" à "+data.region+" La ferme prospère est une ferme agricole de "+data.TerrainContentEspaceEnHectare+" hectares située à "+data.ville+", une region agricole de la tunisie"+
            specTerrain+plattext+concatPlatFertile+fertileText+irrigueText+routeGoudronneText+terrainBoiseText+typeArbreText+". La ferme dispose également d'une maison d'habitation et de plusieurs batiments agricoles.";
            break;
        case 'Villa':
         
            return typeImmo+" Fleurie à "+data.region+" est une charmante villa de "+data.espace+" m² située à ville "+data.ville+", à proximité des commerces et des restaurant."+" La villa dispose de "+data.NbreChambre+" chambres , "+salleDeBains+bedRoom+
            cuisine+","+piscinePrive+jardinPrive+concatJardinCrage+carageVille+villaImmeble+" Elle idéale pour une famille ou pour les vacances.";
            break;
        case "Maison d'hote":
            
            return typeImmo+" moderne à "+data.region+" est un maison de "+data.espace+" m² située à ville "+data.ville+" La maison dispose de "+data.NbreChambre+" chambres , "+salleDeBains+bedRoom+cuisine+salans+terrasse
            +comporteMaison+jardin+concatJardinCarage+garage+". Il est idéal pour une famille ou pour des vacances.";
            break;
            
        default:
            
            return typeImmo+" à "+data.region+"."+data.nomProperty+" est immobiliere touristique située à ville "+data.ville+plageSable+" la zone touristique de "+data.ville+" sur le nom "+data.nomProperty+" offre ["+
            hotelOffre+restaurantOffre+barsOffre+centreCommerciauxOffre+"]"+activitySportivesxOffre+data.nomProperty+" est idéale pour des vacances en famille, entre amis ou enre les couples.";
    }
    
}
function ResidenceTest(value){
    if(value ==="Oui"){
        return true
    }else{
        return false
    }
}
function garage(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function mer(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function parking(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}

function industrielTest(value) {
    if(value ==="Oui"){
        return true
    }else{
        return false
    }
}
function sanitairesContentIndustrie(value) {
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function situeZoneIndustrie(value) {
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}

function zoneTouristTest(value) {
    if(value ==="Oui"){
        return true
    }else{
        return false
    }
}
function zoneTouristOffreHotel(value) {
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function zoneTouristOffreRestaurant(value) {
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function zoneTouristOffreBars(value) {
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function zoneTouristOffreCentreCommerciaux(value) {
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function zoneTouristOffreActivitySportives(value) {
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}

function StudioTest(value){
    if(value ==="Oui"){
        return true
    }else{
        return false
    }
}
function StudioSpacieux(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function StudioLumineux(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function StudioSpecificationCuisine(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function StudioSpecificationSalleDeBain(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function StudioSpecificationTerrace(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}

function TerrainTest(value){
    if(value ==="Oui"){
        return true
    }else{
        return false
    }
}
function TerrainFertile(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function TerrainIrrigue(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function TerrainRouteGoudronnee(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}
function TerrainBoise(value){
    if(value ==="oui"){
        return true
    }else{
        return false
    }
}

function LocalCommercialContent(value) {
    if(value ==="Oui"){
        return true
    }else{
        return false
    }
}
function BureauContent(value) {
    if(value ==="Oui"){
        return true
    }else{
        return false
    }
}
/* ################### end function testing is residsence ou non ################### */

/* ################### start request new property and save ################### */
app.post("/aaqari/api/proprietaire/createProperty", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const currentTime = new Date();
    const formattedDate = format(currentTime, 'dd/MM/yyyy HH:mm');
    const opt =data.operation /*vendre"  location */
    const type =data.typeProperty
    try {
        const newProperty = new Property()

        newProperty.nom =data.nomProperty
        newProperty.type = data.typeProperty
        newProperty.CodeImmo=generateCodeNewImmo()
        newProperty.description = await generateDescriptionImmo(type , data)

        newProperty.region = data.region
        newProperty.ville = data.ville
        newProperty.zone = data.zone
        newProperty.gps = data.gps

        newProperty.ImgDocCertificat = data.ImgDocCertificatProperty
        newProperty.photos.imgPrincipal = data.ImgPropertyPrincipal
        newProperty.photos.imgSecondaire1 = data.ImgPropertySecondaire1
        newProperty.photos.imgSecondaire2 = data.ImgPropertySecondaire2
        newProperty.photos.imgSecondaire3 = data.ImgPropertySecondaire3
        newProperty.photos.imgSecondaire4 = data.ImgPropertySecondaire4

        newProperty.operation =opt
        if(opt ==="location"){
            newProperty.IsLocation.valueLoc = true
            newProperty.IsLocation.periode = data.peiode
            newProperty.IsLocation.prix = data.prixLoc
        }else{
            newProperty.IsLocation.valueLoc = false
            newProperty.IsLocation.periode = ""
            newProperty.IsLocation.prix = 0
        }
        
        if(opt ==="vendre"){
            newProperty.IsVendre.valueVendre = true
            newProperty.IsVendre.prix = data.prixVendre
        }else{
            newProperty.IsVendre.valueVendre = false
            newProperty.IsVendre.prix = 0
        }
        

        newProperty.features.espace = data.espace
        
        const IsResid =IsResidence(type);
        if(IsResid){
            newProperty.IsResidence.ValueResid = true
            newProperty.IsResidence.nbChambre = data.NbreChambre
            newProperty.IsResidence.specification.bedRoom = data.bedRoom
            newProperty.IsResidence.specification.piscine = ResidenceTest(data.piscine)
            newProperty.IsResidence.specification.cuisine = data.cuisine
            newProperty.IsResidence.specification.terrasse = data.terrasse
            newProperty.IsResidence.specification.salleDeBains = data.bain
            newProperty.IsResidence.specification.salans = data.salans
            newProperty.IsResidence.specification.jardin =  ResidenceTest(data.jardin)
            newProperty.IsResidence.specification.garage = ResidenceTest(data.garage)
            newProperty.IsResidence.specification.immeuble = ResidenceTest(data.resImmeuble)
            newProperty.IsResidence.specification.environnement.mer = ResidenceTest(data.mer)
            newProperty.IsResidence.specification.environnement.parking = ResidenceTest(data.parking)
        }else{
            newProperty.IsResidence.ValueResid = false
            newProperty.IsResidence.nbChambre = 0
            newProperty.IsResidence.specification.bedRoom = 0
            newProperty.IsResidence.specification.piscine = false
            newProperty.IsResidence.specification.cuisine = 0
            newProperty.IsResidence.specification.terrasse = 0
            newProperty.IsResidence.specification.salleDeBains = 0
            newProperty.IsResidence.specification.salans = 0
            newProperty.IsResidence.specification.jardin = false
            newProperty.IsResidence.specification.garage = false
            newProperty.IsResidence.specification.immeuble = false
            newProperty.IsResidence.specification.environnement.mer = false
            newProperty.IsResidence.specification.environnement.parking = false
        }
        if(isIndustrielle(type)){
            newProperty.IsIndustriel.ValueIndustrie = true
            newProperty.IsIndustriel.content.Bureaux = industrielTest(data.BureauxContentIndustrie)
            newProperty.IsIndustriel.content.sanitaires = industrielTest(data.sanitairesContentIndustrie)
            newProperty.IsIndustriel.content.parking = industrielTest(data.parkingContentIndustrie)
            newProperty.IsIndustriel.content.situeZoneIndustrie = industrielTest(data.situeZoneIndustrie)

        }else{
            newProperty.IsIndustriel.ValueIndustrie = false
            newProperty.IsIndustriel.content.Bureaux = false
            newProperty.IsIndustriel.content.sanitaires = false
            newProperty.IsIndustriel.content.parking = false
            newProperty.IsIndustriel.content.situeZoneIndustrie = false
        }
        if(IsZoneTouristique(type)){
            newProperty.IsZoneTouristique.ValueTouristique = true
            newProperty.IsZoneTouristique.content.plage = zoneTouristTest(data.zoneTouristContentPlage)
            newProperty.IsZoneTouristique.offre.hotel = zoneTouristTest(data.zoneTouristOffreHotel)
            newProperty.IsZoneTouristique.offre.restaurant = zoneTouristTest(data.zoneTouristOffreRestaurant)
            newProperty.IsZoneTouristique.offre.bars = zoneTouristTest(data.zoneTouristOffreBars)
            newProperty.IsZoneTouristique.offre.centreCommerciaux = zoneTouristTest(data.zoneTouristOffreCentreCommerciaux)
            newProperty.IsZoneTouristique.offre.activitySportives = zoneTouristTest(data.zoneTouristOffreActivitySportives)
        }else{
            newProperty.IsZoneTouristique.ValueTouristique = false
            newProperty.IsZoneTouristique.content.plage = false
            newProperty.IsZoneTouristique.offre.hotel = false
            newProperty.IsZoneTouristique.offre.restaurant = false
            newProperty.IsZoneTouristique.offre.bars = false
            newProperty.IsZoneTouristique.offre.centreCommerciaux = false
            newProperty.IsZoneTouristique.offre.activitySportives = false
        }

        if(IsStudio(type)){
            newProperty.IsStudio.ValueStudio = true
            newProperty.IsStudio.content.maxNbrePersone = data.StudioNbrePersoneMax
            newProperty.IsStudio.content.meublé = StudioTest(data.StudioMeublé)
            newProperty.IsStudio.content.spacieux = StudioTest(data.StudioSpacieux)
            newProperty.IsStudio.content.lumineux = StudioTest(data.StudioLumineux)

            newProperty.IsStudio.content.specification.cuisine = StudioTest(data.StudioSpecificationCuisine)
            newProperty.IsStudio.content.specification.salleDeBain = StudioTest(data.StudioSpecificationSalleDeBain)
            newProperty.IsStudio.content.specification.terrace = StudioTest(data.StudioSpecificationTerrace)

        }else{
            newProperty.IsStudio.ValueStudio = false
            newProperty.IsStudio.content.maxNbrePersone = 0
            newProperty.IsStudio.content.meublé = false
            newProperty.IsStudio.content.spacieux = false
            newProperty.IsStudio.content.lumineux = false

            newProperty.IsStudio.content.specification.cuisine = false
            newProperty.IsStudio.content.specification.salleDeBain = false
            newProperty.IsStudio.content.specification.terrace = false
        }
        if(IsTerrain(type)){
            newProperty.IsTerrain.ValueTerrain = true
            newProperty.IsTerrain.content.espaceEnHectare = data.TerrainContentEspaceEnHectare
            newProperty.IsTerrain.content.plat = TerrainTest(data.TerrainContentPlat)
            newProperty.IsTerrain.content.fertile = TerrainTest(data.TerrainContentFertile)
            newProperty.IsTerrain.content.irriguéParPuits = TerrainTest(data.TerrainContentIrrigueParPuits)
            newProperty.IsTerrain.content.routeGoudronnée = TerrainTest(data.TerrainContentRouteGoudronnee)
            newProperty.IsTerrain.content.terrainBoisé = TerrainTest(data.TerrainContentTerrainBoise)
            newProperty.IsTerrain.content.typeArbres = data.TerrainContentTypeArbre
        }else{
            newProperty.IsTerrain.ValueTerrain = false
            newProperty.IsTerrain.content.espaceEnHectare = 0
            newProperty.IsTerrain.content.plat = false
            newProperty.IsTerrain.content.fertile = false
            newProperty.IsTerrain.content.irriguéParPuits = false
            newProperty.IsTerrain.content.routeGoudronnée = false
            newProperty.IsTerrain.content.terrainBoisé = false
            newProperty.IsTerrain.content.typeArbres = ""
        }
        if(IsLocalCommercial(type)){
            newProperty.isLocalCommercial.ValueLocalCommercial = true
            newProperty.isLocalCommercial.content.ZoneCommAchalandee = LocalCommercialContent(data.LocalCommZoneCommAchalandee)
            newProperty.isLocalCommercial.content.transportPublic = LocalCommercialContent(data.LocalCommTransportPublic)
            newProperty.isLocalCommercial.content.parking = LocalCommercialContent(data.LocalCommParking)
            newProperty.isLocalCommercial.content.lumineux = LocalCommercialContent(data.LocalCommLumineux)
            newProperty.isLocalCommercial.content.spacieux = LocalCommercialContent(data.LocalCommSpacieux)
        }else{
            newProperty.isLocalCommercial.ValueLocalCommercial = false
            newProperty.isLocalCommercial.content.ZoneCommAchalandee = false
            newProperty.isLocalCommercial.content.transportPublic = false
            newProperty.isLocalCommercial.content.parking = false
            newProperty.isLocalCommercial.content.lumineux = false
            newProperty.isLocalCommercial.content.spacieux = false
        }
        if(IsBureau(type)){
            newProperty.IsBureau.ValueBureau = true
            newProperty.IsBureau.content.ApprocheTransportPublic = BureauContent(data.isBureauApprocheTransportPublic)
            newProperty.IsBureau.content.ApprocheAdministrations = BureauContent(data.isBureauApprocheAdministrations)
            newProperty.IsBureau.content.lumineux = BureauContent(data.isBureauLumineux)
            newProperty.IsBureau.content.spacieux = BureauContent(data.isBureauSpacieux)
            newProperty.IsBureau.content.ImmeubleRecent = BureauContent(data.isBureauImmeubleRecent)
            newProperty.IsBureau.content.specification.kitchenette = BureauContent(data.isBureauSpecificationkitchenette)
            newProperty.IsBureau.content.specification.salleAttente = BureauContent(data.isBureauSpecificationSalleAttente)
            newProperty.IsBureau.content.specification.sanitaire = BureauContent(data.isBureauSpecificationSanitaire)
        }else{
            newProperty.IsBureau.ValueBureau = false
            newProperty.IsBureau.content.ApprocheTransportPublic = false
            newProperty.IsBureau.content.ApprocheAdministrations = false
            newProperty.IsBureau.content.lumineux = false
            newProperty.IsBureau.content.spacieux = false
            newProperty.IsBureau.content.ImmeubleRecent = false
            newProperty.IsBureau.content.specification.kitchenette = false
            newProperty.IsBureau.content.specification.salleAttente = false
            newProperty.IsBureau.content.specification.sanitaire = false
        }
        

        newProperty.idProprietaire = data.proprietaireID
        newProperty.proprietaireDetail.idProp = data.proprietaireID
        newProperty.proprietaireDetail.nomComplet= data.proprietaireNomComplet
        newProperty.proprietaireDetail.imgProfil= data.proprietaireImgProfil
        newProperty.proprietaireDetail.tel = data.proprietaireContactTel
        newProperty.proprietaireDetail.email = data.proprietaireContactEmail

        newProperty.DateCreation =formattedDate
        if(opt ==="location"){
            newProperty.prixGlobal = data.prixLoc
        }else{
            newProperty.prixGlobal = data.prixVendre
        }
        
        newProperty.statutImmo ="en attente"


        await newProperty.save()

        res.send({etat , newProperty})
        
    } catch (error) {
        const etat = statusRequest("500" , "echec");
        res.send({etat})
    }
    

    

})
/* ################### end request new property and save ################### */
function test(value){
    if(value ==="Oui"){
        return true
    }else{
        return false
    }
}
/* ################### start request update property and save ################### */
app.put("/aaqari/api/proprietaire/update/property", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
   /* const currentTime = new Date();
    const formattedDate = format(currentTime, 'dd/MM/yyyy HH:mm');*/
    const opt =data.operation;
    const type =data.typeProperty;
    const idProperty = data.idProperty;
    try {
        const Annonce = await Property.findByIdAndUpdate(idProperty);

        Annonce.nom =data.nomProperty
        Annonce.description = await generateDescriptionImmo(type , data)

        Annonce.region = data.region
        Annonce.ville = data.ville
        Annonce.zone = data.zone
        Annonce.gps = data.gps

        Annonce.operation =opt
        if(opt ==="location"){
            Annonce.IsLocation.valueLoc = true
            Annonce.IsLocation.periode = data.periode
            Annonce.IsLocation.prix = data.prixLoc
        }else{
            Annonce.IsLocation.valueLoc = false
            Annonce.IsLocation.periode = ""
            Annonce.IsLocation.prix = 0
        }

        if(opt ==="vendre"){
            Annonce.IsVendre.valueVendre = true
            Annonce.IsVendre.prix = data.prixVendre
        }else{
            Annonce.IsVendre.valueVendre = false
            Annonce.IsVendre.prix = 0
        }
        const IsResid =IsResidence(type);
        if(IsResid){
            Annonce.IsResidence.ValueResid = true
            Annonce.IsResidence.nbChambre = data.NbreChambre
            Annonce.IsResidence.specification.bedRoom = data.bedRoom
            Annonce.IsResidence.specification.piscine = test(data.piscine)
            Annonce.IsResidence.specification.cuisine = data.cuisine
            Annonce.IsResidence.specification.terrasse = data.terrasse
            Annonce.IsResidence.specification.salleDeBains = data.bain
            Annonce.IsResidence.specification.salans = data.salans
            Annonce.IsResidence.specification.jardin =  test(data.jardin)
            Annonce.IsResidence.specification.garage = test(data.garage)
            Annonce.IsResidence.specification.immeuble = test(data.resImmeuble)
            Annonce.IsResidence.specification.environnement.mer = test(data.mer)
            Annonce.IsResidence.specification.environnement.parking = test(data.parking)
        }else{
            Annonce.IsResidence.ValueResid = false
            Annonce.IsResidence.nbChambre = 0
            Annonce.IsResidence.specification.bedRoom = 0
            Annonce.IsResidence.specification.piscine = false
            Annonce.IsResidence.specification.cuisine = 0
            Annonce.IsResidence.specification.terrasse = 0
            Annonce.IsResidence.specification.salleDeBains = 0
            Annonce.IsResidence.specification.salans = 0
            Annonce.IsResidence.specification.jardin = false
            Annonce.IsResidence.specification.garage = false
            Annonce.IsResidence.specification.immeuble = false
            Annonce.IsResidence.specification.environnement.mer = false
            Annonce.IsResidence.specification.environnement.parking = false
        }

        if(isIndustrielle(type)){
            Annonce.IsIndustriel.ValueIndustrie = true
            Annonce.IsIndustriel.content.Bureaux = test(data.BureauxContentIndustrie)
            Annonce.IsIndustriel.content.sanitaires = test(data.sanitairesContentIndustrie)
            Annonce.IsIndustriel.content.parking = test(data.parkingContentIndustrie)
            Annonce.IsIndustriel.content.situeZoneIndustrie = test(data.situeZoneIndustrie)

        }else{
            Annonce.IsIndustriel.ValueIndustrie = false
            Annonce.IsIndustriel.content.Bureaux = false
            Annonce.IsIndustriel.content.sanitaires = false
            Annonce.IsIndustriel.content.parking = false
            Annonce.IsIndustriel.content.situeZoneIndustrie = false
        }

        if(IsZoneTouristique(type)){
            Annonce.IsZoneTouristique.ValueTouristique = true
            Annonce.IsZoneTouristique.content.plage = test(data.zoneTouristContentPlage)
            Annonce.IsZoneTouristique.offre.hotel = test(data.zoneTouristOffreHotel)
            Annonce.IsZoneTouristique.offre.restaurant = test(data.zoneTouristOffreRestaurant)
            Annonce.IsZoneTouristique.offre.bars = test(data.zoneTouristOffreBars)
            Annonce.IsZoneTouristique.offre.centreCommerciaux = test(data.zoneTouristOffreCentreCommerciaux)
            Annonce.IsZoneTouristique.offre.activitySportives = test(data.zoneTouristOffreActivitySportives)
        }else{
            Annonce.IsZoneTouristique.ValueTouristique = false
            Annonce.IsZoneTouristique.content.plage = false
            Annonce.IsZoneTouristique.offre.hotel = false
            Annonce.IsZoneTouristique.offre.restaurant = false
            Annonce.IsZoneTouristique.offre.bars = false
            Annonce.IsZoneTouristique.offre.centreCommerciaux = false
            Annonce.IsZoneTouristique.offre.activitySportives = false
        }

        if(IsStudio(type)){
            Annonce.IsStudio.ValueStudio = true
            Annonce.IsStudio.content.maxNbrePersone = data.StudioNbrePersoneMax
            Annonce.IsStudio.content.meublé = test(data.StudioMeublé)
            Annonce.IsStudio.content.spacieux = test(data.StudioSpacieux)
            Annonce.IsStudio.content.lumineux = test(data.StudioLumineux)

            Annonce.IsStudio.content.specification.cuisine = test(data.StudioSpecificationCuisine)
            Annonce.IsStudio.content.specification.salleDeBain = test(data.StudioSpecificationSalleDeBain)
            Annonce.IsStudio.content.specification.terrace = test(data.StudioSpecificationTerrace)

        }else{
            Annonce.IsStudio.ValueStudio = false
            Annonce.IsStudio.content.maxNbrePersone = 0
            Annonce.IsStudio.content.meublé = false
            Annonce.IsStudio.content.spacieux = false
            Annonce.IsStudio.content.lumineux = false

            Annonce.IsStudio.content.specification.cuisine = false
            Annonce.IsStudio.content.specification.salleDeBain = false
            Annonce.IsStudio.content.specification.terrace = false
        }
        
        if(IsTerrain(type)){
            Annonce.IsTerrain.ValueTerrain = true
            Annonce.IsTerrain.content.espaceEnHectare = data.TerrainContentEspaceEnHectare
            Annonce.IsTerrain.content.plat = test(data.TerrainContentPlat)
            Annonce.IsTerrain.content.fertile = test(data.TerrainContentFertile)
            Annonce.IsTerrain.content.irriguéParPuits = test(data.TerrainContentIrrigueParPuits)
            Annonce.IsTerrain.content.routeGoudronnée = test(data.TerrainContentRouteGoudronnee)
            Annonce.IsTerrain.content.terrainBoisé = test(data.TerrainContentTerrainBoise)
            Annonce.IsTerrain.content.typeArbres = data.TerrainContentTypeArbre
        }else{
            Annonce.IsTerrain.ValueTerrain = false
            Annonce.IsTerrain.content.espaceEnHectare = 0
            Annonce.IsTerrain.content.plat = false
            Annonce.IsTerrain.content.fertile = false
            Annonce.IsTerrain.content.irriguéParPuits = false
            Annonce.IsTerrain.content.routeGoudronnée = false
            Annonce.IsTerrain.content.terrainBoisé = false
            Annonce.IsTerrain.content.typeArbres = ""
        }
        
        if(IsLocalCommercial(type)){
            Annonce.isLocalCommercial.ValueLocalCommercial = true
            Annonce.isLocalCommercial.content.ZoneCommAchalandee = test(data.LocalCommZoneCommAchalandee)
            Annonce.isLocalCommercial.content.transportPublic = test(data.LocalCommTransportPublic)
            Annonce.isLocalCommercial.content.parking = test(data.LocalCommParking)
            Annonce.isLocalCommercial.content.lumineux = test(data.LocalCommLumineux)
            Annonce.isLocalCommercial.content.spacieux = test(data.LocalCommSpacieux)
        }else{
            Annonce.isLocalCommercial.ValueLocalCommercial = false
            Annonce.isLocalCommercial.content.ZoneCommAchalandee = false
            Annonce.isLocalCommercial.content.transportPublic = false
            Annonce.isLocalCommercial.content.parking = false
            Annonce.isLocalCommercial.content.lumineux = false
            Annonce.isLocalCommercial.content.spacieux = false
        }
        if(IsBureau(type)){
            Annonce.IsBureau.ValueBureau = true
            Annonce.IsBureau.content.ApprocheTransportPublic = test(data.isBureauApprocheTransportPublic)
            Annonce.IsBureau.content.ApprocheAdministrations = test(data.isBureauApprocheAdministrations)
            Annonce.IsBureau.content.lumineux = test(data.isBureauLumineux)
            Annonce.IsBureau.content.spacieux = test(data.isBureauSpacieux)
            Annonce.IsBureau.content.ImmeubleRecent = test(data.isBureauImmeubleRecent)
            Annonce.IsBureau.content.specification.kitchenette = test(data.isBureauSpecificationkitchenette)
            Annonce.IsBureau.content.specification.salleAttente = test(data.isBureauSpecificationSalleAttente)
            Annonce.IsBureau.content.specification.sanitaire = test(data.isBureauSpecificationSanitaire)
        }else{
            Annonce.IsBureau.ValueBureau = false
            Annonce.IsBureau.content.ApprocheTransportPublic = false
            Annonce.IsBureau.content.ApprocheAdministrations = false
            Annonce.IsBureau.content.lumineux = false
            Annonce.IsBureau.content.spacieux = false
            Annonce.IsBureau.content.ImmeubleRecent = false
            Annonce.IsBureau.content.specification.kitchenette = false
            Annonce.IsBureau.content.specification.salleAttente = false
            Annonce.IsBureau.content.specification.sanitaire = false
        }

        Annonce.features.espace = data.espace

        if(opt ==="location"){
            Annonce.prixGlobal = data.prixLoc
        }else{
            Annonce.prixGlobal = data.prixVendre
        }

        await Annonce.updateOne(Annonce) ;
        res.send({etat , Annonce})

    } catch (error) {
        const etat = statusRequest("500" , "echec");
        res.send({etat})
        
    }


})
/* ################### end request update property and save ################### */

/* ################### start request get all proprietaire property ################### */
app.post("/aaqari/api/proprietaire/getAllByIdProp",async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
  
    try {
        const AnnoncesImmo = await Property.find({ idProprietaire: data.idProp });

        res.send({AnnoncesImmo});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   

})
/* ################### end  request get all proprietaire property ################### */


/* ################### start request get all proprietaire property ################### */
app.get("/aaqari/api/Admin/getAllNewProperty", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const attente = "en attente"
  
    try {
        const NewAnnonces = await Property.find({ statutImmo: attente });

        res.send({NewAnnonces,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   

})
/* ################### end request get all proprietaire property ################### */


/* ################### start request get all proprietaire property ################### */
app.get("/aaqari/api/Client/getAllPropertyPublie", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const attente = "publier"
  
    try {
        const annonce = await Property.find({ statutImmo: attente });

        res.send({annonce,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   

})
/* ################### end request get all proprietaire property ################### */


/* ################### start request Approuver nouveau annonce immo par admin ################### */
app.put("/aaqari/api/Admin/NewProperty/decision/Approuver", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const idProperty = data.idProperty;
  
    try {
        const AnnonceApprouver = await Property.findByIdAndUpdate(idProperty);

        AnnonceApprouver.statutImmo = "publier" ;
        await AnnonceApprouver.updateOne(AnnonceApprouver) ;

        res.send({AnnonceApprouver,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   

})
/* ################### end request Approuver nouveau annonce immo par admin ################### */

/* ################### start request rejeter nouveau annonce immo par admin ################### */
app.put("/aaqari/api/Admin/NewProperty/decision/Rejeter", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const idProperty = data.idProperty;
  
    try {
        const AnnonceApprouver = await Property.findByIdAndUpdate(idProperty);

        AnnonceApprouver.statutImmo = "refuser" ;
        await AnnonceApprouver.updateOne(AnnonceApprouver) ;

        res.send({AnnonceApprouver,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   

})
/* ################### end request rejeter nouveau annonce immo par admin ################### */


/* ################### start request get property by id ################### */
app.post("/aaqari/api/admin/getPorpertyById",async (req,res)=>{
    const etat = statusRequest("200" , "success");

    const data = req.body;
    const idProperty = data.idProperty;
    try {
        const propertyById = await Property.findById(idProperty);

        res.send({propertyById,etat})
    }
    catch(err){
        res.status(500).send('recuperation property by id is failled');
    }

})
/* ################### end request get property by id ################### */

/* ################### start request get property by id ################### */
app.post("/aaqari/api/client/getPorpertyById",async (req,res)=>{
    const etat = statusRequest("200" , "success");

    const data = req.body;
    const idProperty = data.idProperty;
    try {
        const propertyById = await Property.findById(idProperty);

        res.send({propertyById,etat})
    }
    catch(err){
        res.status(500).send('recuperation property by id is failled');
    }

})
/* ################### end request get property by id ################### */


/* request get all property*/
app.get("/recupererAllProperty",async (req,res)=>{
    try {
    const propertyAll = await Property.find();

    res.send({propertyAll});
    }
    catch(err){
        res.status(500).send('Erreur interne du serveur');
    }

})


/* request get property by id*/
app.get("/recupererPropertyById",async (req,res)=>{
    const idProperty = "65f42e3726ff53450006f3b6"
    try {
    const propertyById = await Property.findById(idProperty);

    res.json(propertyById);}
    catch(err){
        res.status(500).send('recuperation property by id is failled');
    }

})


/* request update property by id*/
app.put("/updatePropertyById",async (req,res)=>{
    /*const userId = req.params.userId;*/
    const idProperty = "65f42e3726ff53450006f3b6"
    const dataUpdate = {
        "nom" : "luxury"
    };

    try {
    const property = await Property.findByIdAndUpdate(idProperty);

    if(!property){
       return res.status(404).send("property est trouve pas");
    }

    await property.updateOne(dataUpdate) 

    res.json("mise effectuer avec succes");
    }
    catch(err){
        res.status(500).send("mise a jour d'un property est echoué");
    }

})


/* request Evaluer property by id*/
app.put("/EvaluerProperty",async (req,res)=>{
    /*const userId = req.params.userId;*/
    const idProperty = "65f42e3726ff53450006f3b6"
   

    try {
    const property = await Property.findByIdAndUpdate(idProperty);

    if(!property){
       return res.status(404).send("property est trouve pas");
    }
    property.evaluer.value +=1
    property.evaluer.listeEvaluateurs.push({
        idClient : "1234569874521",
        nomComplet : "ahmed saihi",
        notation : "1",
        dateRating : "12/12/2021",

    }) 

    await property.updateOne(property) 

    res.json("evaluer effectuer avec succes");
    }
    catch(err){
        res.status(500).send("evaluation echoué");
    }

})

/* request signaler property by id*/
app.put("/SignalerProperty",async (req,res)=>{
    /*const userId = req.params.userId;*/
    const idProperty = "65f42e3726ff53450006f3b6"
   

    try {
    const property = await Property.findByIdAndUpdate(idProperty);

    if(!property){
       return res.status(404).send("property est trouve pas");
    }
    
    property.signaler.push({
        idClient : "1234569874521",
        nomComplet : "sami snug saihi",
        raison : "fake",
        notation : "1",
        justification : "fake fake",
        dateSignal : "12/12/2021",

    }) 

    await property.updateOne(property) 

    res.json("signalisation effectuer avec succes");
    }
    catch(err){
        res.status(500).send("signalisation echoué");
    }

})






/*Authentification connexion / inscription */

app.post("/aaqari/api/auth/connexion",cors() ,async (req,res)=>{
    
    try{

        const data = req.body;
        const user = await Utilisateurs.findOne( {userName : data.gmail});
        if(!user) return res.status(404).json("utilisateur n'exist pas")

       const isPasswordCorrect = await bcrypt.compare(data.password ,user.auth.password);
        if(!isPasswordCorrect) return res.status(400).send("Mot de passe ou nom d’utilisateur erroné")



        const{isAdmin, ...otherDetails } = user._doc;

        const isAdminValue = user.isAdmin;

        const token = jwt.sign({id : user._id, isAdminValue},jwt_Secret_Key);

        res.cookie("access_token",token,{httpOnly:true,}).status(200).json({...otherDetails});

    }catch(err){
        res.status(500).send("recuperation des information d'utilisateur est echoué")
    }

})


app.post("/aaqari/api/auth/inscription",cors() ,async (req,res)=>{
    try{
    const data = req.body;
    const user = await Utilisateurs.findOne( {userName : data.gmail});
    if(user) {return res.status(402).json("votre gmail déjà utilisé")}
    else{

    const newUser = new Utilisateurs()
    
    newUser.nom=data.nom
    newUser.prenom=data.prenom
    newUser.DateNaissance=data.naissance
    newUser.ComeQui=data.commeQui
    newUser.userName=data.gmail
    if(data.commeQui ==="proprietaire"){
        newUser.Cin=data.cin
    }else{
        newUser.Cin=""
    }
    newUser.NumTel=data.numeroTel


    const salt = bcrypt.genSaltSync(10);
    const PassHash = bcrypt.hashSync(data.motDpasse,salt);

    newUser.auth.email=data.gmail
    newUser.auth.password=PassHash
    newUser.auth.dateModification =data.dateMof

    newUser.ImgProfil=data.Img
    newUser.EtatCompte="Active"

    newUser.isActive.status=false
    newUser.isActive.codeActivation =""
    newUser.isActive.codeActivation=""

    

    await newUser.save()

    const isAdminValue = newUser.isAdmin;

    const token = jwt.sign({id : newUser._id, isAdminValue},jwt_Secret_Key);
    res.cookie("access_token",token,{httpOnly:true,}).status(200).send("utilisateur est creé avec succeés"+newUser).json()

    }
    }catch(err){
        res.status(500).send("creation un nouveau utilisateur est echoué")
    }

   
})

app.get("/BackEnd",cors() , (req,res)=>{

    res.send("hi i am back end")
})




app.get("/allUsers",cors(), async (req,res)=>{
    
    const user = await Utilisateurs.find();


    res.send(user)
})




/* #################################### start connexion au compte utilisateur #################################### */

app.post("/aaqari/api/connexionTest",cors() , async (req,res)=>{
    const etat = statusRequest("200" , "success");
    
    const data = req.body;

    /*res.send("hi " + data.gmail+" "+data.password)*/
    try{
    const user = await Utilisateurs.findOne( {userName : data.gmail});
    if(!user) {
        const etat = statusRequest("404" , "utilisateur n'exist pas");
        return res.send({etat}).json();
    }
    

    const isPasswordCorrect = await bcrypt.compare(data.password ,user.auth.password);
    if(!isPasswordCorrect){
        const etat = statusRequest("400" , "Mot de passe ou nom d’utilisateur erroné");
        return res.send({etat}).json();
    }
    
    if(user.EtatCompte ==="ban") {
        const etat = statusRequest("405" , "Compte est banned");
        return res.send({etat}).json();
    }

    
    const{isAdmin, ...otherDetails } = user._doc;

    const isAdminValue = user.isAdmin;

    const token = jwt.sign({id : user._id, isAdminValue},jwt_Secret_Key);

    res.cookie("access_token",token,{httpOnly:true,}).status(200).json({/*...otherDetails*/user,token,etat});
    }catch(err){
        res.send("recuperation des information d'utilisateur est echoué") /*.status(500) */
    }
    
})
/* #################################### end connexion au compte utilisateur #################################### */


/* #################################### start creation  compte utilisateur #################################### */
app.post("/aaqari/api/inscription",cors() ,async (req,res)=>{
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd/MM/yyyy HH:mm');
    const etat = statusRequest("200" , "success");

    try{
        const data = req.body;
        const user = await Utilisateurs.findOne( {userName : data.gmail});
        if(user) {
            const etat = statusRequest("400" , "votre gmail déjà utilisé");
            return res.send({etat}).json();
        } 
        else{

            const newUser = new Utilisateurs()
            
            newUser.nom=data.nom
            newUser.prenom=data.prenom
            newUser.DateNaissance=data.naissance
            
            newUser.userName=data.gmail
            newUser.ComeQui=data.commeQui
            newUser.Cin=data.cin
           
          
            newUser.NumTel=data.numeroTel
        
        
            const salt = bcrypt.genSaltSync(10);
            const PassHash = bcrypt.hashSync(data.motDpasse,salt);
        
            newUser.auth.email=data.gmail
            newUser.auth.password=PassHash
            newUser.auth.dateModification =formattedDate
        
            newUser.ImgProfil=data.Img
            newUser.EtatCompte="Active"
        
            newUser.isActive.status=true
            newUser.isActive.codeActivation =generateCodeActivation()
            newUser.isActive.codeConfirmation=""
        
            await newUser.save()
        
            const isAdminValue = newUser.isAdmin;
            const token = jwt.sign({id : newUser._id, isAdminValue},jwt_Secret_Key);
            res.cookie('access_token',token,{ httpOnly: true }).send({newUser , token, etat}).json()
        
            }

    }catch(err){
        res.send("inscription est echoué");

    }
    
})
/* #################################### end creation  compte utilisateur #################################### */


/* envoyer un mail de confirmation compte*/ 
app.post("/envoyerMail", async (req,res)=>{
    /*let code =  generateCodeConfirmation();
    const mailto = "samisalhi.rnb@gmail.com";
    await sendConfirmationEmail(mailto,code);*/
    res.send("hi im step de confirmation par google");
})
/* #################################### start verifier le existance email tel , cin avant sign up de new user #################################### */
app.post("/aaqari/api/verifyContact/NewUser",cors(), async (req,res)=>{
    const data = req.body;
    const etat = statusRequest("200" , "success");
   

    try {
        const user = await Utilisateurs.findOne({userName : data.email , NumTel : data.tel});
        if(user) {
            const etat = statusRequest("400" , "Email et Numero de téléphone sont utilisé");
            return res.send({etat}).json();
        }

        const user1 = await Utilisateurs.findOne({userName : data.email});
        if(user1) {
            const etat = statusRequest("402" , "Email déjà utilisé");
            return res.send({etat}).json();
        }

        const user2 = await Utilisateurs.findOne({NumTel : data.tel});
        if(user2) {
            const etat = statusRequest("401" , "Numero de téléphone déjà utilisé");
            return res.send({etat}).json();
        }

       
        res.send({etat , "res":"votre contact non utilisé"});
        }
        catch(err){
            res.status(500).send('verification de contact de nouvelle utilisateur est échoué');
        }

})

/* #################################### end verifier le existance email tel , cin avant sign up de new user #################################### */

/* #################################### start confirmation compte utilisateur by gmail #################################### */
app.post("/confirmationAccountByGoogle",cors(), async (req,res)=>{
    const data = req.body;
    let code =  generateCodeConfirmation();
    const mailto = data.gmail;
    await sendConfirmationEmail(mailto,code);

    const currentTime = new Date();

    const dataMail ={
        dateCurrent : currentTime,
        gmailConcernant : data.gmail,
        codeConfirmation : code,
        step : "verification",
    }
    res.send(dataMail);

    
})
/* #################################### end confirmation compte utilisateur by gmail #################################### */


/* #################################### start function de gestion des erreur #################################### */
function statusRequest(stat , desc) {
    return data = {
        status : stat,
        description : desc,
    }
 }
/* #################################### end function de gestion des erreur #################################### */


/* #################################### start mise a jour utilisateur #################################### */
/* update data utilisateur */
app.put("/aaqari/api/utilisateur/update/infoPersonnel",cors(), async (req,res)=>{
    const data = req.body;
    const etat = statusRequest("200" , "success");

    try {
    const user = await Utilisateurs.findByIdAndUpdate(data.idClient);
    if(!user) {
        const etat = statusRequest("404" , "utilisateur n'existe pas");
        return res.send({etat}).json();
    }
     

    const isPasswordCorrect = await bcrypt.compare(data.passConfirm ,user.auth.password);
    if(!isPasswordCorrect){ 
        const etat = statusRequest("402" , "mot de passe incorrect");
        return res.send({etat}).json();
    }

    user.nom = data.nom;
    user.prenom = data.prenom;
    user.DateNaissance = data.dateNaissance;
    user.NumTel = data.tel;


    await user.updateOne(user) ;
    res.send({ etat , user}).json();

    }
    catch(err){
        res.status(500).send(' update utilisateur est echoué');
    } 
 })

/* update password utilisateur */
app.put("/aaqari/api/utilisateur/update/security",cors(), async (req,res)=>{ 
    const data = req.body;
    const etat = statusRequest("200" , "success");
    const currentTime = new Date();

    try {
        const user = await Utilisateurs.findByIdAndUpdate(data.idClient);
        if(!user) {
            const etat = statusRequest("404" , "utilisateur n'existe pas");
            return res.send({etat}).json();
        }

        const isPasswordCorrect = await bcrypt.compare(data.passConfirm ,user.auth.password);
        if(!isPasswordCorrect){ 
            const etat = statusRequest("402" , "mot de passe incorrect");
            return res.send({etat}).json();
        }

        const salt = bcrypt.genSaltSync(10);
        const PassHash = bcrypt.hashSync(data.NewPassword,salt);

        user.auth.password = PassHash;
        user.auth.dateModification = currentTime ;
        await user.updateOne(user) ;
        res.send({ etat , user}).json();
    
        }
        catch(err){
            res.status(500).send(' mise a jour de mot de passe utilisateur est échoué');
        }

})
/* update photo utilisateur */
app.put("/aaqari/api/utilisateur/update/photo",cors(), async (req,res)=>{ 
    const data = req.body;
    const etat = statusRequest("200" , "success");
   

    try {
        const user = await Utilisateurs.findByIdAndUpdate(data.idClient);
        if(!user) {
            const etat = statusRequest("404" , "utilisateur n'existe pas");
            return res.send({etat}).json();
        }

        user.ImgProfil = data.NewImgProfil ;
        await user.updateOne(user) ;
        res.send({ etat , user}).json();
    
        }
        catch(err){
            res.status(500).send(' mise a jour de photo utilisateur est échoué');
        }

})
/* #################################### end mise a jour utilisateur #################################### */




/* #################################### start signaler property #################################### */
app.put("/aaqari/api/utilisateur/signaler/property",cors(), async (req,res)=>{ 
    const data = req.body;
    const etat = statusRequest("200" , "success");
    const idprop = data.idProperty;
    const currentTime = new Date();
    const formattedDate = format(currentTime, 'dd/MM/yyyy HH:mm');
   

    try {
        const property = await Property.findByIdAndUpdate(idprop);

        if(!property) {
            const etat = statusRequest("404" , "property n'existe pas");
            return res.send({etat}).json();
        }
        property.signaler.push({
            idClient : data.idClient,
            nomComplet : data.nomComplet,
            ImgClient : data.imgUser,
            raison : data.raison,
            justification : data.justification,
            dateSignal : formattedDate
        }) 

        await property.updateOne(property);
        res.send({property,etat});
        }
        catch(err){
            res.status(500).send("signaler d'un property est echoué");
        }
       

})

/* #################################### end signaler property #################################### */


/* #################################### start Fonction calcul rating property ####################################  */
function CalculRating(tab) {
    var SommeStar = 0;
    var rate = 0.00;
    var TailTab = 0;
    for (let i = 0; i < tab.length; i++) {
        SommeStar +=  parseInt(tab[i].notation, 10); 
        TailTab += 1;
    }
    rate = SommeStar/TailTab;
    return parseFloat(rate.toFixed(2));
}
/* #################################### end Fonction calcul rating property ####################################  */


/* #################################### start Fonction existence person rating property ####################################  */
function ExistencePersonRating(tab ,idUserRating) {
    let exist;
    if(tab.length > 0){
        for (let i = 0; i < tab.length; i++) {
            if(tab[i].idClient == idUserRating){
                exist = true;
                break;
            }else{
                exist = false;
            }
    }}else{
        exist = false;
    }
    return exist;
}
/* #################################### end Fonction existence person rating property ####################################  */

/* #################################### start Fonction recherche indice person rating dans table rate property ####################################  */
function IndicePersonRating(tab ,idUserRating) {
    var indice = 0;
    if(tab.length > 0){
        for (let i = 0; i < tab.length; i++) {
            if(tab[i].idClient == idUserRating){
                indice = i;
                break;
            }else{
                indice = 0;
            }
    }}
    return indice;
}
/* #################################### end Fonction recherche indice person rating dans table rate property ####################################  */

/* #################################### start Evaluer property #################################### */
app.put("/aaqari/api/utilisateur/evaluer/property",cors(), async (req,res)=>{ 
    const data = req.body;
    const etat = statusRequest("200" , "success");
    const idprop = data.idProperty;
    const currentTime = new Date();
   

    try {
        const property = await Property.findByIdAndUpdate(idprop);
        if(!property) {
            const etat = statusRequest("404" , "property n'existe pas");
            return res.send({etat}).json();
        }
         

         const personIsRating = ExistencePersonRating(property.evaluer.listeEvaluateurs ,data.idClient);
         if(personIsRating == true){
            var indice = IndicePersonRating(property.evaluer.listeEvaluateurs ,data.idClient);
            property.evaluer.listeEvaluateurs[indice].notation = data.rate;
            property.evaluer.listeEvaluateurs[indice].dateRating = currentTime;
         }
        if(personIsRating == false){
        property.evaluer.listeEvaluateurs.push({
                idClient : data.idClient,
                nomComplet : data.nomComplet,
                notation : data.rate,
                dateRating : currentTime
        })} 
        await property.updateOne(property);
        const rate =  CalculRating(property.evaluer.listeEvaluateurs);
        const rateToString = rate.toString();
        property.evaluer.value = rateToString;

        await property.updateOne(property);
        res.send({property,etat,rate , "PersonRatingExist":personIsRating });
        }
        catch(err){
            res.status(500).send("evaluer d'un property est echoué");
        }
       

})
/* #################################### end Evaluer property #################################### */


/* #################################### start new demande location / achat #################################### */

app.post("/aaqari/api/utilisateur/property/demande",cors() ,async (req,res)=>{
    const data = req.body;
    const etat = statusRequest("200" , "success");
    const idprop = data.idProperty;
    const opt = data.operation;
    const currentTime = new Date();
    const formattedDate = format(currentTime, 'dd/MM/yyyy HH:mm');

    try {
        const propertyConcerne = await Property.findById(idprop);
        if(!propertyConcerne) {
            const etat = statusRequest("404" , "immobilie n'existe pas");
            return res.send({etat}).json();
        }
        
        const demande = await Demandes.findOne({CinClient : data.CinClient ,idProperty : data.idProperty});
        if(demande) {
            const etat = statusRequest("202" , "demande déja existe");
            return res.send({etat}).json();
        }
        /*if(demande && demande.idProperty === data.idProperty){
            const etat = statusRequest("202" , "demande déja existe");
            return res.send({etat}).json();
        }*/
       /* if(demande.idProperty !== data.idProperty){
            return res.send({demande , staus:" demande n'existe pas"});
        }*/
        
        
        
   
        const newDemande = new Demandes();
        newDemande.idProperty =  data.idProperty
        newDemande.type =  data.type
        newDemande.idClient =  data.idClient
        newDemande.CinClient =  data.CinClient
        newDemande.operation =  data.operation

        newDemande.InfoClient.nom =  data.nom
        newDemande.InfoClient.nomArab =  data.nomArab
        newDemande.InfoClient.prenom=  data.prenom
        newDemande.InfoClient.prenomArab =  data.prenomArab

        newDemande.Coordonnées.NumeroTel =  data.tel
        newDemande.Coordonnées.gmail =  data.email

        if(opt ==="location"){
            newDemande.IsLocation.valueLoc = true
            newDemande.IsLocation.periodeRequise = data.periodeRequise
            newDemande.IsLocation.DateDebut = data.dateDebut
            newDemande.IsLocation.DateFin = data.dateFin
        }else{
            newDemande.IsLocation.valueLoc = false
            newDemande.IsLocation.periodeRequise = ""
            newDemande.IsLocation.DateDebut = ""
            newDemande.IsLocation.DateFin = ""
        }

        if(opt ==="vendre"){
            newDemande.IsAchat.valueAchat = true
            newDemande.IsAchat.montantPropose = data.montantPropose
        }else{
            newDemande.IsAchat.valueAchat = false
            newDemande.IsAchat.montantPropose = ""
        }

        newDemande.idConcernéProprietaire = data.IdProprietaire
        newDemande.CinProprietaire = data.CinProprietaire
        newDemande.infoProprietaire.NomComplet = data.nomCompletProp

        newDemande.infoProprietaire.NumeroTel = data.numeroTelProp
        newDemande.infoProprietaire.gmail = data.gmailProp

        newDemande.dateDemande = formattedDate

        newDemande.decision.valueDec = "en attente"
        newDemande.decision.dateDec = ""
        
        await newDemande.save()

        const nomClientComplet = data.nom+" "+data.prenom;
        const property = await Property.findByIdAndUpdate(idprop);
        property.offreDemande.push({
            idDmd : newDemande._id,
            idClient : data.idClient,
            nomComplet : nomClientComplet,
            prixPropose : data.montantPropose,
            dateOffre : formattedDate,
            statut : "en attente"
        })

        await property.updateOne(property);
        res.send({newDemande ,etat});


    }catch(err){

        res.status(500).send('creation de nouvelle demande est échoué');
    }


    
})


/* #################################### end new demande location / achat #################################### */

/* #################################### start request get all user for admin #################################### */
app.get("/aaqari/api/admin/allUser" ,cors(),async (req,res)=>{
    const etat = statusRequest("200" , "success");
    try {
    const users = await Utilisateurs.find();

    res.send({etat , users});
    }
    catch(err){
        res.status(500).send('suspendre de compte utilisateur est échoué');
    }

})
/* #################################### end request get all user for admin #################################### */

/* #################################### start admin ban compte user #################################### */
app.put("/aaqari/api/admin/ban/compteUser" ,cors(),async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    try {
    const user = await Utilisateurs.findByIdAndUpdate(data.userId);
    if(!user){
        const etat = statusRequest("404" , "user n'existe pas");
        return res.send({etat}).json();
    }
    user.EtatCompte = "ban"
    await user.updateOne(user) ;
   

    res.send({etat , user});
    }
    catch(err){
        res.status(500).send('oops recuperation de users est échoué');
    }

})

app.put("/aaqari/api/admin/activate/compteUser" ,cors(),async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    try {
    const user = await Utilisateurs.findByIdAndUpdate(data.userId);
    if(!user){
        const etat = statusRequest("404" , "user n'existe pas");
        return res.send({etat}).json();
    }
    user.EtatCompte = "Active"
    await user.updateOne(user) ;
   

    res.send({etat , user});
    }
    catch(err){
        res.status(500).send('oops recuperation de users est échoué');
    }

})


/* #################################### end admin ban compte user #################################### */


/* #################################### start admin update data compte user #################################### */
app.put("/aaqari/api/admin/update/data/compteUser" ,cors(),async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const currentTime = new Date();
    const formattedDate = format(currentTime, 'dd/MM/yyyy HH:mm');

    try {
    const user = await Utilisateurs.findByIdAndUpdate(data.userId);
    if(!user){
        const etat = statusRequest("404" , "user n'existe pas");
        return res.send({etat}).json();
    }

    user.nom = data.nom
    user.prenom = data.prenom
    user.DateNaissance = data.dateNass
    user.ComeQui = data.comeQui
    user.Cin = data.cin
    user.NumTel = data.tel
    user.userName = data.gmail
    user.auth.email = data.gmail

    const salt = bcrypt.genSaltSync(10);
    const PassHash = bcrypt.hashSync(data.newPass,salt);

    user.auth.password = PassHash
    user.auth.dateModification = formattedDate

    await user.updateOne(user);
    res.send({etat , user});
    }
    catch(err){
        res.status(500).send('oops recuperation de users est échoué');
    }

})
/* #################################### end admin update data compte user #################################### */


/* #################################### start admin gestion des rapports #################################### */
app.get("/aaqari/api/Admin/rapports", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const vide = null
  
    try {
        const AnnonceRpporter = await Property.find({ signaler: { $exists: true, $not: { $size: 0 } } });

        res.send({AnnonceRpporter,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   

})


/* #################################### end admin gestion des rapports #################################### */




/* #################################### start suspendre annonce signalé admin #################################### */
app.put("/aaqari/api/Admin/rapport/decision/suspendre", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const idProperty = data.idProperty;
  
    try {
        const AnnonceSuspendre = await Property.findByIdAndUpdate(idProperty);

        AnnonceSuspendre.statutImmo = "suspendre" ;
        await AnnonceSuspendre.updateOne(AnnonceSuspendre) ;

        res.send({AnnonceSuspendre,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   
})
/* #################################### end suspendre annonce signalé admin #################################### */

/* #################################### start reactiver annonce signalé admin  (publier) #################################### */
app.put("/aaqari/api/Admin/rapport/decision/reactiver", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const idProperty = data.idProperty;
  
    try {
        const AnnonceSuspendre = await Property.findByIdAndUpdate(idProperty);

        AnnonceSuspendre.statutImmo = "publier" ;
        await AnnonceSuspendre.updateOne(AnnonceSuspendre) ;

        res.send({AnnonceSuspendre,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   
})
/* #################################### end reactiver annonce signalé admin (publier) #################################### */


/* #################################### start get user by id admin  #################################### */
app.post("/aaqari/api/Admin/getUserById/rapport", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const idUser = data.idUser;
  
    try {
        const user = await Utilisateurs.findById(idUser);


        res.send({user,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   
})

/* #################################### end get user by id admin  #################################### */

/* #################################### start annuler rapport signalé admin #################################### */
app.put("/aaqari/api/Admin/rapport/decision/AnnulerRapport", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const idProperty = data.idProperty;
  
    try {
        const updatedProperty = await Property.findByIdAndUpdate(
            idProperty,
            { $set: { signaler: [], statutImmo: "publier" } },
            { new: true }
        );

        await updatedProperty.updateOne(updatedProperty) ;

        res.send({updatedProperty,etat});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   
})
/* #################################### start annuler rapport signalé admin #################################### */

app.listen(2000,()=>{
    console.log("Iam listining in porte 2000");
});