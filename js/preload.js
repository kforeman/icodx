/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		7 January 2012
	Purpose:	Preload some data from MySQL that is required for subsequent steps (ie can't be loaded asynchronously)
*/

// have a single object to store various menu lookups in
	var lookups = {};	

// determine if this is the offline version
	var use_mysql = (window.location.host != 'localhost:8888');

// setup defaults
	settings = {
		geo: 	'ARM',
		cause:	'A01',
		sex:	1,
		unit:	'rate',
		xaxis:	'time',
		data:	'corr',
		model:	'none'
	}

// load the cause list
	if (use_mysql) {
		$.ajax({
			url: 'php/cause_list.php',
			dataType: 'json',
			async: false,
			success: function(json) {
				cause_list = json;
				lookups['cause'] = {};
				cause_list.map(function(d) {
					lookups['cause'][d.cause] = d;
					lookups['cause'][d.cause]['cause_viz'] = d.cause.replace(/\./g, '_')
				});
			}
		});		
	}
	else {
		$.ajax({
			url: 'data/parameters/cause_list.csv',
			dataType: 'text',
			async: false,
			success: function(csv) {
				cause_list = d3.csv.parse(csv);
				lookups['cause'] = {};
				cause_list.map(function(d) {
					lookups['cause'][d.cause] = d;
					lookups['cause'][d.cause]['cause_viz'] = d.cause.replace(/\./g, '_')
				});
			}
		});
	}

// list of years
	var start_year = 1980;
	var years = d3.range(start_year, 2012);

// load the list of outliers
	outliers = {};
	if (use_mysql) {
		$.ajax({
			url: 'php/outliers.php',
			dataType: 'json',
			async: false,
			success: function(json) {
				json.map(function(d) {
					outliers[d.obs_id + '_' + d.cause] = d;
				});
			}
		});	
	}
	else {
		$.ajax({
			url: 'data/outliers/outliers.csv',
			dataType: 'text',
			async: false,
			success: function(csv) {
				d3.csv.parse(csv).map(function(d) {
					outliers[d.obs_id + '_' + d.cause] = d;
				});
			}
		});	
	}

// country lookup
	country_lookup = {};
	geo_list.map(function(d) {
		country_lookup[d.code] = d.name;
	});

// countries by region
	regions = {};
	geo_list.map(function(d) {
		if (typeof regions[d.R] == 'undefined') regions[d.R] = [];
		if (d.code.substr(0,2) != 'R_') regions[d.R].push(d.code);
	});
