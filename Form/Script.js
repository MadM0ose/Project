const [register, authorization, registrationLogin,
  authorizationLogin, authorizationPass, registrationPass1,
  registrationPass2, avatar, regImg, userImg, signIn, signUp,
  registrationForm, authorizationForm, registrationFormClose,
  authorizationFormClose
] = [ 'register', 'authorization', 'reg-login', 'auth-login',
  'auth-pass', 'reg-pass1', 'reg-pass2', 'avatar', 'reg-img',
  'user-photo', 'signin', 'signup', 'reg-form', 'auth-form',
  'reg-close', 'auth-close'
].map(item => document.getElementById(item))

registrationPass2.disabled = true
registrationForm.disabled = true
authorizationForm.disabled = true

let pass = ''

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
    pass = Sha256.hash (event.target.value)
    signIn.disabled = !(pass && registrationLogin.value.match(/\S/))
  }  
}

avatar.onchange = function (event) {
  let data
  const reader = new FileReader 
  reader.onload = function (event) {
    data = event.target.result
    regImg.src = data
  }
  reader.readAsDataURL(event.target.files[0])
}


signUp.onclick = function (event) {
  fetch (`https://garevna-rest-api.glitch.me/user/${registrationLogin.value}`,{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      passhash: pass,
      avatar: regImg.src
  })
}).then((response) => {
    if (response.ok) {
        document.cookie = `login=${registrationLogin.value}`
        document.cookie = `hash=${pass}`
    }
    else throw new Error ('Fetch failed')
  })
    .then( (response) => {
      userImg.style.display = 'inline-block'
      userImg.src = regImg.src
      registrationForm.style.display = 'none'
      register.style.display = 'none'
      authorization.style.display = 'none'
    })
}

signIn.onclick = function (event) {
  fetch ( `https://garevna-rest-api.glitch.me/user/${authorizationLogin.value}`)
    .then( ( response ) => {
      if (response.ok) {
        response.json() 
          .then( (response) => {
            user = response 
            pass = Sha256.hash (authorizationPass.value)
            pass === user.passhash 
              ? userImg.style.display = 'inline-block' : null
            userImg.src = user.avatar
          })
            .then( ( response ) => {
              authorizationForm.style.display = 'none'
              register.style.display = 'none'
              authorization.style.display = 'none'
            } )     
      }
    })
}



registrationFormClose.onclick = function(event) {
  registrationForm.style.display = 'none'
}


authorizationFormClose.onclick = function(event) {
  authorizationForm.style.display = 'none'
}

window.onclick = function (event) {
  event.target === document.body ? registrationForm.style.display = 'none' 
    ? authorizationForm.style.display = 'none' : null : null

}