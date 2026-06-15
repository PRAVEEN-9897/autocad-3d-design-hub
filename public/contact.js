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

    console.log(data);

    const response = await fetch("/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.text();

    alert(result);
});