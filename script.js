let catContainer = document.getElementById("cats-container");
let breedSelector = document.getElementById("breed_selector");
let breedImage = document.getElementById("breed_image");
let breedInfo = document.getElementById("breed_json");
let wikiLink = document.getElementById("wiki_link");

const apiKey =
  "live_fxDGq2ushTvAzWHWb53HvzAqrFLais3RM5FRmH6eoAPGPriGFZb5nw8kT62ngdNs";
const breedUr1 = "https://api.thecatapi.com/v1/breeds";
let storedBreeds = [];

async function getBreeds() {
  try {
    const respuesta = await fetch(breedUr1, {
      headers: { "x-api-key": apiKey },
    });

    if (!respuesta.ok) {
      throw new Error(`Error al obtener razas: ${respuesta.status}`);
    }

    let data = await respuesta.json();
    storedBreeds = data;

    breedSelector.innerHTML = `<option value="">Cats</option>`;

    storedBreeds.forEach((breed, index) => {
      let option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelector.appendChild(option);
    });
  } catch (error) {
    console.error("Error obteniendo razas:", error);
  }
}

function clearDisplay() {
  catContainer.innerHTML = "";
  breedImage.src = "";
  breedInfo.textContent = "";
  wikiLink.textContent = "";
  document.getElementById("breed-info-container").style.display = "none";
}

async function getData(breedId = "") {
  try {
    document.getElementById("loader").style.display = "block";

    clearDisplay();

    let url = `https://api.thecatapi.com/v1/images/search?limit=10&order=RANDOM&page=0&api_key=${apiKey}`;

    if (breedId) {
      url = `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${apiKey}`;
    }

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`Response status: ${respuesta.status}`);
    }

    const imagenes = await respuesta.json();
    imagenes.forEach((imagen) => {
      const card = document.createElement("div");
      card.classList.add("cat-card");

      let imgElement = document.createElement("img");
      imgElement.src = imagen.url;
      imgElement.alt = "Imagen de un gato";
      imgElement.classList.add("cat-img");

      const heartIcon = document.createElement("img");
      heartIcon.src = "icono/hug.png";
      heartIcon.alt = "Like";
      heartIcon.classList.add("heart-icon");

      const likeButton = document.createElement("i");
      likeButton.className = "fi fi-ts-cat-head cat-like-button";

      const commentButton = document.createElement("i");
      commentButton.className = "fi fi-ts-comment-heart cat-action-button";

      const shareButton = document.createElement("i");
      shareButton.className = "fi fi-tr-source-document cat-action-button";

      imgElement.addEventListener("click", () => {
        const isLiked = likeButton.classList.toggle("liked");

        if (isLiked) {
          likeCount++;
          heartIcon.classList.add("show", "bounce");
        } else {
          likeCount--;
        }

        likeText.textContent = `${likeCount} ${
          likeCount === 1 ? "like" : "likes"
        }`;

        setTimeout(() => {
          heartIcon.classList.remove("show", "bounce");
        }, 900);
      });

      likeButton.addEventListener("click", () => {
        const isLiked = likeButton.classList.toggle("liked");

        if (isLiked) {
          likeCount++;
          heartIcon.classList.add("show", "bounce");
        } else {
          likeCount--;
        }

        likeText.textContent = `${likeCount} ${
          likeCount === 1 ? "like" : "likes"
        }`;

        setTimeout(() => {
          heartIcon.classList.remove("show", "bounce");
        }, 900);
      });

      card.appendChild(imgElement);
      const actionContainer = document.createElement("div");
      actionContainer.className = "cat-actions";

      actionContainer.appendChild(likeButton);
      actionContainer.appendChild(commentButton);
      actionContainer.appendChild(shareButton);
      card.appendChild(actionContainer);

      let likeCount = 0;
      const likeText = document.createElement("p");
      likeText.classList.add("like-count");
      likeText.textContent = `${likeCount} likes`;

      card.appendChild(likeText);
      card.appendChild(heartIcon);
      catContainer.appendChild(card);
    });

    if (breedId) {
      let breedData = storedBreeds.find((breed) => breed.id === breedId);
      if (breedData) {
        breedImage.src = imagenes[0]?.url || "";
        breedInfo.textContent =
          breedData.temperament || "No hay información disponible";
        wikiLink.href = breedData.wikipedia_url || "#";
        wikiLink.textContent = breedData.wikipedia_url
          ? "Más información en Wikipedia"
          : "";

        document.getElementById("breed-info-container").style.display = "block";
      }
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    document.getElementById("loader").style.display = "none";
  }
}

breedSelector.addEventListener("change", function () {
  let selectedBreed = this.value;
  if (selectedBreed) {
    getData(selectedBreed); // Llamamos la función con el ID de la raza seleccionada
  } else {
    getData(); // Si no hay raza seleccionada, mostramos imágenes aleatorias
  }
});

getBreeds();
getData();
