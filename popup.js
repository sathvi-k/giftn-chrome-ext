let people;
let mappedIds;

window.onload = function() {
    chrome.runtime.sendMessage(
        {command: "getUserInfo"}
    );

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.command == "sendPeople") {
                console.log('req people', request.people);
                people = request.people;
                mappedIds = request.mappedIds;
                console.log('req people', people);
                console.log('req mapped ids', mappedIds);
                people.map((name) => {
                    var x = document.createElement("OPTION");
                    x.setAttribute("value", name);
                    var t = document.createTextNode(name);
                    x.appendChild(t);
                    document.getElementById("dropdown-add-gift").appendChild(x);
                })
                return true; 
            }
        }
    )
}

function uuidv4() {  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {    
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);    
        return v.toString(16);  
    });
}

function addGift() {
    // access backend
    // for this user (google id), get list of people user is buying gifts for and show in drop down using the map function and document
    // make call to backend after user presses add gift button -- add gift under the selected person

    var e = document.getElementById("dropdown-add-gift");
    var friend = e.value;
    console.log(friend);
    var friendID = mappedIds[friend]

    console.log('friendID: ', friendID);

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

        getData().then(data => {
            let name = data.product.title;
            let link = data.product.link;
            let price = data.product.buybox_winner.price.raw;
            let value = data.product.buybox_winner.price.value.toString();
    
            console.log('name: ', name);
            console.log('link: ', link);
            console.log('price: ', price);
            console.log('value: ', value);
            const uniqueID = uuidv4();

            //addGiftToPerson
            const url = `http://localhost:9090/api/personGift/${friendID}`;
            console.log(url);
            const bodyData = JSON.stringify({"gift": {"giftName":name, "price":value, "link":link, "id":uniqueID }});
            console.log(bodyData);
            fetch(url, {
                method: "POST",
                headers:  { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: bodyData
            }).then((response) => {
                console.log('just res', response);
                response.json().then((data) => {
                    console.log('data', data);
                })
            });
            document.getElementById('prompt').innerHTML = 'Added ' + name + ' for ' + friend + '!';
        });
        chrome.tabs.executeScript(tabs[0].id, {file: "content_script.js"});
    });
}

document.getElementById('addgift-btn').addEventListener('click', addGift);