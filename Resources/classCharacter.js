// Character Class
exports.Character = function(name, realm, mounts, feed){
    this.name = name;
    this.server = server;
    this.mounts = mounts;
    this.lootHistory = feed;
    this.hasTLPD = false;
    this.vyraKills = [];
    this.getTLPD = function() {
        var i;

        // Check to see if player already has TLPD
        for (i = 0; i < mounts.length; i++) {
            if (mounts[i].creatureId === 32153) {
                Ti.API.info('Has Time-Lost Proto-Drake');
                this.hasTLPD = true; // Set boolean TRUE if they do
            } 
        }
    };
    this.getVyraKills = function() {
        var vyra_loot, vyra_output , i;

        vyra_loot = 44732;  // Azure Dragonleather Helm ID

        // Check player feed for recent Vyragosa loot
        for (i = 0; i < this.lootHistory; i++) {        
            var loot,

            loot = lootHistory[i];

            if(loot.type === "LOOT" && loot.itemId === vyra_loot) {
                this.vyraKills.push(moment(loot.timestamp).format('lll'));    
            }
        }
           
        // Ready Vyragosa data
        if (this.vyraKills.length > 0) {

            // If Vyragosa has been recently looted..
            Ti.API.info(this.name + ' has killed Vyragosa recently:');
            
            vyra_output = ''; //Clear out Vyragosa Output
            
            // Loop through array of Vyragosa loot data
            for (k = 0; k < this.vyraKills.length; k++) {
                Ti.API.info(this.vyraKills[k]);
                
                // For each Vyragosa loot, add loot data to string output;
                vyra_output += this.vyraKills[k] + '\n'; 
            }
            
            // Set label for number of Vyragosa loots
            vyra_count = 'has recently looted Vyragosa ' + vyra_array.length + ' time(s).';
        }
        
        Ti.API.info(vyra_count);
        Ti.API.info(vyra_output);   
    };
    this.updateRow = function() {
        var i;

        for(i = 0; i < table.data[0].rows.length; i++){
            var row = table.data[0].rows[r];
            
            if(row.character_name == this.name && row.character_realm == this.realm){
                if(this.hasTLPD) { row.setRightImage('tlpd.png'); };   // If player has TLPD, update right-side image
                
                row.children[1].setText(this.vyraKills.length);

                row.info.name = this.name;
                row.info.feed = this.vyraKills.length;

                row.addEventListener("click", function(e){
                    alert(e.source.info.name + "\n" + e.source.info.feed);
                });  
            }
        }
       
        Ti.API.info('Row pushed for ' + json.name);
    };
};