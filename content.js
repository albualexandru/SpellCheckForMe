chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "replace-selection") {
    replaceSelection(message.correctedText, message.originalText);
    return;
  }

  if (message?.type === "spellcheck-error" && message.message) {
    window.alert(message.message);
  }
});

function replaceSelection(replacement, originalText) {
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
      return;
    }

    if (originalText && activeEl.value.includes(originalText)) {
      activeEl.value = activeEl.value.replace(originalText, replacement);
      activeEl.dispatchEvent(new Event("input", { bubbles: true }));
      activeEl.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
  }

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
    selection.removeAllRanges();
    return;
  }

  if (originalText && document.body?.innerText?.includes(originalText)) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node?.nodeValue?.includes(originalText)) {
        node.nodeValue = node.nodeValue.replace(originalText, replacement);
        return;
      }
    }
  }
}
