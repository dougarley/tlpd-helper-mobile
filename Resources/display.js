Ti.UI.backgroundColor = '#dddddd';

var myData = require('data');
var win2 = Ti.UI.createWindow({
	title: "Data",
	backgroundColor:"#ffffff"
});
var table = Ti.UI.createTableView();
var tableData = [];
var feed = [];
var vyra_loot = 44732;
var json, mounts, collected, i, ii, row, nameLabel, nickLabel, isFlying, wowRemoteResponse, wowRemoteError, vyra, vyra_array;

wowRemoteResponse = function() {
		Ti.API.debug(this.responseText);
 
    	json = JSON.parse(this.responseText);
		mounts = json.mounts.collected;
		isFlying = '';

        vyra = '';
        vyra_array = [];
        
        row = Ti.UI.createTableViewRow({
            height:'60dp'
        });
		
        for(j=0;j<json.feed; j++){
        	if(json.feed.type == "LOOT" && json.feed.itemId == vyra_loot) {
        		vyra_array.push("Has looted Vyragosa: " + feed.timestamp);
        	}
        }
        
        if (vyra_array.length < 1) {
            Ti.API.debug('Vyragosa has not been killed recently by ' + json.name);
            vyra = 'Vyragosa has not been kill recently';
        } else {
            Ti.API.debug(json.name + ' has killed Vyragosa recently:');
            for(var k=0;k<vyra_array.length;k++){
                Ti.API.debug(vyra_array[k]);
                
                vyra =+ vyra_array[k] + '\n';
            }
        }
        
        Ti.API.debug(vyra);
        
        row.info = {
            name: json.name,
            feed: vyra
        };
        
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
 
        row.add(nameLabel);
        row.add(nickLabel);
        tableData.push(row);

    	table.setData(tableData);
};

wowRemoteError = function(e) {
	    Ti.API.debug("STATUS: " + this.status);
	    Ti.API.debug("TEXT:   " + this.responseText);
	    Ti.API.debug("ERROR:  " + e.error);
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