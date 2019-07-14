// **************************** DEFINICIJE SVIH FUNKCIJA ****************************

/**
 * Ova funkcija se koristi za prikazati vise opisa o filmu.
 * Funkcija kontrolira i logiku botuna "Procitaj vise/manje", gdje skriva ili prikazuje sadrzaj
 * ovisno o kliku.
 * @param {Event} event - dogadaj koji se proslijedi kada korisnik klikne na procitaj vise
 */
function readMoreText(event) {
    let readMoreA = event.target
    const spanMore = readMoreA.parentElement.querySelector('.more')
    
    if(!isPressed) {
        readMoreA.innerText = "Procitaj manje"
        spanMore.style.display = "block";
    } else if(isPressed)
    {
        readMoreA.innerText = "Procitaj vise"
        spanMore.style.display = "none";
    }
    isPressed = !isPressed
}

/**
 * Ova funkcija gradi kartice filmova, na temelju podataka koje primi iz baze.
 * @param {Array} data - niz objekata koji u sebi sadrze sva polja (navedeno za @function getMovies() ) vezana za film.
 */
async function buildMovieCards(data) {
    const movieCardObj = document.querySelector('.card-movie')
    const movieCardsArr = []

    movieCardsArr.push(movieCardObj)

    // Kreiramo kartica koliko smo dobili filmova iz baze podataka
    for (let i = 0; i < data.length - 1; i++) {
        let deepObjCopy = movieCardObj.cloneNode(true)
        movieCardsArr.push(deepObjCopy)
    }

    // Za svaki objekt (film) iz baze kreiraj karticu sa navedenim vrijednostima
    data.forEach((value, index) => {
        movieCardsArr[index].querySelector('h3').innerText = value.hrvName
        movieCardsArr[index].querySelector('h4').innerText = value.engName
        movieCardsArr[index].querySelector('.movie-info').innerText = 
            `${value.length} | ${value.categories.join(', ')}`
        
        movieCardsArr[index].querySelector('.movie-img').src = `data:image/${value.ext};base64,${value.imgFile}`
        if (value.description.split(' ').length > 50) {
            let words = value.description.split(' ')
            let lessStr = words.slice(0, 50).join(' ')

            movieCardsArr[index].children[4].innerText = lessStr

            let spanElem = document.createElement('span')
            spanElem.className = 'more'
            spanElem.innerText = words.slice(50).join(' ')
            
            spanElem.style.display = "none"
            movieCardsArr[index].querySelector('.movie-text').appendChild(spanElem)
        } else {
            movieCardsArr[index].querySelector('.movie-text').innerText = value.description
            movieCardsArr[index].querySelector('.read-more').style.display = 'none'
        }

        movieCardsArr[index].querySelector('.trailer').href = value.trailerLink
        // movieCardsArr[index].querySelector('.watch-here').href = 
        //     `${window.location.href}/${value.hashName}?movie=${value.movieName}`
        movieCardsArr[index].querySelector('.watch-here').href = 
            `${window.location.href}/gledaj/?movieHash=${value.hashName}&movie=${value.movieName}`
    })

    // Dodaj sve te kreirane kartice u glavni element za prikaz (.movies-display)
    document.querySelector('.movies-display').append(...movieCardsArr)
}

/**
 * Ova funkcija zatrazi podatke iz baze i gradi kartice sa tim podacima.
 * Poziva unutar sebe dvije funkcije: 
 * @function getMovies()
 * @function buildMovieCards()
 * 
 * Nikakvu dodatnu logiku ova funkcija ne radi.
 */
async function fetchNBuild() {
    let data = undefined
    try {
        const url = `${window.location.href}/data`
        data = await getMovies(url)
    } catch (error) {
        console.error(error)
    }

    await buildMovieCards(data)
}

// **************************** IZVRSAVANJE KODA ****************************
let isPressed = false
window.onload = async () => {
    await fetchNBuild()
    const readMoreArr = document.querySelectorAll('.read-more')
    
    for(let i = 0; i < readMoreArr.length; ++i) {
        readMoreArr[i].addEventListener('click', readMoreText)
    }
}
