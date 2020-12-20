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
// var db = firebase.firestore();
let user = {};

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "testScript.js"});
 });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.command == "getUserInfo") {
        const userID = '103897508817747912934'; // get from background.js, user info
        const url = `http://localhost:9090/api/user/${userID}`;
        console.log(url);
        fetch(url, {
            headers:  { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin" : "*", 
                "Access-Control-Allow-Credentials" : true 
            }
        }).then((response) => {
            console.log('just res', response);
            response.json().then((data) => {
                console.log('data', data);
                // const budget = data.budget;
                const people = data.people;
                console.log('people', people);
                const n = people.length;
                var dict = {}; // maps names to person id
                var names = [];

                for (i = 0; i < n; i++) {
                    console.log('person', people[i]);
                    console.log('name', people[i].name);
                    console.log('id', people[i].id);
                    dict[people[i].name] = people[i].id;
                    names.push(people[i].name);
                }
                console.log('dict', dict);
                console.log('names', names);
                chrome.runtime.sendMessage(
                    {command: "sendPeople", people: names, mappedIds: dict}
                );
                
            });
        }).catch(error => {
            console.log("Error fetching response: ", error);
        });
        return true;  // Will respond asynchronously.
      }
});

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
    });
});
