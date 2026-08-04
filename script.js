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
const speakSourceButton = document.getElementById('speakSourceButton')
const speakTranslatedButton = document.getElementById('speakTranslatedButton')
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
    // translatedText.value = "";
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
    starLoading();

        // Get selected languages
    let source = sourceLanguage.value;
    const target = targetLanguage.value;

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
        saveHistory();
        clearTranslation();

       

    } 
    catch(error){
        console.error(error);
        starLoading();
        statusMessage.textContent = "Cannot translate now! Try again!";
    }
    stopLoading();
}
translateButton.addEventListener("click", translateText);

function starLoading(){
    translateButton.disabled = true;
    translateButton.textContent = "Translating...";
    translateButton.classList.add("opacity-70", "cursor-not-allowed");
}
function stopLoading(){
    translateButton.disabled = false;
    translateButton.textContent = "Translate";
    translateButton.classList.remove("opacity-70", "cursor-not-allowed")
}
 function deleteHistory(index){
            translationHistory.splice(index, 1);
            showHistory();
            saveHistory();
        }

function swapLanguages(){
    const tempLanguage = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = tempLanguage;

     const tempText = sourceText.value;
    sourceText.value = translatedText.value;
    translatedText.value = tempText;

    updateCharacterCount(); 
}        
    swapButton.addEventListener("click", swapLanguages);

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

function speakText(text, language){
    if(text.trim()=== ""){
        statusMessage.textContent = "Enter text to pronounce!";
        return
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language;
    speech.onerror = function(){
        statusMessage.textContent = "Unable to play";
    }
    window.speechSynthesis.speak(speech);
}
speakSourceButton.addEventListener("click", function(){
   
    speakText(sourceText.value, sourceLanguage.value)
});
speakTranslatedButton.addEventListener("click", function(){
    speakText(translatedText.value, targetLanguage.value);
})
function showHistory(){
    historySection.innerHTML = "";
    translationHistory.forEach((item, index) => {
        historySection.innerHTML += `    
            <div class="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/10 p-6 mb-4">
                <div class="flex justify-between items-center mb-4">
                    <p class="text-sm text-gray-300">
                        ${item.from.toUpperCase()} → ${item.to.toUpperCase()}</p>
                   <button class="deleteButton text-red-400 hover:text-red-300" data-index = "${index}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
               <p class="text-lg font-medium mb-2">${item.source}</p>                                 
                <p class="text-cyan-300 text-lg">${item.translated}</p>                                         
            </div>
        `
    });
    
 };
 
 historySection.addEventListener("click", function (event) {
    const button = event.target.closest(".deleteButton");
    if (!button) return;
    const index = Number(button.dataset.index);
    deleteHistory(index);
});

function saveHistory(){
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
 }

function loadHistory(){
    const savedHistory = localStorage.getItem("translationHistory");
    if(savedHistory){
        translationHistory = JSON.parse(savedHistory);
        showHistory();
    }
}
loadHistory();

