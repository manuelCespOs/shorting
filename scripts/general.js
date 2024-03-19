const shortlyForm = document.getElementById('shorten-form-id');
const copyLinkBtn = document.getElementById('copy-link-btn');
const errorMessages = document.getElementsByClassName('form-error-message');


const valueIsEmpty = value => value.trim().length === 0;

const toggleInvalid = isNotValid => {
    if (!isNotValid) {
        shortlyForm.classList.remove('invalid');
    } else {
        shortlyForm.classList.add('invalid');
    }

    for (let element of errorMessages) {
        element.style.display = !isNotValid ? 'none' : 'block';
    }
}

const showShortenedLink = (mainLink, shortenedLink) => {
    const linksContainer = document.getElementById('links-container-id');
    const copyButton = document.createElement('button');
    const shortenedLinkTextElement = document.createElement('p');
    const shortenedLinkContainer = document.createElement('div');
    const mainLinkTextElement = document.createElement('p');
    const card = document.createElement('div');
    //Adding button style & Text
    copyButton.className = 'btn btn--primary';
    copyButton.textContent = 'Copy';

    //Adding shortened p style & Text
    shortenedLinkTextElement.className = 'shortened-link';
    shortenedLinkTextElement.textContent = shortenedLink;

    //Appending shortened link elements
    shortenedLinkContainer.className = 'shortened-link-container';
    shortenedLinkContainer.appendChild(shortenedLinkTextElement);
    shortenedLinkContainer.appendChild(copyButton);

    //Adding main link p style & text
    mainLinkTextElement.className = 'real-link';
    mainLinkTextElement.textContent = mainLink;

    //Adding main container style & adding elements
    card.className = 'shortened-link-card rounded-border';
    card.appendChild(mainLinkTextElement);
    card.appendChild(shortenedLinkContainer);

    linksContainer.append(card)
} 

shortlyForm.addEventListener('submit', (e) => {
    console.log('Submitting');
    e.preventDefault();
    
    const linkInput = document.getElementById('link-input');
    const linkValue = linkInput.value;

    toggleInvalid(valueIsEmpty(linkValue))
    
    if(valueIsEmpty(linkValue)) return;
    
    fetchHTTP(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(linkValue)}`, 'POST')
    .then(response => {
        if (response === 'Error') {
            toggleInvalid(true);
            return;
        }
        showShortenedLink(linkValue, response);
        linkInput.value = '';
    })
})

const fetchHTTP = (URL, method, body) => fetch(URL, {
    method: method || 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})
.then(response => response.text())