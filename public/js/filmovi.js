const readMoreArr = document.querySelectorAll('.read-more')
console.log(readMoreArr)

for(let i = 0; i < readMoreArr.length; ++i) {
    readMoreArr[i].addEventListener('click', readMoreText)
}

let isPressed = false
function readMoreText(event) {
    let readMoreA = event.target
    const spanMore = readMoreA.parentElement.querySelector('.more')
    isPressed = !isPressed

    if(!isPressed) {
        readMoreA.innerText = "Procitaj manje"
        spanMore.style.display = "block";
    } else if(isPressed)
    {
        readMoreA.innerText = "Procitaj vise"
        spanMore.style.display = "none";
    }
}