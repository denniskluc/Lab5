// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');

const newImg = document.querySelector('#image-input');

const form = document.querySelector('#generate-meme');

const clearBtn = document.getElementById('button-group').querySelectorAll('button')[0];
const readBtn = document.getElementById('button-group').querySelectorAll('button')[1];
const genBtn = form.querySelectorAll('button')[0];

const voiceSelection = document.getElementById('voice-selection');
let voices = [];
const volumeGroup = document.getElementById('volume-group');
const voiceSelection = document.getElementById('voice-selection');
const volumeSlider = volumeGroup.querySelectorAll('input')[0];


const top = document.getElementById('text-top').value;
const bottom = document.getElementById('text-bottom').value;

newImg.addEventListener('change', changeImg);
function changeImg() {
  let imgFile = newImg.files[0];
  img.src = URL.createObjectURL(imgFile);
  img.alt = imgFile.name;
};

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);


  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

form.addEventListener('submit', generateText);
function generateText() {

  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '50px Impact';

  ctx.fillText(top.value, canvas.width / 2, canvas.height / 8);
  ctx.fillText(bottom.value, canvas.width / 2, canvas.height * 0.95);

  genBtn.disabled = true;
  clearBtn.disabled = false;
  readBtn.disabled = false;

  voiceSelection.disabled = false;
  top.disabled = true;
  bottom.disabled = true;

  populateVoiceList();
  e.preventDefault();
}

function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

readBtn.addEventListener('click', () =>  {
  let topAudio = new SpeechSynthesisUtterance(top.value);
  let bottomAudio = new SpeechSynthesisUtterance(bottom.value);
  let selection = voiceSelect.selectedOptions[0].getAttribute('data-name');

  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selection) {
      topAudio.voice = voices[i];
      bottomAudio.voice = voices[i];
    }
  }

  topAudio.volume = volumeSlider.value / 100;
  bottomAudio.volume = volumeSlider.value / 100;
  synth.speak(topAudio);
  synth.speak(bottomAudio);
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  form.reset();

  clearBtn.disabled = true;
  readBtn.disabled = true;
  genBtn.disabled = false;

  top.disabled = false;
  bottom.disabled = false;
  voiceSelection.disabled = false;
});

volumeSlider.addEventListener('input', () => {
  // change the volume icons depending on the following volume ranges: (note: you can find these icons in the icons directory)
  if (volumeSlider.value == 0) {
    volumeIcon.src = 'icons/volume-level-0.svg';
    volumeIcon.alt = 'Volume Level 0';
  }
  else if (volumeSlider.value <= 33) {
    volumeIcon.src = 'icons/volume-level-1.svg';
    volumeIcon.alt = 'Volume Level 1';
  }
  else if (volumeSlider.value <= 66) {
    volumeIcon.src = 'icons/volume-level-2.svg';
    volumeIcon.alt = 'Volume Level 2';
  }
  else {
    volumeIcon.src = 'icons/volume-level-3.svg';
    volumeIcon.alt = 'Volume Level 3';
  }
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
