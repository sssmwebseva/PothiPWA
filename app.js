
if('serviceWorker' in navigator) {
    window.addEventListener('load', () =>{
        navigator.serviceWorker
           .register('./sw.js')
           .then(reg => console.log('Service Worker: Registered'))
           .catch(err => console.log(`Service Wroker: Error: ${err}`))
    } )
  
}
else{ 
    console.log('Your browser does not support the Service-Worker!');
}

class Theme {
    //font-size
    static textToFontSize = {
        "text-sm": "0.75rem", 
        "text-base": "1rem",         
        "text-lg": "1.125rem",
        "text-xl": "1.25rem",
        "text-2xl": "1.5rem",
        "text-3xl": "1.875rem"

    };
    //line-height
    static textToLineHeight = {
        "text-sm": "1.25rem",
        "text-base": "1.5rem",
        "text-lg": "1.75rem",
        "text-xl": "1.75rem",
        "text-2xl": "2rem",
        "text-3xl": "2.25rem"
    };

    static darkModeTemplate = "text-white bg-black";
    static lightModeTemplate = "text-black bg-white";

    static fonts = ["Default", "Akshar", "Kanak", "Mangal", "Kiran", "Sharada", "Akruti Dev Priya"];

    static getContentFontSize(){
        let contentFontSize = localStorage.getItem("contentFontSize");
        if (contentFontSize == null) {
            contentFontSize = "text-base";
        }
        console.log("getContentFontSize(): " + contentFontSize);
        return contentFontSize;  
    };

    static setContentFontSize(contentFontSize){
        console.log("setContentFontSize: " + contentFontSize);
        localStorage.setItem("contentFontSize",contentFontSize);
    }
    
    static getContentFont(){
        let contentFont = localStorage.getItem("contentFont");
        if (contentFont == null) {
            contentFont = "Default";
        }
        console.log("getContentFont(): " + contentFont);
        return contentFont;
    };

    static setContentFont(selectedFont){
        console.log("setContentFont(): " + selectedFont);    
        localStorage.setItem("contentFont",selectedFont);
    };
    
    static getDarkModeClasses(){        
        let darkModeClasses = localStorage.getItem("darkmodeclasses");
        if (darkModeClasses == null) {
            darkModeClasses = this.lightModeTemplate;
        }
        console.log("getDarkModeClasses()" + darkModeClasses);
        return darkModeClasses;
    };

    static setDarkModeClasses(darkModeClasses){
        console.log("setDarkModeClasses(): " + darkModeClasses);
        localStorage.setItem("darkmodeclasses", darkModeClasses);
    };

    static getDarkModeFlag(){
        let darkModeFlag = localStorage.getItem("darkmodeflag");
        if (darkModeFlag == null) {
            darkModeFlag = "0";
        }
        console.log("getDarkModeFlag(): " + darkModeFlag);
        return darkModeFlag;
    };

    static setDarkModeFlag(darkModeFlag){
        console.log("setDarkModeFlag()" + darkModeFlag);
        localStorage.setItem("darkmodeflag",darkModeFlag);
    };

    static toggleDarkModeClasses(domElementRef){
        let darkModeFlag = this.getDarkModeFlag();
        let toRemove;
        let toAdd;
        if( darkModeFlag == "1"){
            toRemove = this.lightModeTemplate.split(" ");
            toAdd = this.darkModeTemplate.split(" "); 
        }
        else{
            toRemove = this.darkModeTemplate.split(" ");
            toAdd = this.lightModeTemplate.split(" "); 
        }

        toRemove.forEach((element) => {
            domElementRef.classList.remove(element);
        });

        toAdd.forEach((element) => {
            domElementRef.classList.add(element);
        });

    };

};

let volumes = {};

class Volume {
    static fileName = "";
    static indexTitle = "";
    static index = [];
    static chapters = {};
    static volumeName = "";
    constructor(fileName, volumeName) {
        this.fileName = fileName;
        this.volumeName = volumeName;
        this.indexTitle = volumeName + " अनुक्रमणिका";
        this.index = new Array();
        this.chapters = new Object();
    }

   static setCurrentVolume(currentVolume){
    localStorage.setItem("currentVolume",currentVolume);
   }

   static getCurrentVolume(){
    return localStorage.getItem("currentVolume");
   }

};

