const player = document.querySelector(".player"),
  musicImg = player.querySelector(".albumImg img"),
  musicTitle = player.querySelector(".song-details .title"),
  musicArtist = player.querySelector(".song-details .artist"),
  mainAudio = player.querySelector("#main-audio"),
  playPauseBtn = player.querySelector(".play-pause"),
  prevBtn = player.querySelector("#prev"),
  nextBtn = player.querySelector("#next"),
  progressBar = player.querySelector(".progress-bar"),
  progressArea = player.querySelector(".progress-area"),
  showMoreBtn = player.querySelector("#more-music"),
  hideMusicBtn = player.querySelector("#close"),
  musicList = player.querySelector(".music-list");

let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
});

function loadMusic(indexNum) {
  musicTitle.innerText = allMusic[indexNum - 1].title;
  musicArtist.innerText = allMusic[indexNum - 1].artist;
  musicImg.src = `img/${allMusic[indexNum - 1].img}.png`;
  mainAudio.src = `songs/${allMusic[indexNum - 1].src}.mp3`;
}
// next Music function
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
// next Music function
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}
// play Music
function playMusic() {
  player.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
  playingNow();
}
// pause Music
function pauseMusic() {
  player.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
  playingNow();
}

// play or pause music button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = player.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
  playingNow();
});
// next music btn event
nextBtn.addEventListener("click", () => {
  nextMusic();
});
// prev music btn event
prevBtn.addEventListener("click", () => {
  prevMusic();
});
// update the progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = player.querySelector(".current"),
    musicDuration = player.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    // update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  // update song total current
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});
// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth; //getting width progess bar
  let clickedOffSetX = e.offsetX; //getting offset value
  let songDuration = mainAudio.duration; //song duration

  mainAudio.currentTime = (clickedOffSetX / progressWidth) * songDuration;
  playMusic();
});
// repeat, shuffle song according to icon
const repeatBtn = player.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});
// after the song ended
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      // generate random index between the max range of array lengt
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); // this loop run until the next random number won't be the same of the current index
      musicIndex = randIndex; //passing hte randindex so the random song will play
      loadMusic(musicIndex);
      playMusic();
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = player.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
  <div class="row">
    <span>${allMusic[i].title}</span>
    <p>${allMusic[i].artist}</p>
  </div>
  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
  <span id="${allMusic[i].src}" class="audio-duration">3:38</span>
</li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);
  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    // add t duration attribute
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

// play particular song on clicked
const allLiTags = ulTag.querySelectorAll("li");
// console.log(allLiTags);
// if this music playin we put style

function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

// play song on li click
function clicked(element) {
  // get li index
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

///////////////////////////////////////////////////////////////////////////////////////
const global = {
  api: {
    apiKey: "693d0c8dcfmsheeda56caef363fbp1545a1jsn5417f7af0e09",
    spotifyHost: "spotify23.p.rapidapi.com",
    geniusHost: "genius-song-lyrics1.p.rapidapi.com",
  },
};
function initializeTabs() {
  const defaultTabIndex = 0;
  showTab(defaultTabIndex);
}
function showTab(tabIndex) {
  const tabPanels = document.querySelectorAll(".tab-panel");
  const tabs = document.querySelectorAll(".tab");

  // Check if the provided tabIndex is within the valid range
  if (tabIndex >= 0 && tabIndex < tabPanels.length) {
    // hide all tabs
    for (let i = 0; i < tabPanels.length; i++) {
      tabPanels[i].classList.remove("active");
      tabs[i].classList.remove("active");
    }

    // show the selected tab content
    tabPanels[tabIndex].classList.add("active");
    tabs[tabIndex].classList.add("active");
    // Call the specific functions for each tab index
    switch (tabIndex) {
      case 0:
        displayLyrics();
        break;
      case 1:
        displayAlbum();
        break;
      case 2:
        displayRelatedArtist();
        break;
      // Add more cases as needed for other tabs
      default:
        // Do nothing or handle any other cases if needed
        break;
    }
  }
}
// Call the function to set the initial active state on page load
initializeTabs();

// fetch api lyrics
async function fetchAPILyrics() {
  const url =
    "https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=7076626";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": global.api.apiKey,
      "X-RapidAPI-Host": global.api.geniusHost,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  // console.log(data);
  return data;
}
function removeUnderlinesAndLinks(html) {
  // Remove underlines from anchor tags
  html = html.replace(/<a[^>]*>/g, "<a>");

  // Remove the 'href' attribute from anchor tags
  html = html.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>/gi, "<a>");

  return html;
}

