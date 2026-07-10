# SpellCheckForMe

Chrome extension that adds a **"Spell check selection"** right-click action.

## Features

- Right-click selected text and trigger spell check.
- Uses Gemini API (`generateContent`) to correct spelling/punctuation.
- Replaces selected text in place inside inputs, textareas, and editable content.
- Options page to configure:
  - Gemini model name (default: `gemini-2.0-flash`)
  - Gemini API key

## Load extension locally

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this repository folder (the directory that contains `manifest.json`)

## Configure

1. Open extension **Details** → **Extension options**
2. Set Gemini model name and API key
3. Save

## Use

1. Select text inside a form field or editable area
2. Right click
3. Click **Spell check selection**