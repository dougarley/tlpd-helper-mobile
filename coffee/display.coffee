moment = require 'lib/moment'
myData = require 'data'

Ti.UI.backgroundColor = '#dddddd'
table = Ti.UI.createTableView() 
 

win2 = Ti.UI.createWindow(
  title: "Data",
  backgroundColor:"#ffffff"
)

wowRemoteResponse = ->
  hasTLPD = false;
  tableData = []
  feed = []  
  vyra_loot = 44732;  # Azure Dragonleather Helm ID
  vyra_array = [];    # Array storing Vyragosa kills   
  vyra_count = '';    # String indentifying number of Vyragosa kills.
  vyra_output = 'Vyragosa has not been kill recently';         # String output for array    

  json = JSON.parse(@responseText);      # Parse response
  mounts = json.mounts.collected;        # Store collected mounts array

  # Announce Player Name, response, mounts, and feed
  Ti.API.info(json.name);
  Ti.API.info '-----'
  Ti.API.info 'Response text: ' + @responseText
  Ti.API.info 'Mounts collected:' + json.mounts.collected
  Ti.API.info 'Player feed:' + json.feed
  Ti.API.info '-----'
  
  # Check player feed for recent Vyragosa loot
  for j in json.feed     
    if json.feed[j].type is "LOOT" and json.feed[j].itemId is vyra_loot
      vyra_array.push "Has looted Vyragosa: " + moment(json.feed[j].timestamp).format('lll')
    
  # Ready Vyragosa data
  if vyra_array.length > 0
    # If Vyragosa has been recently looted..
    Ti.API.info json.name + ' has killed Vyragosa recently:'
    
    # Clear out Vyragosa Output
    vyra_output = ''
    
    # Loop through array of Vyragosa loot data
    for k in vyra_array.length
      Ti.API.info vyra_array[k]
      
      # For each Vyragosa loot, add loot data to string output;
      vyra_output += vyra_array[k] + '\n'
    
    # Set label for number of Vyragosa loots
    vyra_count = 'has recently looted Vyragosa ' + vyra_array.length + ' time(s).'

  Ti.API.info(vyra_count)
  Ti.API.info(vyra_output)

  # Check to see if player already has TLPD
  for mount in mounts.length
    if mounts[mount].creatureId is 32153
      Ti.API.info 'Has Time-Lost Proto-Drake'
      hasTLPD = true; # Set boolean TRUE if they do
 
  # Build table view row
  row = Ti.UI.createTableViewRow(
    height:'60dp'
    rightImage: ''
    backgroundColor: '#fff'
    info : { name: json.name, feed: vyra_output }
  )
    
  # If player has TLPD, update right-side image
  row.rightImage = 'tlpd.png' if hasTLPD is true    
  
  # Player name label
  nameLabel = Ti.UI.createLabel(
    text: json.name
    touchEnabled: false
    font: { fontSize: '24dp', fontWeight: 'bold' }
    height: 'auto'
    left: '10dp'
    top: '5dp'
    color: '#000'
  )
        
  # Vyragosa loot into label
  nickLabel = Ti.UI.createLabel(
    text: vyra_count
    font: { fontSize:'16dp' }
    height:'auto'
    left:'15dp'
    bottom:'5dp'
    color:'#000'
    touchEnabled:false
  )

  # Click event listener to display Vyragosa loot data
  row.addEventListener "click", (e) ->
    alert e.source.info.name + "\n" + e.source.info.feed
 
  Ti.API.info '==============================='

  row.add(nameLabel)
  row.add(nickLabel)
  tableData.push(row)
  table.setData(tableData)

wowRemoteError = (e) ->
  Ti.API.info 'STATUS:' + @status
  Ti.API.info 'TEXT:' + @responseText
  Ti.API.info 'ERROR:' + e.error
  alert 'There was an error retrieving the remote data. Try again.'

for i in myData.data.length
  url = "http://us.battle.net/api/wow/character/#{myData.data[i].charserver}/#{myData.data[i].charname}?fields=feed,mounts"

  xhr = Ti.Network.createHTTPClient(
    onload: wowRemoteResponse
    onerror: wowRemoteError
    timeout:5000
  )

  xhr.open("GET", url)
  xhr.send()

win2.add(table)
exports.display = win2