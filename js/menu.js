/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		7 February 2012
	Purpose:	Build lefthand menus for cause of death DB
*/

// add an accordion to allow for multiple sets of menus
	accordion = menu.append('div')
		.attr('id', 'accordion');

// add the main menu
	accordion.append('h3')
	  .append('a')
		.attr('href', '#')
		.text('Settings');
	menu_panel = accordion.append('div')
		.attr('class', 'accordion_section');

// add a legend
	accordion.append('h3')
	  .append('a')
		.attr('href', '#')
		.text('Legend');
	legend_panel = accordion.append('div')
		.attr('class', 'accordion_section');

// add a panel for outlier submission
	accordion.append('h3')
	  .append('a')
	  	.attr('href', '#')
	  	.text('Outliers');
  	outlier_panel = accordion.append('div')
  		.attr('class', 'accordion_section');

// turn it into an accordion
	$('#accordion').accordion({ fillSpace: true });

// menu entries
	var menu_entries = [
			{ id:	'geo',		name:	'Place',	type:	'select' },
			{ id:	'cause',	name:	'Cause',	type:	'select' },
			{ id:	'sex',		name:	'Sex',		type:	'radio' },
			{ id:	'model',	name:	'Model',	type:	'select' },
			{ id:	'data',		name:	'Data',		type:	'radio' },
			{ id:	'unit',		name:	'Units',	type:	'radio' },
			{ id:	'xaxis',	name:	'X-axis',	type:	'radio' }
		];
		
		
		
		
		settings = {
			geo: 	'ARM',
			cause:	'A01',
			sex:	1,
			unit:	'rate',
			xaxis:	'time',
			data:	'corr',
			model:	'none'
		}
		

// fill in the main menu
	var menu_font_size = 14,
		menu_row_height = 50,
		menu_label_width = 50,
		menu_row_buffer = 10,
		update_functions = {};
	menu_entries.map(function(e, i) {
		// a label identifying the menu entry, which toggles sync when clicked
			menu_panel.append('div')
			  .append('center')
				.attr('id', 'menu_label_' + e.id)
				.attr('class', 'menu_label')
				.style('top', ((menu_row_height * (i + .5)) - (menu_font_size / 2) + (i * menu_row_buffer)) + 'px')
				.style('font-size', menu_font_size + 'px')
				.style('line-height', menu_font_size + 'px')
				.style('width', menu_label_width + 'px')
				.text(e.name);
		// divs for the controls
			menu_panel.append('div')
				.attr('id', 'menu_control_' + e.id)
				.attr('class', 'menu_control')
				.style('top', ((menu_row_height * (i + .25)) + (i * menu_row_buffer)) + 'px')
				.style('height', (menu_row_height / 2) + 'px')
				.style('width', (menu_width - menu_label_width) + 'px')
				.style('left', menu_label_width + 'px');
	});


// geo selectors
	var s = d3.select('#menu_control_geo')
			  .append('select')
				.attr('id', 'geo_select')
				.attr('class', 'select_menu')
				.attr('onchange', 'change_geo(this.value)');
	s.selectAll()
	  	.data(geo_list)
  	  .enter().append('option')
  	  	.attr('id', function(d) { return 'geo_option_' + d.code; })
  	  	.attr('value', function(d) { return d.code; })
  	  	.text(function(d) { return d.name; })
  	  	.style('font-weight', function(d) { return d.code.substr(0,2) == 'R_' ? 'bold' : 'normal'; })
  	  	.style('margin-left', function(d) { return d.code.substr(0,2) == 'R_' ? '0px' : '5px'; })
  	$('#geo_option_' + settings['geo'])[0].selected = true;
  	$('#geo_select').chosen();



// update geo selection
	function change_geo(val) {
		// update the settings
			settings['geo'] = val;
		// update the chart
			update_chart();
	}