class Chapter {
    static title = "";
    static content = [];
    static length = 0;
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
    static getCurrentChapterId(){
        return localStorage.getItem("currentChapterId");
    }
    static setCurrentChapterId(currentChapterId){
        localStorage.setItem("currentChapterId",currentChapterId);
    }
};
class Page{
    constructor(start,end){
        this.start = start;
        this.end = end;
    }
    getPage(){
        return Page.getPage(this.start,this.end);
    }
    static getPage(start,end){
        const pageSpan = document.createElement("span");
        for(let lineno=start; lineno<end; lineno++){
            let para = document.createElement("p");
            para.textContent = Chapter.content[lineno];
            pageSpan.appendChild(para);
        }
        return pageSpan;
    }
}
class Pages {
    static pages = [];

    static createPages(){
        this.pages = [];
        const contentLength = Chapter.content.length;
        const pageContent = document.getElementById("pageContent");
        const documentBody = document.body;

        let lineStart=0;
        let lineEnd = 1;
        const innerHeight = window.innerHeight - 50;
        //const innerHeight = window.innerHeight;
        while(true){
            removeAllChildren(pageContent);
            let pageSpan = Page.getPage(lineStart, lineEnd); 
            //pageSpan.style.fontSize = "xx-large"; Earlier Fix for TailWind CSS Rendering (CSS Does not get expanded in time)        
            pageContent.appendChild(pageSpan);
            let scrollHeight = pageContent.scrollHeight;
            //let scrollHeight = documentBody.scrollHeight;
            //The purpose of this block is to cut pages
            if ((scrollHeight >= innerHeight) || (lineEnd >= contentLength)){
                if (lineEnd < contentLength){
                    lineEnd--;
                }
                let page = new Page(lineStart, (lineEnd));
                this.pages.push(page);
                lineStart = lineEnd;
                lineEnd = lineStart + 1;
                if (lineEnd >= contentLength){break;}
            }
            else{
                    lineEnd++;
            }
        }
    }
    
    static updateSiteURL(){
        let pageNumber = this.getPageNumber();
        let currentVolume = Volume.getCurrentVolume();
        let currentChapterId = Chapter.getCurrentChapterId();
        window.history.pushState(Page.number, null, `app.html?apppage=content&vol=${currentVolume}&chap=${currentChapterId}&page=${pageNumber}`);
    }

    static gotoPage(mode){
        let pageNumber = this.getPageNumber();

        if (mode === "next"){
            if (pageNumber < (this.pages.length - 1)) {
                pageNumber++;
            }   
        }
        else if(mode === "prev"){
            if (pageNumber > 0) {
                pageNumber--;
            }
        }
        else{
            pageNumber = mode;
            console.log("Added handling for numeric page");
        }
        console.log(`gotoPage(): ${mode} ${pageNumber}`);        
        this.setPageNumber(pageNumber);
        let page = this.pages[pageNumber];
        let pageSpan = page.getPage();
        const pageContent = document.getElementById("pageContent");
        removeAllChildren(pageContent);
        pageContent.appendChild(pageSpan);
        this.updateSiteURL();

    }
    static getPageNumber(){
        let pageNumber = localStorage.getItem("pageNumber");
        if (pageNumber == null || pageNumber > this.pages.length) {
            pageNumber = 1;
            this.setPageNumber(pageNumber);            

        }    
        console.log(`getPageNumber(): ${pageNumber}`);
        return pageNumber;

    }
    static setPageNumber(pageNumber){
        localStorage.setItem("pageNumber", pageNumber);
    }

};

function initVolumeInfo() {

    console.log("In initVolumeInfo");
    volumes["purva"] = new Volume("purva.json", "पूर्वचरित्र");
    volumes["uttar"] = new Volume("uttar.json", "उत्तरचरित्र");

}

