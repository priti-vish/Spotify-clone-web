console.log("Spotify Clone Script Loaded");
let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinuteSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "0:00/0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`${folder}`) 
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {

            songs.push(element.href.split(`${folder}`)[1]); //songs.push(element.href.split("songs")[1]);
            
        }
    }

    //Show all the song in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="" height="20" width="20" style="margin-top: 9px;">
                            <div class="info">
                                <div>${decodeURIComponent(song)}</div>
                                <div>Taylor</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="playbutton.svg" alt="" class="invert" height="26" width="26">
                            </div></li>`;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerText);
        });
    })


}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+track)
    
    currentSong.src = `/${currFolder}` + track; //currentSong.src = `/songs/` + track;
    if (!pause) {

        currentSong.play();
        play.src = "pausebutton.svg";
    }
    document.querySelector(".songinfo").innerText = decodeURIComponent(track);
    document.querySelector(".songtime").innerText = `0:00/0:00`;

    
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer");
    let array = Array.from(anchors)
        for (let i = 0; i < array.length; i++) {
            const e = array[i];
        
        if(e.href.includes("%5Csongs")){
            let folder= e.href.split("%5C").slice(-1)[0].split("/").slice(0,-1).join("/");

            //Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            
            cardContainer.innerHTML= cardContainer.innerHTML +`<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
        }
    }
}

async function main() {


    //Get the list of all songs
    await getSongs("songs/annie");
    playMusic(songs[0], true);
   
    //Display all the albums of the page
    await displayAlbums();
    
    //Attach event listener to play next and previous buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pausebutton.svg";
        } else {
            currentSong.pause();
            play.src = "playbutton.svg";
        }
    });

    //Listen for timeupdate event on audio element
    currentSong.addEventListener("timeupdate", () => {
        
        document.querySelector(".songtime").innerText = `${secondsToMinuteSeconds(currentSong.currentTime)}/${secondsToMinuteSeconds(currentSong.duration)}`; //CWH : document.querySelector(".songtime").innerText=`${secondsToMinuteSeconds(currentSong.currentTime)}`;
        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;

    })

    //Add an event listener to the seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = e.offsetX / e.target.offsetWidth * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    });

    //Add an event listener to the hamburger
    document.querySelector(".hamburgercontainer").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";

    })

    //Add an event listener to the close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    //Add an event listener to previous & next buttons
    previous.addEventListener("click", () => {
        
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split(`/${currFolder}`)[1])); //let index = songs.indexOf(currentSong.src.split("/songs/").slice(-1)[0]);
        
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split(`/${currFolder}`)[1]));
        if ((index + 1) < (songs.length)) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event listener to volume slider
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {
        currentSong.volume=parseInt(e.target.value)/100;
        
    })

    //Load the library when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs("songs%5C" + item.currentTarget.dataset.folder + "%5C");
            
        })
    })

    //Add the event listener to the volume for mute
    document.querySelector(".volume>img").addEventListener("click", (e) => {

        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg");
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume=0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })
     

}
main();