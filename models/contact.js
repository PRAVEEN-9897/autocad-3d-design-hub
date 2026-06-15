

console.log("CONTACT JS LOADED");
contactForm.addEventListener("submit", async function(e){

    e.preventDefault();

    alert("FORM SUBMITTED");

});





const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },
    phone:{
          type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    }

});

module.exports = mongoose.model("Contact", contactSchema);
