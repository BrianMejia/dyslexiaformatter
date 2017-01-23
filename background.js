// thanks to https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
var speechUtteranceChunker = function (utt, settings, callback) {
    settings = settings || {};
    var newUtt;
    var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
    if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
        newUtt = utt;
        newUtt.text = txt;
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }
    else {
        var chunkLength = (settings && settings.chunkLength) || 160;
        var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        var chunkArr = txt.match(pattRegex);

        if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
            //call once all text has been spoken...
            if (callback !== undefined) {
                callback();
            }
            return;
        }
        var chunk = chunkArr[0];
        newUtt = new SpeechSynthesisUtterance(chunk);
        var x;
        for (x in utt) {
            if (utt.hasOwnProperty(x) && x !== 'text') {
                newUtt[x] = utt[x];
            }
        }
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
                return;
            }
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
            speechUtteranceChunker(utt, settings, callback);
        });
    }

    if (settings.modifier) {
        settings.modifier(newUtt);
    }

    var timer = setInterval(function () {
      if (window.speechSynthesis.getVoices().length > 0) {
        clearInterval(timer);
        chrome.storage.sync.get({
          ttsVoiceSelectionSetting : 'native'
        }, function(items) {
          var voices = window.speechSynthesis.getVoices();
          newUtt.voice = voices.filter(function(voice) { return voice.name == items.ttsVoiceSelectionSetting; })[0];

          //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
          //placing the speak invocation inside a callback fixes ordering and onend issues.
          console.log(newUtt);
          setTimeout(function () {
            window.speechSynthesis.speak(newUtt);
          }, 0);
        });
      }
    }, 0);
};


function ttsOnClick(info, tab) {
  /*speechSynthesis.getVoices().forEach(function(voice) {
    console.log(voice.name, voice.default ? '(default)' :'', voice.lang);
  });*/
  chrome.storage.sync.get({
    ttsEnableSetting : false,
    ttsVoiceSelectionSetting : 'native'
  }, function(items) {
    if (items.ttsEnableSetting) {
      var msg = new SpeechSynthesisUtterance(info.selectionText);
      speechUtteranceChunker(msg, {
          chunkLength: 120
      }, function () {
          //some code to execute when done
          console.log('done');
      });
    }
  });
}

var id = chrome.contextMenus.create({"title": "Speak Selected Text", "contexts":["selection"],
                                     "onclick": ttsOnClick});