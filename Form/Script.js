const login = document.getElementById('login')

const pass1 = document.getElementById('pass1')

const pass2 = document.getElementById('pass2')
pass2.disabled = true

const avatar = document.getElementById('avatar')

const img = document.getElementById('img')

const submit = document.getElementById('submit')


let hash = '', test

pass1.oninput = function (event) {
  event.target.test = Boolean(event.target.value.match(/\d/)
   && event.target.value.match(/\w/)
   && event.target.value.length > 7)
   console.log(event.target.test)
  event.target.style.color = event.target.test ? '#2DFF08' : 'red'
}

pass1.onchange = function (event) {
  if (event.target.test) {
    pass2.disabled = false
  }
}

pass2.oninput = function (event) {
  event.target.style.color = 
    event.target.value === pass1.value 
      ? '#2DFF08' : 'red' 
}

pass2.onchange = function (event) {
  if (event.target.value === pass1.value) {
    hash = Sha256.hash (event.target.value)
    submit.disabled = !(hash && login.value.match(/\S/))
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


submit.onclick = function (event) {
  fetch (`https://garevna-rest-api.glitch.me/user/${login.value}`,{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      passhash: hash,
      avatar: img.src
  })
}).then((response) => {
    if (response.ok) {
        document.cookie = 'login=${login.value'
        document.cookie = `hash=${hash}`
    }
    else throw new Error ('Fetch failed')
    }
  )
}