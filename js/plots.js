/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		12 Feb 2012
	Purpose:	Build the (empty) plots
*/

// spacing tweaks
	var plot_title_offset =	16,
		ts_left_margin = 	35,
		ap_left_margin = 	35,
		ts_right_margin = 	6,
		ap_right_margin = 	6,
		ts_top_margin = 	22,
		ap_top_margin = 	20,
		ts_bottom_margin =	16,
		ap_bottom_margin =	16;

// list of ages
	var ages = [{ age: 0,	name: 'Early Neonatal',	short: 'E'  },
				{ age: .01,	name: 'Late Neonatal',	short: 'L'  },
				{ age: .1,	name: 'Post Neonatal',	short: 'P'	},
				{ age: 1,	name: 'Age 1 to 4',		short: '1'  },
				{ age: 80,	name: 'Age 80 Plus',	short: '80' }]
	d3.range(5, 80, 5).map(function(a) {
		ages.push({ age: a,	name: 'Age ' + a + ' to ' + (a+4),	short: a+'' });
	});
	ages.sort(function(d,e) { return d.age - e.age; });
	var age_lookup = {},
		ordinal_age_lookup = {};
	ages.map(function(a) {
		age_lookup[a.age] = a.name.replace('Age ', '');
		ordinal_age_lookup[a.age] = a.short;
	});

// figure out the spacing of time-series plots
	var num_ts_plots =	ages.length,
		ts_rows = 		Math.ceil(Math.sqrt(num_ts_plots)),
		ts_cols = 		Math.ceil(num_ts_plots / ts_rows),
		ts_width =		content_width / ts_cols,
		ts_height =		height / ts_rows;
	plot_coords = {};
	ages.map(function(a, i) {
		plot_coords[a.age] = {
			x:	(i % ts_cols) * ts_width,
			y:	Math.floor(i / ts_cols) * ts_height
		}
	});

// add a bottom layer on which to put the models
	var model_g = svg.append('g');

// add gs for each ts plot
	var ts_gs = svg.selectAll('ts_g')
		.data(ages)
	  .enter().append('g')
	  	.style('opacity', settings['xaxis'] == 'time' ? 1 : 1e-6)
	  	.attr('id', function(a,i) {
	  		return 'ts_' + i;
	  	});

// add titles for each ts plot
	var ts_titles = ts_gs.append('text')
	  	.attr('x', function(a) { return plot_coords[a.age].x + (ts_width / 2); })
	  	.attr('y', function(a) { return plot_coords[a.age].y + plot_title_offset; })
	  	.text(function(a) { return a.name; })
	  	.attr('class', 'plot_title');

// find the scale ranges for each ts plot
	var x_scales = 	{},
		y_scales = 	{},
		x_axes = 	{},
		y_axes = 	{};
	ages.map(function(a) {
		// x axis (time)
			x_scales[a.age] = 	d3.scale.linear()
				.range([plot_coords[a.age].x + ts_left_margin, plot_coords[a.age].x + ts_width - ts_right_margin])
				.domain([d3.min(years), d3.max(years)+1]);
			x_axes[a.age] = 		d3.svg.axis()
				.scale(x_scales[a.age])
				.orient('bottom')
				.tickSize(3)
				.ticks(4)
				.tickSubdivide(1)
				.tickFormat(d3.format('0000'));
		// y axis (CF/rate/deaths)
			y_scales[a.age] = 	d3.scale.linear()
				.range([plot_coords[a.age].y + ts_height - ts_bottom_margin, plot_coords[a.age].y + ts_top_margin])
				.domain([0,1000])
				.nice();
			y_axes[a.age] = 		d3.svg.axis()
				.scale(y_scales[a.age])
				.orient('left')
				.tickSize(3)
				.ticks(4)
				.tickSubdivide(1)
				.tickFormat(d3.format('0s'));
	});

// draw the ts axes
	var ts_y_labels = [],
		ts_x_labels = [];
	ages.map(function(a,i) {
		ts_x_labels.push(
			d3.select('#ts_' + i)
			  .append('g')
		  		.attr('class', 'axis')
		  		.call(x_axes[a.age])
		  		.attr('transform', 'translate(0,' + (plot_coords[a.age].y + ts_height - ts_bottom_margin) + ')')
		);
		ts_y_labels.push(
			d3.select('#ts_' + i)
			  .append('g')
		  		.attr('class', 'axis')
		  		.call(y_axes[a.age])
		  		.attr('transform', 'translate(' + (plot_coords[a.age].x + ts_left_margin) + ',0)')
		);
	});

