const form = document.querySelector("form");
form.addEventListener('submit', login);
async function login(event) {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify({email, password}),
        headers: {'content-type': 'application/json'}
})
}