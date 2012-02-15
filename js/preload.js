/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		7 January 2012
	Purpose:	Preload some data from MySQL that is required for subsequent steps (ie can't be loaded asynchronously)
*/

// have a single object to store various menu lookups in
	var lookups = {};	

// load the cause list
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

// list of years
	var start_year = 1980;
	var years = d3.range(start_year, 2012);

// load the list of outliers
	outliers = {};
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
