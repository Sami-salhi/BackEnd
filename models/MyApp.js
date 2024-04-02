const mongoose= require("mongoose");
const Schema = mongoose.Schema

const MyApp = new Schema({
    nomApp: String,
    isActive : Boolean
})

const App = mongoose.model("Utilisateurs" , MyApp)
module.exports = App
