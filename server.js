require("dotenv").config();
console.log(process.env.EMAIL_USER);
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const Contact = require("./models/contact");
const Course = require("./models/course");
console.log("SERVER FILE =", __filename);
const Note = require("./models/Note");
const mongoose = require("mongoose");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
mongoose.connect("mongodb://praveen:praveen123@ac-iecp8ks-shard-00-00.cx4wwye.mongodb.net:27017,ac-iecp8ks-shard-00-01.cx4wwye.mongodb.net:27017,ac-iecp8ks-shard-00-02.cx4wwye.mongodb.net:27017/mywebsite?ssl=true&replicaSet=atlas-gyosc6-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0")

.then(() => {

    console.log("MongoDB Connected");

})

.catch((error) => {

    console.log(error);

});

/* MULTER STORAGE */

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads");

    },

    filename: function(req, file, cb){

        cb(null, Date.now() + "-" + file.originalname);

    }

});

const upload = multer({ storage: storage });


// Email notification


const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});


/* MIDDLEWARE */

app.use(express.static("public"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* HOME ROUTE */

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/public/index.html");

});


/* CHECK ROUTE */

app.get("/check", (req,res)=>{

    res.send(__dirname);

});
app.get("/testpdf", (req,res)=>{

    res.sendFile(
        path.join(__dirname, "uploads", "1780471148721-Networking_networks.pdf")
    );

});



/* PDF UPLOAD ROUTE */

app.post("/upload-note", upload.single("pdf"), async (req, res) => {

    try{

        console.log(req.file);

        const newNote = new Note({

            title:req.file.originalname,

            pdf:req.file.filename

        });

        await newNote.save();

        console.log("Note Saved");

        res.send("PDF Uploaded Successfully");

    }

    catch(error){

        console.log(error);

        res.send("Error Uploading PDF");

    }

});



/* GET ALL NOTES */

app.get("/notes", async (req, res) => {

    try{

        const notes = await Note.find();

        res.json(notes);

    }

    catch(error){

        console.log(error);

        res.status(500).send("Error Fetching Notes");

    }

});




app.get("/hello", (req,res)=>{
    res.send("HELLO PRAVEEN");
});

/* SERVER */
app.get("/admin", (req,res)=>{

    res.sendFile(
        __dirname + "/public/admin.html"
    );

});

// course
console.log("UPLOAD COURSE ROUTE LOADED");
app.post("/upload-course", async (req,res)=>{

    try{

        const newCourse = new Course({

            title:req.body.title,

            description:req.body.description,

            price:req.body.price,

            videoLink:req.body.videoLink

        });

        await newCourse.save();

        res.send("Course Saved Successfully");

    }

    catch(error){

        console.log(error);

        res.send("Error Saving Course");

    }

});
console.log("COURSES ROUTE LOADED");


app.get("/courses", async(req,res)=>{

    try{

        const courses = await Course.find();

        res.json(courses);

    }

    catch(error){

        console.log(error);
        res.status(500).send("Error Fetching Courses");

    }

});

// course
app.get("/course/:id", async(req,res)=>{

    try{

        const course =
        await Course.findById(req.params.id);
        console.log("ID =", req.params.id);
console.log("COURSE =", course);

if(!course){
    return res.send("Course Not Found In MongoDB");
}

        let lessonsHTML = "";

        course.lessons.forEach((lesson,index)=>{

            lessonsHTML += `

            <li
            onclick="changeVideo(
'${lesson.videoLink}',
'${lesson.title}',
'${lesson.description}'
)"
            style="cursor:pointer; margin:10px 0;">

                ${lesson.title}

            </li>

            `;

        });

        res.send(`

        <html>

        <body>

        <h1>${course.title}</h1>

        <p>${course.description}</p>

        <div style="display:flex; gap:40px;">

            <div style="width:30%;">

                <h2>Lessons</h2>

                <ul>

                    ${lessonsHTML}

                </ul>

            </div>

            <div style="width:70%;">

                <iframe
                id="videoPlayer"
                width="800"
                height="450"
                src="https://www.youtube.com/embed/uIlNQUN_FA8"
                frameborder="0"
                allowfullscreen>
                </iframe>
                <h2 id="lessonTitle"></h2>

                <p id="lessonDescription"></p>

            </div>

        </div>

        <script>

        function changeVideo(link,title,description){

    document.getElementById("videoPlayer").src = link;

    document.getElementById("lessonTitle").innerText = title;

    document.getElementById("lessonDescription").innerText = description;

}

        </script>

        </body>

        </html>

        `);

    }

    catch(error){

        console.log(error);

        res.send("Course Not Found");

    }

});


