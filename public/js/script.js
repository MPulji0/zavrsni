
// let url = window.location.href
// let queryUrl = url.substring(url.indexOf('?'))
// let uploadUrl = queryUrl.substring(queryUrl.indexOf('upload') + 'upload'.length + 1)
// let currentRoute = window.location.pathname

// console.log(url)
// console.log(uploadUrl)  
// console.log(currentRoute)

// if (uploadUrl !== -1 && currentRoute === '/') {
//   alert('First login to upload a movie')
//   window.location.href = '/'
// }

function loginPanelFunc() {
  const loginPanelDiv = document.querySelector('.loginPanel')
  loginPanelDiv.style.display = "block"
  const signupPanelDiv = document.querySelector('.signupPanel')
  signupPanelDiv.style.display = "none"
}

function signUpPanelFunc() {
  const signupPanelDiv = document.querySelector('.signupPanel')
  signupPanelDiv.style.display = "block"
  const loginPanelDiv = document.querySelector('.loginPanel')
  loginPanelDiv.style.display = "none"
}

function activeTabNavBar(val) {
  const navBarList = document.querySelector('.navbar-nav')
  const childrenArr = navBarList.children
  for(let i = 0; i < childrenArr.length; ++i){
    childrenArr[i].className = ''
  }
  childrenArr[val].className = 'active'
}

async function buildSlideShowCards() {
  let data = undefined
  try {
    const url = `${window.location.origin}/filmovi/data`
    data = await getMovies(url)

    // Izbrisi sva polja u objektu koja nam ne trebaju
    data.forEach(element => {
      delete element.hashName
      delete element.engName
      delete element.description
      delete element.categories
      delete element.movieName
      delete element.trailerLink
    });
    
    console.log(data)
  } catch (err) {
    console.error(err)
    return undefined
  }

  const itemObj = document.querySelector('.item')
  const itemIndicatorObj = document.querySelector('.carousel-indicators li')

  console.log(itemIndicatorObj)

  const carouselDiv = document.querySelector('.carousel-inner')
  const carouselIndicatorsListObj = document.querySelector('.carousel-indicators')


  // Ako ijednog od ovih elemenata nema, prekini izvrsavanje ove funkcije
  if (!itemObj && !itemIndicatorObj 
    && !carouselDiv
    && !carouselIndicatorsListObj) return undefined
      
  
  const itemsArr = []
  const indicatorsArr = []

  itemsArr.push(itemObj)
  indicatorsArr.push(itemIndicatorObj)

  
  for (let i = 0; i < data.length - 1; ++i) {
    // Slike
    let deepCopyObj = itemObj.cloneNode(true)
    itemsArr.push(deepCopyObj)
    
    // Indikatori
    deepCopyObj = itemIndicatorObj.cloneNode(true)
    deepCopyObj.className = ''
    deepCopyObj.setAttribute('data-slide-to', i + 1)
    indicatorsArr.push(deepCopyObj)
  }
  
  itemObj.className += ' active'
  
  data.forEach((value, index) => {
    itemsArr[index].querySelector('img').src = 
    `data:image/${value.ext};base64,${value.imgFile}`

    
    itemsArr[index].querySelector('.carousel-caption')
    .innerHTML = value.hrvName


    // Svaka slika ima na sebi a href element
    // Ako se klikne na sliku na naslovnoj stranici
    // odmah direktno vodi na film koji se nalazi na serveru.
    itemsArr[index].querySelector('a').href = value.linkToMovie

  })
  
  console.log(itemsArr)
  carouselDiv.append(...itemsArr)
  carouselIndicatorsListObj.append(...indicatorsArr)
}

function checkStatus() {
  // Ako je neuspjela prijava na server, ili upload ili je film uspjesno uploadan
  // location.search nam vraca query string, dio URL-a
  const queryStringParams = new URLSearchParams(location.search)
  let isFailed = queryStringParams.has('failed')
  console.log(isFailed)
  if (isFailed) alert('Prijava u sustav nije uspjela.')

  isFailed = queryStringParams.get('upload')
  if(isFailed === 'Login-first') alert('Potrebno se prijaviti prije uploada na server.')
  if (isFailed === 'True') alert('Film je uspjesno uploadan')

  isFailed = queryStringParams.get('dbUpload')
  if (isFailed === 'Failed') alert('Dogodila se pogreska na serveru.\nUpload nije uspio.')
}

/**
 * Unutar ove funkcije se izvrsava sva logika vezana za ovu skriptu
 */
async function main() {

  $(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#movie ").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });

  await buildSlideShowCards()
  checkStatus()
}

// ********************************* IZVRSAVANJE KODA *********************************
main()
