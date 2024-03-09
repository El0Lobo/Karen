// Select DOM elements
const slidesContainer = document.querySelector('.slideshow')
const pagination = document.querySelector('.pagination')
const paginationContainer = document.querySelector('.pagination-container')
const muteButton = document.querySelector('.mute-button')
const links = [
  'https://cdn.discordapp.com/attachments/556278872530878494/1208869983782703144/image.png?ex=65f74fe7&is=65e4dae7&hm=9b91b5880792f723657e86f716c72ab2e064be74d3f8b4333abb27005df67e41&',
  'https://cdn.discordapp.com/attachments/556278872530878494/1208870045258620948/image.png?ex=65f74ff6&is=65e4daf6&hm=477211c961bbcc7ac433d717f0e5929ee8f1389b10b63fa5299a9c3a9edec84e&',
  'https://cdn.discordapp.com/attachments/556278872530878494/1208869929462403182/image.png?ex=65f74fda&is=65e4dada&hm=1c6b5922d7ad8a51f6d7546fa8a8fa6c98db59e2980d7ba78a64a788445e7bd2&',
  'https://cdn.discordapp.com/attachments/556278872530878494/1208870076678283335/image.png?ex=65f74ffe&is=65e4dafe&hm=5b053e0cd64c4f3730826fd9bb1ea5a29996cf5880624bf9294a4847cdb3c5de&',
  'https://cdn.discordapp.com/attachments/556278872530878494/1208870127135752242/image.png?ex=65f7500a&is=65e4db0a&hm=9b97130f096f5ca2df49e97a3a724c107cbfc81fd4b1b28bd91a0c7f3d43d8f0&',
  'https://cdn.discordapp.com/attachments/556278872530878494/1208870172258074644/image.png?ex=65f75014&is=65e4db14&hm=9ca1e7ccc662ec6f7aa60b5de12047e122ff886ddf64334344d7e28302038781&',
  'https://cdn.discordapp.com/attachments/556278872530878494/1208870220861804617/image.png?ex=65f75020&is=65e4db20&hm=d9490835d39df3041998e9047d8865344e682c6243bf20256fcf9c112dc60ca8&',
  'https://cdn.discordapp.com/attachments/556278872530878494/1208870263127547924/image.png?ex=65f7502a&is=65e4db2a&hm=566eaf93a630a049bbd4822185136aed63b4507da147f1f93b5a9c223d4b78fd&'
];
const audio = new Audio('https://www.myinstants.com/media/sounds/batman-transition-download-sound-link.mp3')

let favorites = JSON.parse(localStorage.getItem('favorites')) || []

// We build a Map data structure that groups entries by their first letter.
// Using JavaScript's reduce function, we construct the Map
// from our entries array. 
// (in the form of { letter => [entries] })
const groupedEntries = entries.reduce((map, entry) => {

  let firstLetter = entry.charAt(0).toUpperCase() // Extract the first letter
  if (!isNaN(firstLetter)) firstLetter = '#' // if it's not a number, set it to #

  // The Map method set() updates the value for a key in the Map.
  // If the key doesn't exist yet, it will be added.
  // We're using the logical OR operator (||) to default to an empty array
  // if the key doesn't exist in the Map yet.
  map.set(firstLetter, map.get(firstLetter) || [])

  // We then add the current entry to the array of entries for this letter.
  map.get(firstLetter).push(entry)

  return map // Return the updated Map to the next step in the reduce function
}, new Map())

groupedEntries.set('FAV', favorites || [])

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
    pagination.id = `pagination-${letter}` // IDs are now of the form `pagination-A`, `pagination-B`, etc.

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

    // Create a new button for this subPagination, set its text and data attribute,
    // and add an event listener for the click event.
    // When clicked, the button will trigger the navigateToSlide function.
    const button = document.createElement('button')
    button.textContent = ``
    button.dataset.slide = slide.id
    button.dataset.pagination = pagination.id
    button.addEventListener('click', navigateToSlide)

    // Add the button of the subPAgination to the pagination container
    pagination.appendChild(button)
  })
})
// Now we create all Pagination buttons
groupedEntries.forEach((entriesForLetter, letter) => {

  let firstLetter = letter.charAt(0).toUpperCase() // Extract the first letter
  if (!isNaN(firstLetter)) firstLetter = '#' // if it's not a number, set it to #
  let dataset = `-${letter}-` // IDs are now of the form `slide-A`, `slide-B`, etc.

  const button = document.createElement('button')
    button.id = "paginationbutton"
    button.textContent = `${letter == 'FAV' ? "⭐️" : letter}`
    button.addEventListener('click', navigateToSubPagination)
    button.dataset.pagination = dataset
    paginationContainer.appendChild(button)
})

