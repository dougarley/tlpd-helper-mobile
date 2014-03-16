// this sets the background color of the master UIView (when there are no windows/tab groups on it)
var storage = require('local');

Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

// create base UI tab and root window
var form = Titanium.UI.createWindow({  
    title: "Main Tab",
    backgroundColor:'#fff',
    layout: 'vertical'
});

var tab = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:"Main",
    window:form
});

var saveName = Titanium.UI.createTextField({
	value:'',
	width:250,
	height:40,
	top:10,
	hintText: 'Character Name',
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocorrect:false
});

var saveServer = Titanium.UI.createTextField({
	value:'',
	width:250,
	height:40,
	top:10,
	hintText: 'Character Realm',
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocorrect:false
});

var btn = Titanium.UI.createButton({
	title: 'Submit',
	top: 10,
	width: 250,
	height: 40
});

btn.addEventListener('click', function(e){
   var input = new storage.person(saveName.value,saveServer.value);
   input.save();
});

// create base UI tab and root window
var display = Titanium.UI.createWindow({  
    title: "Data",
    backgroundColor:'#fff',
    layout: 'vertical'
});

var table = Titanium.UI.createTableView({
    data: storage.read
});

var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:"Data",
    window:display
});

form.add(saveName);
form.add(saveServer);
form.add(btn);
display.add(table);
tabGroup.addTab(tab);  
tabGroup.addTab(tab2);

// open tab group
tabGroup.open();