// add cause selectors
	var s = d3.select('#menu_control_cause')
			  .append('select')
				.attr('id', 'cause_select')
				.attr('class', 'select_menu')
				.attr('onchange', 'change_cause(this.value)');
	s.selectAll()
	  	.data(cause_list)
  	  .enter().append('option')
  	  	.attr('id', function(d) { return 'cause_option_' + d.cause_viz; })
  	  	.attr('value', function(d) { return d.cause_viz; })
  	  	.text(function(d) { return d.cause + '. ' + d.cause_name; })
  	  	.style('font-weight', function(d) { return (d.cause_viz.match(/_/g) == null ? 0 : d.cause_viz.match(/_/g).length) == 0 ? 'bold' : 'normal'; })
  	  	.style('margin-left', function(d) { return ((d.cause_viz.length == 1 ? 0 : (d.cause_viz.match(/_/g) == null ? 1 : d.cause_viz.match(/_/g).length + 1)) * 3) + 'px'; })
  	$('#cause_option_' + settings['cause'])[0].selected = true;
  	$('#cause_select').chosen();


// update cause selection
	function change_cause(val) {
		// update the settings
			settings['cause'] = val;
		// update the list of models
			refresh_model_list();
		// update the chart
			update_chart();
	}


// buttons for sex
	var s = d3.select('#menu_control_sex')
			  .append('form')
				.attr('id', 'sex_radio');
	[{ val: 1, name: 'Male' },
	 { val: 2, name: 'Female' }].map(function(d) {
		 s.append('input')
			.attr('type', 'radio')
			.attr('name', 'sex_radio')
			.attr('class', 'sex_radio')
			.attr('id', 'sex_radio_' + d.val)
			.attr('value', d.val)
			.attr(settings['sex'] == d.val ? 'checked' : 'ignoreme', 'true');
		s.append('label')
			.attr('for', 'sex_radio_' + d.val)
			.text(d.name);
	 });
	 $('#sex_radio').buttonset()
	 	.css('margin-left', '10px')
	 	.change(function() { change_sex($('.sex_radio:checked').val()); });

// change sexes
	function change_sex(val) {
		// update the settings
			settings['sex'] = val;
		// update the model list
			refresh_model_list();
		// update the chart
			update_chart();
	}


// buttons for units
	var s = d3.select('#menu_control_unit')
			  .append('form')
				.attr('id', 'unit_radio');
	[{ val: 'num', 	name: '#' },
	 { val: 'rate', name: 'Rate' },
	 { val: 'prop', name: '%' }].map(function(d) {
		 s.append('input')
			.attr('type', 'radio')
			.attr('name', 'unit_radio')
			.attr('class', 'unit_radio')
			.attr('id', 'unit_radio_' + d.val)
			.attr('value', d.val)
			.attr(settings['unit'] == d.val ? 'checked' : 'ignoreme', 'true');
		s.append('label')
			.attr('for', 'unit_radio_' + d.val)
			.text(d.name);
	 });
	 $('#unit_radio').buttonset()
	 	.css('margin-left', '14px')
	 	.change(function() { change_unit($('.unit_radio:checked').val()); });

// change units
	function change_unit(val) {
		// update the settings
			settings['unit'] = val;
		// update the chart
			update_chart();
	}

// buttons for raw v corrected
	var s = d3.select('#menu_control_data')
			  .append('form')
				.attr('id', 'data_radio');
	[{ val: 'raw', 	name: 'Raw' },
	 { val: 'corr', name: 'Corrected' }].map(function(d) {
		 s.append('input')
			.attr('type', 'radio')
			.attr('name', 'data_radio')
			.attr('class', 'data_radio')
			.attr('id', 'data_radio_' + d.val)
			.attr('value', d.val)
			.attr(settings['data'] == d.val ? 'checked' : 'ignoreme', 'true');
		s.append('label')
			.attr('for', 'data_radio_' + d.val)
			.text(d.name);
	 });
	 $('#data_radio').buttonset()
	 	.css('margin-left', '7px')
	 	.change(function() { change_data($('.data_radio:checked').val()); });

// change corrected/raw
	function change_data(val) {
		// update the settings
			settings['data'] = val;
		// update the chart
			update_chart();
	}

