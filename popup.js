let people;
let mappedIds;

// on window load, send a message to the background script to load the signed-in user's information
window.onload = function() {
    chrome.runtime.sendMessage(
        {command: "getUserInfo"}
    );

    // after receiving user's list of people who they're buying gifts for, add people as options to the dropdown to select
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.command == "sendPeople") {
                people = request.people; // array of people's names
                mappedIds = request.mappedIds; // json object with peoples' names as keys and their IDs in the backend database as values
                // map all options to the dropdown selector component
                people.map((name) => {
                    var option = document.createElement("OPTION");
                    option.setAttribute("value", name);
                    var textNode = document.createTextNode(name);
                    option.appendChild(textNode);
                    document.getElementById("dropdown-add-gift").appendChild(option);
                })
                return true; // respond asynchronously
            }
        }
    )
}

// function to generate a random gift id 
function uuidv4() {  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {    
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);    
        return v.toString(16);  
    });
}

// function that is called when the user presses the add gift button after seeing a product they may want to gift to a friend
function addGift() {
    // get selected person's name and ID from the dropdown selector containing the list of people the user is buying gifts for
    var e = document.getElementById("dropdown-add-gift");
    var friend = e.value;
    var friendID = mappedIds[friend]

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        
        // if on an amazon product page, extract the ASIN (used to extract information about products on amazon.com)
        let asin;
        var regex = RegExp("https://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
        m = url.match(regex);
        if (m) { 
            asin = m[4];
        } 

        // make call to rainforest api using ASIN to get more information about the product
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
                        resolve(data);
                    });
                }).catch(error => {
                    console.log("Error fetching response: ", error);
                });
            })    
        }

        // get link to product page, the product's name and price, and generate a random gift ID
        getData().then(data => {
            let name = data.product.title;
            let link = data.product.link;
            let value = data.product.buybox_winner.price.value.toString();
            const uniqueID = uuidv4();

            // add gift as an option for this person
            const url = `http://localhost:9090/api/personGift/${friendID}`;
            const bodyData = JSON.stringify({"gift": {"giftName":name, "price":value, "link":link, "id":uniqueID }});
            fetch(url, {
                method: "POST",
                headers:  { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: bodyData
            }).then((response) => {
                response.json().then((data) => {
                    console.log('data', data);
                })
            }).catch(error => {
                console.log("Error fetching response: ", error);
            });

            // let user know their choice has been saved to the database by displaying a message on the popup
            document.getElementById('prompt').innerHTML = 'Added ' + name + ' for ' + friend + '!';
        });
    });
}

document.getElementById('addgift-btn').addEventListener('click', addGift);