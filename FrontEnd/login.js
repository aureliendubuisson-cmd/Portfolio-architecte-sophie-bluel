const form = document.querySelector("form");
form.addEventListener('submit', login);
async function login(event) {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;


     const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify({email, password}),
        headers: {'content-type': 'application/json'}
})
    const data = await response.json();

     if (response.status === 200) {
         localStorage.setItem("token", data.token);
         window.location.href = "index.html";
     }
     else {
         document.querySelector(".error").classList.add("active");
     }
}