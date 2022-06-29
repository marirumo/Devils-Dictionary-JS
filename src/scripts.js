//Llamamos al JSON y almacenamos en localStorage
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

//fetch a JSON
function fetchData() {
    fetch('.data/dictionary.json')
        .then((response) => response.json())
        .then((json) => localStorage.setItem('myResponse', JSON.stringify(json)))
        .catch(() => alert('intente de nuevo'))
}


//Bienvenida al usuario
const welcome = document.getElementById('welcome')
const inputName = document.getElementById('username')
const firstbtn = document.getElementById('saveBtn')
const usernameDiv = document.getElementById('usernameOut')
const userOut = document.getElementById('user')
const searchSection = document.getElementById('searchsection')
const p = document.createElement('p')

function welcomeS() {
    welcome.remove();
    usernameDiv.innerHTML = inputName.value;
    usernameDiv.appendChild(p)
    p.innerHTML = `<p class='text-base'>Escribe alguna letra para buscar una palabra</p>`;
    searchSection.classList.remove('hidden');
}

firstbtn.addEventListener('click', welcomeS);


//Creamos datalist
let datalist = document.createElement('datalist');
datalist.id = 'datalist';
document.body.appendChild(datalist);

//Iteramos en localstorage de JSON para sumar a datalist 
let dataJson = JSON.parse(localStorage.getItem('myResponse'));
let listofWords = dataJson.map(({ word }) => word)
listofWords.forEach(function (dataJson) {
    let option = document.createElement('option')
    option.value = dataJson
    datalist.appendChild(option)
});

const inputValue = document.querySelector('#inputSearch').setAttribute('list', 'datalist');


//input donde el usuario ingresa la busqueda
const inputSearch = document.getElementById('inputSearch')


//Fetch API de gifs
const url = 'https://api.giphy.com/v1/gifs/search'
const key = '&api_key=yUpN1R1UWMOJBqUKZfsL90UH5kmb2vHa'
let usergif = '?q='
const limit = '&limit=1'

let q = '';
let urlComplete = '';

function giphyRequested() {
    q = inputSearch.value;
    urlComplete = url + usergif + q + key + limit;
    getGif();
}

//De la información de la API creamos componente img
const getGif = async () => {
    await fetch(urlComplete)
        .then((res) => res.json())
        .then((giphy) => {
            for (let i = 0; i < giphy.data.length; i++) {
                const gif = document.createElement('img');
                gif.src = giphy.data[i].images['original'].url;
                document.getElementById('gif').appendChild(gif)
                gif.classList.add('w-80', 'h-80', 'object-cover')
            }
        })
}


//Obtener la busqueda del usuario en datalist
function wordRequested() {

    if (inputSearch.value === '') {
        alert('Tu búsqueda era tan magistral que no estamos preparados para ella');
    }
    else {
        let words = dataJson.find(obj => obj.word === inputSearch.value)
        let definitions = document.createElement('h6');
        definitions.textContent = words.description
        document.getElementById('card').appendChild(definitions)
    }
}


//Crear card con respuestas
const card = document.querySelector('#card')

function createCard() {
    card.classList.add('card', 'bg-white', 'shadow-xl', 'p-6', 'items-center')
    let titleWord = document.createElement('h4');
    titleWord.classList.add('card-title')
    titleWord.textContent = inputSearch.value;
    card.appendChild(titleWord)
    giphyRequested()
    wordRequested()

}

//Evento para traer la información en los dos fetch de acuerdo a la busqueda del usuario
const searchBtn = document.getElementById('searchBtn')
searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    createCard();
    saveWords();
    inputSearch.value = '';
})

//crear listado de busquedas anteriores
let searches = [];
const listW = document.getElementById('listW');

//store palabra
const saveWords = (wordSear) => {
    let wordSearched = inputSearch.value
    if (searches.includes(wordSearched)) {
        return
    }
    else {
        if (searches.length > 3) {
            searches.splice(0, 1);
            searches.push(wordSearched);
        }
        else {
            searches.push(wordSearched);
        }
    }
    localStorage.setItem('history', JSON.stringify(searches)) || [];
    itemsList(searches);
}

let itemsList = (arr) => {
    listW.textContent = '';
    for (let i = 0; i < arr.length; i++) {
        let itemWord = document.createElement('button');
        itemWord.className = 'btn-ghost'
        itemWord.setAttribute('value', arr[i]);
        itemWord.setAttribute('id', 'wordBtn')
        itemWord.textContent = arr[i];
        listW.appendChild(itemWord);
    }
};

let loadHistory = () => {
    searchArr = JSON.parse(localStorage.getItem('history'));
    if (!searchArr) {
        searchArr = [];
    }
    else {
        itemsList(searchArr);
    }
}

//Limpiar pantalla
function clearHTML() {
    if (document.querySelector('h6')) {
        document.querySelector('h6').remove();
    }
    if (document.querySelector('h4')) {
        document.querySelector('h4').remove();
    }
    if (document.querySelector('img')) {
        document.querySelector('img').remove();
    }
    if (document.querySelector('#card')) {
        document.querySelector('#card').classList.remove('card', 'bg-white', 'shadow-xl', 'p-6', 'w-60', 'items-center')
    }
    loadHistory();
}

//Prevenir una segunda busqueda sin limpiar pantalla 
inputSearch.addEventListener('change', (e) => {
    clearHTML();
})