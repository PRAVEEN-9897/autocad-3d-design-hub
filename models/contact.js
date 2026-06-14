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
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async function(e){

    e.preventDefault();

    console.log("FORM SUBMITTED");

    const formData = new FormData(contactForm);

    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message")
    };

    console.log(data);

    alert("Button Clicked");
});