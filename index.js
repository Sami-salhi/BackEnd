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
    origin :"http://localhost:3000" || "http://192.168.1.129:3000",
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
/* ################### end function testing is residsence ou non ################### */

/* ################### start request new property and save ################### */
app.post("/aaqari/api/proprietaire/createProperty", cors() ,async (req,res)=>{
    const etat = statusRequest("200" , "success");
    const data = req.body;
    const currentTime = new Date();
    const formattedDate = format(currentTime, 'dd/MM/yyyy HH:mm');
    const opt ="vendre" /* location */
    try {
        const newProperty = new Property()

        newProperty.nom ="villa 2"
        newProperty.type = "residence"
        newProperty.CodeImmo=generateCodeNewImmo()
        newProperty.description ="villa contient de 6 chambre blablabla "

        newProperty.region = "kasserine"
        newProperty.ville ="foussana"
        newProperty.zone =""
        newProperty.gps = ""

        newProperty.ImgDocCertificat = "doc.1"
        newProperty.photos.imgPrincipal = "immo.png"
        newProperty.photos.imgSecondaire1 = "immo1.png"
        newProperty.photos.imgSecondaire2 = "immo2.png"
        newProperty.photos.imgSecondaire3 = "immo3.png"
        newProperty.photos.imgSecondaire4 = "immo4.png"

        newProperty.operation ="achat"
        if(opt ==="location"){
            newProperty.IsLocation.valueLoc = true
            newProperty.IsLocation.periode = "mois"
            newProperty.IsLocation.prix = 1500
        }else{
            newProperty.IsLocation.valueLoc = false
            newProperty.IsLocation.periode = ""
            newProperty.IsLocation.prix = 0
        }
        
        if(opt ==="vendre"){
            newProperty.IsVendre.valueVendre = true
            newProperty.IsVendre.prix = 1500
        }else{
            newProperty.IsVendre.valueVendre = false
            newProperty.IsVendre.prix = 0
        }
        

        newProperty.features.espace = "200mettre"
        const resid ="Maison d'hote"
        const IsResid =IsResidence(resid);
        if(IsResid){
            newProperty.IsResidence.ValueResid = true
            newProperty.IsResidence.nbChambre = 6
            newProperty.IsResidence.specification.bedRoom = 7
            newProperty.IsResidence.specification.piscine = PiscineIsExist("Non")
        }else{
            newProperty.IsResidence.ValueResid = false
            newProperty.IsResidence.nbChambre = 0
            newProperty.IsResidence.specification.bedRoom = 0
            newProperty.IsResidence.specification.piscine = false
        }
        

        newProperty.idProprietaire = "123456789"
        newProperty.proprietaireDetail.idProp ="123456789"
        newProperty.proprietaireDetail.nomComplet="sami salhi"
        newProperty.proprietaireDetail.imgProfil="12536.jpg"
        newProperty.proprietaireDetail.tel = "63789521"
        newProperty.proprietaireDetail.email = "salhi bilel"

        newProperty.DateCreation =formattedDate
        newProperty.prixGlobal = 1500
        newProperty.statutImmo ="en attente"


        /*await newProperty.save()*/

        res.send({etat , newProperty})
        
    } catch (error) {
        const etat = statusRequest("500" , "echec");
        res.send({etat})
    }
    

    

})
/* ################### end request new property and save ################### */


/* request get all property*/
app.get("/recupererAllProperty",async (req,res)=>{
    try {
    const propertyAll = await Property.find();

    res.json(propertyAll);}
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
   

    try {
        const property = await Property.findByIdAndUpdate(idprop);

        if(!property) {
            const etat = statusRequest("404" , "property n'existe pas");
            return res.send({etat}).json();
        }
        property.signaler.push({
            idClient : data.idClient,
            nomComplet : data.nomComplet,
            raison : data.raison,
            justification : data.justification,
            dateSignal : currentTime
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

        if(opt ==="achat"){
            newDemande.IsAchat.valueAchat = true
            newDemande.IsAchat.montantPropose = data.montantPropose
        }else{
            newDemande.IsAchat.valueAchat = false
            newDemande.IsAchat.montantPropose = ""
        }

        newDemande.idConcernéProprietaire = data.IdProprietaire
        newDemande.CinProprietaire = data.CinProprietaire
        newDemande.infoProprietaire.nom = data.nomProp
        newDemande.infoProprietaire.prenom = data.prenomProp
        newDemande.infoProprietaire.NumeroTel = data.numeroTelProp
        newDemande.infoProprietaire.gmail = data.gmailProp

        newDemande.dateDemande = currentTime

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
            dateOffre : currentTime,
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





app.listen(2000,()=>{
    console.log("Iam listining in porte 2000");
});