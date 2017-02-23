var colorsTable = {
  'black' : '#000000',
  'white' : '#ffffff',
  'cream' : '#fffdd0',
};

var fontsTable = {
  'helvetica' : 'Helvetica',
  'arial' : 'Arial',
  'comicsans' : 'Comic Sans MS',
  'opendyslexic' : 'Open Dyslexic'
}

// Saves options to chrome.storage.sync.
function save_options() {
  var color = document.getElementById('color').value;
  var background = document.getElementById('background').value;
  var font = document.getElementById('font').value;
  var tts_enable = document.getElementById('tts_enable').checked;
  var tts_voice_options = document.getElementById('tts_voices');
  var tts_voice_selection = tts_voice_options.options[tts_voice_options.selectedIndex].text;
  var tts_voice_index = tts_voice_options.value;
  chrome.storage.sync.set({
    colorSetting : color,
    backgroundSetting : background,
    fontSetting : font,
    ttsEnableSetting : tts_enable,
    ttsVoiceIndexSetting : tts_voice_index,
    ttsVoiceSelectionSetting : tts_voice_selection
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    var msg = new SpeechSynthesisUtterance('Bleep Blorp.');
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices.filter(function(voice) { return voice.name == tts_voice_selection; })[0];
    window.speechSynthesis.speak(msg);
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  var timer = setInterval(function () {
    if (window.speechSynthesis.getVoices().length > 0) {
      clearInterval(timer);
      window.speechSynthesis.getVoices().forEach(function(voice) {
        $("#tts_voices").append($('<option>', {value:voice.lang, text:voice.name}));
      });
      chrome.storage.sync.get({
        colorSetting : 'default',
        backgroundSetting : 'default',
        fontSetting : 'arial',
        ttsEnableSetting : false,
        ttsVoiceIndexSetting : 'native',
        ttsVoiceSelectionSetting : 'native'
      }, function(items) {
        document.getElementById('color').value = items.colorSetting;
        document.getElementById('background').value = items.backgroundSetting;
        document.getElementById('font').value = items.fontSetting;
        document.getElementById('tts_enable').checked = items.ttsEnableSetting;
        document.getElementById('tts_voices').value = items.ttsVoiceIndexSetting;
        $('#preview').css({
          'font-family' : fontsTable[items.fontSetting],
          'color' : colorsTable[items.colorSetting],
          'background-color' : colorsTable[items.backgroundSetting],
          'font-size' : 20
        });
      });
    }
  }, 0);
}

function change_preview() {
  var color = document.getElementById('color').value;
  var background = document.getElementById('background').value;
  var font = document.getElementById('font').value;
  console.log(fontsTable[font]);
  $('#preview').css({
    'font-family' : fontsTable[font],
    'color' : colorsTable[color],
    'background-color' : colorsTable[background],
    'font-size' : 20
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
var changing_elements = document.getElementsByClassName('prev_changer');
for (var i = 0; i < changing_elements.length; i++) {
    changing_elements[i].addEventListener('change', change_preview, false);
}
