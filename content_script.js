/* function add(href) {
    console.log("HREF FROM ADD: ", href);
    alert('I CLICKED!'); 
} */

//flag == true, false;

// person id from user's info


function chooseResult() {
    console.log('inside click result');
    /* var results = document.getElementsByClassName("s-result-item s-asin"),
        randomIndex = Math.floor(Math.random() * results.length),
        clickResult = results[randomIndex];
    const productID = clickResult.dataset.asin;

    var links = Array.from(clickResult.getElementsByTagName("a"));
    
    let hrefLink; 
    let myLink;
    for (var i = 0; i < links.length; i++) {
        if (links[i].classList.contains("a-link-normal") && links[i].classList.contains("a-text-normal")) {
            myLink = links[i];
            hrefLink = links[i].href;
            break;
        }
    }

    console.log('my link: ', myLink);
    if (myLink !== null){
        myLink.onclick = add(myLink.href);
    }*/

    // var link = document.getElementsByClassName("a-link-normal a-text-normal");
    // console.log('results', results);
    // console.log('randomIndex', randomIndex);
    // console.log('click result', clickResult);
    // console.log('asin: ', productID)
    // console.log('links', links);
    // console.log("href: ", hrefLink);
}

chooseResult();
