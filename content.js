chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "replace-selection") {
    const replaced = replaceSelection(message.correctedText);
    if (!replaced) {
      window.alert("Could not replace the selected text. Please keep the selection active and try again.");
    }
    return;
  }

  if (message?.type === "spellcheck-error" && message.message) {
    window.alert(message.message);
  }
});

function replaceSelection(replacement) {
  const activeEl = document.activeElement;
  if (
    activeEl &&
    (activeEl.tagName === "TEXTAREA" ||
      (activeEl.tagName === "INPUT" &&
        /^(text|search|email|url|tel|password)$/i.test(activeEl.type)))
  ) {
    const start = activeEl.selectionStart ?? 0;
    const end = activeEl.selectionEnd ?? start;

    if (end > start) {
      activeEl.setRangeText(replacement, start, end, "end");
      activeEl.dispatchEvent(new Event("input", { bubbles: true }));
      activeEl.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
  }

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
    selection.removeAllRanges();
    return true;
  }

  return false;
}
