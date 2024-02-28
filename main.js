const html = document.querySelector('html');
const banner = document.querySelector('.app__image');
const PausePlayIcon = document.querySelector('.app__card-primary-butto-icon')
const focusButton = document.querySelector('.app__card-button--foco');
const shortRestButton = document.querySelector('.app__card-button--curto');
const longRestButton = document.querySelector('.app__card-button--longo');
const title = document.querySelector('.app__title');
const buttons = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const startPauseMsg = document.querySelector('#start-pause span')
const timeOnScreen = document.querySelector('#timer')
const musicFocusInput = document.querySelector('#alternar-musica');
const musicFocus = new Audio('./sons/luna-rise-part-one.mp3');
const musicPlay = new Audio('./sons/play.wav');
const musicPause = new Audio('./sons/pause.mp3');
const musicAlert = new Audio('./sons/beep.mp3');


let timePassadoSegs = 25 * 60;
let intervaloId = null;

musicFocus.loop = true;

musicFocusInput.addEventListener('change', () => {
    if(musicFocus.paused) {
        musicFocus.play();
    } else {
        musicFocus.pause();
    }
})

focusButton.addEventListener('click', () => {
    timePassadoSegs = 25 * 60
    changeContext('foco');
    focusButton.classList.add('active');
})

shortRestButton.addEventListener('click', () => {
    timePassadoSegs = 5 * 60
    changeContext('descanso-curto');
    shortRestButton.classList.add('active');
})

longRestButton.addEventListener('click', () => {
    timePassadoSegs = 15 * 60
    changeContext('descanso-longo');
    longRestButton.classList.add('active');
})

function changeContext(contexto) {
    showTime();
    buttons.forEach(function (each) {
        each.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            pause();
            timePassadoSegs = 25 * 60
            title.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;
        case 'descanso-curto':
            pause();
            timePassadoSegs = 5 * 60
            title.innerHTML = `Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta.</strong>`
            break;
        case 'descanso-longo':
            pause();
            timePassadoSegs = 15 * 60
            title.innerHTML = `Hora de voltar à superfície. <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break;
    }
}

const contagemRegressiva = () => {
    if (timePassadoSegs <= 0) {
        musicAlert.loop = true; // Permitindo repetição contínua do áudio
        musicAlert.play();
        alert('time finalizado!');
        const onFocus = html.getAttribute('data-contexto') == 'foco';
        if (onFocus) {
            const event = new CustomEvent('focusEnd');
            document.dispatchEvent(event);
        }
        musicAlert.pause();
        PausePlayIcon.setAttribute('src', `./imagens/play_arrow.png`);
        reset();
        switch (html.getAttribute('data-contexto')) {
        case 'foco':
            timePassadoSegs = 25 * 60
            break;
        case 'descanso-curto':
            timePassadoSegs = 5 * 60
            break;
        case 'descanso-longo':
            timePassadoSegs = 15 * 60
            break;}
        return;
    }
    timePassadoSegs -= 1;
    showTime();}

startPauseBt.addEventListener('click', playPause);

function playPause() {
    if (intervaloId){
        reset();
        musicPause.play();
        PausePlayIcon.setAttribute('src', `./imagens/play_arrow.png`);
        return;
    }
    intervaloId = setInterval(contagemRegressiva, 1000*1);
    musicPlay.play();
    PausePlayIcon.setAttribute('src', `./imagens/pause.png`);
    startPauseMsg.textContent = "Pause"
}

function reset() {
    clearInterval(intervaloId);
    startPauseMsg.textContent = "Start";
    intervaloId = null;
}

function pause() {
if (intervaloId){
    reset();
    musicPause.play();
    PausePlayIcon.setAttribute('src', `./imagens/play_arrow.png`);}}

function showTime() {
    const time = new Date(timePassadoSegs * 1000);
    const timeFormat = time.toLocaleTimeString('pt-BR', {minute: '2-digit', second: '2-digit'})
    timeOnScreen.innerHTML = `${timeFormat}`;
}

showTime();