// buttons for x-axis
	var s = d3.select('#menu_control_xaxis')
			  .append('form')
				.attr('id', 'xaxis_radio');
	[{ val: 'time', name: 'Time' },
	 { val: 'age',  name: 'Age' }].map(function(d) {
		 s.append('input')
			.attr('type', 'radio')
			.attr('name', 'xaxis_radio')
			.attr('class', 'xaxis_radio')
			.attr('id', 'xaxis_radio_' + d.val)
			.attr('value', d.val)
			.attr(settings['xaxis'] == d.val ? 'checked' : 'ignoreme', 'true');
		s.append('label')
			.attr('for', 'xaxis_radio_' + d.val)
			.text(d.name);
	 });
	 $('#xaxis_radio').buttonset()
	 	.css('margin-left', '22px')
	 	.change(function() { change_xaxis($('.xaxis_radio:checked').val()); });

// change xaxis
	function change_xaxis(val) {
		// update the setting
			settings['xaxis'] = val;
		// fade the axes in/out
			ts_gs.transition().duration(settings['xaxis'] == 'time' ? 500 : 1000).delay(settings['xaxis'] == 'time' ? 500 : 0).style('opacity', settings['xaxis'] == 'time' ? 1 : 1e-6);
			ap_gs.transition().duration(settings['xaxis'] == 'age' ? 500 : 1000).delay(settings['xaxis'] == 'age' ? 500 : 0).style('opacity', settings['xaxis'] == 'age' ? 1 : 1e-6);
		// move the points
			update_chart();
	}

// selector for model
	var model_select = d3.select('#menu_control_model')
			  .append('select')
				.attr('id', 'model_select')
				.attr('class', 'select_menu')
				.attr('onchange', 'change_model(this.value)')
				.attr('data-placeholder', 'No models');
	model_select.append('option').attr('value', 'none').text('None').attr('id', 'model_option_none');
  	$('#model_select').chosen({ disable_search_threshold: 100 });

// function to update the list of models
	function refresh_model_list() {
		$.ajax({
			url: 'php/model_list.php?sex=' + settings['sex'] + '&cause=' + settings['cause'].replace(/_/g, '.'),
			dataType: 'json',
			async: false,
			success: function(json) {
			// remove the old menu options
				d3.selectAll('.model_option').remove();
			// add new model options to the menu
				if (json != 'failure') model_select.selectAll()
		  			.data(json)
	  	  		  .enter().append('option')
	  	  		  	.attr('class', 'model_option')
	  	  			.attr('id', function(d) { return 'model_option_' + d.model_number; })
	  	  			.attr('value', function(d) { return d.model_number + '_' + d.corrected; })
	  	  			.text(function(d) { 
	  	  				var dt = new Date(Date.parse(d.upload_time)).toDateString().substr(4);
	  	  				return d.model_name + '   [' + dt + ']'; 
	  	  			})
	  	  			.style('line-height', '13px');
	  	  	// select the corrected model
	  	  		var dd = json.filter(function(d) { return d.corrected == 1; })[0],
	  	  			dflt = (typeof dd != 'undefined' ? json.filter(function(d) { return d.corrected == 1; })[0].model_number : 'none');
	  	  		$('#model_option_' + dflt)[0].selected = true;
	  	  		settings['model'] = dflt + '_1';
			// trigger the update of the select
				$('#model_select').trigger('liszt:updated');
			}
		});	
	}
	refresh_model_list();

// change models
	function change_model(val) {
		settings['model'] = val;
		update_chart();
	}

// bug report button
	menu_panel.append('div')
		.style('top', '500px')
		.style('position', 'absolute')
		.style('width', '220px')
  	  .append('center')
	  	.attr('onclick', 'bug_email()')
  		.attr('class', 'bug_report')
	  	.text('Submit Bug Report');
	function bug_email() {
		var mailto = "mailto:kfor@uw.edu?subject=icodx Bug Report&body=Dear Kyle,%0A%0AI have angered the benevolent icodx gods in the following ways:%0A[Describe the bug you've encountered here]%0A%0A[Insert screenshot here]%0A%0ACurrent settings:%0A" + JSON.stringify(sort_keys(settings), null, '%0A');
		win = window.open(mailto, 'emailWindow');
		if (win && win.open &&!win.closed) win.close();
	}
	function sort_keys(o) {
 		var sorted = {},
    		key, a = [];
	    for (key in o) if (o.hasOwnProperty(key)) a.push(key);
	    a.sort();
	    for (key = 0; key < a.length; key++) sorted[a[key]] = o[a[key]];
    	return sorted;
	}
