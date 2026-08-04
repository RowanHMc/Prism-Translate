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
const historySection= document.getElementById('historySection');
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
    statusMessage.textContent = "";

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
    // if (source === "auto") {
    //     source = "en";
    // }

    // console.log("Text:", text);
    // console.log("Source:", source);
    // console.log("Target:", target);
    
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
        const translation = {
            source: text,
            translated: data[0][0][0],
            from: source,
            to: target 
        };
        translationHistory.unshift(translation)

        if(translationHistory.length > MAX_HISTORY){
            translationHistory.pop();
        }
        showHistory();

    } catch(error){
        console.error(error);
        statusMessage.textContent = "Cannot translate now! Try again!";
    }
}
translateButton.addEventListener("click", translateText);

function copyTranslation(){
    const text = translatedText.value;
    if(text === ""){
        statusMessage.textContent = "Copy field is empty!";
        return;
    }
    navigator.clipboard.writeText(text);
    statusMessage.textContent = "Text Copied";
}
copyButton.addEventListener("click", copyTranslation);

function showHistory(){
    historySection.innerHTML = "";
    translationHistory.forEach((item) => {
        historySection.innerHTML += `    
            <div class="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/10 p-6">
                <div class="flex justify-between items-center mb-4">
                    <p class="text-sm text-gray-300">
                        ${item.from.toUpperCase()} → ${item.to.toUpperCase()}</p>
                   <button class="text-red-400 hover:text-red-300">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
               <p class="text-lg font-medium mb-2">${item.source}</p>                                 
                <p class="text-cyan-300 text-lg">${item.translated}</p>                                         
            </div>
        `
    });
 }
 
