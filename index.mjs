import axios from "axios";

// Getting references to HTML elements
const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
const carousel = document.getElementById("carouselExampleControls");

// API key for accessing cat API
const API_KEY =
  "live_JUzP7iAYoOWVszHKtiY2dE9lrsuGwSFMh8ZafEgZarKwt40Ku6pXOScCxacYpJ2R";

//Function to load
async function initialLoad() {
  try {
    //Fetching list of cat brreds
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");

    //dropdown with options
    response.data.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    //add event listener
    breedSelect.addEventListener("change", handleBreedSelection);

    //function to load images
    handleBreedSelection();
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

initialLoad();

//breed selection
async function handleBreedSelection() {
  try {
    const selectedBreedId = breedSelect.value;
    //Fetching images
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreedId}`
    );

    //Clearing carousel
    carousel.innerHTML = "";

    //Adding images to carousel
    response.data.forEach((breed) => {
      const carouselElement = document.createElement("img");
      carouselElement.src = breed.url;
      carouselElement.alt = breed.name;
      carousel.appendChild(carouselElement);
    });

    //Clearing the info dump section
    infoDump.innerHTML = "";

    //Displaying info
    displayAdditionalInfo(selectedBreedId);
  } catch (error) {
    console.error("Error fetching breed information:", error);
  }
}
//info on data keys and corresponding labels
const additionalInfoData = {
  adaptability: "Adaptability",
  affectionLevel: "Affection Level",
  childFriendly: "Child Friendly",
  dogFriendly: "Dog Friendly",
  energyLevel: "Energy Level",
  grooming: "Grooming",
  intelligence: "Intelligence",
  sheddingLevel: "Shedding Level",
  vocalisation: "Vocalisation",
  wikipediaUrl: "Wikipedia URL",
};

//additional info about a breed
async function displayAdditionalInfo(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/breeds/${breedId}`
    );

    const breedInfo = response.data;
    const infoSection = document.createElement("div");
    infoSection.classList.add("info-section");

    //creating paras for available info
    for (const key in additionalInfoData) {
      if (breedInfo[key] !== undefined) {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${additionalInfoData[key]}: ${breedInfo[key]}`;
        infoSection.appendChild(paragraph);
      }
    }
    //Appending the info section to the info dump container
    infoDump.appendChild(infoSection);
  } catch (error) {
    console.error("Error fetching breed information:", error);
  }
}
//Function to select img with fetch via axios
async function favorite(imageId) {
  try {
    const response = await axios.post(
      "https://api.thecatapi.com/v1/favourites",
      { image_id: imageId }
    );
    console.log("Image favorited:", response.data);
  } catch (error) {
    console.error("Error favoriting image:", error);
  }
}

//Adding event listener to carousel
carousel.addEventListener("click", (event) => {
  if (event.target.classList.contains("favorite-icon")) {
    const imageId = event.target.dataset.imageId;
  }
});

async function getFavorites() {
  try {
    const response = await axios.get("/favorites");

    //Clear carousel container
    carousel.innerHTML = "";

    //Iterating over images and adding them to carousel
    response.data.forEach(async (imgId) => {
      const imageResponse = await axios.get(`/images/${imgId}`);
      const image = imageResponse.data;
      const imgElement = document.createElement("img");
      imgElement.src = image.url;
      imgElement.alt = image.id;
      const favouriteIcon = document.createElement("span");
      favouriteIcon.classList.add("favorite-icon");
      favouriteIcon.dataset.imageId = image.id;
      favouriteIcon.innerHTML = "&#10084;";
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      carouselItem.appendChild(imgElement);
      carouselItem.appendChild(favouriteIcon);
      carousel.appendChild(carouselItem);
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}

// Adding click event listener to fa vbutton
getFavouritesBtn.addEventListener("click", getFavorites);
