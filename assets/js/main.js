window.addEventListener('load', async function (e) {
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
const arr = await fetch(endpoint).then(data => data.json().then(data => data));

wallpaper.classList.add('on');
wallpaper.addEventListener('click', pressStart)
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
        changeSong (index,null)
    }
    closeModal()
})

document.querySelector('.audio-navigation').addEventListener('click', function (e) {
    if (e.target.matches('.prev-btn')) {
        changeSong(null,-1)
    } else if (e.target.matches('.next-btn')) {
        changeSong(null,1)
    }
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
    const switchEffect = [
        './assets/images/Switch Channel/giphy.gif',
        './assets/images/Switch Channel/giphy (1).gif',
        './assets/images/Switch Channel/giphy (2).gif'
    ];
    let target;
    const id = wallpaper.dataset.id -1;
    const random = Math.floor(Math.random()*2.9)
    
    if (dir && dir > 0 && id < arr.length-1) {
        target = arr[id + 1]
    } else if (dir && dir < 0 && id > 0) {
        target = arr[id -1]
    } else if (index) {
        target = arr[index];
    } else if (id <= arr.length-1 || id >= 0) {
        return
    }

    mainSong.parentElement.removeChild(mainSong)
    const template = `<audio id="main-song">
    <source src="./assets/audio/${target.title}.mp3" type="audio/mp3">
    </audio>`;

    wrapper.insertAdjacentHTML('beforeend',`<audio id="main-song">
    <source src="./assets/audio/switch channel/Channel switch effect.mp3" type="audio/mp3">
    </audio>`);

    mainSong = document.querySelector('#main-song');
    mainSong.play()
    wallpaper.setAttribute('src',switchEffect[random])
    setTimeout(() => {
        mainSong.parentElement.removeChild(mainSong)
        wrapper.insertAdjacentHTML('beforeend',template)
        wallpaper.setAttribute('src',`${target.srcImg}`);
        wallpaper.setAttribute('data-id',`${target.id}`);
        document.querySelector('.song-name').textContent = target.title;
        [...play].forEach(item => {
            item.classList.add('playing');
            item.classList.remove('paused')
        });
        mainSong = document.querySelector('#main-song');
        mainSong.play();
    },500)
    
    
}
function closeModal (e) {
    modal.classList.remove('is-shown')
}

function pressStart (e) {
    wallpaper.classList.remove('pointer');
    [...document.querySelectorAll('.off')].forEach(item => {
        item.classList.remove('off');
        mainSong.play();
        [...play].forEach(item => {
            item.classList.add('playing');
            item.classList.remove('paused')
        })
    })
    document.querySelector('.press-wrapper').classList.add('off');
}

async function getAPI () {
    const response = await fetch(endpoint).then(data => data.json()).then(data => data);
}
})