var idtoken;

function onSuccess(googleUser) {
  var profile = googleUser.getBasicProfile();
  id_token = googleUser.getAuthResponse().id_token;

  document.getElementById("profile-pic").src = profile.getImageUrl();
  document.getElementById("username").innerHTML = profile.getName();

  var xhr = new XMLHttpRequest();
  xhr.open('POST', './tokensignin');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
  };
  xhr.send('idtoken=' + id_token);

  document.getElementById("row-1").setAttribute('data-signed-in', "true");
  updateButton();
}

function onFailure(error) {
  console.log(error);
}

function renderButton() {
  gapi.signin2.render('google-signin', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'light',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  resetProfileInfo();
  document.getElementById("row-1").setAttribute('data-signed-in', "false");
  updateButton();
}

function resetProfileInfo() {
  document.getElementById("profile-pic").src = './images/default-profile.png';
  document.getElementById("username").innerHTML = 'default name'; 
}

function updateButton() {
  if (document.getElementById("row-1").getAttribute('data-signed-in') == "true") {
    document.getElementById("signin").style.display = 'none';
    document.getElementById("profile").style.display = 'inline-block';
    document.getElementById("row-2").style.display = 'flex';
  } else {
    document.getElementById("signin").style.display = 'flex';
    document.getElementById("profile").style.display = 'none';
    document.getElementById("row-2").style.display = 'none';
  }
}