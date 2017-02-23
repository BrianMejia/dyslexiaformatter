// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
var MOUSE_CLICKED_CLASSNAME = 'crx_mouse_clicked';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;
var srcElement = null;
var enabledHighlighting = false;
var curElement = null;

document.addEventListener("DOMContentLoaded", function (e) {

}, false);

document.addEventListener('keypress', function (e) {
  if (e.keyCode == 96)
    enabledHighlighting = !enabledHighlighting;
  else if (e.keyCode == 92 && speechSynthesis.speaking)
    speechSynthesis.cancel();
  if (!enabledHighlighting)
    curElement.classList.remove(MOUSE_VISITED_CLASSNAME);
}, false);

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
  var srcElement = e.srcElement;
  curElement = srcElement;

  // Lets check if our underlying element is a DIV.
  if ((srcElement.nodeName == 'DIV' || srcElement.nodeName == 'BODY') && enabledHighlighting) {

    // For NPE checking, we check safely. We need to remove the class name
    // Since we will be styling the new one after.
    if (prevDOM != null) {
      prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
    }

    // Add a visited class name to the element. So we can style it.
    srcElement.classList.add(MOUSE_VISITED_CLASSNAME);


    // The current element is now the previous. So we can remove the class
    // during the next iteration.
    prevDOM = srcElement;
  }
}, false);

document.addEventListener('click', function (e) {
  var srcElement = e.srcElement;

  if ((srcElement.nodeName == 'DIV' || srcElement.nodeName == 'BODY') && enabledHighlighting) {
    chrome.storage.sync.get({
      colorSetting : 'black',
      backgroundSetting : 'cream',
      fontSetting : 'comicsans',
    }, function(items) {
      srcElement.classList.toggle(items.fontSetting);
      srcElement.classList.toggle('text_' + items.colorSetting);
      srcElement.classList.toggle('bg_' + items.backgroundSetting);
    });
    srcElement.classList.toggle(MOUSE_CLICKED_CLASSNAME);
  }
}, false);

function ttsPhrase(info, tab) {
  /*speechSynthesis.getVoices().forEach(function(voice) {
    console.log(voice.name, voice.default ? '(default)' :'', voice.lang);
  });*/
  var text = "";
  chrome.storage.sync.get({
    ttsEnableSetting : false
  }, function(items) {
    if (items.ttsEnableSetting) {
      var msg = new SpeechSynthesisUtterance();
      var voices = window.speechSynthesis.getVoices();
      msg.voice = voices.filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];
      if (window.getSelection) {
          text = window.getSelection().toString();
          /*sentences = text.split(".");
          for (var i = 0; i < sentences.length; i++) {
            sentences[i] = sentences[i].concat(', eh?');
          }
          text = sentences.join();*/
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }
      msg.text = text;
      window.speechSynthesis.speak(msg);
    }
  });
}
