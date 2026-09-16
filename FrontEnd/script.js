
async function afficherLesImages() {
    const response = await fetch("http://localhost:5678/api/works");
    const images = await response.json();
    for (const image of images) {
        console.log(image.title);
    }
    const gallery = document.querySelector(".gallery");
    const img = document.createElement("img")

    img.src = images[0].imageUrl;

    gallery.appendChild(img);
}

afficherLesImages();