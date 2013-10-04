// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//var myData = require('data');

var myData2 = require('display');
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

// create base UI tab and root window
var win = Titanium.UI.createWindow({  
    title: "Main Tab",
    backgroundColor:'#fff'
});

var tab = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:"Main",
    window:win
});

var label = Titanium.UI.createLabel({
	color:'#999',
	text:"Stand-in Main Window",
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:"Data",
    window:myData2.display
});

/*
var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:"",
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});
*/

win.add(label);
tabGroup.addTab(tab);  
tabGroup.addTab(tab2);

// open tab group
tabGroup.open();