const express = require("express");
const mongoose = require("mongoose");
const app = express();





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

app.post("/envoyerMail",  (req,res)=>{
    let code =  generateCodeConfirmation();
    const mailto = "samisalhi.rnb@gmail.com";
    sendConfirmationEmail(mailto,code);
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















app.listen(2000,()=>{
    console.log("Iam listining in port 2000");
});