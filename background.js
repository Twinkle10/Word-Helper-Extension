// 🟢 Create context menu on extension install/update
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "lookupWord",
        title: "Find meaning of '%s'",
        contexts: ["selection"]
    });
});

// 🟢 Handle right-click menu selection
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "lookupWord") {
        const selectedText = info.selectionText.trim();
        if (!selectedText) return;

        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`);
            const data = await res.json();

            if (data[0]) {
                const meaning = data[0].meanings[0].definitions[0].definition || "No definition found.";
                
                // Inject alert into the tab to show meaning
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (meaning) => alert(`📖 Meaning: ${meaning}`),
                    args: [meaning]
                });
            }
        } catch (error) {
            console.error("❌ Error fetching word:", error);
        }
    }
});

// 🟢 Handle messages from content.js to store selected word
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "STORE_WORD") {
        chrome.storage.local.set({ selectedWord: request.word }, () => {
            if (chrome.runtime.lastError) {
                console.error("❌ Error saving word:", chrome.runtime.lastError);
            } else {
                console.log(`✅ Stored word: ${request.word}`);
            }
        });
    }
});
