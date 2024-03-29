const express = require("express");
const mongoose = require("mongoose");
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
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParsar());
app.use(cors({
    origin :"http://localhost:3000",
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

/* request new property and save*/
app.post("/createProperty",async (req,res)=>{
    const newProperty = new Property()
    const data = req.body;
    newProperty.nom ="villa 2"
    newProperty.type = "residence"
    newProperty.description ="villa contient de 6 chambre blablabla "

    newProperty.adresse.region = "kasserine"
    newProperty.adresse.ville ="foussana"
    newProperty.adresse.zone =""
    newProperty.adresse.gps = ""

    newProperty.photos =["img1.jpg","img2.jpg","img3.jpg"]
    newProperty.operation ="achat"

    newProperty.IsLocation.valueLoc = true
    newProperty.IsLocation.season = "3mois"
    newProperty.IsLocation.prix = 1500

    newProperty.IsVendre.valueVendre = false
    newProperty.IsVendre.prix = 0

    newProperty.features.espace = "200mettre"

    newProperty.IsResidence.ValueResid = true
    newProperty.IsResidence.nbChambre = 6
    newProperty.IsResidence.specification.bedRoom = 7
    newProperty.IsResidence.specification.piscine = true

    newProperty.proprietaireDetail.idProp ="123456789"
    newProperty.proprietaireDetail.nomComplet="sami salhi"
    newProperty.proprietaireDetail.imgProfil="12536.jpg"
    newProperty.proprietaireDetail.tel = "63789521"
    newProperty.proprietaireDetail.email = "salhi bilel"

    newProperty.DateCreation ="12/3/2024"
    newProperty.prixGlobal = 1500


    await newProperty.save()

    res.send("property created successfilly")

})



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
    
    const data = req.body;

    /*res.send("hi " + data.gmail+" "+data.password)*/
    try{
    const user = await Utilisateurs.findOne( {userName : data.gmail});
    if(!user) return res.status(404).json("utilisateur n'exist pas")

    const isPasswordCorrect = await bcrypt.compare(data.password ,user.auth.password);
    if(!isPasswordCorrect) return res.send("Mot de passe ou nom d’utilisateur erroné")  /*.status(400) */

    
    const{isAdmin, ...otherDetails } = user._doc;

    const isAdminValue = user.isAdmin;

    const token = jwt.sign({id : user._id, isAdminValue},jwt_Secret_Key);

    res.cookie("access_token",token,{httpOnly:true,}).status(200).json({...otherDetails,token});
    }catch(err){
        res.send("recuperation des information d'utilisateur est echoué") /*.status(500) */
    }
    
})
/* #################################### end connexion au compte utilisateur #################################### */


/* #################################### start creation  compte utilisateur #################################### */
app.post("/aaqari/api/inscription",cors() ,async (req,res)=>{
    

    try{
        const data = req.body;
        const user = await Utilisateurs.findOne( {userName : data.gmail});
        if(user) {return res.json("votre gmail déjà utilisé")} 
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




app.listen(2000,()=>{
    console.log("Iam listining in porte 2000");
});