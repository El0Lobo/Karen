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
document.addEventListener('DOMContentLoaded', () => {
    const entries = window.entries.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    const slidesContainer = document.getElementById('slides-container');
    const paginationContainer = document.getElementById('pagination-container');
    const searchInput = document.getElementById('search-input');

    const audio = new Audio('https://github.com/El0Lobo/Karen/raw/main/Stuff%20to%20host/batman-transition-download-sound-link.mp3');


    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Function to create and display entries
    const displayEntries = (filteredEntries = entries) => {
        slidesContainer.innerHTML = ''; // Clear existing entries
        filteredEntries.forEach(entry => {
            const entryContainer = document.createElement('div');
            entryContainer.className = 'entry-container';

            const button = document.createElement('button');
            button.className = 'button-entry';
            button.textContent = entry;

            // Assign the divClick function to the onclick event of each button
            button.onclick = function () {
                divClick(entry); // Adjust how `entry` maps to your soundBox names if needed
            };

            const favButton = document.createElement('button');
            favButton.className = 'fav-button';
            favButton.innerHTML = favorites.includes(entry) ? '★' : '☆'; // Star symbols for favorite/unfavorite
            favButton.onclick = (e) => {
                e.stopPropagation(); // Prevent triggering the entry button's onclick
                toggleFavorite(entry);
            };

            if (favorites.includes(entry)) {
                favButton.classList.add('favorite');
            }

            entryContainer.appendChild(button);
            entryContainer.appendChild(favButton); // Append favButton to entryContainer, not button
            slidesContainer.appendChild(entryContainer);
        });
    };


    // Function to toggle favorite status and refresh display correctly
    const toggleFavorite = (entry) => {
        const index = favorites.indexOf(entry);
        if (index === -1) {
            favorites.push(entry);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Refresh display based on current filter
        filterEntries(currentFilter);
    };


    // Current filter tracking
    let currentFilter = 'all';

    // Adjusted filterEntries function to handle special characters or labels
    const filterEntries = (filter) => {
        currentFilter = filter; // Update current filter
        let filteredEntries = entries;

        if (filter === 'all') {
            displayEntries(entries); // Show all entries
        } else if (filter === '⭐️' || filter === 'favorites') {
            // Ensure this matches how you've implemented or labeled the favorites button
            filteredEntries = entries.filter(entry => favorites.includes(entry));
            displayEntries(filteredEntries);
        } else {
            // Handle other filters such as alphabetical or numeric
            filteredEntries = entries.filter(entry => entry.toLowerCase().startsWith(filter) || (!isNaN(entry[0]) && filter === '#'));
            displayEntries(filteredEntries);
        }
    };


    // Live search function
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        if (query) {
            const filteredEntries = entries.filter(entry => entry.toLowerCase().includes(query));
            displayEntries(filteredEntries);
        } else {
            filterEntries(currentFilter); // Display based on the current filter or show all if no filter
        }
    });

    // Initialize pagination buttons
    const createPagination = () => {
        const paginationButtons = ['#', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), 'All', '⭐️'];
        paginationContainer.innerHTML = '';
        paginationButtons.forEach(label => {
            const button = document.createElement('button');
            button.textContent = label;
            button.className = `pagination-button ${label.toLowerCase()}`;
            button.onclick = () => filterEntries(label.toLowerCase());
            paginationContainer.appendChild(button);
        });
    };

    displayEntries(); // Initial display of entries
    createPagination(); // Set up pagination buttons

    // Function to play a sound, perform animations, and send a text to Discord
    function divClick(soundBox) {
        audio.play(); // Play sound

        // Start background animation
        const background = document.getElementById('background');
        background.classList.add('spin');
        background.addEventListener('animationend', () => {
            background.classList.remove('spin');
        });

        // Start logo animation
        const logo = document.querySelector('.batman-logo');
        logo.classList.add('visible');
        setTimeout(() => {
            logo.classList.remove('visible');
        }, 2000);

        // Random number for special Discord message
        var number = Math.floor(Math.random() * 100);
        if (number == 1) {
            const content = "!supremenavalinvade";
            fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            }).catch((error) => console.log('Error:', error));
        } else {
            const content = "!" + soundBox;
            fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            }).catch((error) => console.log('Error:', error));

            if (['zugdauerundrichtung', 'zugzeit', 'zugzeit2', 'zugzeit3', 'zugzeit4', 'zugzeitherzlichwillkomen', 'bong', 'zuege'].includes(soundBox)) {
                const randomLink = links[Math.floor(Math.random() * links.length)];
                fetch(webhookURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: randomLink }),
                })
                .then(response => response.json())
                .then(data => console.log('Success:', data))
                .catch((error) => console.log('Error:', error));
            }
        }
    }
});


