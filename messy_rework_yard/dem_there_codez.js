// Select DOM elements
const slidesContainer = document.querySelector('.slideshow')
const paginationContainer = document.querySelector('.pagination')
const arrowLeft = document.querySelector('.arrow.left')
const arrowRight = document.querySelector('.arrow.right')

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
  // Create a new slide and assign it a class and id
  const slide = document.createElement('div')
  slide.className = 'slide'
  slide.id = `slide-${letter}`

  // Create the content for this slide
  // We use the map function to transform the entriesForLetter array
  // into an array of list item strings. We then join these strings
  // into a single string to be used as HTML content.
  const slideContent = entriesForLetter
    .map(entry => `<li><button>${entry}</button></li>`)
    .join('')

  // Set the inner HTML of the slide to our content
  // and append it to the slideshow container
  slide.innerHTML = `<ul>${slideContent}</ul>`
  slidesContainer.appendChild(slide)

  // Create a new button for this slide, set its text and data attribute,
  // and add an event listener for the click event.
  // When clicked, the button will trigger the navigateToSlide function.
  const button = document.createElement('button')
  button.textContent = letter
  button.dataset.slide = slide.id
  button.addEventListener('click', navigateToSlide)

  // Add the button to the pagination container
  paginationContainer.appendChild(button)

})

// Set the first slide and button as active
const firstSlide = slidesContainer.querySelector('.slide').classList.add('active')
const firstButton = paginationContainer.querySelector('button').classList.add('active')

if (firstSlide) {
  firstSlide.classList.add('active')
}

if (firstButton) {
  firstButton.classList.add('active')
}
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

slidesContainer.addEventListener('click', (event) => {
  const clickedButton = event.target.closest('li button')
  if (clickedButton) {
    const audio = new Audio('https://www.myinstants.com/media/sounds/batman-transition-download-sound-link.mp3')
    audio.play()
  }
})

function toggleFullscreen() {
  console.log('toggleFullscreen')
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
  playSound()
  startAnimation()
  playDiscord(soundBox)
}

function startAnimation() {
  const spinningImage = document.getElementById('spinningImagea')
  spinningImage.style.display = 'block'
  spinningImage.style.animationPlayState = 'running'

  setTimeout(() => {
    spinningImage.style.display = 'none'
  }, 2000)
}

function playSound() {
  const backgroundMusic = document.getElementById('backgroundMusic')
  backgroundMusic.play()
}

function playDiscord(soundName) {
  const content = "!" + soundName.id
  console.log(content)
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