async function fetchData(volumeName) {
    console.log("Inside Fetch Data");
    try {
        response = await fetch(volumes[volumeName].fileName, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        data = await response.json();
        let volData = {};
        volData["volumeName"] = volumeName;
        volData["chapters"] = data.chapters;
        return volData;
    } catch (error) {
        console.error(`Could not get products: ${error}`);
    }
}


function fetchVolumeData() {
    console.log("Inside fetchVolumeData");
    const fetchPromisePurva = fetchData("purva");
    const fetchPromiseUttar = fetchData("uttar");

    Promise.all([fetchPromisePurva, fetchPromiseUttar])
        .then(responses => {

            for (const response of responses) {
                populateContent(response["volumeName"], response["chapters"]);
            }

            loadAppPage();
        })
        .catch(error => {
            console.error(`Failed to fetch: ${error}`)
        }
        )

}

function loadAppPage() {

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("apppage")) {
        let appPage = urlParams.get("apppage");
        switch (appPage) {
            case 'intro':
                displayIntroPage();
                break;
            case 'volumes':
                displayVolumesListPage();
                break;
            case 'chlist':
                if(urlParams.has("vol")){                                        
                    let vol = urlParams.get("vol");
                    Volume.setCurrentVolume(vol);
                }
                displayChapterListPage();
                break;
            case 'content':
                if (urlParams.has("vol") && urlParams.has("chap") && urlParams.has("page")) {
                    console.log("reload");
                    let vol = urlParams.get("vol");
                    Volume.setCurrentVolume(vol);
                    let id = urlParams.get("chap");
                    Page.number = Number(urlParams.get("page"));
                    if (!isNaN(Page.number)) {
                        displayContent(id);
                        //Pages.createPages();
                    }
                }
                break;
            case 'fontset':
                displayFontSettingsPage();
                break;
            default:
                displayCoverPage();
        }
    }
    else {
        displayCoverPage();
    }

}

window.onload = function () {
    // Check if this is a reload, in which case you are already on a slide.
    console.log("In On Load");
    initVolumeInfo();
    fetchVolumeData();
}

window.onpopstate = function (e) {
    console.log("In onpopstate");
    if (e.state != null) {
        Page.prevPage();
    }
}

function removeAllChildren(parentNode){
    while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
    }
}

function displayCoverPage() {
 
    rootNode = document.getElementById("root");
    removeAllChildren(rootNode);

    const authorChild = document.createElement("div");
    authorChild.classList.add("text-2xl", "my-5", "text-gray-500");
    authorChild.innerText = "कै. गणेश नारायण मुजुमदार रचित";   

    const bookNameChild = document.createElement("div");
    bookNameChild.classList.add("text-5xl", "my-5", "text-gray-500");
    bookNameChild.innerText = "|| श्रीकृष्णविजय ||";
    
    const volumeNamesChild = document.createElement("div");
    volumeNamesChild.classList.add("text-2xl", "my-1", "text-gray-500");
    volumeNamesChild.innerText = "(पूर्वार्ध आणि उत्तरार्ध)";
    
    const introPageButtonChild = document.createElement("div");
    const introPageButton = document.createElement("button");
    const introPageSpan = document.createElement("span");
    introPageSpan.classList.add("material-symbols-rounded");
    introPageSpan.innerText = "chevron_right";
    introPageButton.appendChild(introPageSpan);
    introPageButton.addEventListener('click',displayIntroPage);
    introPageButtonChild.appendChild(introPageButton);

    rootNode.appendChild(authorChild);
    rootNode.appendChild(bookNameChild);
    rootNode.appendChild(volumeNamesChild);
    rootNode.appendChild(introPageButtonChild);

    window.history.pushState(Page.number, null, 'app.html?apppage=cover');
}

function displayIntroPage() {
    const rootNode = document.getElementById("root");
    removeAllChildren(rootNode);

    const imageChild = document.createElement("div");
    imageChild.classList.add("h-fit", "w-fit");

    const imageTag = document.createElement("img");
    imageTag.src = "img/Swami.jpg";
    imageChild.appendChild(imageTag);

    const nameChild = document.createElement("div");
    nameChild.classList.add("text-xl", "text-blue-500")
    nameChild.textContent = "श्रीकृष्ण सरस्वती दत्त महाराज";

    const birthChild = document.createElement("div");
    birthChild.classList.add("text-sg", "text-blue-500");
    birthChild.textContent = "जन्म - माघ वद्य पंचमी शके १७५७ रविवार ता . ७ फेब्रु . १८३६"

    const samadhiChild = document.createElement("div");
    samadhiChild.classList.add("text-sg","text-blue-500");
    samadhiChild.textContent = "समाधी - श्रावण वद्य दशमी शके १८२२ सोमवार ता. २० ऑगस्ट १९००";

    const volumePageButtonChild = document.createElement("div");
    const volumePageButton = document.createElement("button");
    const volumePageSpan = document.createElement("span");

    volumePageSpan.classList.add("material-symbols-rounded");
    volumePageSpan.innerText = "chevron_right";
    volumePageButton.appendChild(volumePageSpan);
    volumePageButton.addEventListener('click',displayVolumesListPage);
    volumePageButtonChild.appendChild(volumePageButton);

    rootNode.appendChild(imageChild);
    rootNode.appendChild(nameChild);
    rootNode.appendChild(birthChild);
    rootNode.appendChild(samadhiChild);
    rootNode.appendChild(volumePageButtonChild);


    window.history.pushState(Page.number, null, 'app.html?apppage=intro');
}

