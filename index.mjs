import axios from "axios";

// Getting references to HTML elements
const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
const carousel = document.getElementById("carouselExampleControls");

// API key for accessing the Cat API
const API_KEY = "live_JUzP7iAYoOWVszHKtiY2dE9lrsuGwSFMh8ZafEgZarKwt40Ku6pXOScCxacYpJ2R"; 

// Function to load breeds initially
async function initialLoad() {
  try {
    // Fetching list of cat breeds from the Cat API
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");

    // Populating breed select dropdown with options
    response.data.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Adding event listener for breed select dropdown change
    breedSelect.addEventListener("change", handleBreedSelection);

    // Calling handleBreedSelection function to load images for the initially selected breed
    handleBreedSelection();
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

initialLoad(); // Calling initialLoad function

// Function to handle breed selection
async function handleBreedSelection() {
  try {
    const selectedBreedId = breedSelect.value;
    // Fetching images for the selected breed from the Cat API
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreedId}`
    );

    // Clearing the carousel container
    carousel.innerHTML = "";

    // Adding images to the carousel
    response.data.forEach((breed) => {
      const carouselElement = document.createElement("img");
      carouselElement.src = breed.url;
      carouselElement.alt = breed.name;
      carousel.appendChild(carouselElement);
    });

    // Clearing the info dump section
    infoDump.innerHTML = "";

    // Displaying additional information about the selected breed
    displayAdditionalInfo(selectedBreedId);
  } catch (error) {
    console.error("Error fetching breed information:", error);
  }
}

// Object containing additional information data keys and corresponding labels
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

// Function to display additional information about a breed
async function displayAdditionalInfo(breedId) {
  try {
    // Fetching additional information about the breed from the Cat API
    const response = await axios.get(
      `https://api.thecatapi.com/v1/breeds/${breedId}`
    );

    const breedInfo = response.data;
    const infoSection = document.createElement("div");
    infoSection.classList.add("info-section");

    // Iterating over additionalInfoData object and creating paragraphs for available information
    for (const key in additionalInfoData) {
      if (breedInfo[key] !== undefined) {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${additionalInfoData[key]}: ${breedInfo[key]}`;
        infoSection.appendChild(paragraph);
      }
    }
    // Appending the info section to the info dump container
    infoDump.appendChild(infoSection);
  } catch (error) {
    console.error("Error fetching breed information:", error);
  }
}

// Function to favorite/unfavorite an image
async function favorite(imageId) {
  try {
      // Use axios to post to the cat API's favorites endpoint with the given image ID
      const response = await axios.post('https://api.thecatapi.com/v1/favourites', { image_id: imageId });
      console.log('Image favorited:', response.data);
      // Implement logic to handle the response as needed
  } catch (error) {
      console.error('Error favoriting image:', error);
  }
}

// Adding click event listener to the carousel
carousel.addEventListener("click", (event) => {
  // Checking if the clicked element is a favorite icon
  if (event.target.classList.contains("favorite-icon")) {
    const imageId = event.target.dataset.imageId;
    // Calling favorite function with the image ID
    favorite(imageId);
  }
});

// Function to fetch and display favorite images
async function getFavorites() {
  try {
    // Fetching favorite images from the server
    const response = await axios.get("/favorites");

    // Clearing the carousel container
    carousel.innerHTML = "";

    // Iterating over favorite images and adding them to the carousel
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

// Adding click event listener to the Get Favorites button
getFavouritesBtn.addEventListener("click", getFavorites);
