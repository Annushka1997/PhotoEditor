"use strict";

const tabs = document.querySelector(".tabs");
const tabHeader = tabs.querySelector(".tab-header");
const tabHeaderElements = tabs.querySelectorAll(".tab-header > div");
const tabBody = tabs.querySelector(".tab-body");
const tabBodyElements = tabs.querySelectorAll(".tab-body > div");
const tabIndicator = tabs.querySelector(".tab-indicator > div");
const chooseImg = document.querySelector("#chooseImg");
const saveImg = document.querySelector("#saveImg");
const previewImg = document.querySelector(".preview-img img");
const resetBtn = document.querySelector("#resetBtn");
const fileInput = document.querySelector(".file-input");
const rotateBtns = document.querySelectorAll(".rotateBtn");
const filterType = document.querySelector("#filterType");
const filterValue = document.querySelector("#filterValue");
const filterSlider = document.querySelector("#filterInput");
const filterBtns = document.querySelectorAll(".filterBtn");

let file;
let contrast = "1";
let rotate = 0; 
let flipHorizontal = 1;
let flipVertical = 1;
let brightness = "100";
let saturation = "100";
let inversion = "0"; 
let grayscale = "0";
let opacity = "100";
let sepia = 0;

function tabNavigation () {
    for (let i=0; i<tabHeaderElements.length; i++) {
        tabHeaderElements[i].addEventListener("click", function () {
            tabHeader.querySelector(".active").classList.remove("active");
            tabHeaderElements[i].classList.add("active");
            tabBody.querySelector(".active").classList.remove("active");
            tabBodyElements[i].classList.add("active");  
            tabIndicator.style.left = `${i*34}%`;
        });
    }
}

function importImg () {
    file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
}

function exportImg () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "img.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

function rotateAndFlip () {
    rotateBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            console.log(rotateBtns);
            if (btn.classList.contains("left")){
                rotate -= 90; 
            } else if (btn.classList.contains("right")) {
                rotate += 90;
            } else if (btn.classList.contains("vertical")) {
                flipVertical = flipVertical !== 1 ? 1 : -1;
            } else if (btn.classList.contains("horizontal")) {
                flipHorizontal = flipHorizontal !== 1 ? 1 : -1;
            } else {
                cropImage();
            }
            update();
        }); 
    });
}

function update () {
    previewImg.style.filter = `contrast(${contrast}) brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) opacity(${opacity}%) sepia(${sepia}%)`;
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
}

function resetAll () {
    previewImg.style.transform = `rotate(0deg) scale(1, 1)`;
    previewImg.style.filter = `contrast(1) brightness(100%) saturate(100%) invert(0%) grayscale(0%) opacity(100%) sepia(0%)`;
}

function filterShow () {
    filterBtns.forEach(filBtn => {
        filBtn.addEventListener("click", () => {
            document.querySelector(".activeFilter").classList.remove("activeFilter");
            filBtn.classList.add("activeFilter");
            filterType.innerText = filBtn.innerText;
            if (filBtn.classList.contains("contrast")) {
                filterValue.innerText = `${contrast}%`
                filterSlider.max = "100";
                filterSlider.value = contrast;
            }
            if(filBtn.classList.contains("saturation")) {
                filterValue.innerText = `${saturation}%`
                filterSlider.max = "200";
                filterSlider.value = saturation;
            } else if (filBtn.classList.contains("brightness")) {
                filterValue.innerText = `${brightness}%`;
                filterSlider.max = "200";
                filterSlider.value = brightness;
            } else if(filBtn.classList.contains("inversion")) {
                filterValue.innerText = `${inversion}%`;
                filterSlider.max = "100";
                filterSlider.value = inversion;
            } else if (filBtn.classList.contains("grayscale")) {
                filterSlider.value = grayscale;
                filterValue.innerText = `${grayscale}%`;
                filterSlider.max = "100";
            } else if (filBtn.classList.contains("opacity")) {
                filterSlider.value = opacity;
                filterValue.innerText = `${opacity}%`;
                filterSlider.max = "100";
            }
            else if (filBtn.classList.contains("sepia")) {
                filterSlider.value = sepia;
                filterValue.innerText = `${sepia}%`;
                filterSlider.max = "100";
            }
        });
    });
}

function filter () {
    filterValue.innerText = `${filterSlider.value}%`;
    const current = document.querySelector(".filter .activeFilter");

    if (current.classList.contains("contrast")) {
        contrast = filterSlider.value;
    } 
    else if (current.classList.contains("saturation")) {
        saturation = filterSlider.value;
    } 
    else if (current.classList.contains("brightness")) {
        brightness = filterSlider.value;
    }  
    else if (current.classList.contains("inversion")) {
        inversion = filterSlider.value;
    } 
    else if (current.classList.contains("grayscale")){
        grayscale = filterSlider.value;
    } 
    else if (current.classList.contains("opacity")){
        opacity = filterSlider.value;
    } 
    else if (current.classList.contains("sepia")){
        sepia = filterSlider.value;
    }
    update();
}


tabNavigation();
rotateAndFlip();
filterShow();
chooseImg.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", importImg);
saveImg.addEventListener("click", exportImg);
resetBtn.addEventListener("click", resetAll);
filterSlider.addEventListener("input", filter);
