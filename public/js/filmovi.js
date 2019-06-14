window.onload = async () => {
    await fetchNBuild()
    
    const readMoreArr = document.querySelectorAll('.read-more')
    
    for(let i = 0; i < readMoreArr.length; ++i) {
        readMoreArr[i].addEventListener('click', readMoreText)
    }

    let isPressed = false

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
    
    async function getMovies() {
        const url = `${window.location.href}/data`
        const requestRes = await fetch(url)
        return await requestRes.json()
    }
    
    // Ova funkcija gradi kartice filmova, na temelju podataka koje primi iz baze
    async function buildMovieCards(data) {
        const movieCardObj = document.querySelector('.card-movie')
        const movieCardsArr = []
    
        movieCardsArr.push(movieCardObj)
    
        // Kreiramo kartica koliko smo dobili filmova
        // iz baze podataka
        for (let i = 0; i < data.length - 1; i++) {
            let deepObjCopy = movieCardObj.cloneNode(true)
            movieCardsArr.push(deepObjCopy)
        }
    
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
            movieCardsArr[index].querySelector('.watch-here').href = 
                `${window.location.href}/${value.hashName}?movie=${value.movieName}`
        })
    
        document.querySelector('.movies-display').append(...movieCardsArr)
    }
    
    // Ova funkcija zatrazi podatke iz baze i gradi kartice sa tim podacima
    async function fetchNBuild() {
        let data = undefined
        try {
            data = await getMovies()
        } catch (error) {
            console.error(error)
        }
    
        await buildMovieCards(data)
    }
}