function createVolumeNameButton(volumeButtonDiv, volId){
    const volumeNameButton = document.createElement("button");
    volumeNameButton.classList.add("border-solid", "border-2", "rounded-md", "p-2", "border-red-700", "border-offset-2", "my-5");

    const bookNamePara = document.createElement("p");
    bookNamePara.classList.add("text-blue-500", "text-3xl");
    bookNamePara.innerText = "|| श्रीकृष्णविजय ||"

    const volumeNamePara = document.createElement("p");
    volumeNamePara.classList.add("text-red-700", "text-2xl");

    if (volId === "purva"){
        volumeNamePara.innerText = "पूर्वचरित्र";
        volumeNameButton.addEventListener('click',displayChapterListPurva);
    }
    else{
        volumeNamePara.innerText = "उत्तरचरित्र";
        volumeNameButton.addEventListener('click',displayChapterListUttar);
    }
    
    volumeNameButton.appendChild(bookNamePara);
    volumeNameButton.appendChild(volumeNamePara);
    volumeButtonDiv.appendChild(volumeNameButton);  
}

function displayVolumesListPage() {
    const rootNode = document.getElementById("root");
    removeAllChildren(rootNode);

    const authorChild = document.createElement("div");
    authorChild.classList.add("text-3xl", "text-red-700", "py-5");
    authorChild.textContent = "कै. गणेश नारायण मुजुमदार रचित";

    const purvaChild = document.createElement("div");
    createVolumeNameButton(purvaChild, "purva");

    const uttarChild = document.createElement("div");
    createVolumeNameButton(uttarChild, "uttar");

    rootNode.appendChild(authorChild);
    rootNode.appendChild(purvaChild);
    rootNode.appendChild(uttarChild);

    window.history.pushState(Page.number, null, 'app.html?apppage=volumes');
}

function displayChapterListPurva() {
    Volume.setCurrentVolume("purva");
    displayChapterListPage();
}

function displayChapterListUttar() {
    Volume.setCurrentVolume("uttar");
    displayChapterListPage();

}

function populateContent(volumeName, chapters) {
    console.log("Inside populateContent")
    for (let i = 0; i < chapters.length; i++) {
        volumes[volumeName].index[i] = chapters[i].id;
        volumes[volumeName].chapters[chapters[i].id] = new Chapter(chapters[i].title, chapters[i].content);
    }
}

function createNavButton(buttonText, buttonHandler){
    const buttonChild = document.createElement("div");
    const button = document.createElement("button");
    const buttonSpan = document.createElement("span");
    buttonSpan.classList.add("material-symbols-rounded");
    buttonSpan.innerText = buttonText;
    button.appendChild(buttonSpan);
    button.addEventListener('click', buttonHandler);
    buttonChild.appendChild(button);
    return buttonChild;
}

function createChapterListNavBar(indexTitle){
    const navbarParent = document.createElement("div");
    navbarParent.classList.add("flex", "flex-row", "grow-0", "justify-between", "items-center", "py-2", "text-white", "bg-orange-900", "h-auto", "w-full", "text-center");
    navbarParent.classList.add("text-xl");
    const leftButtonChild = createNavButton("arrow_back", displayVolumesListPage);

    const centerTextChild = document.createElement("div");
    centerTextChild.innerText = `${indexTitle}`;

    const rightButtonChild = createNavButton("home", displayVolumesListPage);

    navbarParent.appendChild(leftButtonChild);
    navbarParent.appendChild(centerTextChild);
    navbarParent.appendChild(rightButtonChild);

    return navbarParent;

}

