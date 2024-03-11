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
    wordsColumn.innerHTML = '<h2>Words</h2>';
    entries.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.innerText = word;
        wordDiv.classList.add('selectable');
        wordDiv.onclick = () => toggleSelection(wordDiv, word, selectedWords);
        wordsColumn.appendChild(wordDiv);
    });
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

    tags.forEach(tag => {
        const dropdown = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = tag[0];
        dropdown.appendChild(summary);

        tag[1].forEach(word => {
            const wordDiv = document.createElement('div');
            wordDiv.innerText = word;
            dropdown.appendChild(wordDiv);
        });

        combinedColumn.appendChild(dropdown);
    });
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
