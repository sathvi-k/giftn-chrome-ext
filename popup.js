/* var firebaseConfig = {
    apiKey: "AIzaSyDBgFH0trwdSnwKq30Lj4H2EfDu8xCsGKU",
    authDomain: "chrome-duke.firebaseapp.com",
    projectId: "chrome-duke",
    storageBucket: "chrome-duke.appspot.com",
    messagingSenderId: "919440526614",
    appId: "1:919440526614:web:2d21458b94ff325b951437"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
let user = {}; */

function injectTheScript() {
    // query the active tab, which will be only one tab
    // and inject the script in it
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        console.log('url: ', url);

        let asin;
        var regex = RegExp("https://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
        m = url.match(regex);
        if (m) { 
            asin = m[4];
        } 
        console.log('asin: ', asin);

        // make call to rainforest api using asin to get more product information
        const API = `https://api.rainforestapi.com/request?api_key=EC5DB0CF47884FB6BD5BE1D9253AF2BE&type=product&amazon_domain=amazon.com&asin=${asin}`;

        function getData() {
            return new Promise((resolve, reject) => {
                fetch(API, {
                    headers : { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    response.json().then((data) => {
                        console.log('data', data);
                        resolve(data);
                    });
                    console.log('fetch', response);
                }).catch(error => {
                    console.log("Error fetching response: ", error);
                });
            })    
        }

        let title;
        getData().then(data => {
            title = data.product.title;
            console.log('title: ', title);
            document.getElementById('item-name').innerHTML = 'This gift: ' + title;
        });
        
        chrome.tabs.executeScript(tabs[0].id, {file: "content_script.js"});
    });
}

function addGift() {
    // access backend
    // for this user (google id), get list of people user is buying gifts for and show in drop down using the map function and document
    // make call to backedn after user presses add gift button -- add gift under the selected person, add asin, name, picture
    // name, price, bought (is false), url link
}

document.getElementById('clickactivity').addEventListener('click', injectTheScript);
document.getElementById('addgift').addEventListener('click', addGift);
// console.log('link from popup', link);
// document.getElementById('item-name').innerHTML = link;