function navigateToSubPagination(event){
  const targetSlide = event.target.dataset.pagination
  console.log(targetSlide)
  const pagination = document.querySelectorAll('.slide')
  const pageButtons = document.querySelectorAll('.pagination button')
  let subPagination
  if (targetSlide === '-#-') {
    subPagination = document.querySelectorAll(`[data-slide*= -\\#- ]`)
  } else {
    subPagination = document.querySelectorAll(`[data-slide*= ${targetSlide} ]`)
  }
  pagination.forEach(pagination => pagination.classList.remove('active'))
  pageButtons.forEach(button => button.classList.remove('active'))

  //Activates all matching subPaginations
  subPagination.forEach((element) => {
    element.classList.add('active')
  })
  //Activate the first slide of this letter
  const slide = document.getElementById(`slide${targetSlide}1`)
  slide.classList.add('active')
}

// If there are favorites, set the favorites slide as active. Otherwise, set the first slide as active
if (favorites.length > 0) {
  document.getElementById('slide-FAV-1').classList.add('active')
  pagination.querySelector('button[data-slide="slide-FAV-1"]').classList.add('active')
} else {
  slidesContainer.querySelector('.slide').classList.add('active')
  pagination.querySelector('button').classList.add('active')
}
// Variable to keep track of the current slide index.
let currentSlideIndex = 0

function navigateToSlide(event) {
  const targetSlide = event.target.dataset.slide
  const targetPagination = event.target.dataset.pagination
  const slides = document.querySelectorAll('.slide')
  const pageButtons = document.querySelectorAll('.pagination button')
  const subPagination = document.querySelectorAll(`[data-pagination*= ${targetPagination} ]`)

  slides.forEach(slide => slide.classList.remove('active'))
  pageButtons.forEach(button => button.classList.remove('active'))

  subPagination.forEach((element) => {
    element.classList.add('active')
  })

  document.getElementById(targetSlide).classList.add('active')
  event.target.classList.add('active')
  currentSlideIndex = Array.from(pageButtons).findIndex(button => button.classList.contains('active'))
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  tags[0][1].push("test")
  console.log(tags[0][1])
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
    })
  }
}

function divClick(soundBox) {
  audio.play();
  startAnimation();

  var number = Math.floor(Math.random() * 100)
  if(number == 1) {
    playDiscord("supremenavalinvade");
  } else {
    // Send a random link along with the soundBox command if it's one of the specified sounds.
    if (['zugdauerundrichtung', 'zugzeit', 'zugzeit2', 'zugzeit3', 'zugzeit4', 'zugzeitherzlichwillkomen'].includes(soundBox)) {
      const randomLink = links[Math.floor(Math.random() * links.length)]; // Select a random link
      playDiscord(soundBox); // Play the specific sound
      sendRandomLink(randomLink); // Send the random link
    } else {
      playDiscord(soundBox); // Play any other sound
    }
  }
  animateLogo();
}

function animateLogo() {
  const logo = document.querySelector('.batman-logo');
  logo.classList.add('visible');

  setTimeout(() => {
    logo.classList.remove('visible');
  }, 2000);
}
;

function startAnimation() {
  const background = document.getElementById('background');
  background.classList.add('spin');

  // remove the 'spin' class after the animation ends
  background.addEventListener('animationend', () => {
    background.classList.remove('spin');
  });
}


const button = document.querySelector('.slide ul li button');
button.addEventListener('click', animateLogo);

function playDiscord(soundName) {
  const content = "!" + soundName;

  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  })
    .catch((error) => console.log('Error:', error));
}


// Add event listener to the mute button
muteButton.addEventListener('click', () => {
  // Check if the audio is currently not muted
  if (!audio.muted) {
    // If the audio is not muted, mute the audio
    audio.muted = true
    // Change the mute button icon to a muted volume icon
    muteButton.className = 'mute-button fas fa-volume-mute'
  } else {
    // If the audio is muted, unmute the audio
    audio.muted = false
    // Change the mute button icon to an unmuted volume icon
    muteButton.className = 'mute-button fas fa-volume-up'
  }
})

const skipSymbol = document.querySelector('.skip-button');
const stopSymbol = document.querySelector('.stop-button');

skipSymbol.addEventListener('click', () => {
  sendCommandToWebhook('!skip');
});

stopSymbol.addEventListener('click', () => {
  sendCommandToWebhook('!stop');
});

function sendCommandToWebhook(command) {
  const content = command;

  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
    .catch((error) => console.log('Error:', error));
}

// Get the context menu elements
const contextMenu = document.getElementById('context-menu');
const favouriteButton = document.getElementById('favourite-button');


// Keep track of the current button
let currentButton = null

