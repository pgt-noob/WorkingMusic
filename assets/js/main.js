const playBtn = document.querySelectorAll('.play-btn');
const pauseBtn = document.querySelectorAll('.pause-btn');
const play = document.querySelectorAll('.play');
let mainSong = document.querySelector('#main-song');
const listOpen = document.querySelector('.audio-list-opener');
const modal = document.querySelector('.audio-list-wrapper')
const listItem = document.querySelector('.list-item')
const endpoint = 'https://minimusic.herokuapp.com/songs'
const closeBtn = document.querySelector('.close-btn')
const wallpaper = document.querySelector('.wallpaper')
const wrapper = document.querySelector('.wrapper');

;[...play].forEach(item => {
    item.addEventListener('click', function (e) {
        if (mainSong.paused) {
            mainSong.play();
            [...play].forEach(item => {
                item.classList.add('playing');
                item.classList.remove('paused')
            })
        } else {
            mainSong.pause();
            [...play].forEach(item => {
                item.classList.remove('playing');
                item.classList.add('paused')
            })
        }
    })
})

listOpen.addEventListener('click', async function (e) {
    modal.classList.add('is-shown');
    if (!document.querySelector('.row').firstElementChild) {
        const arr = await fetch(endpoint).then(data => data.json().then(data => data));
        arr.forEach(item => {
        const {title,srcImg,id} = item;
        renderItem(srcImg,title,id)
    })
    }
})

closeBtn.addEventListener('click', function (e) {
    closeModal()
})

modal.addEventListener('click', function (e) {
    e.stopPropagation();
    console.log(e.target)
    if (e.target.matches('.list-item')) {
        const index = (e.target.dataset.id) -1;
        changeSong (index)
    }
    closeModal()
})
function renderItem (src,title,id) {
    const template = `<div class="col-3 list-item" data-id="${id}">
    <div class="item-image">
        <img src="${src}" alt="">
    </div>
    <span class="item-title">
        ${title}
    </span>
</div>`;
    document.querySelector('.row').insertAdjacentHTML("beforeend",template)
}

async function changeSong (index,dir = 0) {
    const arr = await fetch(endpoint).then(data => data.json().then(data => data));
    const target = arr[index];
    mainSong.parentElement.removeChild(mainSong)
    const template = `<audio id="main-song">
    <source src="./assets/audio/${target.title}.mp3" type="audio/mp3">
</audio>`;
    wrapper.insertAdjacentHTML('beforeend',template)
    wallpaper.setAttribute('src',`${target.srcImg}`);
    document.querySelector('.song-name').textContent = target.title;
    [...play].forEach(item => {
        item.classList.remove('playing');
        item.classList.add('paused')
    });
    mainSong = document.querySelector('#main-song');
}
function closeModal (e) {
    modal.classList.remove('is-shown')
}

console.log(mainSong.firstElementChild)