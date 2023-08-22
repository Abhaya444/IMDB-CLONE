// this is the api , base url and image url
const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
const BASEURL = 'https://api.themoviedb.org/3';
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

// getting the fav movies stored in the local storage 
var storageData = localStorage.getItem('MovieArray');
var favMovieArray = JSON.parse(storageData);

// looping over the fav movie array 
favMovieArray.forEach(async id =>{
    let link = `/movie/${id}?language=en-US&`;
    let url = BASEURL+link+APIKEY;
    await apiCall(url, id);
});

// calling function to request api 
function apiCall(url, id){
    const x = new XMLHttpRequest();
    x.open('get',url);
    x.send();
    x.onload = function(){
        var resp = x.response;
        var jsonRes = JSON.parse(resp);
        favMovieData(jsonRes, id);
    }
}

// displaying the fav movies here 
function favMovieData(jsonResp, id){
    var eachListItem = document.createElement('div');
    eachListItem.classList.add('list-item');
    eachListItem.innerHTML = `
    
        <div class="movie-details">

            <div class="thumbnail">
                <a href="moviePage.html?id=${id}">
                    <img id="movieimg" src=${IMAGEURL+jsonResp.poster_path} alt="Thumbnail">
                <a/>
            </div>
            <div id="details">
                <div class="title">
                <a href="moviePage.html?id=${id}"> ${jsonResp.title} </a> 
                </div>
            
                <div class="remove-movie" id='${id}' onclick="deleteMovie(${id})">
                <i id="removeicon" class="far fa-trash-alt"></i>
                </div>
            </div>
        </div>
    
    `; 
    document.getElementById('list-container').appendChild(eachListItem);
}

// removing all the movies from the fav list 
// clearing the local storage.
document.getElementById('clear-whole-list').addEventListener('click', function(){
    if(window.confirm("clear fav list")){
        localStorage.clear();
        window.location.reload();
    }
});

// deleting single movie from fav array 
async function deleteMovie(id){
    if(window.confirm('Delete this movie from fav list?')){
        var temp = await JSON.parse(localStorage.getItem('MovieArray'));
        var i = await temp.indexOf(id.toString());
        await temp.splice(i, 1);
        await localStorage.setItem('MovieArray', JSON.stringify(temp));
        await window.location.reload();
    }
}
