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
app.use(express.json());






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






























app.listen(2000,()=>{
    console.log("Iam listining in port 2000");
});