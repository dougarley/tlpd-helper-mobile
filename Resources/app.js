// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//var myData = require('data');

var myData2 = require('display');
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

// create base UI tab and root window
var win = Titanium.UI.createWindow({  
    title: "Main Tab",
    backgroundColor:'#fff',
    layout: 'vertical'
});

var tab = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:"Main",
    window:win
});

var charName = Titanium.App.Properties.getString("foo");

var tf1 = Titanium.UI.createTextField({
	value:charName,
	width:250,
	height:40,
	top:10,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocorrect:false
});

var charServ = Titanium.App.Properties.getString("foo");

var tf2 = Titanium.UI.createTextField({
	value:charServ,
	width:250,
	height:40,
	top:10,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocorrect:false
});

var btn = Titanium.UI.createButton({
	title: 'Submit',
	top: 10,
	width: 250,
	height: 40
});

var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:"Data",
    window:myData2.display
});

win.add(tf1);
win.add(tf2);
win.add(btn);
tabGroup.addTab(tab);  
tabGroup.addTab(tab2);

// open tab group
tabGroup.open();