function createChapterButton(buttonText, buttonHandlerArg, isCurrent){
    const buttonChild = document.createElement("div");
    buttonChild.classList.add("w-5/6");
    const button = document.createElement("button");
    const textColour = isCurrent ? "text-orange-600":"text-black";
    
    button.classList.add("border-solid", "border-2", "rounded-md", "p-2", "border-orange-900" , "border-offset-2", "w-full");
    const buttonSpan = document.createElement("span");
    buttonSpan.className = `${textColour} text-2xl`;    
    buttonSpan.innerText = buttonText;
    button.appendChild(buttonSpan);
    let displayContentHandler = function(){displayContent(buttonHandlerArg);};
    button.addEventListener('click', displayContentHandler);
    buttonChild.appendChild(button);
    return buttonChild;
}

function displayChapterListPage() {
    console.log("inside displayChapterListPage()");
    let currentVolume = Volume.getCurrentVolume();
    let indexTitle = volumes[currentVolume].indexTitle;

    const rootNode = document.getElementById("root");
    removeAllChildren(rootNode);

    const navbarChild = createChapterListNavBar(indexTitle);
    rootNode.appendChild(navbarChild);

    const chapterListPaneChild = document.createElement("div");
    chapterListPaneChild.classList.add("flex", "flex-col", "content-center", "justify-items-center", "overflow-y-scroll", "items-center", "gap-2", "bg-[url('img/bg.jpg')]", "w-full");
    const chapterId = Chapter.getCurrentChapterId()
     for (let i = 0; i < volumes[currentVolume].index.length; i++) {
        let id = volumes[currentVolume].index[i];
        let title = volumes[currentVolume].chapters[id].title;
        const isCurrent = chapterId === id ? true : false;
        chapterButton = createChapterButton(title,id,isCurrent);
        chapterListPaneChild.appendChild(chapterButton);
    }
    
    rootNode.appendChild(chapterListPaneChild);
    window.history.pushState(Page.number, null, `app.html?apppage=chlist&vol=${currentVolume}`);
}

function setFontSelection() {
    let element = document.getElementById("fontsel");
    let selectedFont = element.value;
    Theme.setContentFont(selectedFont);
    console.log("Selected Font : " + selectedFont);
    let sizeFontArea = document.getElementById("sizefontarea");
    sizeFontArea.style.fontFamily = selectedFont;
}

function setTextSize() {
    let element = document.getElementById("textsize");
    let textSize = element.value;
    console.log("Text Size : " + textSize);
    let prevSize = Theme.getContentFontSize();
    Theme.setContentFontSize(textSize);
    let sizeFontArea = document.getElementById("sizefontarea");
    sizeFontArea.classList.remove(prevSize);
    sizeFontArea.classList.add(textSize);
}

function setDarkMode() {
    let element = document.getElementById("darkmode");
    let darkModeFlag = element.value;
    let sizeFontArea = document.getElementById("sizefontarea");
    console.log("darkModeFlag: " + darkModeFlag);

    if (darkModeFlag == "1") {
        Theme.setDarkModeFlag("1");
        Theme.setDarkModeClasses(Theme.darkModeTemplate);   
    }
    else {
        Theme.setDarkModeFlag("0");
        Theme.setDarkModeClasses(Theme.lightModeTemplate);        
    }
    Theme.toggleDarkModeClasses(sizeFontArea);
}
function windowLocationReplace(location){
    window.location.replace(location);
}
function createFontNavBar(prevLocationHandler){

    const navBarContainer = document.createElement("div");
    navBarContainer.classList.add("flex", "flex-row", "justify-between", "items-center", "py-2", "text-white", "bg-orange-900", "h-auto", "w-full", "text-center");
    const backButton = createNavButton("arrow_back", prevLocationHandler);
    
    const fontNavBarHeading = document.createElement("div");
    fontNavBarHeading.textContent = "Font Style and Size Settings";
    const homePageButton = createNavButton("home",displayVolumesListPage);
    navBarContainer.appendChild(backButton);
    navBarContainer.appendChild(fontNavBarHeading);
    navBarContainer.appendChild(homePageButton);
    return navBarContainer;
}

