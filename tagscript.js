document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
    renderWords();
});

let selectedWords = [];
let selectedTags = [];

function loadInitialData() {
    renderWords();
    renderTags();
    renderCombined();
}

function renderWords() {
    const wordsColumn = document.getElementById('wordsColumn');
    wordsColumn.innerHTML = '<h2>Sounds</h2>';
    entries.forEach(word => {
        const wordDiv = document.createElement('div');
        const textSpan = document.createElement('span');
        textSpan.innerText = word;
        
        wordDiv.appendChild(textSpan);

        // Check if the word is tagged
        if (isWordTagged(word)) {
            const checkMark = document.createElement('span');
            checkMark.innerHTML = ' ✓'; // Add check mark
            checkMark.classList.add('check-mark');
            wordDiv.appendChild(checkMark);
        }

        wordDiv.classList.add('selectable');
        wordDiv.onclick = () => toggleSelection(wordDiv, word, selectedWords);
        wordsColumn.appendChild(wordDiv);
    });
}

function isWordTagged(word) {
    // Check if the word exists in any tag's list of words
    return tags.some(tag => tag[1].includes(word));
}


function renderTags() {
    const tagsColumn = document.getElementById('tagsColumn');
    tagsColumn.innerHTML = '<h2>Tags</h2>';

    tags.forEach(tag => {
        const tagDiv = document.createElement('div');
        tagDiv.innerText = tag[0];
        tagDiv.classList.add('selectable');
        tagDiv.onclick = () => toggleSelection(tagDiv, tag[0], selectedTags);
        tagsColumn.appendChild(tagDiv);
    });
}

function renderCombined() {
    const combinedColumn = document.getElementById('combinedColumn');
    combinedColumn.innerHTML = '<h2>Combined</h2>';

    tags.forEach((tag, tagIndex) => {
        const dropdown = document.createElement('details');
        dropdown.setAttribute('draggable', true); // Make the tag draggable
        dropdown.classList.add('draggable'); // Add class for styling and selectors
        dropdown.addEventListener('dragstart', e => handleDragStart(e, tagIndex));
        dropdown.addEventListener('dragover', e => e.preventDefault()); // Necessary to allow dropping
        dropdown.addEventListener('drop', e => handleDrop(e, tagIndex));

        const summary = document.createElement('summary');
        summary.textContent = tag[0];
        dropdown.appendChild(summary);

        // Sort words alphabetically before rendering
        tag[1].sort().forEach((word, wordIndex) => {
            const wordDiv = document.createElement('div');
            const deleteButton = document.createElement('span');

            wordDiv.innerText = word;
            deleteButton.innerHTML = ' x';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = (e) => {
                e.stopPropagation(); // Prevents the dropdown from toggling
                removeWordFromTag(tagIndex, wordIndex);
            };

            wordDiv.appendChild(deleteButton);
            dropdown.appendChild(wordDiv);
        });

        combinedColumn.appendChild(dropdown);
    });
}



function removeWordFromTag(tagIndex, wordIndex) {
    // Removes the word from the specified tag
    tags[tagIndex][1].splice(wordIndex, 1);

    // Re-render the combined column to reflect the changes
    renderCombined();
}


function addTag() {
    const tagName = prompt("Enter new tag name:");
    if (tagName) {
        tags.push([tagName, []]);
        renderTags();
        renderCombined();
    }
}

function associateTags() {
    selectedTags.forEach(tag => {
        tags.forEach(tagEntry => {
            if (tagEntry[0] === tag) {
                selectedWords.forEach(word => {
                    if (!tagEntry[1].includes(word)) {
                        tagEntry[1].push(word);
                    }
                });
                // Sort the words within the tag alphabetically
                tagEntry[1].sort();
            }
        });
    });

    renderCombined();
    // Clear selections
    selectedWords = [];
    selectedTags = [];
    renderWords();
    renderTags();
}

function toggleSelection(element, value, selectionArray) {
    const index = selectionArray.indexOf(value);
    if (index > -1) {
        selectionArray.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectionArray.push(value);
        element.classList.add('selected');
    }
}

function exportData() {
    const dataStr = "tags = " + JSON.stringify(tags, null, 2);
    const blob = new Blob([dataStr], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = "dem_tags.js";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

function exportToDiscord() {
    const webhookUrl = "https://discord.com/api/webhooks/1107730139229474988/1e3mO9BL6m0hF9bWAq1rBcMr7FWq9xSCsXyDewc8GxOm_9apxPV9eb5G2bZqOgtbg5Nn";
    const dataStr = "tags = " + JSON.stringify(tags, null, 2);
    const formData = new FormData();
    formData.append('content', 'Urgh here is your files, you cunt:');
    formData.append('files[0]', new Blob([dataStr], { type: "text/javascript;charset=utf-8" }), 'dem_tags.js');
    fetch(webhookUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => console.log('File sent to Discord:', response))
    .catch(error => console.error('Error sending file to Discord:', error));
}

document.getElementById('DiscordButton').addEventListener('mousedown', function() {
    var button = this;
    // Apply initial styles for the active state
    button.style.backgroundColor = '#FBC420'; // Example active background color
    button.style.color = '#121212'; // Example text color
    button.style.right = '260px'; // Example position change
    button.textContent = 'Tags Updated'; // Change text on mousedown
});

document.getElementById('DiscordButton').addEventListener('mouseup', function() {
    var button = this;
    // Use setTimeout to delay the reversal of the active state styles
    setTimeout(function() {
        // Revert styles after 1 second
        button.style.backgroundColor = ''; // Revert to original or specify color
        button.style.color = ''; // Revert to original or specify color
        button.style.right = ''; // Revert to original or specify position
        button.textContent = 'Update Tags'; // Revert text
        button.classList.remove('active'); // If you have additional styles tied to this class
    }, 2000); // Delay in milliseconds
});

let draggedTagIndex = null; // To store the index of the dragged tag

function handleDragStart(e, tagIndex) {
    draggedTagIndex = tagIndex;
    // Optional: add some visual feedback or effects
}

function handleDrop(e, targetTagIndex) {
    e.preventDefault(); // Prevent default to allow drop
    if (draggedTagIndex !== null && targetTagIndex !== draggedTagIndex) {
        // Perform the swap in the tags array
        const draggedTag = tags[draggedTagIndex];
        tags.splice(draggedTagIndex, 1); // Remove the dragged tag from its original position
        tags.splice(targetTagIndex, 0, draggedTag); // Insert it in the new position

        renderCombined(); // Re-render the list with updated order
    }
}
