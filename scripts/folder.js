import { getAllMusic, displayPlay, playMusic,  getApiMusic, addToPlaylist } from "../main.js";

const main_page_section_folders = document.querySelector('.main_page_section_folders');
const table_body = document.querySelector('.table_body');
const audioPlayer = document.getElementById('audio');
const main_folder_section = document.querySelector('.main_folder_section');
const main_center_section = document.querySelector('.main-center_section');
const header__go_back = document.querySelector('.header__go_back');
const go_back = document.querySelector('.go_back');
const gobackColor = document.querySelector('.gobackColor');
const folder_image = document.querySelector('.folder_image');
const folder_name = document.querySelector('.folder_name');
const folder_song_length = document.querySelector('.folder_song_length');

function currentDate(){
    const date = new Date();

    const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
    }).format(date);

    return formattedDate;
}
header__go_back.addEventListener('click',() => {
    showMainPage();
    gobackColor.style.color = '#1F1F1F'
})
go_back.addEventListener('click',() => {
    showMainPage();
})
function showfoldersContent(){
    main_center_section.style.display = 'none';
    main_folder_section.style.display = 'block';
}
function showMainPage(){
    main_center_section.style.display = 'block';
    main_folder_section.style.display = 'none';
}

function displayFolders(data){

    data.forEach((folder,index) => {
        main_page_section_folders.innerHTML += `
            <div role="folder" class="folders" data-folder-index="${index}">
                <div aria-label="Folder image" class="folder_img">
                    <img src="${folder.image}" alt="${folder.foldername}">
                </div>
                <div aria-label="Folder name" class="folder_name">
                    <p>${folder.foldername}</p>
                </div>
            </div>
        `
    })
        main_page_section_folders.addEventListener('click',async (e) => {
            const folderDiv = e.target.closest('.folders');
            if(!folderDiv) return;

            showfoldersContent()
            gobackColor.style.color = 'white'

            const folderIndex = Number(folderDiv.dataset.folderIndex);
            const data = await getApiMusic()

            if(folderIndex === 0){
                if(!addToPlaylist || addToPlaylist.length === 0){
                    console.log('no songs');
                }else{
                    innerContentHTMLofFolders(addToPlaylist);
                    const folder = data[0]
                    folder_image.src = folder.image;
                    folder_name.innerText = folder.foldername;
                    folder_song_length.innerHTML = `<span class="folder_composer">playlist spotify;</span>${addToPlaylist.length} songs`
                }
            }else{
                let folder = data[folderIndex];
                if(folder && folder.songs){
                    innerContentHTMLofFolders(folder.songs);

                    folder_image.src = folder.image;
                    folder_name.innerText = folder.foldername;
                    folder_song_length.innerHTML = `<span class="folder_composer">${folder.songs[0].composer} &bull;</span>${folder.songs.length} songs`
                }
            }
    })
}
async function folderHTML(){
    const data = await getApiMusic()
    displayFolders(data);
}
folderHTML()

function innerContentHTMLofFolders(addToPlaylist){
    table_body.innerHTML = "";
    addToPlaylist.forEach((song,index) => {
        const { songName, songImg, artist, composer } = song;
        const table_row = document.createElement('li');
        table_row.className = 'table_row';
        table_row.innerHTML = `
            <div class="media_queries grid-1">${index + 1}</div>
            <div>
                <div class="title_section grid-2">
                    <img src="${songImg}" alt="${songName}">
                    <div class="tile_section_texts">
                        <p>${songName}</p>
                        <span>${artist}</span>
                    </div>
                </div>
            </div>
            <div class="album media_queries grid-3">${composer}</div>
            <div class="media_queries grid-4">${currentDate()}</div>
            
        `

        table_row.addEventListener('click',async() => {
            const allsongs = await getAllMusic();

            const index = allsongs.findIndex(s => s.id === song.id);

            await playMusic(index)
            displayPlay();
            audioPlayer.play();
        })

        table_body.appendChild(table_row);
    })
}