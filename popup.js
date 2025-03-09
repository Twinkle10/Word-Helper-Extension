document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("selectedWord", function (data) {
        if (chrome.runtime.lastError) {
            console.error("❌ Error retrieving word:", chrome.runtime.lastError);
        }

        let word = data.selectedWord || "";
        document.getElementById("word").textContent = word || "No word selected!";

        if (word) {
            fetchWordDetails(word);
        } else {
            updateDefinition("Select a word before opening the extension.", "-", "-");
        }
    });
});

function fetchWordDetails(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data[0]) {
                const meaning = data[0].meanings[0]?.definitions[0]?.definition || "No definition found.";
                const synonyms = data[0].meanings[0]?.synonyms?.slice(0, 5).join(", ") || "No synonyms found.";
                const example = data[0].meanings[0]?.definitions[0]?.example || "No example found.";

                document.getElementById("definition").textContent = meaning;
                document.getElementById("synonyms").textContent = synonyms;
                document.getElementById("example").textContent = example;
            } else {
                updateDefinition("No definition found.", "-", "-");
            }
        })
        .catch(error => {
            console.error("❌ Error fetching data:", error);
            updateDefinition("Error fetching data.", "-", "-");
        });
}

// 🔄 Function to update the UI safely
function updateDefinition(def, syn, ex) {
    document.getElementById("definition").textContent = def;
    document.getElementById("synonyms").textContent = syn;
    document.getElementById("example").textContent = ex;
}
