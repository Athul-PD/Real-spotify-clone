const playButton = document.querySelector('.playBtn');
const pauseButton = document.querySelector('.pauseBtn');
const currentSongUI = document.querySelectorAll('.currentSong');
const currentSongArtistsUI = document.querySelectorAll('.currentSongArtists');
const currentSongComposerUI = document.querySelector('.currentSongComposer');
const currentSongImageUI = document.querySelectorAll('.currentSongImage');
const audioPlayer = document.getElementById('audio');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const queueImage = document.querySelector('.queueImage');
const queueSongArtists = document.querySelector('.queueSongArtists');
const queueSongName = document.querySelector('.queueSongName');
const songCurrentTime = document.querySelector('.songCurrentTime');
const songtotalDuration = document.querySelector('.songtotalDuration');
const song_progresss_bar = document.getElementById('song_progresss_bar');
const addToPlaylistButton = document.getElementById('addToPlaylistButton');
const search_bar = document.getElementById('search_bar');
const input_popup = document.querySelector('.input_popup');
// ..............................................

// helper function........
export function displayPlay(){
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
}
export function displayPause(){
    pauseButton.style.display = 'block';
    playButton.style.display = 'none';
}
function getSavedSongLocalStorage(key){
    const playlist = localStorage.getItem(key);
    return playlist ? JSON.parse(playlist) : [];
}
function setSavedSongLocalStorage(key,value){
    localStorage.setItem(key,JSON.stringify(value))
}
export function formatTime(time){
    const inMin = Math.floor(time / 60)
    const inSec = Math.floor(time % 60)

    return `${inMin}:${inSec.toString().padStart(2,'0')}`
}

let apiData = null;
let currentSong = 0;
let allSongs = null;

export async function getApiMusic(){
    try{
        if(!apiData){
            const res = await fetch(`./datas/folders.json`);
            apiData = await res.json();
        }

        return apiData;

    }catch(err){
        console.log('Error',err);
    }
}

export async function getAllMusic(){

    if(allSongs) return allSongs;

    try{
        const data = await getApiMusic();
        allSongs = data.flatMap(folder => folder.songs);
        return allSongs;
    }catch(err){
        console.error('Failed to get all songs, err')
        return [];
    }
}

async function nextSongQueue(){
    const songs = await getAllMusic();
    const song = (currentSong + 1) % songs.length;

    const { songName, songImg, artist } = songs[song];
    queueImage.src = songImg;
    queueImage.alt = songName;
    queueSongArtists.innerText = artist;
    queueSongName.innerText = songName;
}
export async function playMusic(currentSong){
    const songs = await getAllMusic();
    const song = songs[currentSong];

    const { songName, audio, songImg, artist, composer } = song;

    currentSongUI.forEach(name => {
        name.innerText = songName;
    })
    currentSongArtistsUI.forEach(artists => 
        artists.innerText = artist
    )
    currentSongComposerUI.innerText = composer;
    currentSongImageUI.forEach(image => {
        image.src = songImg
        image.alt = songName
    })

    audioPlayer.src = audio;
    nextSongQueue();
}
playMusic(currentSong);

playButton.addEventListener('click',()=>{
    displayPause();
    audioPlayer.pause();
})
pauseButton.addEventListener('click',()=>{
    audioPlayer.play();
    displayPlay();
})
nextButton.addEventListener('click',async () => {
    const songs = await getAllMusic();
    currentSong++
    if(currentSong >= songs.length){
        currentSong = 0;
    }
    await playMusic(currentSong);
    audioPlayer.play()
    displayPlay();
    updateAddButtonState();
})
previousButton.addEventListener('click',async () => {
    const songs = await getAllMusic();
    currentSong--
    if(currentSong < 0){
        currentSong = songs.length - 1;
    }
    await playMusic(currentSong);
    audioPlayer.play()
    displayPlay();
    updateAddButtonState();
})

