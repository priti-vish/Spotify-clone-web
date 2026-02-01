console.log("Spotify Clone Script Loaded");
let currentSong = new Audio();

function secondsToMinuteSeconds(seconds){
    if(isNaN(seconds) || seconds<0){
        return "";
    }
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response= await a.text();
    console.log(response);
    let div= document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    let songs=[];
    for(let i=0;i<as.length;i++){
        const element=as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("songs")[1]);
        }
    }
    return songs;

}

const playMusic = (track, pause=false) => {
    // let audio = new Audio("/songs/"+track)
    currentSong.src="/songs/"+track;
    if(!pause){
        
        currentSong.play();
        play.src="pausebutton.svg";
    }
    document.querySelector(".songinfo").innerText=track.replace("%5C"," ");
    document.querySelector(".songtime").innerText=`0:00/0:00`;
}

async function main(){

    
    //Get the list of all songs
let songs =await getSongs();
playMusic(songs[0], true);

//Show all the song in the playlist
let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0];
for (const song of songs) {
    songUL.innerHTML=songUL.innerHTML+`<li><img class="invert" src="music.svg" alt="" height="20" width="20" style="margin-top: 9px;">
                            <div class="info">
                                <div>${song.replace("%5C"," ")}</div>
                                <div>Taylor</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="playbutton.svg" alt="" class="invert" height="26" width="26">
                            </div></li>`;
}

//Attach an event listener to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click",element=>{
        
    console.log(e.querySelector(".info").firstElementChild.innerText);
    playMusic(e.querySelector(".info").firstElementChild.innerText);
    });
})

//Attach event listener to play next and previous buttons
play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play();
        play.src="pausebutton.svg";
    }else{
        currentSong.pause();
        play.src="playbutton.svg";
    }
});

//Listen for timeupdate event on audio element
currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerText=`${secondsToMinuteSeconds(currentSong.currentTime)}/${secondsToMinuteSeconds(currentSong.duration)}`; //CWH : document.querySelector(".songtime").innerText=`${secondsToMinuteSeconds(currentSong.currentTime)}`;
    document.querySelector(".circle").style.left=`${(currentSong.currentTime/currentSong.duration)*100}%`;
    
})

//Add an event listener to the seekbar

document.querySelector(".seekbar").addEventListener("click",(e)=>{
    console.log(e);

});

}
main();