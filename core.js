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

document.addEventListener('mouseup', function (e) {
  var text = "";
  chrome.storage.sync.get({
    ttsEnableSetting : false
  }, function(items) {
    if (items.ttsEnableSetting) {
      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  });

}, false);

document.addEventListener('keypress', function (e) {
  if (e.keyCode == 96)
    enabledHighlighting = !enabledHighlighting;
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
      colorSetting : 'Red',
      backgroundSetting : 'Cream',
      fontSetting : 'Comic Sans MS',
    }, function(items) {
      console.log(items.colorSetting);
      console.log(items.backgroundSetting);
      console.log(items.fontSetting);

      srcElement.classList.toggle(items.fontSetting);
      srcElement.classList.toggle(items.colorSetting);
      srcElement.classList.toggle(items.backgroundSetting);

      //srcElement.style.color='red';
    });
    console.log(document.styleSheets);
    srcElement.classList.toggle(MOUSE_CLICKED_CLASSNAME);
    document.querySelectedAll(".crx_mouse_clicked *")[0].style.color = 'red';
  }
}, false);
