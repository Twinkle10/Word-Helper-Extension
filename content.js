document.addEventListener("mouseup", function () {
    let selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    // 🚨 Check if extension is still active before sending a message
    try {
        chrome.runtime.sendMessage({ type: "STORE_WORD", word: selectedText }, (response) => {
            if (chrome.runtime.lastError) {
                console.warn("⚠️ Could not send message. Extension may have been reloaded.");
            }
        });
    } catch (error) {
        console.warn("⚠️ Extension is unavailable. It may have been reloaded.");
    }
});
