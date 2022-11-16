/*
let btn = document.querySelector(".record-btn");

btn.addEventListener("click", async function () {
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  }).then(async function (stream) {
    let recorder = RecordRTC(stream, {
      type: 'video'
    });
    recorder.mimeType = {
      audio: 'audio/wav',
      video: 'video/webm',
      gif:   'image/gif'
    };
    recorder.startRecording();
    recorder.stopRecording(function() {
        let blob = getSeekableBlob(recorder.getBlob());
        let url = URL.createObjectURL(blob);
        let video = document.querySelector("video");
        video.src = url;
        let a = document.createElement('a');
        a.href = url;
        a.download = 'video.webm';
        a.click();
    });
 
});
});
*/
window.location.href = "https://www.anistick.com/anirecorder";
window.href = "https://www.anistick.com/anirecorder";
