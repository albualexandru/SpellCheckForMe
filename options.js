const DEFAULT_MODEL = "gemini-2.0-flash";

const modelInput = document.getElementById("geminiModel");
const apiKeyInput = document.getElementById("geminiApiKey");
const saveButton = document.getElementById("save");
const statusEl = document.getElementById("status");

loadOptions();
saveButton.addEventListener("click", saveOptions);

async function loadOptions() {
  const { geminiModel = DEFAULT_MODEL, geminiApiKey = "" } = await chrome.storage.sync.get([
    "geminiModel",
    "geminiApiKey"
  ]);

  modelInput.value = geminiModel;
  apiKeyInput.value = geminiApiKey;
}

async function saveOptions() {
  const geminiModel = modelInput.value.trim() || DEFAULT_MODEL;
  const geminiApiKey = apiKeyInput.value.trim();

  await chrome.storage.sync.set({
    geminiModel,
    geminiApiKey
  });

  statusEl.textContent = "Saved.";
  setTimeout(() => {
    statusEl.textContent = "";
  }, 1500);
}