function createLabel(labelId,labelText){
    const labelContainer = document.createElement("div");
    const labelElement = document.createElement("label");
    labelElement.htmlFor = labelId;
    labelElement.textContent = labelText;
    labelContainer.appendChild(labelElement);
    return labelContainer;

}
function createDarkModeInput(valueText,handlerFunc){
    const inputContainer = document.createElement("div"); 
    const inputElement = document.createElement("input");
    inputElement.classList.add("w-10","items-center","justify-items-center");
    inputElement.type = "range";
    inputElement.id = "darkmode";
    inputElement.name = "darkmode";
    inputElement.min = "0";
    inputElement.max = "1";
    inputElement.value = valueText;
    inputElement.step = "1";
    inputElement.onchange = handlerFunc;
    inputContainer.appendChild(inputElement);
    return inputContainer;

}
function createTextSizeSelectBox(contentFontSize){
    const selectBoxContainer = document.createElement("div");
    const selectBox = document.createElement("select");
    selectBox.classList.add("w-28", "items-center", "justify-items-center");
    selectBox.name = "Text Size";
    selectBox.id = "textsize";
    selectBox.onchange = setTextSize;

    let sizeOption = 0;
        for (textSize in Theme.textToFontSize) {
            let option = "";        
            sizeOption++;
            const optionElement = document.createElement("option");
            optionElement.value = textSize;
            optionElement.textContent = sizeOption;
            if (contentFontSize == textSize) {
                optionElement.selected = true;
            }
            else {
                optionElement.selected = false;
            }
            selectBox.appendChild(optionElement);
        }
        selectBoxContainer.appendChild(selectBox);
        return selectBoxContainer;
}
function createFontSelectBox(contentFont){
    const selectBoxContainer = document.createElement("div");
    const selectBox = document.createElement("select");
    selectBox.classList.add("w-28", "items-center", "justify-items-center");    
    selectBox.name = "Font Selection";
    selectBox.id = "fontsel";   
    selectBox.onchange = setFontSelection;

    Theme.fonts.forEach((element) => {
        const optionElement = document.createElement("option");
        optionElement.value = element;
        optionElement.textContent = element;
        if (element == contentFont) {
            optionElement.selected = true;
        }
        else {
            optionElement.selected = false;
        }

        selectBox.appendChild(optionElement);
    })
    selectBoxContainer.appendChild(selectBox);
    return selectBoxContainer;
}

function createSizeFontArea(darkModeClasses){
    const sizeFontArea = document.createElement("div");
    sizeFontArea.classList.add("col-span-2", "text-center", "py-10", "border-2", "border-orange-900", "my-10");
    const tokens = darkModeClasses.split(" ");
    tokens.forEach(token => {
        sizeFontArea.classList.add(token);
    });

    sizeFontArea.id="sizefontarea";
    sizeFontArea.textContent = "|| श्रीकृष्णविजय ||";
    return sizeFontArea;

}

function createFontSettingsPane(darkModeFlag, contentFont, darkModeClasses,contentFontSize){
    const fontSettingsPane = document.createElement("div");
    fontSettingsPane.classList.add("grow","shrink","grid","grid-cols-2","gap-1","text-lg","font-semibold","text-amber-800","text-left","content-center","items-center");
    fontSettingsPane.id = "fontsetbody";

    const labelDarkMode = createLabel("darkmode","Dark Mode");
    const darkModeInput = createDarkModeInput(darkModeFlag,setDarkMode);
    const labelTextSize = createLabel("textsize","Text Size");
    const textSizeSelectBox = createTextSizeSelectBox(contentFontSize);
    const labelFont = createLabel("fontsel","Set Font Style");
    const fontStyleSelectBox = createFontSelectBox(contentFont);
    const sizeFontArea = createSizeFontArea(darkModeClasses);
    fontSettingsPane.appendChild(labelDarkMode);
    fontSettingsPane.appendChild(darkModeInput);
    fontSettingsPane.appendChild(labelTextSize);
    fontSettingsPane.appendChild(textSizeSelectBox);
    fontSettingsPane.appendChild(labelFont);
    fontSettingsPane.appendChild(fontStyleSelectBox);
    fontSettingsPane.appendChild(sizeFontArea);
    return fontSettingsPane;
}