app.get("/add-lessons", async (req, res) => {

    await Course.updateOne(
        { title: "AutoCAD Complete Course" },
        {
            $set: {
                lessons: [
                    {
                        title: "Lesson 1",
                        description: "AutoCAD ToolBars Explained With Examples Mechanical, Civil, Archtecture",
                        videoLink: "https://www.youtube.com/embed/uIlNQUN_FA8"
                    },
                    {
                        title: "Lesson 2",
                        description: "How to Draw Centre,-Axis,End, -Elliptical Arc, Quickly in AutoCAD",
                        videoLink: "https://www.youtube.com/embed/kIItMJ9tWnE"
                    },
                     {
                        title: "Lesson 3",
                        description: "How to Draw Hatch,Gradient, Boundary Quickly in AutoCAD ",
                        videoLink: "https://www.youtube.com/embed/VDhFqgsqeQM"
                       
                    }
                    ,
                     {
                        title: "Lesson 4",
                        description: "10+ Powerful Draw Commands(Spline,Construction Divide,3D POLYLINE,Measure) ",
                        videoLink: "https://www.youtube.com/embed/lxWqvpTf3c0"
                      
                       
                    } ,
                     {
                        title: "Lesson 5",
                        description:"AutoCAD Tutorial For Beginners Modify Toolbar Explained in Hindi (Part-1)",
                        videoLink: "https://www.youtube.com/embed/ZoJ0vYWRST4"
                       
                      
                       
                    }
                     ,
                     {
                        title: "Lesson 6",
                        description: "Modify Toolbar Explained in Hindi(Part-2)Fillet, Explode,Strech,Scale ",
                        videoLink: "https://www.youtube.com/embed/qYY0t8cjjtQ"
                      
                       
                    }
                     ,
                     {
                        title: "Lesson 7",
                        description: "AutoCAD Annotation Toolbar ",
                        videoLink: "https://www.youtube.com/embed/MaIIw-X_ors"
                        
                      
                       
                    }
                     ,
                     {
                        title: "Lesson 8",
                        description: "Autocad Layer Command Tutorial Complete (Layer Properties) Manager  ",
                        videoLink: "https://www.youtube.com/embed/h3LLKM2ZJRo"
                        
                      
                       
                    }
                     ,
                     {
                        title: "Lesson 9",
                        description: "Autocad Block Properties-1 Trick You Must Know Block Properties Explained",
                        videoLink: "https://www.youtube.com/embed/kD5znAyvU14"
                        
                      
                       
                    }
                     ,
                     {
                        title: "Lesson 10",
                        description: "AutoCAD Group Tool Tutorial  | Group, Ungroup, GroupEdit & Pickstyle ",
                        videoLink: "https://www.youtube.com/embed/MlyTOzvuCoo"
                        
                      
                       
                    }
                     ,
                     {
                        title: "Lesson 11",
                        description: "AutoCAD Utilities Toolbar  | Measure (Angle, Area, Volume) + Quick Select ++Calculator ",
                        videoLink: "https://www.youtube.com/embed/lTU9rHT7Kis"
                       
                       
                    }
                     ,
                     {
                        title: "Lesson 12",
                        description: "AutoCAD Clipboard Commands | Copy, Cut, Paste, as Block & Paste Special Explained ",
                        videoLink: "https://www.youtube.com/embed/gERXGKht8uI"
                        
                      
                       
                    }
                    ,
                     {
                        title: "Lesson 13",
                        description: "AutoCAD Blueprint Effect in 2 Minutes",
                        videoLink: "https://www.youtube.com/embed/E57k_yJZVLg"
                       
                     }
                     ,
                     {
                        title: "Lesson 14",
                        description: "AutoCAD Start Karne Se Pehle Ye Setting Zaroor Karo(Unit setup+Dimension Style Mangerutes",
                        videoLink: "https://www.youtube.com/embed/EdOTyU0qexI"
                       
                        
                     }
                      ,
                     {
                        title: "Lesson 15",
                        description: "AutoCAD Print Setup & DWG to PDF  Mechanical + Civil Drawing(Step by Step)",
                        videoLink: "https://www.youtube.com/embed/tWDP0HhQV34"
                        
                       
                        
                     }
                ]
            }
        }
    );

    res.send("Lessons Added");
});



