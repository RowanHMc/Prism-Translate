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

// translate btn
async function translateText(){
    const text = sourceText.value.trim();
    if(text === ""){
        statusMessage.textContent = "Nothing to translate!";
        return;
    }
    statusMessage.textContent = "";

        // Get selected languages
    let source = sourceLanguage.value;
    const target = targetLanguage.value;

    // MyMemory doesn't support "auto"
    if (source === "auto") {
        source = "en";
    }

    console.log("Text:", text);
    console.log("Source:", source);
    console.log("Target:", target);
    
    try{
        const response = await fetch(
             `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
        );
        if(!response.ok){
            throw new Error("Translation Failed!")
        }
       
        const data = await response.json();
        console.log(data);

        translatedText.value = data[0][0][0];

    } catch(error){
        console.error(error);
        statusMessage.textContent = "Cannot translate now! Try again!";
    }
}
translateButton.addEventListener("click", translateText);