// list of semidecades
	var semidecades = [];
	d3.range(d3.min(years), 2010, 5).map(function(s) {
		semidecades.push({ sd: s,	name: s + ' to ' + (s+4) });
	});
	semidecades.push({ sd: 2010,	name: '2010 and later' });

// figure out the spacing of age-pattern plots
	var num_ap_plots =	semidecades.length,
		ap_rows = 		Math.ceil(Math.sqrt(num_ap_plots)),
		ap_cols = 		Math.ceil(num_ap_plots / ap_rows),
		ap_width =		content_width / ap_cols,
		ap_height =		height / ap_rows;
	semidecades.map(function(s, i) {
		plot_coords[s.sd] = {
			x:	(i % ap_cols) * ap_width,
			y:	Math.floor(i / ap_cols) * ap_height
		}
	});
	ordinal_ages = [];
	ages.map(function(a) {
		ordinal_ages.push(a.short);
	});

// add gs for each ap plot
	var ap_gs = svg.selectAll('ap_g')
		.data(semidecades)
	  .enter().append('g')
	  	.style('opacity', settings['xaxis'] == 'age' ? 1 : 1e-6)
	  	.attr('id', function(s, i) {
	  		return 'ap_' + i;
	  	});

// add titles for each ap plot
	var ap_titles = ap_gs.append('text')
	  	.attr('x', function(s) { return plot_coords[s.sd].x + (ap_width / 2); })
	  	.attr('y', function(s) { return plot_coords[s.sd].y + plot_title_offset; })
	  	.text(function(s) { return s.name; })
	  	.attr('class', 'plot_title');

// find the scale ranges for each ap plot
	semidecades.map(function(s) {
		// x axis (age)
			x_scales[s.sd] = 	d3.scale.ordinal()
				.domain(ordinal_ages)
				.rangePoints([plot_coords[s.sd].x + ap_left_margin, plot_coords[s.sd].x + ap_width - ap_right_margin]);
			x_axes[s.sd] = 		d3.svg.axisCustom()
				.scale(x_scales[s.sd])
				.tickSize(3)
				.orient('bottom');
		// y axis (CF/rate/deaths)
			y_scales[s.sd] = 	d3.scale.linear()
				.range([plot_coords[s.sd].y + ap_height - ap_bottom_margin, plot_coords[s.sd].y + ap_top_margin])
				.domain([0,1000])
				.nice();
			y_axes[s.sd] = 		d3.svg.axis()
				.scale(y_scales[s.sd])
				.orient('left')
				.tickSize(3)
				.ticks(4)
				.tickSubdivide(1)
				.tickFormat(d3.format('0s'));
	});

// draw the ap axes
	var ap_y_labels = [],
		ap_x_labels = [];
	semidecades.map(function(s,i) {
		ap_x_labels.push(
			d3.select('#ap_' + i)
			  .append('g')
		  		.attr('class', 'axis')
		  		.call(x_axes[s.sd])
		  		.attr('transform', 'translate(0,' + (plot_coords[s.sd].y + ap_height - ap_bottom_margin) + ')')
		);
		ap_y_labels.push(
			d3.select('#ap_' + i)
			  .append('g')
		  		.attr('class', 'axis')
		  		.call(y_axes[s.sd])
		  		.attr('transform', 'translate(' + (plot_coords[s.sd].x + ap_left_margin) + ',0)')
		);
	});

// functions to find the proper location of any datapoint
	function find_x(time, age) {
		return x_scales[settings['xaxis'] == 'age' ? Math.floor(time / 5) * 5 : age](settings['xaxis'] == 'age' ? ordinal_age_lookup[age] : time);
	}
	function find_y(value, time, age) {
		return y_scales[settings['xaxis'] == 'age' ? Math.floor(time / 5) * 5 : age](value);
	}

// load in the initial data
	var plotme = retrieve_cause_fractions(settings['geo'], settings['sex'], settings['cause']);
	plotme.map(function(d,i) {
		var pe = retrieve_pop_env(d.geo, settings['sex'], parseFloat(d.age), parseInt(d.year))
		plotme[i]['pop'] = pe.pop;
		plotme[i]['env'] = pe.env;
	});

