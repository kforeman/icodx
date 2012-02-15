<?php
/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		9 January 2012
	Purpose:	Load data from mysql for treemaps
	Arguments:	geo_sex, metric
*/

	// load in mysql server configuration
	include 'mysql_config.php';

	// connect to the database
	$link = mysql_connect($host, $username, $password);
	$db = mysql_select_db($db, $link);
	
	// figure out which columns to grab
	$result = mysql_query('DESC gbd_cfs'); 
	$columns = array(); 
	while (list($column) = mysql_fetch_array($result))
  		if (substr($column,0,(strlen($_GET['metric'])+2)) == $_GET['metric'].'_m') 
    		$columns[] = $column.' AS m'.substr($column,(strlen($_GET['metric'])+3)); 
	$columns = join(',',$columns);

	// perform the query
	$rows = array();
	//$result = mysql_query('SELECT cause_viz,'.$columns.' FROM gbd_cfs LEFT JOIN gbd_causes USING (cause_viz) WHERE geo_sex="'.$_GET['geo_sex'].'" AND leaf=1;');
	$result = mysql_query('SELECT cause_viz,'.$columns.' FROM gbd_cfs WHERE geo_sex="'.$_GET['geo_sex'].'";');
	while($row = mysql_fetch_array($result, MYSQL_ASSOC))
    	$rows[] = $row;
    
    // return the results
	if (count($rows)) echo json_encode($rows);
	else echo '"failure"';
?>