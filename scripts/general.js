const shortlyForm = document.getElementById('shorten-form-id');
const copyLinkBtn = document.getElementById('copy-link-btn');
const errorMessages = document.getElementsByClassName('form-error-message');
const menuButton = document.getElementById('menu-button');
const closeMenuButton = document.querySelector('#menu-options-container button.close-menu-btn');

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
    copyButton.addEventListener('click', e => {
        e.preventDefault();
        copyLinkAction(shortenedLink, copyButton);
    });

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

const copyLinkAction = async (link, element) => {   
    try {
        await navigator.clipboard.writeText(link);
        element.classList.add('copied-btn');
        element.textContent = 'Copied!';
    }catch (err) {
        console.error('Failed to copy: ', err);
    }
}

menuButton.onclick = (event) => {
    event.preventDefault();
    const linksContainer = document.getElementById('menu-options-container');
    linksContainer.classList.toggle('show-menu');
}

closeMenuButton.onclick = (event) => {
    event.preventDefault();
    const linksContainer = document.getElementById('menu-options-container');
    
    linksContainer.classList.toggle('show-menu');
}


const fetchHTTP = (URL, method, body) => fetch(URL, {
    method: method || 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})
.then(response => response.text())