var moment = require('lib/moment');

var feed, i, nameLabel, wowRemoteResponse, wowRemoteError;

Ti.UI.backgroundColor = '#dddddd';

var myData = require('data');
var win2 = Ti.UI.createWindow({
	title: "Data",
	backgroundColor:"#ffffff"
});
var table = Ti.UI.createTableView();
var tableData = [];
feed = [];

wowRemoteResponse = function() {
    var json, mounts, hasTLPD, vyra, vyra_array, vyra_loot, vyra_count, row, ii,  j, k, nickLabel;

    hasTLPD = false;
    vyra = '';
    vyra_loot = 44732; // Azure Dragonleather Helm
    vyra_array = [];
    vyra_count = '';

    json = JSON.parse(this.responseText);
	mounts = json.mounts.collected;

    Ti.API.info(json.name);
    Ti.API.info('-----');
    Ti.API.info('Response text: ' + this.responseText);
    Ti.API.info('Mounts collected: ' + json.mounts.collected);
	Ti.API.info('Player feed: ' + json.feed);
    Ti.API.info('-----');
	
    for(j=0;j<json.feed.length; j++){        
    	if(json.feed[j].type === "LOOT" && json.feed[j].itemId === vyra_loot) {
    		vyra_array.push("Has looted Vyragosa: " + moment(json.feed[j].timestamp).format('lll'));	
    	}
    }
       
           
    if (vyra_array.length < 1) {
        Ti.API.info('Vyragosa has not been killed recently by ' + json.name);
        vyra = 'Vyragosa has not been kill recently';
    } else {
        Ti.API.info(json.name + ' has killed Vyragosa recently:');
        for(k=0;k<vyra_array.length;k++){
            vyra += vyra_array[k] + '\n';
            
            Ti.API.info(vyra_array[k]);
        }
        vyra_count = 'has recently looted Vyragosa ' + vyra_array.length + ' time(s).';
    }
    
    Ti.API.info(vyra_count);
    Ti.API.info(vyra_array);
    Ti.API.info(vyra);

    for(ii=0;ii<mounts.length;ii++) {
        if(mounts[ii].creatureId === 32153) {
            Ti.API.info('Has Time-Lost Proto-Drake');
            hasTLPD = true;
        } 
    }
   
    row = Ti.UI.createTableViewRow({
        height:'60dp',
        rightImage: '',
        backgroundColor: '#fff',
        info : {
            name: json.name,
            feed: vyra
        }
    });
    
    if(hasTLPD) { row.rightImage = 'tlpd.png'; };
    
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
        
    nickLabel = Ti.UI.createLabel({
//    	text: isFlying,
        text: vyra_count,
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