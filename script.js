const sourceLanguage = document.getElementById('sourceLanguage');
const targetLanguage = document.getElementById('targetLanguage');
const sourceText = document.getElementById('sourceText');
const translatedText = document.getElementById('translatedText');
const translateButton = document.getElementById('translateButton');
const clearButton = document.getElementById('clearButton');
const swapButton = document.getElementById('swapButton');
const copyButton = document.getElementById('copyButton');
const characterCount = document.getElementById('characterCount');
const statusMessage= document.getElementById('statusMessage');

// translation history - why array-
let translationHistory = []
const MAX_HISTORY = 10;

// functions
function updateCharacterCount(){
    console.log(sourceText.value);
    characterCount.textContent = sourceText.value.length;
}
sourceText.addEventListener("input", updateCharacterCount);

function clearTranslation(){
    sourceText.value= "";
    translatedText.value = "";
    characterCount.textContent = 0;
    statusMessage = "";

}
clearButton.addEventListener("click", clearTranslation);

