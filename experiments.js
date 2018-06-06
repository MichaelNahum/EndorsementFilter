// parses through layers of html and returns the element preceding the supplied text
function findElementsDirectlyContainingText(ancestor, text) {
    let elements= [];
    walk(ancestor);
    return elements;

    function walk(element) {
        let n= element.childNodes.length;
        for (let i= 0; i<n; i++) {
            let child= element.childNodes[i];
            if (child.nodeType===3 && child.data.indexOf(text)!==-1) {
                elements.push(element);
                break;
            }
        }
        for (let i= 0; i<n; i++) {
            let child= element.childNodes[i];
            if (child.nodeType===1)
                walk(child);
        }
    }
}

// returns an array of html pages, each corresponding to an individual email
let parsedMessages = messages.map( message => {return Base64.decode(message.payload.parts[0].body.data)});

let titles = parsedMessages.forEach(function(message) {
  let dmcaps = $('.sept')[0].innerText
  return dmcaps
});

// Questions: 1. How can jquery and javascript be combined? The structure of this program ( API call (JS) => returns an object containing an html page that needs to be parsed with jquery => )

// returns dataminr caption
let caption = $('.sept')[0].innerText

// returns vernacular

parsedMessages.forEach( message => { //message is a STRING. My God.
  let translated     = message.findElementsDirectlyContainingText($('center > table')[0], 'TRANSLATED FROM');
  let translation_el = translated.parent().next().next();
  let original_text  = translation_el.textContent.trim();
  return original_text;
})

// returns Estimated Event Area
let eventArea = findElementsDirectlyContainingText($('center > table')[0], 'ESTIMATED EVENT AREA')[0];
let geoTag    = eventArea.children[2].textContent;

// returns type of sourcing ('Chatter', 'Reporter', etc.)
let source     = findElementsDirectlyContainingText($('center > table')[0], 'SOURCE VERIFICATION')[0];
let sourceType = source.children[1].children[0].firstElementChild.firstElementChild.innerText;

// returns source handle with link
let handle            = findElementsDirectlyContainingText($('center > table')[0], 'TRANSLATED FROM')[0];
let endorsementHandle = handle.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.children[3].textContent.trim();
                        //OR $('.auth')[0].innerText
let externalLink      = handle.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.children[3].firstElementChild.href
                        //OR $('a')[0].href
// returns urgent level
let urgentLevels = findElementsDirectlyContainingText($('center > table')[0], 'Lists');
let precedence   = urgentLevels[0].nextSibling.textContent.trim();

// returns tags
let tags = findElementsDirectlyContainingText($('center > table')[0], 'Topics')[0].nextSibling
