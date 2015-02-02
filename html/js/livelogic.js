/**
 * LiveLogic.js

 	Monitors for new files in dir and uses XML to render new file in templates/rendered/livelogic.html
 */

var fs   = require('fs');
var util = require('util');
var path = require('path');
var json2html = require('node-json2html');
var moment = require('moment');

var dir = '/home/bettorlogic/upload/';

/**
 * Setup our file watcher instance.
 */
var watcher = fs.watch(dir, function(evt, filename) {
	if(evt != 'change') {
		// We don't care about changed files right now, just new ones.
		return;
	}

	// Ignore filenames that don't appear to be fact-related.
	if(filename.indexOf('GetInPlayData') !== 0) {
		util.log('Ignoring non-fact file: ' + filename);
		return;
	}

	// Give the file a chance to complete its upload before we schedule
	// it for processing. Just because we see the filename, doesn't mean that
	// it's been completedly uploaded yet.
	util.log("New file detected, will process in 5 seconds: " + filename);
	setTimeout(function() {
		processFile(dir + '/' + filename);
	}, 5000);
});

watcher.on('error', function(e) {
	util.log('File-watcher error: ' + e);
});

util.log("File watcher is running");


// debug_log, info_log function
var debug_log = function(d) { //
	var debug_log_file = fs.createWriteStream(__dirname + '/../log/debug.log', {flags : 'a'});
  	debug_log_file.write(util.format(d) + '\n');
};
var info_log = function(d) { //
	var info_log_file = fs.createWriteStream(__dirname + '/../log/info.log', {flags : 'a'});
  	info_log_file.write(util.format(d) + '\n');
};

//function to validate the json elements are there as per spec
var validate_json_livelogic = function(json) {
	//Todo - finish this
	return true;
}


/**
 * Our processing function. Will be called with the full file path each
 * time a new file is detected.
 */
var processFile = function(path) {
	util.log("Processing file: " + path);	
	var livelogic_ts = path.substr(path.indexOf('_')+1, path.indexOf('.') - path.indexOf('_')-1); //timestamp
	util.log("Livelogic Timestamp: " + livelogic_ts);	
	fs.readFile(path, function read(err,xml) {
		if (err) {
	        throw err;
	    }
		var parseString = require('xml2js').parseString;
		parseString(xml, function (err, json) {	
		//TODO - Err Handling/Logging if XML is bad?		   						
			var json_valid = validate_json_livelogic(json);
			util.log("JSON data: "+json);
			if (json_valid==false) {
				var html = '<div class="alert alert-warning" role="alert">Error Parsing XML! See Logs for Error.</div>';
				debug_log(moment().format()+" "+json); //todo make this better
			}			
			else {
				var trans = [ { tag: 'div', class: 'ArrayOfEvent', children: [] } ];								
				var root = trans[0].children;		
				var num_events = json.ArrayOfEvent.Event.length;		
				util.log("Num Events: "+num_events);				
				var i = 0;
				//TODO - Validate? Reorder if necessary?
				//TODO - Placeholder text if there are no matches
				while (i<num_events) {					
					root.push({tag:"div",class:"Event", children: []} );
					root[i].children.push({tag:"div",class:"Country", html: '${ArrayOfEvent.0.Event.'+i+'.Country}' } );
					root[i].children.push({tag:"div",class:"LeagueName", html: '${DArrayOfEvent.0.Event.'+i+'.LeagueName}' } );
					root[i].children.push({tag:"div",class:"EventId", html: '${ArrayOfEvent.0.Event.'+i+'.EventId}' } );
					root[i].children.push({tag:"div",class:"CurrentScore", html: '${ArrayOfEvent.0.Event.'+i+'.CurrentScore}' } );
					root[i].children.push({tag:"div",class:"Text", html: '${ArrayOfEvent.0.Event.'+i+'.Text}' } );				
					// MarketType
					// Outcome
					// CurrentMinute
					// GenerateAt	
					// MatchPeriod
					// Team1ID
					// Team1Name
					// Team2ID
					// Team2Name
					// Odds
					// OddsLink
			
					i++;
				}												
				var html = json2html.transform(json,trans);

			}		
			var new_file_name = '/vagrant/html/templates/rendered/livelogic_'+livelogic_ts+'.html';
			util.log("New file name: "+new_file_name);
			var livelogic_html_file = fs.createWriteStream(new_file_name, {flags : 'a'});
  			livelogic_html_file.write(html);
		});
	});						
};

