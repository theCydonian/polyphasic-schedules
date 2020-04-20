function onSuccess(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;

  console.log('Logged in as: ' + profile.getName());

  document.getElementById("profile").getElementsByTagName('img')[0].src = profile.getImageUrl();
  document.getElementById("profile").getElementsByTagName('p')[0].innerHTML = profile.getName();

  var xhr = new XMLHttpRequest();
  xhr.open('POST', './tokensignin');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
  };
  xhr.send('idtoken=' + id_token);
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
    'theme': 'dark',
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
}

function resetProfileInfo() {
  document.getElementById("profile").getElementsByTagName('img')[0].src = './images/default-profile.png';
  document.getElementById("profile").getElementsByTagName('p')[0].innerHTML = 'default name'; 
}