// Handle right-click on a button
document.addEventListener('contextmenu', (event) => {
  // Prevent the default context menu from showing
  event.preventDefault()

  // Check if a button was clicked
  if (event.target.tagName === 'BUTTON') {
    // Store the current button
    currentButton = event.target
    const menu = document.getElementById('context-menu')
    menu.style.display = 'block'
  }
})

document.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  const menu = document.getElementById('context-menu')
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

// Handle click on the favourite button
favouriteButton.addEventListener('click', () => {
  // Toggle the favourite status of the current button
  toggleFavorite(currentButton.innerHTML)
})

// Handle click anywhere else on the document
document.addEventListener('click', () => {
  // Hide the context menu
  contextMenu.hidden = true
})



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

// Initially hide the FAV button if there are no favorites
updateFavButtonVisibility()

function toggleFavorite(buttonId) {
  //check if i remove or add
  let remove = false
  // Check if the button is already a favourite
  const index = favorites.indexOf(buttonId)
  if (index === -1) {
    // Add to favorites
    favorites.push(buttonId)
  } else {
    // Remove from favorites
    favorites.splice(index, 1)
    //
    remove = true
  }

  // Write favorites back to LocalStorage
  localStorage.setItem('favorites', JSON.stringify(favorites))

  // Update 'FAV' in groupedEntries
  groupedEntries.set('FAV', favorites)

  // Remove all 'FAV' slides and buttons
  document.querySelectorAll(`[id^='slide-FAV-']`).forEach(el => el.remove())

  // Recreate 'FAV' slides and buttons
  createSlidesAndButtons('FAV', favorites, remove)

  // Hide the context menu
  const menu = document.getElementById('context-menu')
  menu.style.display = 'block'
}

//Handling of Tags
tags.forEach(element => {
  tagSlide = document.getElementById('mySidenav')
  //Create a Textlabel inside the Side Navigation
  const tagLabel = document.createElement('a')
  //Name the Textlabel
  tagLabel.textContent = element[0]
  //Create a new Slide and atatch it to the Slide-Container
  createTagSlide(element[0], element[1])
  tagLabel.dataset.slide = element[0]
  tagLabel.dataset.pagination = `-${element[0]}-`
  tagLabel.addEventListener('click', navigateToSubPagination)
  tagSlide.appendChild(tagLabel)
  
});

function createTagSlide (letter, entriesForLetter){

  let chunks = []
  for (let i = 0; i < entriesForLetter.length; i += MAX_ENTRIES_PER_SLIDE) {
    chunks.push(entriesForLetter.slice(i, i + MAX_ENTRIES_PER_SLIDE))
  }

  chunks.forEach((chunk, chunkIndex, all_chunks) => {
    // Create a new slide and assign it a class and id
    const slide = document.createElement('div')
    slide.className = 'slide'
    slide.id = `slide-${letter}-${chunkIndex + 1}` // IDs are now of the form `slide-A-1`, `slide-A-2`, etc.
    pagination.id = `pagination-${letter}` // IDs are now of the form `pagination-A`, `pagination-B`, etc.
  
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
  })
}


// For each chunk, create a slide
function createSlidesAndButtons(letter, entriesForLetter, remove) {

  let chunks = []
  for (let i = 0; i < entriesForLetter.length; i += MAX_ENTRIES_PER_SLIDE) {
    chunks.push(entriesForLetter.slice(i, i + MAX_ENTRIES_PER_SLIDE))
  }

  chunks.forEach((chunk, chunkIndex, all_chunks) => {
    // Create a new slide and assign it a class and id
    const slide = document.createElement('div')
    slide.className = 'slide'
    slide.id = `slide-${letter}-${chunkIndex + 1}` // IDs are now of the form `slide-A-1`, `slide-A-2`, etc.
    pagination.id = `pagination-${letter}` // IDs are now of the form `pagination-A`, `pagination-B`, etc.
  
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
  })
  if(remove) {
    if (favorites.length > 0) {
      document.getElementById('slide-FAV-1').classList.add('active')
      pagination.querySelector('button[data-slide="slide-FAV-1"]').classList.add('active')
    } else {
      slidesContainer.querySelector('.slide').classList.add('active')
      pagination.querySelector('button').classList.add('active')
    }
  }
}

const toggleStyleButton = document.getElementById("toggle-style-button");
const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');

toggleStyleButton.addEventListener("click", () => {
    for (const stylesheet of styleSheets) {
        stylesheet.disabled = !stylesheet.disabled;
    }
});


function sendRandomLink(link) {
  // Implementation depends on how you intend to send the link.
  // For example, if you're sending it to a Discord webhook:
  const content = link; // The message you want to send, which is the link.

  fetch(webhookURL, { // Make sure you define `webhookURL` somewhere in your code.
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.log('Error:', error));
}
