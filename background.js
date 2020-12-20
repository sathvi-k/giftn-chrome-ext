const firebaseConfig = {
    apiKey: "AIzaSyD-thtNi-U_hW8rawNHVdBml_Qr117wmfc",
    authDomain: "giftn-a1b43.firebaseapp.com",
    projectId: "giftn-a1b43",
    storageBucket: "giftn-a1b43.appspot.com",
    messagingSenderId: "123538290178",
    appId: "1:123538290178:web:81b2898daec1dd2365d91b",
    measurementId: "G-840RX00WET"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
let user = {};

chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
    firebase.auth().signInWithCredential(credential);

    fetch ('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonResponse) {
        user = jsonResponse;
        email = user.email;
        console.log('user', user);
        // document.getElementById('user-email').innerHTML = "Welcome, " + email;
    });
});
