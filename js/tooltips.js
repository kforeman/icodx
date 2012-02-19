/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		13 Feb 2012
	Purpose:	Functions to make pretty tooltips with info upon mouseover
*/

// generate the tooltips (partially cribbed from Evan's treemaps)
	function tooltip(d) {
		var md = retrieve_meta_data(d.source_id, settings['geo']);
		var output = '<table>';
		var output = '<tr><td><b>Country:</b></td><td>' + country_lookup[d.geo] + '</td></tr>';
		output += '<tr><td><b>Year:</b></td><td>' + d.year + '</td></tr>';		
		output += '<tr><td><b>Age:</b></td><td>' + age_lookup[d.age] + '</td></tr>';		
		output += '<tr><td><b>Sex:</b></td><td>' + (settings['sex'] == '1' ? 'Male' : 'Female') + '</td></tr>';		
		output += '<tr><td><b>Type:</b></td><td>' + md.source_type + '</td></tr>';		
		output += '<tr><td><b>Source:</b></td><td>' + md.source_label + '</td></tr>';		
		output += '<tr><td><b>File:</b></td><td>' + md.source + '</td></tr>';		
		output += '<tr><td><b>Cause List:</b></td><td>' + md.icd_vers + '</td></tr>';		
		output += '<tr><td><b>National:</b></td><td>' + (md.national ? 'Yes' : 'No') + '</td></tr>';		
		output += '<tr><td><b>Sample Size:</b></td><td>' + format_num(d.sample_size) + '</td></tr>';		
		output += '<tr><td><b>Proportion:</b></td><td>' + format_cf(find_value(d, 'corr', 'prop')) + '</td></tr>';		
		output += '<tr><td><b>Prop (Raw):</b></td><td>' + format_cf(find_value(d, 'raw', 'prop')) + '</td></tr>';		
		output += '<tr><td><b>Deaths:</b></td><td>' + format_num(find_value(d, 'corr', 'num')) + '</td></tr>';		
		output += '<tr><td><b>Rate:</b></td><td>' + format_rate(find_value(d, 'corr', 'rate')) + '</td></tr>';		
		output += '<tr><td><b>Total Mortality:&nbsp;</b></td><td>' + format_num(d.env) + '</td></tr>';
		output += '<tr><td><b>Population:</b></td><td>' + format_num(d.pop) + '</td></tr>';
		if (typeof outliers[d.obs_id + '_' + settings['cause']] != 'undefined') {
			if (outliers[d.obs_id + '_' + settings['cause']].outlier == 1) output += '<tr><td><b>Outlier:</b></td><td>' + d.reason + ' (' + d.name + ')</td></tr>';
		}
		output += '</table>';
		return output;
	}

// format numbers
	function format_num(n) {
		if (isNaN(n)) return 'Missing';
		else return d3.format(',.0f')(n);	
	} 
	function format_cf(n) {
		if (isNaN(n)) return 'Missing';
		else return d3.format('.2%')(n);	
	} 
	function format_rate(n) {
		if (isNaN(n)) return 'Missing';
		else if (n <= .5) return d3.format('.2f')(n);
		else if (n < 5) return d3.format('.1f')(n);
		else return d3.format(',.0f')(n);
	}
	