// function to find the value of a datapoint in the correct units
	function find_value(d, dt, u) {
		// use current settings if data type and unit not specified
			if (!dt) var dt = settings['data'];
			if (!u)  var u =  settings['unit'];
		// figure out if we're using raw or adjusted
			if (dt == 'raw') var cf = parseFloat(d.cf_raw);
			else var cf = parseFloat(d.cf);
		// scale up to the envelope if necessary
			if (u == 'prop') 		return cf;
			else if (u == 'num') 	return cf * d.env;
			else if (u == 'rate')	return cf * d.env / d.pop * 100000;
	}

// function to format ticks correctly based on the units and maximum scale value
	function tick_formatter(max) {
		if (settings['unit'] == 'prop') {
			if (max <= .0005) return d3.format('.2%');
			else if (max <= .005) return d3.format('.1%');
			else if (max <= .05) return d3.format('.1%');
			else return d3.format('.0%');
		}
		else {
			if (max <= .5) return d3.format('.2f');
			else if (max < 5) return d3.format('.1f');
			else if (max <= 1000) return d3.format('.0f');
			else return d3.format('s');
		}
	}

// load in model results
	var mm = 	settings['model'].split('_'),
		model = retrieve_model_results(mm[0], mm[1], settings['geo']),
		ma =	model_ages[mm[0] + '_' + mm[1]],
		my =	model_years[mm[0] + '_' + mm[1]];

// find model results in correct units
	function find_model_estimates(age, year) {
		var pe = 	retrieve_pop_env(settings['geo'], settings['sex'], age, year),
			cf =	model[year][age],
			env =	(mm[1] == 1 ? pe.env_corr : pe.env);
		if (settings['unit'] == 'prop')			return { u: cf.upper, l: cf.lower, m: cf.mean };
		else if (settings['unit'] == 'num') 	return { u: cf.upper * env, l: cf.lower * env, m: cf.mean * env };
		else if (settings['unit'] == 'rate') 	return { u: cf.upper * env / pe.pop * 100000, l: cf.lower * env / pe.pop * 100000, m: cf.mean * env / pe.pop * 100000 };
	}

// adjust the axis domains to reflect the data
	function update_axes() {
		// update the ap plots
		semidecades.map(function(s, i) {
			// find all the data for this ap plot
				var dat = plotme.filter(function(d) {
					return Math.floor(parseInt(d.year) / 5) * 5 == s.sd;
				});
			// find maximum value
				var max = 	d3.max(dat, function(d) {
								return find_value(d);
							});
				if (settings['unit'] == 'cf') {
					if (max < .0001) max = .0001;	
				}
				else {
					if (max < .1) max = .1;	
				}
			// if there's modeled data for this set of years, also check that for a higher max
				if (my.indexOf(s.sd + (s.sd == 2010 ? 1 : 2)) > -1) {
					var mdat = [];
					ma.map(function(a) {
						mdat.push(find_model_estimates(a, s.sd + (s.sd == 2010 ? 1 : 2)).u)
					});
					var mmax = d3.max(mdat);
					max = d3.max([max, mmax]);
				}
			// update the scales
				y_scales[s.sd].domain([0, max]).nice();
			// redraw the axes
				y_axes[s.sd].scale(y_scales[s.sd])
					.tickFormat(tick_formatter(max));
				ap_y_labels[i].transition().duration(1000).call(y_axes[s.sd]);
		});
		// update the ts plots
		ages.map(function(a, i) {
			// find all the data for this ts plot
				var dat = plotme.filter(function(d) {
					return parseFloat(d.age) == a.age;
				});
			// find maximum value
				var max = 	d3.max(dat, function(d) {
								return find_value(d);
							});
				if (settings['unit'] == 'prop') {
					if (max < .0001) max = .0001;	
				}
				else {
					if (max < .1) max = .1;	
				}
			// if there's modeled data for this age, also check that for a higher max
				if (ma.indexOf(a.age) > -1) {
					var mdat = [];
					my.map(function(y) {
						mdat.push(find_model_estimates(a.age, y).u)
					});
					var mmax = d3.max(mdat);
					max = d3.max([max, mmax]);
				}
			// update the scales
				y_scales[a.age].domain([0, max]).nice();
			// redraw the axes
				y_axes[a.age].scale(y_scales[a.age])
					.tickFormat(tick_formatter(max));
				ts_y_labels[i].transition().duration(1000).call(y_axes[a.age]);
		});
	}
	update_axes();