const slidesContainer = document.getElementById('slides-container');

const populateSidenav = () => {
    sidenav = document.getElementById('mySidenav')
    // Iterate through each tag group in dem_tags
    window.tags.forEach(tagGroup => {
        const tagName = tagGroup[0]; // The tag name
        const tagEntries = tagGroup[1]; // The entries associated with this tag

        // Create a link in the sidenav for each tag
        const tagLink = document.createElement('a');
        tagLink.textContent = tagName;
        tagLink.href = "#";
        tagLink.onclick = (e) => {
            e.preventDefault();
            displayEntriesForTag(tagEntries); // Display entries when the tag is clicked
        };
        sidenav.appendChild(tagLink);
    });

    const openButton = document.createElement('a');
    openButton.innerHTML = '>';
    openButton.className = 'openbtn';
    openButton.onclick = (e) => {
        e.preventDefault();
        sidenav.style.width = "250px";
    }
    document.body.appendChild(openButton);

    // Optionally, add a close button to the sidenav
    const closeButton = document.createElement('a');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'closebtn';
    closeButton.onclick = (e) => {
        e.preventDefault();
        sidenav.style.width = "0"; // Close the sidenav
    };
    sidenav.insertBefore(closeButton, sidenav.firstChild);
};

const displayEntriesForTag = (tagEntries) => {
    slidesContainer.innerHTML = ''; // Clear existing entries
    tagEntries.forEach(entry => {
        const entryButton = document.createElement('button');
        entryButton.className = 'button-entry';
        entryButton.textContent = entry;
        slidesContainer.appendChild(entryButton);
    });
};

populateSidenav();


function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
      })
    }
  }

  
  document.addEventListener('DOMContentLoaded', (event) => {
    const favButtons = document.querySelectorAll('.fav-button');
  
    favButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // This should prevent scaling of the button below
  
        // Your code for toggling the favorite state
        this.classList.toggle('favorite');
      });
    });
  });

  const muteButton = document.querySelector('.mute-button');
  const audio = new Audio(); // Assuming this is defined somewhere
  
  muteButton.addEventListener('click', () => {
    if (!audio.muted) {
      audio.muted = true;
      muteButton.className = 'mute-button fas fa-volume-mute';
    } else {
      audio.muted = false;
      muteButton.className = 'mute-button fas fa-volume-up';
    }
    animateLogo(); // Optionally animate logo on mute/unmute
  });
  
  const skipButton = document.querySelector('.skip-button');
  const stopButton = document.querySelector('.stop-button');
  
  skipButton.addEventListener('click', () => {
    sendCommandToWebhook('!skip');
  });
  
  stopButton.addEventListener('click', () => {
    sendCommandToWebhook('!stop');
  });

  function sendCommandToWebhook(command) {
    fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: command })
    }).then(response => {
      if (response.ok) {
        console.log('Command sent successfully');
      } else {
        console.log('Failed to send command');
      }
    }).catch(error => console.log('Error:', error));
  }

  // Toggle search bar visibility
    document.querySelector('.search-button').addEventListener('click', () => {
        const searchBar = document.getElementById('search-container');
        searchBar.style.display = searchBar.style.display === 'none' ? '' : 'none'; // Toggle display
    });

    // Send a random command from the GIF button
    document.querySelector('.gif-command-button').addEventListener('click', () => {
        const commands = ['!zugdauerundrichtung', '!zugzeit', '!zugzeit2', '!zugzeit3', '!zugzeit4', '!zugzeitherzlichwillkomen'];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        sendCommandToWebhook(randomCommand);
    // Optionally, after sending the command, you want to send a link
    const randomLink = links[Math.floor(Math.random() * links.length)];
    
    // Send the random link to the webhook, similar to sending a command
    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: randomLink }),
    })
    .then(response => response.json()) // Assuming you want to handle the JSON response
    .then(data => console.log('Link sent successfully:', data))
    .catch((error) => console.log('Error sending link:', error));
});

const toggleStyleButton = document.getElementById("toggle-style-button");
const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');

toggleStyleButton.addEventListener("click", () => {
    for (const stylesheet of styleSheets) {
        stylesheet.disabled = !stylesheet.disabled;
    }
});
