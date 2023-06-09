// Define the maximum entries per slide
function createSlidesAndButtons(letter, entriesForLetter) {
  // Split entriesForLetter into chunks of size MAX_ENTRIES_PER_SLIDE
  let chunks = [];
  for (let i = 0; i < entriesForLetter.length; i += MAX_ENTRIES_PER_SLIDE) {
    chunks.push(entriesForLetter.slice(i, i + MAX_ENTRIES_PER_SLIDE));
  }

  // For each chunk, create a slide and button
  chunks.forEach((chunk, chunkIndex, all_chunks) => {
    // Create slide
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.id = `slide-${letter}-${chunkIndex + 1}`;

    // Create slide content
    let slideContent = document.createElement("ul");
    chunk.forEach((entry) => {
      let listItem = document.createElement("li");
      let button = document.createElement("button");
      button.textContent = entry;
      button.addEventListener("click", () => divClick(entry));
      listItem.appendChild(button);
      slideContent.appendChild(listItem);
    });
    slide.appendChild(slideContent);

    // Add slide to slidesContainer
    slidesContainer.appendChild(slide);

    // Create button
    const button = document.createElement("button");
    button.textContent = `${letter === "FAV" ? "⭐️" : letter}${
      all_chunks.length > 1 ? " " + getSuperscript(chunkIndex + 1) : ""
    }`; // Update button text
    button.dataset.slide = slide.id;
    button.addEventListener("click", navigateToSlide);

    // Add button to paginationContainer
    paginationContainer.appendChild(button);
  });
}

// Select DOM elements
const slidesContainer = document.querySelector(".slideshow");
const paginationContainer = document.querySelector(".pagination");
const arrowLeft = document.querySelector(".arrow.left");
const arrowRight = document.querySelector(".arrow.right");
const muteButton = document.querySelector(".mute-button");

const audio = new Audio(
  "https://www.myinstants.com/media/sounds/batman-transition-download-sound-link.mp3"
);

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// We build a Map data structure that groups entries by their first letter.
// Using JavaScript's reduce function, we construct the Map
// from our entries array.
// (in the form of { letter => [entries] })
const groupedEntries = entries.reduce((map, entry) => {
  let firstLetter = entry.charAt(0).toUpperCase(); // Extract the first letter
  if (!isNaN(firstLetter)) firstLetter = "#"; // if it's not a number, set it to #

  // The Map method set() updates the value for a key in the Map.
  // If the key doesn't exist yet, it will be added.
  // We're using the logical OR operator (||) to default to an empty array
  // if the key doesn't exist in the Map yet.
  map.set(firstLetter, map.get(firstLetter) || []);

  // We then add the current entry to the array of entries for this letter.
  map.get(firstLetter).push(entry);

  return map; // Return the updated Map to the next step in the reduce function
}, new Map());

groupedEntries.set("FAV", favorites || []);

// Now that we have our entries grouped by their first letter,
// we iterate over the keys of the Map (i.e., the first letters).
groupedEntries.forEach((entriesForLetter, letter) => {
  // Split entriesForLetter into chunks of size MAX_ENTRIES_PER_SLIDE
  let chunks = [];
  for (let i = 0; i < entriesForLetter.length; i += MAX_ENTRIES_PER_SLIDE) {
    chunks.push(entriesForLetter.slice(i, i + MAX_ENTRIES_PER_SLIDE));
  }

  // For each chunk, create a slide
  chunks.forEach((chunk, chunkIndex, all_chunks) => {
    // Create a new slide and assign it a class and id
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.id = `slide-${letter}-${chunkIndex + 1}`; // IDs are now of the form `slide-A-1`, `slide-A-2`, etc.

    // Create an unordered list element for this slide's content
    let slideContent = document.createElement("ul");

    // Iterate through each entry in the chunk
    chunk.forEach((entry) => {
      // Create a new list item and button for each entry
      let listItem = document.createElement("li");
      let button = document.createElement("button");
      // Set the button's text content to the entry
      button.textContent = entry;
      // Attach an event listener to the button that calls the divClick function when clicked
      button.addEventListener("click", () => divClick(entry));
      // Append the button to the list item
      listItem.appendChild(button);
      // Append the list item to the unordered list
      slideContent.appendChild(listItem);
    });
    // Set the slide's inner content to the unordered list we created
    slide.appendChild(slideContent);

    // Append the new slide to the slideshow container
    slidesContainer.appendChild(slide);

    // Create a new button for this slide, set its text and data attribute,
    // and add an event listener for the click event.
    // When clicked, the button will trigger the navigateToSlide function.
    const button = document.createElement("button");
    button.textContent = `${letter == "FAV" ? "⭐️" : letter}${
      all_chunks.length > 1 ? " #" + (chunkIndex + 1) : ""
    }`;
    button.dataset.slide = slide.id;
    button.addEventListener("click", navigateToSlide);

    // Add the button to the pagination container
    paginationContainer.appendChild(button);
  });
});

