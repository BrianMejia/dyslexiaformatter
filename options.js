var defaultColor = "cream";

var colors = {
  "red" : "#ff0000",
  "blue" : "#0000ff",
  "green" : "#00ff00",
  "yellow" : "#ffff00",
  "cream" : "#fffdd0"
};

addStyleSheet();

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("save").addEventListener("click", saveOptions);
  document.getElementById("erase").addEventListener("click", eraseOptions);
});

window.addEventListener('load', loadOptions);

function loadOptions() {
	var favColor = localStorage["favColor"];

	// valid colors are red, blue, green and yellow
	if (favColor == undefined || (favColor != "red" && favColor != "blue" && favColor != "green" && favColor != "yellow")) {
		favColor = defaultColor;
	}

	var select = document.getElementById("color");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
			if (child.value == favColor) {
  			child.selected = "true";
  			break;
		  }
	}
}

function saveOptions() {
	var select = document.getElementById("color");
	var color = select.children[select.selectedIndex].value;
	localStorage["favColor"] = color;
  var stylesheet = document.stylesheets;
  var styleColor = colors[color];
  console.log(stylesheet);
  stylesheet.cssRules[1].style.backgroundColor = styleColor, " !important";
}

function eraseOptions() {
	localStorage.removeItem("favColor");
	location.reload();
}

function addStyleSheet() {
  var newSheet = document.createElement('link');
  newSheet.setAttribute('rel','stylesheet');
  newSheet.setAttribute('type','text/css');
  newSheet.setAttribute('href', 'core.css');
  document.getElementsByTagName('head')[0].appendChild(newSheet);
}
