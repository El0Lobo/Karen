// Define the maximum entries per slide
const MAX_ENTRIES_PER_SLIDE = 30

// Select DOM elements
const slidesContainer = document.querySelector('.slideshow')
const paginationContainer = document.querySelector('.pagination')
const arrowLeft = document.querySelector('.arrow.left')
const arrowRight = document.querySelector('.arrow.right')

const audio = new Audio('https://www.myinstants.com/media/sounds/batman-transition-download-sound-link.mp3')

// We build a Map data structure that groups entries by their first letter.
// Using JavaScript's reduce function, we construct the Map
// from our entries array. 
// (in the form of { letter => [entries] })
const groupedEntries = entries.reduce((map, entry) => {
  let firstLetter = entry.charAt(0).toUpperCase() // Extract the first letter
  if (!isNaN(firstLetter)) firstLetter = '0-9' // if it's not a number, set it to 0-9

  // The Map method set() updates the value for a key in the Map.
  // If the key doesn't exist yet, it will be added.
  // We're using the logical OR operator (||) to default to an empty array
  // if the key doesn't exist in the Map yet.
  map.set(firstLetter, map.get(firstLetter) || [])

  // We then add the current entry to the array of entries for this letter.
  map.get(firstLetter).push(entry)

  return map // Return the updated Map to the next step in the reduce function
}, new Map())

// Now that we have our entries grouped by their first letter,
// we iterate over the keys of the Map (i.e., the first letters).
groupedEntries.forEach((entriesForLetter, letter) => {
  // Split entriesForLetter into chunks of size MAX_ENTRIES_PER_SLIDE
  let chunks = []
  for (let i = 0; i < entriesForLetter.length; i += MAX_ENTRIES_PER_SLIDE) {
    chunks.push(entriesForLetter.slice(i, i + MAX_ENTRIES_PER_SLIDE))
  }

  // For each chunk, create a slide
  chunks.forEach((chunk, chunkIndex, all_chunks) => {
    // Create a new slide and assign it a class and id
    const slide = document.createElement('div')
    slide.className = 'slide'
    slide.id = `slide-${letter}-${chunkIndex + 1}` // IDs are now of the form `slide-A-1`, `slide-A-2`, etc.

    // Create an unordered list element for this slide's content
    let slideContent = document.createElement('ul')

    // Iterate through each entry in the chunk
    chunk.forEach(entry => {
      // Create a new list item and button for each entry
      let listItem = document.createElement('li')
      let button = document.createElement('button')
      // Set the button's text content to the entry
      button.textContent = entry
      // Attach an event listener to the button that calls the divClick function when clicked
      button.addEventListener('click', () => divClick(entry))
      // Append the button to the list item
      listItem.appendChild(button)
      // Append the list item to the unordered list
      slideContent.appendChild(listItem)
    })
    // Set the slide's inner content to the unordered list we created
    slide.appendChild(slideContent)

    // Append the new slide to the slideshow container
    slidesContainer.appendChild(slide)

    // Create a new button for this slide, set its text and data attribute,
    // and add an event listener for the click event.
    // When clicked, the button will trigger the navigateToSlide function.
    const button = document.createElement('button')
    button.textContent = `${letter}${all_chunks.length > 1 ? " #" + (chunkIndex + 1) : ""}`
    button.dataset.slide = slide.id
    button.addEventListener('click', navigateToSlide)

    // Add the button to the pagination container
    paginationContainer.appendChild(button)
  })
})

// Set the first slide and button as active
slidesContainer.querySelector('.slide').classList.add('active')
paginationContainer.querySelector('button').classList.add('active')

// Variable to keep track of the current slide index.
let currentSlideIndex = 0

function navigateToSlide(event) {
  const targetSlide = event.target.dataset.slide
  const slides = document.querySelectorAll('.slide')
  const pageButtons = document.querySelectorAll('.pagination button')

  slides.forEach(slide => slide.classList.remove('active'))
  pageButtons.forEach(button => button.classList.remove('active'))

  document.getElementById(targetSlide).classList.add('active')
  event.target.classList.add('active')
  currentSlideIndex = Array.from(pageButtons).findIndex(button => button.classList.contains('active'))
}

function navigateSlides(direction) {
  const slides = document.querySelectorAll('.slide')
  const pageButtons = document.querySelectorAll('.pagination button')

  slides[currentSlideIndex].classList.remove('active')
  pageButtons[currentSlideIndex].classList.remove('active')

  currentSlideIndex = direction === 'left'
    ? (currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1)
    : (currentSlideIndex === slides.length - 1 ? 0 : currentSlideIndex + 1)

  slides[currentSlideIndex].classList.add('active')
  pageButtons[currentSlideIndex].classList.add('active')
}

arrowLeft.addEventListener('click', () => navigateSlides('left'))
arrowRight.addEventListener('click', () => navigateSlides('right'))

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
    })
  }
}

// The following functions are not used within this script yet, it seems
function divClick(soundBox) {
  audio.play()
  startAnimation()
  playDiscord(soundBox)
}

function startAnimation() {
  const background = document.getElementById('background')
  background.classList.add('spin')

  // remove the 'spin' class after the animation ends
  background.addEventListener('animationend', () => {
    background.classList.remove('spin')
  })
}

function playDiscord(soundName) {
  const content = "!" + soundName
  const url = "https://discord.com/api/webhooks/1107730139229474988/1e3mO9BL6m0hF9bWAq1rBcMr7FWq9xSCsXyDewc8GxOm_9apxPV9eb5G2bZqOgtbg5Nn"

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  })
    .catch((error) => console.log('Error:', error))
}