// If there are favorites, set the favorites slide as active. Otherwise, set the first slide as active
if (favorites.length > 0) {
  document.getElementById("slide-FAV-1").classList.add("active");
  paginationContainer
    .querySelector('button[data-slide="slide-FAV-1"]')
    .classList.add("active");
} else {
  slidesContainer.querySelector(".slide").classList.add("active");
  paginationContainer.querySelector("button").classList.add("active");
}
// Variable to keep track of the current slide index.
let currentSlideIndex = 0;

function navigateToSlide(event) {
  const targetSlide = event.target.dataset.slide;
  const slides = document.querySelectorAll(".slide");
  const pageButtons = document.querySelectorAll(".pagination button");

  slides.forEach((slide) => slide.classList.remove("active"));
  pageButtons.forEach((button) => button.classList.remove("active"));

  document.getElementById(targetSlide).classList.add("active");
  event.target.classList.add("active");
  currentSlideIndex = Array.from(pageButtons).findIndex((button) =>
    button.classList.contains("active")
  );
}

function navigateSlides(direction) {
  const slides = document.querySelectorAll(".slide");
  const pageButtons = document.querySelectorAll(".pagination button");

  slides[currentSlideIndex].classList.remove("active");
  pageButtons[currentSlideIndex].classList.remove("active");

  currentSlideIndex =
    direction === "left"
      ? currentSlideIndex === 0
        ? slides.length - 1
        : currentSlideIndex - 1
      : currentSlideIndex === slides.length - 1
      ? 0
      : currentSlideIndex + 1;

  slides[currentSlideIndex].classList.add("active");
  pageButtons[currentSlideIndex].classList.add("active");
}

arrowLeft.addEventListener("click", () => navigateSlides("left"));
arrowRight.addEventListener("click", () => navigateSlides("right"));

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  }
}

// The following functions are not used within this script yet, it seems
function divClick(soundBox) {
  audio.play();
  startAnimation();
  playDiscord(soundBox);
}

function startAnimation() {
  const background = document.getElementById("background");
  background.classList.add("spin");

  // remove the 'spin' class after the animation ends
  background.addEventListener("animationend", () => {
    background.classList.remove("spin");
  });
}

function playDiscord(soundName) {
  const content = "!" + soundName;
  const url =
    "https://discord.com/api/webhooks/1107730139229474988/1e3mO9BL6m0hF9bWAq1rBcMr7FWq9xSCsXyDewc8GxOm_9apxPV9eb5G2bZqOgtbg5Nn";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  }).catch((error) => console.log("Error:", error));
}

// Add event listener to the mute button
muteButton.addEventListener("click", () => {
  // Check if the audio is currently not muted
  if (!audio.muted) {
    // If the audio is not muted, mute the audio
    audio.muted = true;
    // Change the mute button icon to a muted volume icon
    muteButton.className = "mute-button fas fa-volume-mute";
  } else {
    // If the audio is muted, unmute the audio
    audio.muted = false;
    // Change the mute button icon to an unmuted volume icon
    muteButton.className = "mute-button fas fa-volume-up";
  }
});

// Get the context menu elements
const contextMenu = document.getElementById("context-menu");
const favouriteButton = document.getElementById("favourite-button");

// Keep track of the current button
let currentButton = null;

// Handle right-click on a button
document.addEventListener("contextmenu", (event) => {
  // Prevent the default context menu from showing
  event.preventDefault();

  // Check if a button was clicked
  if (event.target.tagName === "BUTTON") {
    // Store the current button
    currentButton = event.target;

    // Show the context menu at the cursor position
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.hidden = false;
  }
});

