/**
 * Ova funkcija dohvaca filmove iz baze podataka.
 * Odlazi na URL: localhost:8080/filmovi/data gdje prima JSON objekt kao odgovor.
 * Polja koja se nalaze unutar odgovora za svaki film su:
 *  categories, hashName, movieName (bas ime file-a kako se zove.mp4), hrvName, engName,
 *  description, trailerLink i imgFile (bas bitovi slike)
 * @param {String} url - Link za rutu do baze da nam da podatke
 */
async function getMovies(url) {
    const requestRes = await fetch(url)
    return await requestRes.json()
}

function pocetnaMenu() {
    window.location.href = '/'
}
  
function filmoviMenu() {
    window.location.href = "/filmovi"
    const filmoviTab = document.getElementById('filmovi').parentNode.className="active"
    console.log(filmoviTab)
}
  
function uploadMenu() {
    window.location.href = "/upload"
}

function activeTabNavBar(val) {
    const navBarList = document.querySelector('.navbar-nav')
    const childrenArr = navBarList.children
    for(let i = 0; i < childrenArr.length; ++i){
      childrenArr[i].className = ''
    }
    childrenArr[val].className = 'active'
}

function closeBtnFunc() {
    const loginPanelDiv = document.querySelector('.loginPanel')
    const signupPanelDiv = document.querySelector('.signupPanel')
    loginPanelDiv.style.display = "none"
    signupPanelDiv.style.display = "none"
}


// MAIN
if (window.location.href === 'http://localhost:8080/') {
    activeTabNavBar(0)
} else if (window.location.href === 'http://localhost:8080/filmovi') {
    activeTabNavBar(1)
} else if (window.location.href === 'http://localhost:8080/upload') {
    activeTabNavBar(2)
}

let cookieValues = document.cookie
let arr = cookieValues.split(';')
let result = arr[0].search('uname')

if (result > -1) {
  const loginDiv = document.querySelector('.login-div')
  let username = arr[0].substr(arr[0].search('=') + 1)

  loginDiv.style.display = "none"
  const signoutDiv = document.querySelector('.signout-div')
//   const signoutBtn = document.querySelector('#signoutBtn')
    const usernameSpan = document.querySelector('#username')

//   signoutBtn.value = username
usernameSpan.innerHTML = username
  signoutDiv.style.display = "flex"
}

if (result === -1) {
  const loginDiv = document.querySelector('.login-div')
  loginDiv.style.display = "block"
  const signoutDiv = document.querySelector('.signout-div')
  signoutDiv.style.display = "none"
}
