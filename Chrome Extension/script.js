const LOCATION = undefined;

const alertMessage = document.getElementById('alert');
const progressBar = document.getElementById('progressBar');
const ResumeButton = document.getElementById('btn-refresh');


const audioContext = new AudioContext();

ResumeButton.addEventListener('click', () => {
    audioContext.resume();
});


var audioSource = undefined;

function __main__() {
    chrome.tabs.executeScript({
        code: 'document.URL'
    }, (url) => {
        const videoId = getVideoId(url);

        const sourceUrl = LOCATION + videoId;
        
        getArrayBuffer(sourceUrl)
            .then(createAudioBuffer)
            .then(() => {
                audioContext.play();
            });
    });
}

function getVideoId(url) {

    if (!url) return '';

    url = url.toString('utf-8');
    url = url.replace(/.*v=/, '');
    url = url.replace(/&.*/g, '');

    return url;
}

function getArrayBuffer(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.responseType = 'arraybuffer';
        
        xhr.open('GET', url, true);
        xhr.onload = () => {
            alertMessage.innerHTML = '2';

            resolve(xhr.response);
        };
        
        xhr.send();

        alertMessage.innerHTML = '1';
    });
}

function createAudioBuffer(arrayBuffer) {
    var source = audioContext.createBufferSource();

    audioContext.decodeAudioData(arrayBuffer, (audioData) => {
        source.buffer = audioData;

        audioSource = source;

        source.connect(audioContext.destination);
        source.start();
    });
}
__main__();