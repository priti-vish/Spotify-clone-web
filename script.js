console.log("Spotify Clone Script Loaded");

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
async function main(){

    let currentSong;
    //Get the list of all songs
let songs =await getSongs();

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
document.querySelector(".songlist").getElementsByTagName("li");

}
main();