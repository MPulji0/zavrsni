  $(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#movie ").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });

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

function closeBtnFunc() {
  const loginPanelDiv = document.querySelector('.loginPanel')
  console.log(loginPanelDiv)
  loginPanelDiv.style.display = "none"
}

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

let cookieValues = document.cookie
let arr = cookieValues.split(';')
let result = arr[0].search('uname')

if (result > -1) {
  const loginDiv = document.querySelector('.login-div')
  let username = arr[0].substr(arr[0].search('=') + 1)

  loginDiv.style.display = "none"
  const signoutDiv = document.querySelector('.signout-div')
  const signoutBtn = document.querySelector('#signoutBtn')
  
  signoutBtn.value = username
  signoutDiv.style.display = "block"
}

if (result === -1) {
  const loginDiv = document.querySelector('.login-div')
  loginDiv.style.display = "block"
  const signoutDiv = document.querySelector('.signout-div')
  signoutDiv.style.display = "none"
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

if (window.location.href === 'http://localhost:8080/') {
  activeTabNavBar(0)
} else if (window.location.href === 'http://localhost:8080/filmovi') {
  activeTabNavBar(1)
} else if (window.location.href === 'http://localhost:8080/upload') {
  activeTabNavBar(2)
}