audioPlayer.addEventListener('loadedmetadata',() => {
    const totalduration = audioPlayer.duration;
    songtotalDuration.innerText = formatTime(totalduration);

    song_progresss_bar.value = 0;
})
audioPlayer.addEventListener('timeupdate',() => {
    const currentTime = audioPlayer.currentTime;
    songCurrentTime.innerText = formatTime(currentTime);

    const totalduration = audioPlayer.duration
    const currentValue = (currentTime / totalduration) * 100;

    song_progresss_bar.value = currentValue;

    song_progresss_bar.style.background = `linear-gradient(to right, white ${currentValue}%, gray ${currentValue}%)`
    
})
song_progresss_bar.addEventListener('input',() => {
    const totaltime = audioPlayer.duration;
    const newTime = (song_progresss_bar.value / 100) * totaltime;

    audioPlayer.currentTime = newTime;
})
audioPlayer.addEventListener('ended',async () => {
    const songs = await getAllMusic();
    currentSong++
    if(currentSong >= songs.length){
        currentSong = 0;
    }
    await playMusic(currentSong);
    audioPlayer.play()
    displayPlay();
    updateAddButtonState();
})

export let addToPlaylist = getSavedSongLocalStorage('playlist');

addToPlaylistButton.addEventListener('click',async() => {
    const songs = await getAllMusic();
    const savedSong = songs[currentSong];

    const isInplaylist = addToPlaylist.some(song => song.id === savedSong.id);

    if(!isInplaylist){
        addToPlaylist.push(savedSong)
        setSavedSongLocalStorage('playlist',addToPlaylist)

        addToPlaylistButton.classList.add('addToplaylistsaved')
    }else{
        addToPlaylist = addToPlaylist.filter(song => song.id !== savedSong.id);

        setSavedSongLocalStorage('playlist',addToPlaylist)

        addToPlaylistButton.classList.remove('addToplaylistsaved')
    }
})

async function updateAddButtonState(){
    const songs = await getAllMusic();
    const savedSong = songs[currentSong];

    const isInplaylist = addToPlaylist.some(song => song.id === savedSong.id);

    if(isInplaylist){
        addToPlaylistButton.classList.add('addToplaylistsaved')
    }else{
        addToPlaylistButton.classList.remove('addToplaylistsaved')
    }
}
search_bar.addEventListener('click',() => {
    input_popup.style.display = 'block'
})
window.addEventListener('click',(e) =>{
    if(!e.target.classList.contains('input_popup') && !e.target.classList.contains('search-bar')){
        input_popup.style.display = 'none'
    }
})
function filterSongs() {
    search_bar.addEventListener('input', async () => {
        const allSongs = await getAllMusic();
        const searchInput = search_bar.value.trim().toLowerCase();
        const searchResults = document.querySelector('.input_popup');

        searchResults.innerHTML = '';

        if (!searchInput) return;

        // Filter songs.........
        const filtered = allSongs.filter(song =>
            song.songName.toLowerCase().includes(searchInput)
        );

        // Display results........
        if (filtered.length > 0) {
            filtered.forEach(song => {
                const songDiv = document.createElement('div');
                songDiv.className = "search_lists"
                songDiv.innerHTML = `
                    <img src="${song.songImg}" alt="${song.songName}">
                    <div class="songs_details">
                        <p>${song.songName}</p>
                        <span>${song.artist}</span>
                    </div>
                `
                // click to play......
                songDiv.addEventListener('click', async () => {
                    const index = allSongs.findIndex(s => s.id === song.id);
                    currentSong = index;
                    await playMusic(currentSong);
                    audioPlayer.play();
                    displayPlay();
                });
                searchResults.appendChild(songDiv);
            });
        } else {
            searchResults.innerHTML = `<p class="df">No songs found</p>`
        }
    });
}
filterSongs();

// RightSide Section follow and unfollow functioanlity...
const followBtn = document.querySelectorAll('.followBtn')

followBtn.forEach(button => {
    button.addEventListener('click',() => {
        if(button.innerText === 'Unfollow'){
            button.innerText = 'Follow';
            button.setAttribute('aria-pressed','false');
        }else if(button.innerText === 'Follow'){
            button.innerText = 'Unfollow';
            button.setAttribute('aria-pressed','true');
        }
    })
})