async function displayLyrics() {
  const data = await fetchAPILyrics();
  // console.log(data.lyrics.lyrics.body);
  const lyricsBody = data.lyrics.lyrics.body.html;
  // Remove <u> and <a> tags from the lyrics
  const cleanedLyrics = lyricsBody
    .replace(/<\/?u>/g, "")
    .replace(/<\/?a[^>]*>/g, "");
  // console.log(cleanedLyrics);
  // Display cleaned lyrics on the webpage
  document.querySelector("#tab1").innerHTML = cleanedLyrics;
}

// displayLyrics();

async function getAlbumsSpotify() {
  const url =
    "https://spotify23.p.rapidapi.com/artist_albums/?id=06HL4z0CvFAxyc27GXpf02&offset=0&limit=100";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": global.api.apiKey,
      "X-RapidAPI-Host": global.api.spotifyHost,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  // console.log(data);
  return data;
}
async function displayAlbum() {
  try {
    const { data } = await getAlbumsSpotify();
    const albums = data.artist.discography.albums.items;
    // console.log(albums);
    const swiperWrapper = document.querySelector("#tab2 .swiper-wrapper");
    swiperWrapper.innerHTML = "";
    albums.forEach((album) => {
      const albumName = album.releases.items[0].name;
      const albumLink = album.releases.items[0].sharingInfo.shareUrl;
      const albumYear = album.releases.items[0].date.year;
      const albumImg = album.releases.items[0].coverArt.sources[0].url;
      // console.log(albumName);
      // console.log(albumImg);

      const div = document.createElement("div");
      div.classList.add("swiper-slide");
      div.innerHTML = `
               <a href="${albumLink}" target="_blank">
                 <img src="${albumImg}" alt="${albumName}" />
               </a>
               <div class="album-name">
                  <h4>${albumName}</h4>
                  <p>${albumYear}</p>
               </div>
  `;
      swiperWrapper.appendChild(div);
    });
    const swiper = new Swiper(".swiper", {
      loopedSlides: 8,
      spaceBetween: 25,
      slidesPerView: "auto",
      freeMode: true,
      mousewheel: {
        releaseOnEdges: true,
      },
    });
  } catch (error) {
    console.error("Error fetching albums data:", error);
  }
}
// displayAlbum();
async function getRelatedArtist() {
  const url =
    "https://spotify23.p.rapidapi.com/artist_related/?id=2w9zwq3AktTeYYMuhMjju8";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": global.api.apiKey,
      "X-RapidAPI-Host": global.api.spotifyHost,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  // console.log(data.artists);
  return data;
}
// getRelatedArtist();
async function displayRelatedArtist() {
  const data = await getRelatedArtist();
  const artists = data.artists;
  // console.log(data.artists);
  const swiperWrapper = document.querySelector("#tab3 .swiper-wrapper");
  swiperWrapper.innerHTML = "";
  artists.forEach((artist) => {
    console.log(artist.name);
    const artistName = artist.name;
    const artistLink = artist.external_urls.spotify;
    const artistImg = artist.images[0].url;
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
    
    <a href="${artistLink}" target="_blank">
    <img src="${artistImg}" alt="${artistName}" />
    </a> 
                 <div class="album-name">
                    <h4>${artistName}</h4>

                 </div>
    `;
    swiperWrapper.appendChild(div);
  });
  const swiper = new Swiper(".swiper", {
    loopedSlides: 8,
    spaceBetween: 25,
    slidesPerView: "auto",
    freeMode: true,
    mousewheel: {
      releaseOnEdges: true,
    },
  });
}
//

/* <a href="${artistLink}" target="_blank">
<img src="${artistImg}" alt="${artistName}" />
</a> */
