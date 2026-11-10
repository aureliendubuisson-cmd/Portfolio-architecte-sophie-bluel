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
    document.querySelector(".modal-view-gallery").classList.remove("hidden");
    document.querySelector(".modal-view-add").classList.add("hidden");
});

document.querySelector(".modal-close").addEventListener("click", () => {
    document.querySelector(".modal").classList.remove("active");
});

document.querySelector(".modal-add-btn").addEventListener("click", () => {
    document.querySelector(".modal-view-gallery").classList.add("hidden");
    document.querySelector(".modal-view-add").classList.remove("hidden");
});

document.querySelector(".modal-back").addEventListener("click", () => {
    document.querySelector(".modal-view-gallery").classList.remove("hidden");
    document.querySelector(".modal-view-add").classList.add("hidden");
});


async function deleteWork(workId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.ok;
}

function displayModalWorks(works) {
    const gallery = document.querySelector(".modal-gallery");
    gallery.innerHTML = "";
    for (const work of works) {
        const figure = document.createElement("figure");

        const img = document.createElement("img")
        img.src = work.imageUrl;

        const button = document.createElement("button");
        button.textContent = "X";
        button.setAttribute("aria-label", "Supprimer");
        button.addEventListener("click", async () => {
            const isDeleted = await deleteWork(work.id);
            if (isDeleted) {
                figure.remove();

                const position = works.indexOf(work);
                works.splice(position, 1);
                displayWorks(works);
            }
        });

        figure.appendChild(img);
        figure.appendChild(button);
        gallery.appendChild(figure);
    }

}


async function addWork(formData) {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        return null;
    }
    return await response.json();
}

function displayCategoryOptions(categories) {
    const select = document.querySelector("#category");
    for (const category of categories) {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    }
}

function initialisationAddPhotoForm(works) {
    const form = document.querySelector(".modal-form");
    const error = form.querySelector(".error");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.classList.remove("active");

        const newWork = await addWork(new FormData(form));
        if (!newWork) {
            error.classList.add("active");
            return;
        }

        newWork.categoryId = Number(newWork.categoryId);
        works.push(newWork);
        displayWorks(works);
        displayModalWorks(works);

        form.reset();
        document.querySelector(".modal-view-gallery").classList.remove("hidden");
        document.querySelector(".modal-view-add").classList.add("hidden");
    });
}


async function init() {
    const works = await getWorks();
    displayWorks(works);
    displayModalWorks(works);
    const categories = await getCategories();
    displayCategories(categories, works);
    displayCategoryOptions(categories);
    initialisationAddPhotoForm(works);
}

init();