app.get("/add-project-lessons", async(req,res)=>{

await Course.updateOne(
     {_id: "6a2d7c6cdc0f2fa5f5934819"},

    {
        $push:{
            lessons:[{
                title:"Project 1",
                description:"Mechanical Bracket Design",
                videoLink:"https://www.youtube.com/embed/-N5pSYF5B24"
                
            },
            {
                title:"Project 2",
                description:"Drawing Practice 2D Mechanical, Civil, Arch",
                videoLink:"https://www.youtube.com/embed/eBBn95Zr4WI"
                
                
            },
            {
                title:"Project 3",
                description:"Mechanical Component",
                videoLink:"https://www.youtube.com/embed/INMtWUBE-Mg"
               
                
            },
            {
                title:"Project 4",
                description:"AutoCAD Mechanical Practice Drawing",
                videoLink:"https://www.youtube.com/embed/1NhPgOPYIrc"
                
                
            },
            {
                title:"Project 5",
                description:"Mechanical Plate Design Tutorial Step By Step",
                videoLink:"https://www.youtube.com/embed/88LRew6Xelo"
               
                
            },
            {
                title:"Project 6",
                description:"AutoCAD Shaft Drawing Tutorial for Beginners",
                videoLink:"https://www.youtube.com/embed/GbwWTWU631U"
                
                
            },
            {
                title:"Project 7",
                description:"AutoCAD Mechanical Exercise Drawing | Step By Step Tutorial 100% Easy Trick",
                videoLink:"https://www.youtube.com/embed/apGyXgPYETQ"
                
                
            },
            {
                title:"Project 8",
                description:"AutoCAD Mechanical Flange Drawing Tutorial | PCD Hole & Section View Practice Drawing",
                videoLink:"https://www.youtube.com/embed/_iHAhSUU-AU"
                
                
            },
            {
                title:"Project 9",
                description:"AutoCAD 2D Practice Drawing Exercise 5 | Is Drawing Ko 90% Log Galat Banate Hain",
                videoLink:"https://www.youtube.com/embed/-UJ_o9hfQ7w"
                
                
            },
            {
                title:"Project 10",
                description:"AutoCAD Tutorial For Beginners Modify Toolbar Explained in Hindi (Part-1)",
                videoLink:"https://www.youtube.com/embed/ZoJ0vYWRST4"
              
                
                
            }
            ]

        }
    }
);

res.send("Lesson Added");

});




// contact route...

app.post("/contact", async (req, res) => {

    try {

        const { name, email,phone, message } = req.body;

        // MongoDB me save
        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();

        // Email send
        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: "New Contact Form Message",

            html: `

                <h2>New Contact Request</h2>

                <p><b>Name:</b> ${name}</p>

                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>

                <p><b>Message:</b> ${message}</p>

            `
        });

        res.send("Message Sent Successfully");

    }

    catch(error) {

        console.log(error);

        res.send("Error Sending Message");

    }

});




app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});




