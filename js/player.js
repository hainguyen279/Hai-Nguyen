
  const video = document.getElementById('bgVideo');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const seek = document.getElementById('seek');
  const curTime = document.getElementById('curTime');
  const durTime = document.getElementById('durTime');
  const volume = document.getElementById('volume');
  const muteBtn = document.getElementById('muteBtn');
  const volIcon = document.getElementById('volIcon');
  const likeBtn = document.getElementById('likeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const artGlow = document.getElementById('artGlow');
  const eq = document.getElementById('eq');
  const gate = document.getElementById('gate');
  const gateBtn = document.getElementById('gateBtn');

  const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
  const ICON_PAUSE = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';

  function fmt(t){
    if(!isFinite(t)) return '00:00';
    const m = Math.floor(t/60).toString().padStart(2,'0');
    const s = Math.floor(t%60).toString().padStart(2,'0');
    return m+':'+s;
  }

  function setPlayingUI(isPlaying){
    playIcon.outerHTML = '<svg id="playIcon" viewBox="0 0 24 24" fill="currentColor">'+(isPlaying?ICON_PAUSE:ICON_PLAY)+'</svg>';
    statusDot.classList.toggle('paused', !isPlaying);
    statusText.textContent = isPlaying ? 'Đang phát' : 'Đang tạm dừng';
    artGlow.classList.toggle('paused', !isPlaying);
    eq.classList.toggle('paused', !isPlaying);
  }

  document.getElementById('downloadBtn').href = video.src;

  function startPlayback(){
    video.muted = false;
    video.play().catch(()=>{});
  }

  gateBtn.addEventListener('click', ()=>{
    startPlayback();
    gate.classList.add('hidden');
  });

  playBtn.addEventListener('click', ()=>{
    if(video.paused){
      startPlayback();
      gate.classList.add('hidden');
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', ()=> setPlayingUI(true));
  video.addEventListener('pause', ()=> setPlayingUI(false));

  video.addEventListener('loadedmetadata', ()=>{
    durTime.textContent = fmt(video.duration);
  });

  video.addEventListener('timeupdate', ()=>{
    if(!seek.matches(':active')){
      const pct = (video.currentTime / (video.duration||1)) * 100;
      seek.value = pct;
      seek.style.setProperty('--pct', pct+'%');
    }
    curTime.textContent = fmt(video.currentTime);
  });

  seek.addEventListener('input', ()=>{
    const pct = seek.value;
    seek.style.setProperty('--pct', pct+'%');
    if(video.duration){
      video.currentTime = (pct/100) * video.duration;
    }
  });

  volume.addEventListener('input', ()=>{
    video.volume = volume.value;
    video.muted = false;
    volume.style.setProperty('--vpct', (volume.value*100)+'%');
    volIcon.innerHTML = volume.value == 0
      ? '<path d="M16.5 12A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4Z"/><path d="M3 9v6h4l5 5V4L7 9H3z"/>'
      : '<path d="M4 9v6h4l5 5V4L8 9H4z"/>';
  });
  video.volume = volume.value;

  let muted = false;
  muteBtn.addEventListener('click', ()=>{
    muted = !muted;
    video.muted = muted;
    volIcon.innerHTML = muted
      ? '<path d="M16.5 12 19 9.5m0 5L16.5 12M4 9v6h4l5 5V4L8 9H4z"/>'
      : '<path d="M4 9v6h4l5 5V4L8 9H4z"/>';
  });

  let liked = false;
  likeBtn.addEventListener('click', ()=>{
    liked = !liked;
    likeBtn.classList.toggle('liked', liked);
  });

  prevBtn.addEventListener('click', ()=>{
    video.currentTime = Math.max(0, video.currentTime - 10);
  });
  nextBtn.addEventListener('click', ()=>{
    if(video.duration) video.currentTime = Math.min(video.duration, video.currentTime + 10);
  });
