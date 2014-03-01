var moment = require('lib/moment');

var feed, i, nameLabel, wowRemoteResponse, wowRemoteError, vyra_loot;

Ti.UI.backgroundColor = '#dddddd';

var myData = require('data');
var win2 = Ti.UI.createWindow({
	title: "Data",
	backgroundColor:"#ffffff"
});
var table = Ti.UI.createTableView();
var tableData = [];
feed = [];
vyra_loot = 44732; // Azure Dragonleather Helm
//vyra_loot = 102884; // Grievous Gladiator's Cuffs of Accuracy

wowRemoteResponse = function() {
    var json, mounts, isFlying, vyra, vyra_array, row, ii,  j, k, nickLabel;

    json = JSON.parse(this.responseText);
	mounts = json.mounts.collected;

    Ti.API.info(json.name);
    Ti.API.info('-----');
    Ti.API.info('Response text: ' + this.responseText);
    Ti.API.info('Mounts collected: ' + json.mounts.collected);
	Ti.API.info('Player feed: ' + json.feed);
    Ti.API.info('-----');
	
	isFlying = '';
    vyra = '';
    vyra_array = [];

    for(j=0;j<json.feed.length; j++){
    	if(json.feed[j].type == "LOOT" && json.feed[j].itemId == vyra_loot) {
    	    Ti.API.info('Vyragosa kill!');
    		vyra_array.push("Has looted Vyragosa: " + moment(json.feed[j].timestamp).format('lll'));	
    	}
    }
        
    Ti.API.info('Vyragosa has been killed ' + vyra_array.length + ' time(s).');
    Ti.API.info(vyra_array);
    
    
    if (vyra_array.length < 1) {
        Ti.API.info('Vyragosa has not been killed recently by ' + json.name);
        vyra = 'Vyragosa has not been kill recently';
    } else {
        Ti.API.info(json.name + ' has killed Vyragosa recently:');
        for(k=0;k<vyra_array.length;k++){
            Ti.API.info(vyra_array[k]);
            
            vyra += vyra_array[k] + '\n';
        }
    }
    
    Ti.API.info(vyra);
    
    row = Ti.UI.createTableViewRow({
        height:'60dp',
        info : {
            name: json.name,
            feed: vyra
        }
    });
    
    nameLabel = Ti.UI.createLabel({
        text: json.name,
        font: {
            fontSize:'24dp',
        	fontWeight:'bold'
    	},
    	height:'auto',
    	left:'10dp',
    	top:'5dp',
    	color:'#000',
    	touchEnabled:false
    });
		
   for(ii=0;ii<mounts.length;ii++) {
   		if(mounts[ii].creatureId == 32153) {
   			isFlying = "Has Time-Lost Proto-Drake.";
		}
   }
        
    nickLabel = Ti.UI.createLabel({
    	text: isFlying,
    	font:{
        	fontSize:'16dp'
    	},
    	height:'auto',
    	left:'15dp',
    	bottom:'5dp',
    	color:'#000',
        touchEnabled:false
    });
 
	row.addEventListener("click", function(e){
		alert(e.source.info.name + "\n" + e.source.info.feed);
	});
 
    Ti.API.info('===============================');
 
    row.add(nameLabel);
    row.add(nickLabel);
    tableData.push(row);
    table.setData(tableData);
};

wowRemoteError = function(e) {
    Ti.API.info("STATUS: " + this.status);
    Ti.API.info("TEXT:   " + this.responseText);
    Ti.API.info("ERROR:  " + e.error);
    alert('There was an error retrieving the remote data. Try again.');
};

for(i=0;i<myData.data.length;i++){
	var url = "http://us.battle.net/api/wow/character/" + myData.data[i].charserver + "/" + myData.data[i].charname + "?fields=feed,mounts";

	var xhr = Ti.Network.createHTTPClient({
	    onload: wowRemoteResponse,
	    onerror: wowRemoteError,
	    timeout:5000
	});

	xhr.open("GET", url);
	xhr.send();
}
win2.add(table);
exports.display = win2;
//win.open();