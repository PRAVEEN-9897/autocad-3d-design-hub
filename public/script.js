function showSection(sectionId){

    let sections = document.querySelectorAll(".section");

    sections.forEach(function(section){

        section.classList.remove("active-section");

    });

    document.getElementById(sectionId)
    .classList.add("active-section");

}

/* CONTACT FORM */

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const formData = new FormData(contactForm);
    

    const data = {

        name: formData.get("name"),

        email: formData.get("email"),
        phone: formData.get("phone"),

        message: formData.get("message")

    };
    

    const response = await fetch("/contact", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    const result = await response.text();

    alert(result);

    contactForm.reset();

});

async function loadNotes() {

    const response = await fetch("/notes");

    const notes = await response.json();

    const notesContainer =
        document.getElementById("notesContainer");

    notesContainer.innerHTML = "";

    notes.forEach(note => {

        notesContainer.innerHTML += `

        <div class="note-card">

            <h3>${note.title}</h3>

            <a href="/uploads/${note.pdf}" target="_blank">

                <button>Download PDF</button>

            </a>

        </div>

        `;

    });

}

loadNotes();
async function loadCourses(){

    const response = await fetch("/courses");

    const courses = await response.json();

    const container =
    document.getElementById("coursesContainer");

    container.innerHTML = "";

    courses.forEach(course => {

        container.innerHTML += `

        <div class="card">

            <h3>${course.title}</h3>

            <p>${course.description}</p>

            <a href="/course/${course._id}">
             <button>
             View Details
            </button>
            </a>

        </div>

        `;

    });

}

loadCourses();
function scrollNotesLeft(){

    const container =
    document.getElementById("notesContainer");

    container.scrollBy({
        left:-400,
        behavior:"smooth"
    });

}

setInterval(() => {

    const container =
    document.getElementById("notesContainer");

    container.scrollBy({
        left:300,
        behavior:"smooth"
    });

    if(
        container.scrollLeft +
        container.clientWidth >=
        container.scrollWidth
    ){

        container.scrollTo({
            left:0,
            behavior:"smooth"
        });

    }

},2000);


const slider = document.querySelector(".project-slider");

setInterval(() => {

    slider.scrollBy({
        left: 270,
        behavior: "smooth"
    });

    if (
        slider.scrollLeft + slider.clientWidth
        >=
        slider.scrollWidth - 10
    ) {

        slider.scrollTo({
            left: 0,
            behavior: "smooth"
        });

    }

}, 2500);

const serviceSlider = document.querySelector(".service-slider");

setInterval(() => {

    serviceSlider.scrollBy({
        left:320,
        behavior:"smooth"
    });

    if(
        serviceSlider.scrollLeft + serviceSlider.clientWidth
        >= serviceSlider.scrollWidth - 10
    ){
        serviceSlider.scrollTo({
            left:0,
            behavior:"smooth"
        });
    }

},3000);
