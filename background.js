const DEFAULT_MODEL = "gemini-2.0-flash";
const MENU_ID = "spellcheck-with-gemini";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Spell check selection",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab?.id || !info.selectionText) {
    return;
  }

  try {
    const { geminiApiKey = "", geminiModel = DEFAULT_MODEL } = await chrome.storage.sync.get([
      "geminiApiKey",
      "geminiModel"
    ]);

    if (!geminiApiKey) {
      throw new Error("Missing Gemini API key. Set it in extension options.");
    }

    const correctedText = await spellCheckText(info.selectionText, geminiApiKey, geminiModel || DEFAULT_MODEL);

    await chrome.tabs.sendMessage(tab.id, {
      type: "replace-selection",
      originalText: info.selectionText,
      correctedText
    });
  } catch (error) {
    await chrome.tabs.sendMessage(tab.id, {
      type: "spellcheck-error",
      message: error instanceof Error ? error.message : "Spell check failed."
    });
  }
});

async function spellCheckText(inputText, apiKey, modelName) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Correct only spelling and obvious punctuation mistakes in the following text. Keep the original language and meaning. Return only the corrected text with no extra explanation.\n\n${inputText}`
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${body}`);
  }

  const data = await response.json();
  const corrected =
    data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || "").join("").trim() || "";

  if (!corrected) {
    throw new Error("Gemini returned an empty response.");
  }

  return corrected;
}
