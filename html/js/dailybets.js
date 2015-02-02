#!/usr/bin/env node
// usage: curl or cat path/to/xml | node dailybets.js > templates/dailybets.html

var fs = require('fs');
var path = require('path');
var json2html = require('node-json2html');
var moment = require('moment');
var util = require('util');

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
var validate_json_dailybets = function(json) {
	//Todo - finish this
	return true;
}

debug_log("dailybets.js started at "+moment().format());
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(xml) {	
	var parseString = require('xml2js').parseString;					
	parseString(xml, function (err, json) {	
		//TODO - Err Handling/Logging if XML is bad?		   						
		var json_valid = validate_json_dailybets(json);
		if (json_valid==false) {
			var html = '<div class="alert alert-warning" role="alert">Error Parsing XML! See Logs for Error.</div>';
			debug_log(moment().format()+" "+json); //todo make this better
		}
		else if (json.DailyBets.Matches.length==0) {
			var html = '<div class="alert alert-warning" role="alert">There are no DailyBets Matches for today - check back later!</div>';
		}
		else if (json.DailyBets.Matches[0].length==0) {
			var html = '<div class="alert alert-warning" role="alert">There are no DailyBets Matches for today - check back later!</div>';
		}
		else {
			var trans = [ { tag: 'div', class: 'DailyBets', children: [] } ];								
			var root = trans[0].children;		
			var num_matches = json.DailyBets.Matches[0].Match.length;		
			var i = 0;
			//TODO - Validate? Reorder if necessary?
			//TODO - Placeholder text if there are no matches
			while (i<num_matches) {
				root.push({tag:"div",class:"Match", children: []} );
				root[i].children.push({tag:"div",class:"Country", html: '${DailyBets.Matches.0.Match.'+i+'.Country}' } );
				root[i].children.push({tag:"div",class:"LeagueName", html: '${DailyBets.Matches.0.Match.'+i+'.LeagueName}' } );
				root[i].children.push({tag:"div",class:"MatchName", html: '${DailyBets.Matches.0.Match.'+i+'.MatchName}' } );
				root[i].children.push({tag:"div",class:"KickOffTime", html: '${DailyBets.Matches.0.Match.'+i+'.KickOffTime}' } );
				root[i].children.push({tag:"div",class:"TextOutput", html: '${DailyBets.Matches.0.Match.'+i+'.TextOutput}' } );				
				root[i].children.push({tag:'button', class: 'btn-lg btn-primary', style: 'margin: 10px; align: center;', html: '${DailyBets.Matches.0.Match.'+i+'.MarketName}' } );
				root[i].children.push({tag:"div",class:"Odds", html: '${DailyBets.Matches.0.Match.'+i+'.Odds}' } );
				root[i].children.push({tag:"div",class:"OddsLinkText", html: '${DailyBets.Matches.0.Match.'+i+'.OddsLinkText}' } );
				root[i].children.push({tag:"div",class:"OddsLink", html: '${DailyBets.Matches.0.Match.'+i+'.OddsLink}' } );
				root[i].children.push({tag:"div",class:"Order", html: '${DailyBets.Matches.0.Match.'+i+'.Order}' } );				
				i++;
			}												
			var html = json2html.transform(json,trans);		
		}		
		console.log(html);
	});		   		        
});
debug_log("dailybets.js finished at "+moment().format());