function displayFontSettingsPage() {
    /*let prevLocation = window.location.href;
    let onclickstring = function() {window.location.replace(prevLocation);}*/
    let chapterId = Chapter.getCurrentChapterId();
    let onclickstring = function() {displayContent(chapterId);}
    //console.log(prevLocation);
    let contentFontSize = Theme.getContentFontSize();
    let contentFont = Theme.getContentFont();
    let darkModeClasses = Theme.getDarkModeClasses();
    let darkModeFlag = Theme.getDarkModeFlag();

    console.log(`DarkMode:${darkModeFlag} DarkModeClass:${darkModeClasses} Content Font Size = ${contentFontSize} Content Font: ${contentFont}`);

    const rootNode = document.getElementById("root");
    removeAllChildren(rootNode);

    const childFontNavBar = createFontNavBar(onclickstring);
    const childFontSettingsPane = createFontSettingsPane(darkModeFlag,contentFont,darkModeClasses,contentFontSize);
    rootNode.appendChild(childFontNavBar);
    rootNode.appendChild(childFontSettingsPane);

    window.history.pushState(Page.number, null, 'app.html?apppage=setfont');
}

function createContentPageNavBar(indexTitle){
    const navbarParent = document.createElement("div");
    navbarParent.classList.add("flex", "flex-row", "flex-none", "justify-between", "items-center", "px-2", "py-1.5", "text-white", "bg-orange-900", "h-auto", "w-full", "text-center");
    navbarParent.classList.add("text-xl")
    const leftButtonChild = createNavButton("arrow_back", displayChapterListPage);

    const centerTextChild = document.createElement("div");
    centerTextChild.innerText = `${indexTitle}`;

    const rightButtonChild = createNavButton("settings", displayFontSettingsPage);

    navbarParent.appendChild(leftButtonChild);
    navbarParent.appendChild(centerTextChild);
    navbarParent.appendChild(rightButtonChild);

    return navbarParent;

}

function createContentPane(darkModeClasses, contentFontSize, contentFont, pageSpan){
    const pageContainer = document.createElement("div");
    //pageContainer.classList.add("flex-1","px-5", "py-2",  "overflow-y-auto", "leading-10");
    pageContainer.classList.add("flex-1","px-5", "py-2");
    pageContainer.classList.add("text-center");
    pageContainer.classList.add("h-full");
    pageContainer.classList.add("w-full");
    pageContainer.style.fontFamily = contentFont;

    const fontSize  = Theme.textToFontSize[contentFontSize];
    const lineHeight = Theme.textToLineHeight[contentFontSize];
    pageContainer.style.fontSize = fontSize;
    pageContainer.style.lineHeight = lineHeight;

    pageContainer.id = "pageContent";
    let darkModeClassesList = darkModeClasses.split(" ");
    darkModeClassesList.forEach((darkmodeClass) => {
        pageContainer.classList.add(`!${darkmodeClass}`);
      });
    pageContainer.appendChild(pageSpan);
    return pageContainer;
}

function createPageTurnBar(){
    const pageTurnParent = document.createElement("div");
    pageTurnParent.classList.add("flex", "text-xl", "h-auto", "border-2","border-amber-800","text-center");
    const prevPageChild = createNavButton("chevron_left",function(){Pages.gotoPage('prev');});
    const nextPageChild = createNavButton("chevron_right",function(){Pages.gotoPage('next');});
    pageTurnParent.appendChild(prevPageChild);
    pageTurnParent.appendChild(nextPageChild);
    return pageTurnParent;
}

function displayContent(id) {
    console.log(`displaycontent(${id})`);

    let currentVolume = Volume.getCurrentVolume();
    let title = volumes[currentVolume].volumeName + " - " + volumes[currentVolume].chapters[id].title;
    Chapter.content = volumes[currentVolume].chapters[id].content;
    Chapter.setCurrentChapterId(id);
    volumes[currentVolume].chapters[id].length = Chapter.content.length;

    let contentFontSize = Theme.getContentFontSize();
    let contentFont = Theme.getContentFont();
    let darkModeClasses = Theme.getDarkModeClasses();


    let pageSpan = Page.getPage(0,5);
    //console.log("formatted_content: " + formatted_content);
    
    const rootNode = document.getElementById("root");
    removeAllChildren(rootNode);

    const navBarChild = createContentPageNavBar(title);
    const contentPaneChild = createContentPane(darkModeClasses,contentFontSize, contentFont, pageSpan);
    const pageTurnChild = createPageTurnBar();

    rootNode.appendChild(navBarChild);
    rootNode.appendChild(contentPaneChild);
    rootNode.appendChild(pageTurnChild);

    Pages.createPages();
    //let pageNumber = Pages.getPageNumber();
    Pages.setPageNumber(0);
    let pageNumber = Pages.getPageNumber();
    Pages.gotoPage(pageNumber);
    Pages.updateSiteURL();
    //Pages.createPages();

}


