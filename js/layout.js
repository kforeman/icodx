/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		3 January 2012
	Purpose:	Create basic 3 section layout for GBD tool
*/

// parameters for layout
	var menu_width = 220,
		content_width = 800,
		height = 750,
		bg = '#ffffff';

// add the lefthand menu
	body = d3.select('body');
	menu = body.append('div')
		.attr('id', 'menu')
		.style('width', menu_width + 'px')
		.style('height', height + 'px')
		.style('background-color', bg);

// title
	body.append('div')
		.style('width', menu_width + 'px')
		.attr('id', 'title')
	  .append('center')
	  	.text('CoD DB');

// add the righthand content section
	content = body.append('div')
		.attr('id', 'content')
		.style('padding-left', menu_width + 'px')
		.style('width', content_width + 'px')
		.style('height', height + 'px')
		.style('background-color', bg);

// add an svg
	svg = content.append('div')
		.style('height', height + 'px')
	  .append('svg')
		.style('height', height)
		.style('width', content_width)
		.style('background-color', bg);

// add an outline rectangle
	svg.append('rect')
		.attr('x', .5)
		.attr('y', .5)
		.attr('width', (content_width - 1) + 'px')
		.attr('height', (height - 1) + 'px')
		.attr('rx', 4)
		.attr('ry', 4)
		.attr('class', 'content_rect');