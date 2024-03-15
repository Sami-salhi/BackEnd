const nodemailer = require("nodemailer");


const transport = nodemailer.createTransport({
    service : "Gmail",
    auth: {
        user : "samisalhitnt@gmail.com",
        pass : "sami21032000salhi",
    },
});

module.exports.sendConfirmationEmail = (email, activationCode)=>{
    transport.sendMail({
        from : "samisalhitnt@gmail.com",
        to: email,
        subject: "Confirmer votre compte",
        html: /*CardHtml(activationCode)*/activationCode,
    })
    .catch((err)=> console.log("Oops envoyer mail is failled"));

};

/*function CardHtml(code) {
    return(
        <div>
        <h1>Email de confirmation</h1>
        <h2>Bonjour</h2>
        <p> Pour activer votre compte , veuillez retaper ce code la </p>
        <h1>{code}</h1>
        </div>
    )
    
}*/