// path generator functions
	var lg = d3.svg.line().interpolate('cardinal'),
		ag = d3.svg.area().interpolate('cardinal').x(function(d) { return d[0]; }).y0(function(d) { return d[1]; }).y1(function(d) { return d[2]; });

// plot the model time-series
	function m_ts_area_gen(age, years) {
		var dt = [];
		years.map(function(y) {
			dt.push([x_scales[age](y), y_scales[age](find_model_estimates(age, y).l), y_scales[age](find_model_estimates(age, y).u)])
		});
		return ag(dt);
	}
	m_ts_area = model_g.selectAll('m_ts')
		.data(ma, function(a) { return a; })
  	  .enter().append('path')
  	  	.attr('d', function(d) {
  	  		return m_ts_area_gen(d, my);
  	  	})
  	  	.style('stroke', 'none')
  	  	.style('fill', d3.rgb(178, 226, 226))
  	  	.style('fill-opacity', settings['xaxis'] == 'time' ? 1 : 1e-6);
	function m_ts_line_gen(age, years) {
		var dt = [];
		years.map(function(y) {
			dt.push([x_scales[age](y), y_scales[age](find_model_estimates(age, y).m)])
		});
		return lg(dt);
	}
	m_ts_line = model_g.selectAll('m_ts')
		.data(ma, function(a) { return a; })
  	  .enter().append('path')
  	  	.attr('d', function(d) {
  	  		return m_ts_line_gen(d, my);
  	  	})
  	  	.style('stroke', d3.rgb(44, 162, 95))
  	  	.style('stroke-width', '2')
  	  	.style('fill', 'none')
  	  	.style('stroke-opacity', settings['xaxis'] == 'time' ? 1 : 1e-6);

// plot the model age-pattern
	function m_ap_area_gen(y, ages) {
		var da = [];
		ages.map(function(a) {
			da.push([x_scales[y](ordinal_age_lookup[a]), y_scales[y](find_model_estimates(a, y).l), y_scales[y](find_model_estimates(a, y).u)])
		});
		return ag(da);
	}
	m_ap_area = model_g.selectAll('m_ap')
		.data(my.filter(function(y) { return (y % 5) == 0 }), function(y) { return y; })
  	  .enter().append('path')
  	  	.attr('d', function(d) {
  	  		return m_ap_area_gen(d, ma);
  	  	})
  	  	.style('stroke', 'none')
  	  	.style('fill', d3.rgb(178, 226, 226))
  	  	.style('fill-opacity', settings['xaxis'] == 'age' ? 1 : 1e-6);
	function m_ap_line_gen(y, ages) {
		var da = [];
		ages.map(function(a) {
			da.push([x_scales[y](ordinal_age_lookup[a]), y_scales[y](find_model_estimates(a, y).m)])
		});
		return lg(da);
	}
	m_ap_line = model_g.selectAll('m_ap')
		.data(my.filter(function(y) { return (y % 5) == 0 }), function(y) { return y; })
  	  .enter().append('path')
  	  	.attr('d', function(d) {
  	  		return m_ap_line_gen(d, ma);
  	  	})
  	  	.style('stroke', d3.rgb(44, 162, 95))
  	  	.style('stroke-width', '2')
  	  	.style('fill', 'none')
  	  	.style('stroke-opacity', settings['xaxis'] == 'age' ? 1 : 1e-6);

// function to return the correct shape for a given datapoint
	var dot_size = 	32,
		circle = 	d3.svg.symbol().type('circle'),
		square = 	d3.svg.symbol().type('square'),
		triangle = 	d3.svg.symbol().type('triangle-down'),
		cross = 	d3.svg.symbol().type('cross');
	function find_shape(source_id, obs_id, big) {
		// first check to see if it's an outlier
			if (typeof outliers[obs_id + '_' + settings['cause']] != 'undefined') {
				if (outliers[obs_id + '_' + settings['cause']].outlier == 1) return cross.size(big ? dot_size*2 : dot_size)();	
			}
		// otherwise use the source type
			else {
				switch(retrieve_meta_data(source_id, settings['geo']).source_type) {
					case 'VR':	return circle.size(big ? dot_size*2 : dot_size)();		break;
					case 'VA':	return triangle.size(big ? dot_size*2 : dot_size)();	break;
					default:	return square.size(big ? dot_size*2 : dot_size)();		break;
				}
			}
	}

