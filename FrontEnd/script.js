async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}


function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    for (const work of works) {
        const img = document.createElement("img")
        img.src = work.imageUrl;
        gallery.appendChild(img);
        console.log(work.title);
    }
}


async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

function displayCategories(categories) {
    const filters = document.querySelector(".filters");
    const tous = document.createElement('button');
    tous.textContent = "Tous";
    filters.appendChild(tous);

    for (const category of categories) {
        const filter = document.createElement("button");
        filter.textContent = category.name;
        filters.appendChild(filter);
    }
}

async function init() {
    const works = await getWorks();
    displayWorks(works);
    const categories = await getCategories();
    displayCategories(categories);
}

init();