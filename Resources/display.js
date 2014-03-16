var moment = require('lib/moment');

var feed, i, nameLabel, wowRemoteResponse, wowRemoteError;

Ti.UI.backgroundColor = '#dddddd';

//var myData = require('data');
var win2 = Ti.UI.createWindow({
	title: "Data",
	backgroundColor:"#ffffff"
});

var tableData = [];
feed = [];

wowRemoteResponse = function() {
    var json, mounts, hasTLPD, vyra_output, vyra_array, vyra_loot, vyra_count, row, ii,  j, k, nickLabel;

    hasTLPD = false;
    vyra_loot = 44732;  // Azure Dragonleather Helm ID
    vyra_array = [];    // Array storing Vyragosa kills   
    vyra_count = '';    // String indentifying number of Vyragosa kills.
    vyra_output = 'Vyragosa has not been kill recently';         // String output for array    

    json = JSON.parse(this.responseText);  // Parse response
	mounts = json.mounts.collected;        // Store collected mounts array

    // Announce Player Name, response, mounts, and feed
    Ti.API.info(json.name);
    Ti.API.info('-----');
    Ti.API.info('Response text: ' + this.responseText);
    Ti.API.info('Mounts collected: ' + json.mounts.collected);
	Ti.API.info('Player feed: ' + json.feed);
    Ti.API.info('-----');
	
	// Check player feed for recent Vyragosa loot
    for(j=0;j<json.feed.length; j++){        
    	if(json.feed[j].type === "LOOT" && json.feed[j].itemId === vyra_loot) {
    		vyra_array.push("Has looted Vyragosa: " + moment(json.feed[j].timestamp).format('lll'));	
    	}
    }
       
    // Ready Vyragosa data
    if (vyra_array.length > 0) {
        // If Vyragosa has been recently looted..
        Ti.API.info(json.name + ' has killed Vyragosa recently:');
        
        vyra_output = ''; //Clear out Vyragosa Output
        
        // Loop through array of Vyragosa loot data
        for(k=0;k<vyra_array.length;k++){
            Ti.API.info(vyra_array[k]);
            
            // For each Vyragosa loot, add loot data to string output;
            vyra_output += vyra_array[k] + '\n'; 
        }
        
        // Set label for number of Vyragosa loots
        vyra_count = 'has recently looted Vyragosa ' + vyra_array.length + ' time(s).';
    }
    
    Ti.API.info(vyra_count);
    Ti.API.info(vyra_output);

    // Check to see if player already has TLPD
    for(ii=0;ii<mounts.length;ii++) {
        if(mounts[ii].creatureId === 32153) {
            Ti.API.info('Has Time-Lost Proto-Drake');
            hasTLPD = true; // Set boolean TRUE if they do
        } 
    }
    
    Ti.API.info('===============================');
    
    for(r=0;r<table.data[0].rows.length;r++){
        var thisRow = table.data[0].rows[r];
        console.log('This row: ' + thisRow);
        console.log(thisRow['character_name']);
        console.log('Label 0: ' + thisRow.children[0].text);
        
        if(thisRow['character_name'] == json.name && thisRow['character_realm'] == json.realm){
            if(hasTLPD) { thisRow.rightImage = 'tlpd.png'; };   // If player has TLPD, update right-side image
            
            thisRow.children[1].text = vyra_count;
            console.log('Vyra Label: ' + thisRow.children[1].text);
            
            thisRow.info = info = {
                name: json.name,
                feed: vyra_output
            };

            thisRow.addEventListener("click", function(e){
                alert(e.source.info.name + "\n" + e.source.info.feed);
            });  
        }
    }
   
    Ti.API.info('Row pushed for ' + json.name);
};

wowRemoteError = function(e) {
    Ti.API.info("STATUS: " + this.status);
    Ti.API.info("TEXT:   " + this.responseText);
    Ti.API.info("ERROR:  " + e.error);
    alert('There was an error retrieving the remote data. Try again.');
};

exports.pull = function(array) {
    if(array.length < 1) {
        Ti.API.info('No characters in database');
        
        Ti.API.info('tableData emptied');
        tableData = [];
    
        var row = Ti.UI.createTableViewRow({
            height:'60dp',
            backgroundColor: '#fff',
            title: 'Add a character'        
        });

        Ti.API.info('Default row pushed');
        tableData.push(row);
    } else {
        Ti.API.info('Database has ' + array.length + ' characters stored.');
        
        Ti.API.info('tableData emptied');
        tableData = [];
        
        Ti.API.info('Pulling character info:');
        
        for(i=0;i<array.length;i++){
            var row = Ti.UI.createTableViewRow({
                height:'60dp',
                backgroundColor: '#fff',
                character_name: array[i].charname,
                character_realm: array[i].charserver
            });
            var charName = Ti.UI.createLabel({
                text: array[i].charname + ' (' + array[i].charserver  + ')',
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

            var vyraKills = Ti.UI.createLabel({
                text: '',
                font:{
                    fontSize:'16dp'
                },
                height:'auto',
                left:'15dp',
                bottom:'5dp',
                color:'#000',
                touchEnabled:false
            });            

            row.add(charName);
            row.add(vyraKills);
            tableData.push(row);
        }
        
        for(i=0;i<array.length;i++){
            
            Ti.API.info('Begin character pull.');
        	var url = "http://us.battle.net/api/wow/character/" + array[i].charserver + "/" + array[i].charname + "?fields=feed,mounts";
        
        	var xhr = Ti.Network.createHTTPClient({
        	    onload: wowRemoteResponse,
        	    onerror: wowRemoteError,
        	    timeout:5000
        	});
        
        	xhr.open("GET", url);
        	xhr.send();
        	Ti.API.info('Complete character pull.');
        }
    }
    
    Ti.API.info('Pull complete. Data sent.');
    return tableData;
};

//win2.add(table);
//exports.display = win2;
//win.open();