// plot the data
	var dots = svg.selectAll('dots')
		.data(plotme, function(d) { return d.source_id + '_' + d.age; })
	  .enter().append('path')
	  	.attr('class', function(d) { return 'dot source_' + d.source_id + ' obs_' + d.obs_id; })
	    .attr('transform', function(d) {
	    	return 'translate(' + find_x(parseInt(d.year), parseFloat(d.age)) + ',' + find_y(find_value(d), parseInt(d.year), parseFloat(d.age)) + ')' + (typeof outliers[d.obs_id + '_' + settings['cause']] != 'undefined' ? (outliers[d.obs_id + '_' + settings['cause']].outlier == 1 ? ',rotate(45)' : '') : '');
	    })
	    .attr('d', function(d) {
	    	return find_shape(d.source_id, d.obs_id);
	    })
	    .on('mouseover', highlight)
	    .on('mouseout', unhighlight)
	    .style('fill', d3.rgb(49, 130, 189))
	    .style('fill-opacity', 1e-6)
	    .style('stroke', 'black')
	    .attr('title', function(d) {
	    	return tooltip(d);
	    });

// add tooltips
	$('.dot').poshytip({
		slide: false,
		fade: false,
		showTimeout: 0, 
		hideTimeout: 0, 
		className: 'tip-ihme',
		alignX: 'center',
		alignY: 'top',
		alignTo: 'cursor',
		offsetY: 10
	});
	

// highlight a study on mouse over
	function highlight(d) {
		d3.selectAll('.source_' + d.source_id)
			.transition().duration(100)
			.style('fill-opacity', 1)
			.attr('d', function(d) {
				return find_shape(d.source_id, d.obs_id, 'big');
			});
	}

// remove highlighting on mouse out
	function unhighlight(d) {
		d3.selectAll('.source_' + d.source_id)
			.transition().duration(500)
			.style('fill-opacity', 1e-6)
			.attr('d', function(d) {
				return find_shape(d.source_id, d.obs_id);
			});
	}

