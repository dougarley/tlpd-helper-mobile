/**
 * Name: CRUD Module
 * Description: Controls all CRUD functions of the application.
**/

// ==========================================================================================================
//Open SQLite DB, if does not exist, create one.

var db = Titanium.Database.open('characters');
exports.db = db;

db.execute('CREATE TABLE IF NOT EXISTS characters (id INTEGER PRIMARY KEY, name TEXT, server TEXT)');
// ==========================================================================================================

function getRowData() {
    //Create new empty array
    var newdata = [];
    
    //Loop through data for window #2
    var rows = db.execute('SELECT * FROM characters');
    
    while (rows.isValidRow()) {
        var id, name, server;
        
        id = rows.fieldByName('id');
        name = rows.fieldByName('name');
        server = rows.fieldByName('server');
        
        //Add table row
        //Store the fields directly to the rowData
        newdata.push({
            title: name + " (" + server + ")",
            id: id
        });
        rows.next();
    }
    
    return newdata;
}
exports.read = getRowData();

exports.person = function Person(name, server){
    //Set general object properties
    this.name = name;
    this.server = server;
    this.full_name = function(){
        return this.name + " (" + this.server + ")",
    };
    
    //Private Method to refresh table rows
    var refresh = function(){
        data = getRowData();
        tableView.setData(data);
    };
    
    //Create and Update function
    this.save = function(id){
        if (!this.name && !this.server){
            alert('Character name and realm not entered.');
        } else if (!this.name){
            alert('Must provide a character name.');
        } else if (!this.server){
            alert('Must provide a character realm.');
        } else {
            Ti.API.debug(this.full_name() + " has all required fields.");
        
            if(id) {
                // If there's an ID, then EDIT
                // Set that data, and sanitize with parameterization
                db.execute("UPDATE users SET name=?, server=?, WHERE id=?", this.name, this.server, id);
                Ti.API.debug(this.full_name() + " saved with the id: " + id);   
                        
                // Refresh table view with changes
                refresh();

                // Clear input fields upon success
                editfname.value = '';
                editlname.value = '';
                editzipcode.value = '';
                
                // Drop keyboard
                editfname.blur();
                editlname.blur();
                editzipcode.blur();
                
                //Announce User updated.
                alert(this.full_name() + ' has been updated!');
                
                //Close Edit Window
                editWindow.close();
            } else {
                //SQL insert FIRST_NAME, LAST_NAME, and ZIPCODE properties into the SQLite Database
                db.execute('INSERT INTO characters (name, server) VALUES (?,?)', this.name, this.server);
                Ti.API.debug(this.full_name() + ' has been saved.');
                
                //Call private refresh() method to refresh table rows.
                refresh();
                
                //Announce user saved.
                alert(this.full_name() + ' has been saved!');
        
                //Clear input fields upon success.
                savefname.value = '';
                savelname.value = '';
                savezipcode.value = '';
                
                //Drop keyboard.
                savefname.blur();
                savelname.blur();
                savezipcode.blur();
            }
        }
    };
    this.remove = function(id){
        // Delete User
        db.execute('DELETE FROM characters WHERE id=?', id);
    
        refresh();
    
        alert(this.full_name() + ' has been deleted.');
    };
};