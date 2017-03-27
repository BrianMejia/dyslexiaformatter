var colorsTable = {
  'black' : '#000000',
  'white' : '#ffffff',
  'cream' : '#fffdd0',
  'rose'  : '#ffe4e1', 
};

var fontsTable = {
  'helvetica' : 'Helvetica',
  'arial' : 'Arial',
  'comicsans' : 'Comic Sans MS',
  'opensans' : 'Open Sans',
  'notoserif' : 'Noto Serif',
  'opendyslexic' : 'Open Dyslexic'
}

var overlay_rgba = '';

$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });

   check_color();

    $('#overlay_enable').click(function() {
      $("#overlay_color").toggle(this.checked);
      check_color();
    });

    $('#tts_enable').click(function() {
      $('#tts_option').toggle(this.checked);
    });
});

// Saves options to chrome.storage.sync.
function save_options() {
  var color = document.getElementById('color').value;
  var background = document.getElementById('background').value;
  var font = document.getElementById('font').value;
  var paragraph_spacing = document.getElementById('paragraph_spacing').value;
  var letter_spacing = document.getElementById('letter_spacing').value;
  var tts_enable = document.getElementById('tts_enable').checked;
  var overlay_enable = document.getElementById('overlay_enable').checked;
  var overlay_color = overlay_rgba;
  var tts_voice_options = document.getElementById('tts_voices');
  var tts_voice_selection = tts_voice_options.options[tts_voice_options.selectedIndex].text;
  // issue here when saving, make voice bar collapse when tts not enabled
  var tts_voice_index = tts_voice_options.value;
  chrome.storage.sync.set({
    colorSetting : color,
    backgroundSetting : background,
    fontSetting : font,
    paragraphSetting: paragraph_spacing,
    letterSetting: letter_spacing,
    overlayEnableSetting : overlay_enable,
    overlayColorSetting : overlay_color,
    ttsEnableSetting : tts_enable,
    ttsVoiceIndexSetting : tts_voice_index,
    ttsVoiceSelectionSetting : tts_voice_selection
  }, function() {
    // Update status to let user know options were saved.
    console.log("Save: " + overlay_rgba);
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    if($("#tts_enable").is(':checked')) {
        var msg = new SpeechSynthesisUtterance('Bleep Blorp.');
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices.filter(function(voice) { return voice.name == tts_voice_selection; })[0];
        window.speechSynthesis.speak(msg);
        setTimeout(function() {
          status.textContent = '';
        }, 1500);
    }
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
        paragraphSetting: '1',
        letterSetting: '1',
        overlayEnableSetting : false,
        overlayColorSetting : 'rgba(0, 0, 0, 0.0)',
        ttsEnableSetting : false,
        ttsVoiceIndexSetting : 'en-US',
        ttsVoiceSelectionSetting : 'Google US English'
      }, function(items) {
        document.getElementById('color').value = items.colorSetting;
        document.getElementById('background').value = items.backgroundSetting;
        document.getElementById('font').value = items.fontSetting;
        document.getElementById('paragraph_spacing').value = items.paragraphSetting;
        document.getElementById('letter_spacing').value = items.letterSetting;
        document.getElementById('overlay_enable').checked = items.overlayEnableSetting;
        document.getElementById('tts_enable').checked = items.ttsEnableSetting;
        document.getElementById('tts_voices').value = items.ttsVoiceIndexSetting;
        console.log( items);

        if($("#overlay_enable").is(':checked')) {
          $("#overlay_color").show();
        }

        if($("#tts_enable").is(':checked')) {
          $("#tts_option").show();
        }

        overlay_rgba = items.overlayColorSetting;
        $('#preview').css({
          'font-family' : fontsTable[items.fontSetting],
          'color' : colorsTable[items.colorSetting],
          'background-color' : colorsTable[items.backgroundSetting],
          'font-size' : 20,
          'line-height' : items.paragraphSetting,
          'letter-spacing' : items.letterSetting
        });
      });
    }
  });
}

function change_preview() {
  var color = document.getElementById('color').value;
  var background = document.getElementById('background').value;
  var font = document.getElementById('font').value;
  var paragraph_spacing = document.getElementById('paragraph_spacing').value;
  var letter_spacing = document.getElementById('letter_spacing').value;
  console.log(fontsTable[font]);
  $('#preview').css({
    'font-family' : fontsTable[font],
    'color' : colorsTable[color],
    'background-color' : colorsTable[background],
    'font-size' : 20,
    'line-height': paragraph_spacing,
    'letter-spacing': letter_spacing
  });
}

function check_color() {
    chrome.storage.sync.get({
      overlayEnableSetting : false,
      overlayColorSetting : 'rgba(0, 0, 0, 0.0)'
    }, function(items) {
      $('.demo').minicolors({
         control: $(this).attr('data-control') || 'hue',
         inline: $(this).attr('data-inline') === 'true',
         defaultValue: items.overlayColorSetting,
         letterCase: 'lowercase',
         opacity: false,
         change: function(hex, opacity) {
           if(!hex) return;
           try {
             console.log(hex);
             overlay_rgba = $(this).minicolors('rgbaString');
           } catch(e) {}
           $(this).select();
         },
         theme: 'default'
       });
      $('.demo').minicolors('value', {color: items.overlayColorSetting, opacity: 0.3});
    });
}

function check_voice() {
  chrome.storage.sync.get({
    ttsEnableSetting : false,
    ttsVoiceIndexSetting : 'en-US',
    ttsVoiceSelectionSetting : 'Google US English'
  }, function(items) {
      console.log(items);
    if (items.ttsEnableSetting) {
      window.speechSynthesis.getVoices().forEach(function(voice) {
        $("#tts_voices").append($('<option>', {value:voice.lang, text:voice.name}));
      });
      document.getElementById('tts_enable').checked = items.ttsEnableSetting;
      document.getElementById('tts_voices').value = items.ttsVoiceIndexSetting;
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
var changing_elements = document.getElementsByClassName('prev_changer');
for (var i = 0; i < changing_elements.length; i++) {
    changing_elements[i].addEventListener('change', change_preview, false);
}
