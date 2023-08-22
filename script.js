// this is the api key
const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
// this is the home url 
const HOMEURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
// this is the image url 
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

// fetching elements from indexedDB.html 
var container = document.getElementById('movie-container');
var search = document.getElementById('searchMovie');
var wrapperDiv = document.querySelector('.search-conten');
var resultsDiv = document.querySelector('.results');


// this is the previous button
var pBtn = document.getElementById('prev-page');
// this is the next button
var nBtn = document.getElementById('next-page');
// count of pages 
let pageNumber = 1;

// calling function to request api 
apiCall(HOMEURL);
// this is the function to get api data 
function apiCall(url){
    const x = new XMLHttpRequest();
    x.open('get',url);
    x.send();
    x.onload = function(){
        container.innerHTML="";
        var res = x.response;
        // resp to JSON data 
        var conJson = JSON.parse(res);
        // array of movies 
        var moviesArray = conJson.results;
        // create the movie cards here 
        moviesArray.forEach(movie => moviesElement(movie));
        addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
    }
}
// create the home page elements 
function moviesElement(movie){
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <a href="moviePage.html?id=${movie.id}"><img src= ${IMAGEURL+movie.poster_path} alt="Movie Poster"></a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
            <i class="fas fa-star"></i> ${movie.vote_average} 
            </div>
            <div class="add-movie-to-list"  id="${movie.id}" onclick="addMovie(${movie.id})">
                <i class="fas fa-plus"></i>
            </div>
        </div>
    `;
    container.appendChild(movieElement);
}


// array to store fav movies 
var favMovies=[];
var oldMovies=[];

// function to add movie to fav list 
function addMovie(btnId){
    document.getElementById(btnId).innerHTML = '<i class="fas fa-check"></i>';
    // to avoid duplicate movies 
    if(!favMovies.includes(btnId.toString())){
        favMovies.push(btnId.toString());
    }

    // getting array from local storage  
    oldMovies = JSON.parse(localStorage.getItem('MovieArray'));
    if(oldMovies==null){
        // if empty 
        localStorage.setItem('MovieArray', JSON.stringify(favMovies));
    }else{
        // if not empty 
        favMovies.forEach(item=>{
            if(!oldMovies.includes(item)){
                oldMovies.push(item);
            }
        })
        // adding the movie in local storage 
        localStorage.setItem('MovieArray', JSON.stringify(oldMovies));
    }
}

// this is the search function 
search.addEventListener('keyup', function(){
    // input char in the search box
    var input = search.value;
    // getting all the movies related to the input in the search option 
    var inputUrl = `https://api.themoviedb.org/3/search/movie?query=${input}&${APIKEY}`;
    if(input.length !=0){
        apiCall(inputUrl);
    }else{
        window.location.reload();
    }
})

// disable the prev btn when the page is 1
pBtn.disabled = true;
function disablePBtn(){
    if(pageNumber ==1)pBtn.disabled=true;
    else pBtn.disabled=false;
}

// go to next page 
nBtn.addEventListener('click',()=>{
    pageNumber++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});

// go to prev page 
pBtn.addEventListener('click',()=>{
    if(pageNumber==1)return;

    pageNumber--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
})