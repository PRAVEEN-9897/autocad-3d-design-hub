const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    title: String,

    description: String,

    lessons: [
        {
           title: String,
            description: String,
            videoLink: String
        }
    ]

});

module.exports = mongoose.model("Course", courseSchema);