<?php
/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		7 February 2012
	Purpose:	Load cause list
*/

	// load in mysql server configuration
	include 'mysql_config.php';

	// connect to the database
	$link = mysql_connect($host, $username, $password);
	$db = mysql_select_db($db, $link);

	// perform the query
	$rows = array();
	$result = mysql_query('SELECT cause, cause_name FROM id_causes ORDER BY cause_sort;');
	while($row = mysql_fetch_array($result, MYSQL_ASSOC))
    	$rows[] = $row;
		
	// return the results in json format
	if (count($rows)) echo json_encode($rows);
	else echo '"failure"';
?>