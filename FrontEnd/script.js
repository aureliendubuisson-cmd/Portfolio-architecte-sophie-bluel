async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}


function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    for (const work of works) {
        const figure = document.createElement("figure");

        const img = document.createElement("img")
        img.src = work.imageUrl;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);

    }
}


async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

function displayCategories(categories, works) {
    const filters = document.querySelector(".filters");
    const tous = document.createElement('button');
    tous.textContent = "Tous";
    filters.appendChild(tous);
    tous.addEventListener('click', () => {document.querySelector('.filters button.active').classList.remove('active');
        displayWorks(works)
        tous.classList.add("active")});
    tous.classList.add("active")

    for (const category of categories) {
        const filter = document.createElement("button");
        filter.textContent = category.name;
        filters.appendChild(filter);
        filter.addEventListener('click', () => {
            const filteredWorks = works.filter(work => work.categoryId === category.id);
            document.querySelector('.filters button.active').classList.remove('active');
        filter.classList.add('active');
            displayWorks(filteredWorks);
        });
    }
}

function displayAdminMode() {
    const token = localStorage.getItem("token");

    if (token) {
        document.querySelectorAll(".admin").forEach(element => {
            element.classList.add("active");
        });
        document.querySelector(".login").classList.add("hidden");
    }
}

displayAdminMode();

document.querySelector(".logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

document.querySelector(".modifier").addEventListener("click", () => {
    document.querySelector(".modal").classList.add("active");
});

document.querySelector(".modal-close").addEventListener("click", () => {
    document.querySelector(".modal").classList.remove("active");
});

async function init() {
    const works = await getWorks();
    displayWorks(works);
    const categories = await getCategories();
    displayCategories(categories, works);
}

init();