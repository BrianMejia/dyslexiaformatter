var colorsTable = {
  'Red' : '#ff0000',
  'Blue' : '#0000ff',
  'Green' : '#00ff00',
  'Yellow' : '#ffff00',
  'Cream' : '#fffdd0'
};

var fontsTable = {
  'Times New Roman' : 'Times New Roman',
  'Arial' : 'Arial',
  'Comic Sans MS' : 'Comic Sans MS'
}

// Saves options to chrome.storage.sync.
function save_options() {
  var color = document.getElementById('color').value;
  var background = document.getElementById('background').value;
  var font = document.getElementById('font').value;
  chrome.storage.sync.set({
    colorSetting : color,
    backgroundSetting : background,
    fontSetting : font
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    colorSetting : 'Red',
    backgroundSetting : 'Cream',
    fontSetting : 'Comic Sans'
  }, function(items) {
    document.getElementById('color').value = items.colorSetting;
    document.getElementById('background').value = items.backgroundSetting;
    document.getElementById('font').value = items.fontSetting;
    $('#preview').css({
      'font-family' : fontsTable[items.fontSetting],
      'color' : colorsTable[items.colorSetting],
      'background-color' : colorsTable[items.backgroundSetting]
    });
  });
}

function change_preview() {
  console.log("changing preview pane.")
  var color = document.getElementById('color').value;
  var background = document.getElementById('background').value;
  var font = document.getElementById('font').value;
  console.log(background);
  console.log(colorsTable[background]);
  $('#preview').css({
    'font-family' : fontsTable[font],
    'color' : colorsTable[color],
    'background-color' : colorsTable[background]
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
var changing_elements = document.getElementsByClassName('prev_changer');
for (var i = 0; i < changing_elements.length; i++) {
    changing_elements[i].addEventListener('change', change_preview, false);
}
