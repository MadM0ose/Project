const register = document.getElementById('register')

const authorization = document.getElementById('authorization')

const registrationLogin = document.getElementById('reg-login')

const authorizationLogin = document.getElementById('auth-login')

const authorizationPass = document.getElementById('auth-pass')

const registrationPass1 = document.getElementById('reg-pass1')

const registrationPass2 = document.getElementById('reg-pass2')
registrationPass2.disabled = true

const avatar = document.getElementById('avatar')

const img = document.getElementById('img')

const signIn = document.getElementById('signin')

const signUp = document.getElementById('signup')

const registrationForm = document.getElementById('reg-form')
registrationForm.disabled = true

const authorizationForm = document.getElementById('auth-form')
authorizationForm.disabled = true

const registrationformClose = document.getElementById('reg-close')

const authorizationformClose = document.getElementById('auth-close')

let regPass = ''

let authPass = ''

let user = ''

register.onclick = function (event) {
  registrationForm.style = `
    display: block;
    transition: 0.5s;
  `
}

authorization.onclick = function (event) {
  authorizationForm.style = `
    display: block;
    transition: 0.5s;
  `
}

registrationPass1.oninput = function (event) {
  event.target.test = Boolean(event.target.value.match(/\d/)
   && event.target.value.match(/\w/)
   && event.target.value.length > 7)
   console.log(event.target.test)
  event.target.style.color = event.target.test ? '#2DFF08' : 'red'
}

registrationPass1.onchange = function (event) {
  if (event.target.test) {
    registrationPass2.disabled = false
  }
}

registrationPass2.oninput = function (event) {
  event.target.style.color = 
    event.target.value === registrationPass1.value 
      ? '#2DFF08' : 'red' 
}

registrationPass2.onchange = function (event) {
  if (event.target.value === registrationPass1.value) {
    regPass = Sha256.regPass (event.target.value)
    signIn.disabled = !(hash && registrationLogin.value.match(/\S/))
  }  
}

avatar.onchange = function (event) {
  let data
  const reader = new FileReader 
  reader.onload = function (event) {
    data = event.target.result
    img.src = data
  }
  reader.readAsDataURL(event.target.files[0])
}


signIn.onclick = function (event) {
  fetch (`https://garevna-rest-api.glitch.me/user/${registrationLogin.value}`,{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      passhash: regPass,
      avatar: img.src
  })
}).then((response) => {
    if (response.ok) {
        document.cookie = `login=${registrationLogin.value}`
        document.cookie = `hash=${hash}`
    }
    else throw new Error ('Fetch failed')
  })
    .then(
      alert("Welcome!")
  )
}

signUp.onclick = function (event) {
  fetch ( `https://garevna-rest-api.glitch.me/user/${authorizationLogin.value}`)
    .then( ( response ) => {
      if (response.ok) {
        response.json() 
          .then( (response) => {
            user = response 
            console.log(user)
          })
             
              authorizationPass.onchange = function (event) {
              authPass = Sha256.authPass (this.value)
              authPass === response.passhash ? alert('hola') : alert('Wrong password')
              console.log(authPass)
              }
            
      }
    })
}



registrationformClose.onclick = function(event) {
  registrationForm.style.display = 'none'
}


authorizationformClose.onclick = function(event) {
  authorizationForm.style.display = 'none'
}

