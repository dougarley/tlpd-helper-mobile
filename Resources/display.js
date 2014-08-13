var moment = require('lib/moment');
var character = require('classCharacter');

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
    var json, currCharacter, i;

    json = JSON.parse(this.responseText);  // Parse response
    Ti.API.info('Response text: ' + this.responseText + '\n');

    currCharacter = new character.Character(json.name, json.realm, json.mounts.collected, json.feed);

    // Announce Player Name, response, mounts, and feed
    Ti.API.info(currCharacter.name);
    Ti.API.info('-----');
    Ti.API.info('Mounts collected: ' + currCharacter.mounts);
    Ti.API.info('Player feed: ' + currCharacter.lootHistory);
    Ti.API.info('-----');
    
    currCharacter.getTLPD();
    currCharacter.getVyraKills();

    Ti.API.info('===============================');

    currCharacter.updateRow();
    
};

exports.pull = function(array) {
    if(array.length < 1) {
    	// If there are no characters in the database, display stand-in row
    	
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
    	// If there are characters in the database, display them
    	
        Ti.API.info('Database has ' + array.length + ' characters stored.');
        
        Ti.API.info('tableData emptied');
        tableData = [];
        
        Ti.API.info('Pulling character info:');
        
        for(i = 0; i < array.length; i++){
        	
        	// Create new table row
            var row = Ti.UI.createTableViewRow({
                height:'60dp',
                backgroundColor: '#fff',
                character_name: array[i].charname,
                character_realm: array[i].charserver,
                kills: ''
            });
            
            // Create character name label
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

			// Create empty label of Vyragosa kills
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

			// Add labels to row; row to table
            row.add(charName);
            row.add(vyraKills);
            tableData.push(row);
        }
        
        for (i = 0; i < array.length; i++) {
            // Get each character in array, do a remote data pull for each
            Ti.API.info('Begin character pull.');
        	var url = "http://us.battle.net/api/wow/character/" + array[i].charserver + "/" + array[i].charname + "?fields=feed,mounts";
        
        	var xhr = Ti.Network.createHTTPClient({
        	    onload: wowRemoteResponse,
        	    onerror: wowRemoteError,
        	    timeout: 5000
        	});
        
        	xhr.open("GET", url);
        	xhr.send();
        	Ti.API.info('Complete character pull.');
        }
    }
    
    Ti.API.info('Pull complete. Data sent.');
    return tableData;
};