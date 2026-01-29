# Chinese Converter

A VSCode extension that allows you to easily convert between Simplified and Traditional Chinese, as well as perform multi-language translation.

## Features

- **Simplified to Traditional**: Select text and choose "Simplified -> Traditional" from the "Chinese Conversion" submenu in the right-click menu
- **Traditional to Simplified**: Select text and choose "Traditional -> Simplified" from the "Chinese Conversion" submenu in the right-click menu
- **Multi-language Translation**: Find the following features in the "Chinese Conversion" submenu of the right-click menu:
  - Chinese -> English
  - Chinese -> German
  - Chinese -> Vietnamese
  - Translate to English
  - Translate to Simplified Chinese
  - Translate to Traditional Chinese

## Requirements

- VSCode 1.60 or higher
- Python 3.x
- pip package manager

## Installation

1. Open Command Palette in VSCode (Ctrl+Shift+P)
2. Run "Extensions: Install from VSIX..." command
3. Select the extension package file for installation
4. Restart VSCode

## Usage

1. Select the Chinese text you want to convert in the editor
2. Right-click on the selected text
3. Select the "Chinese Conversion" submenu from the context menu
4. In the submenu, you will see multiple options:
   - "Traditional -> Simplified" - Convert selected text from Traditional to Simplified
   - "Simplified -> Traditional" - Convert selected text from Simplified to Traditional
   - "Translate to English" - Translate Chinese to English
   - "Translate to Simplified Chinese" - Translate English to Simplified Chinese
   - "Translate to Traditional Chinese" - Translate English to Traditional Chinese
   - "Chinese -> English" - Translate Chinese to English
   - "Chinese -> German" - Translate Chinese to German
   - "Chinese -> Vietnamese" - Translate Chinese to Vietnamese
5. Click the appropriate option to complete the conversion or translation

## Technical Details

- Uses opencc-python-reimplemented library for Simplified/Traditional conversion
- Leverages VSCode extension API for context menu integration
- Uses python-shell for communication between Node.js and Python
- Supports multiple translation libraries (googletrans, deep-translator, translate) to improve translation success rate
- All conversion and translation features are integrated into a "Chinese Conversion" aggregation menu for easy use

## Notes

- Ensure that Python is properly installed and added to your PATH environment variable
- The first time you run the extension, it may take some time to install Python dependencies
- Translation functionality relies on online translation services and requires an internet connection
- Some translation APIs may have usage limitations or require keys to function

## Version History

- 1.0.0 - Initial version, supports basic simplified and traditional Chinese conversion functions, as well as converting Chinese to other language systems.