// update the chart with new data
	function update_chart() {
		// update the data
			plotme = retrieve_cause_fractions(settings['geo'], settings['sex'], settings['cause']);
			plotme.map(function(d,i) {
				var pe = retrieve_pop_env(d.geo, settings['sex'], parseFloat(d.age), parseInt(d.year))
				plotme[i]['pop'] = pe.pop;
				plotme[i]['env'] = pe.env;
			});
			
		// update the model results
			mm = 	settings['model'].split('_');
			model = retrieve_model_results(mm[0], mm[1], settings['geo']);
			ma =	model_ages[mm[0] + '_' + mm[1]];
			my =	model_years[mm[0] + '_' + mm[1]];
			
		// update the axes
			update_axes();
			
		// rebind new data to the plot
			dots = dots.data(plotme, function(d) { return d.source_id + '_' + d.age; });
		
		// insert new points
			dots.enter().append('path')
				.attr('class', function(d) { return 'dot source_' + d.source_id + ' obs_' + d.obs_id; })
			    .attr('transform', function(d) {
	    			return 'translate(' + find_x(parseInt(d.year), parseFloat(d.age)) + ',' + find_y(find_value(d), parseInt(d.year), parseFloat(d.age)) + ')' + (typeof outliers[d.obs_id + '_' + settings['cause']] != 'undefined' ? (outliers[d.obs_id + '_' + settings['cause']].outlier == 1 ? 'rotate(45)' : '') : '');
	   			})
			    .attr('d', function(d) {
			    	return find_shape(d.source_id, d.obs_id);
			    })
			    .on('mouseover', highlight)
			    .on('mouseout', unhighlight)
			    .style('fill', d3.rgb(49, 130, 189))
			    .style('fill-opacity', 1e-6)
			    .style('stroke-opacity', 1e-6)
			    .style('stroke', 'black')
			    .attr('title', function(d) {
	    			return tooltip(d);
	    		});
		// move existing points
			dots.transition().duration(1000)
				.attr('transform', function(d) {
	    			return 'translate(' + find_x(parseInt(d.year), parseFloat(d.age)) + ',' + find_y(find_value(d), parseInt(d.year), parseFloat(d.age)) + ')' + (typeof outliers[d.obs_id + '_' + settings['cause']] != 'undefined' ? (outliers[d.obs_id + '_' + settings['cause']].outlier == 1 ? 'rotate(45)' : '') : '');
			    })
			    .style('stroke-opacity', 1)
			    .attr('title', function(d) {
	    			return tooltip(d);
	    		})
			  .transition().delay(1000)
			  	.style('visibility', function(d) {
			  		return isNaN(find_value(d)) ? 'hidden' : 'visible';
			  	});
		// remove points that no longer exist
			dots.exit().transition().duration(1000)
				.style('stroke-opacity', 1e-6)
				.remove();
		// update tooltips
			$('.dot').poshytip('destroy');
			$('.dot').poshytip({
				slide: false,
				fade: false,
				showTimeout: 0, 
				hideTimeout: 0, 
				className: 'tip-ihme',
				alignX: 'center',
				alignY: 'top',
				alignTo: 'cursor',
				offsetY: 10
			});
		
		// update the time series model results
			if (settings['xaxis'] == 'time') {
				m_ts_area = m_ts_area.data(ma, function(a) { return a; })
				m_ts_area.enter().append('path')
		  	  		.attr('d', function(d) {
		  	  			return m_ts_area_gen(d, my);
		  	  		})
	  	  			.style('stroke', 'none')
	  	  			.style('fill-opacity', 1)
	  	  			.style('fill', d3.rgb(178, 226, 226));
	  	  		m_ts_area.transition().duration(1000)
	  	  			.attr('d', function(d) {
		  	  			return m_ts_area_gen(d, my);
		  	  		})
		  	  		.style('fill-opacity', 1);
		  	  	m_ts_area.exit().transition().duration(1000)
		  	  		.style('fill-opacity', 1e-6)
		  	  		.remove();
				m_ts_line = m_ts_line.data(ma, function(a) { return a; })
	  	  		m_ts_line.enter().append('path')
			  	  	.attr('d', function(d) {
			  	  		return m_ts_line_gen(d, my);
			  	  	})
			  	  	.style('stroke', d3.rgb(44, 162, 95))
			  	  	.style('stroke-width', '2')
			  	  	.style('stroke-opacity', 1)
			  	  	.style('fill', 'none');
			  	m_ts_line.transition().duration(1000)
			  		.attr('d', function(d) {
			  	  		return m_ts_line_gen(d, my);
			  	  	})
			  	  	.style('stroke-opacity', 1);
			  	m_ts_line.exit().transition().duration(1000)
			  		.style('stroke-opacity', 1e-6)
			  		.remove();			
			}
			else {
				m_ts_area.transition().duration(500).style('fill-opacity', 1e-6);
				m_ts_line.transition().duration(500).style('stroke-opacity', 1e-6);
			}
			
		// update the age pattern model results
			if (settings['xaxis'] == 'age') {
				m_ap_area = m_ap_area.data(my.filter(function(y) { return (y % 5) == 0 }), function(y) { return y; })
				m_ap_area.enter().append('path')
		  	  		.attr('d', function(d) {
		  	  			return m_ap_area_gen(d, ma);
		  	  		})
	  	  			.style('stroke', 'none')
	  	  			.style('fill-opacity', 1)
	  	  			.style('fill', d3.rgb(178, 226, 226));
	  	  		m_ap_area.transition().duration(1000)
	  	  			.attr('d', function(d) {
		  	  			return m_ap_area_gen(d, ma);
		  	  		})
		  	  		.style('fill-opacity', 1);
		  	  	m_ap_area.exit().transition().duration(1000)
		  	  		.style('fill-opacity', 1e-6)
		  	  		.remove();
				m_ap_line = m_ap_line.data(my.filter(function(y) { return (y % 5) == 0 }), function(y) { return y; })
	  	  		m_ap_line.enter().append('path')
			  	  	.attr('d', function(d) {
			  	  		return m_ap_line_gen(d, ma);
			  	  	})
			  	  	.style('stroke', d3.rgb(44, 162, 95))
			  	  	.style('stroke-width', '2')
			  	  	.style('stroke-opacity', 1)
			  	  	.style('fill', 'none');
			  	m_ap_line.transition().duration(1000)
			  		.attr('d', function(d) {
			  	  		return m_ap_line_gen(d, ma);
			  	  	})
			  	  	.style('stroke-opacity', 1);
			  	m_ap_line.exit().transition().duration(1000)
			  		.style('stroke-opacity', 1e-6)
			  		.remove();			
			}
			else {
				m_ap_area.transition().duration(500).style('fill-opacity', 1e-6);
				m_ap_line.transition().duration(500).style('stroke-opacity', 1e-6);
			}			
	}
