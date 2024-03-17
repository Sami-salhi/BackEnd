const nodemailer = require("nodemailer");


const transport = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 465,
    secure: true,
    auth: {
        user : 'lyrx.rnb@gmail.com',
        pass : "yabikausmnjcuxqi",
    },
});

module.exports.sendConfirmationEmail = async (email, activationCode)=>{
    await transport.sendMail({
        from : "lyrx.rnb@gmail.com",
        to: email,
        subject: "Confirmer votre compte",
        text:"Confirmation",
        html: CardHtml(activationCode),
    })
    .catch((err)=> console.log("Oops envoyer mail is failled"));

};

function CardHtml(code) {
    return("<div><h2>Bonjour</h2><h1>Email de confirmation</h1><p> Pour activer votre compte , veuillez retaper ce code la </p>  <h1>"+code+"</h1></div>"   
    )
    
}