// Handle click on the favourite button
favouriteButton.addEventListener("click", () => {
  // Toggle the favourite status of the current button
  toggleFavorite(currentButton.innerHTML);

  // Hide the context menu
  contextMenu.hidden = true;
});

// Handle click anywhere else on the document
document.addEventListener("click", () => {
  // Hide the context menu
  contextMenu.hidden = true;
});

// Handle scroll on the document
document.addEventListener("scroll", () => {
  // Hide the context menu
  contextMenu.hidden = true;
});

function updateFavButtonVisibility() {
  // Get the FAV button
  const favButton = document.querySelector('.pagination button[data-slide="slide-FAV-1"]')

  if (!favButton) return
  // if there is a FAV button, check if there are any favorites
  const favorites = JSON.parse(localStorage.getItem('favorites')) || []

  if (favorites.length > 0) {
    favButton.style.display = ''
  } else {
    favButton.style.display = 'none'
  }
}

function createFavButton() {
  const button = document.createElement('button')
  button.textContent = "⭐️"
  button.dataset.slide = 'slide-FAV-1'
  button.addEventListener('click', navigateToSlide)

  paginationContainer.appendChild(button)
}

// Initially hide the FAV button if there are no favorites
updateFavButtonVisibility()

document.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  const menu = document.getElementById('context-menu')
  menu.style.display = 'block'
  menu.style.transform = 'scale(0)'
  menu.style.top = `${e.clientY}px`
  menu.style.left = `${e.clientX}px`
  setTimeout(() => {
    menu.style.transform = 'scale(1)'
  }, 1) // Set the scale back to normal after 1 millisecond
})

document.addEventListener('click', function (e) {
  const menu = document.getElementById('context-menu')
  if (e.target !== menu && !menu.contains(e.target)) {
    menu.style.transform = 'scale(0)'
    setTimeout(() => {
      menu.style.display = 'none'
    }, 300) // Hide the menu after the "implosion" animation completes
  }
})

function toggleFavorite(buttonId) {
  // Check if the button is already a favourite
  const index = favorites.indexOf(buttonId)
  if (index === -1) {
    // Add to favorites
    favorites.push(buttonId)
  } else {
    // Remove from favorites
    favorites.splice(index, 1)
  }

  // Write favorites back to LocalStorage
  localStorage.setItem('favorites', JSON.stringify(favorites))

  // Update 'FAV' in groupedEntries
  groupedEntries.set('FAV', favorites)

  // Remove all 'FAV' slides and buttons
  document.querySelectorAll(`[id^='slide-FAV-'], [data-slide^='slide-FAV-']`).forEach(el => el.remove())

  // Recreate 'FAV' slides and buttons
  createSlidesAndButtons('FAV', favorites)
}

function createSlidesAndButtons(letter, entriesForLetter) {
  // Split entriesForLetter into chunks of size MAX_ENTRIES_PER_SLIDE
  let chunks = []
  for (let i = 0; i < entriesForLetter.length; i += MAX_ENTRIES_PER_SLIDE) {
    chunks.push(entriesForLetter.slice(i, i + MAX_ENTRIES_PER_SLIDE))
  }

// For each chunk, create a slide and button
chunks.forEach((chunk, chunkIndex, all_chunks) => {
  // Create slide
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.id = `slide-${letter}-${chunkIndex + 1}`;

  // Create slide content
  let slideContent = document.createElement('ul');
  chunk.forEach(entry => {
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.textContent = entry;
    button.addEventListener('click', () => divClick(entry));
    listItem.appendChild(button);
    slideContent.appendChild(listItem);
  });
  slide.appendChild(slideContent);

  // Add slide to slidesContainer
  slidesContainer.appendChild(slide);

  // Create button
  const button = document.createElement('button');
  button.textContent = `${letter == 'FAV' ? "⭐️" : letter}${all_chunks.length > 1 ? " " + getSuperscript(chunkIndex + 1) : ""}`; // Update button text
  button.dataset.slide = slide.id;
  button.addEventListener('click', navigateToSlide);

  // Add button to paginationContainer
  paginationContainer.appendChild(button);
});
}
