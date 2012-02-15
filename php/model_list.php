<?php
/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		11 February 2012
	Purpose:	Load list of models for a given cause/sex
	Parameters:	cause (old "analytical" cause used by CoD team), sex (1 = Male, 2 = Female)
*/

	// load in mysql server configuration
	include 'mysql_config.php';

	// connect to the database
	$link = mysql_connect($host, $username, $password);
	$db = mysql_select_db($db, $link);

	// perform the query
	$rows = array();
	$result = mysql_query('SELECT model_name, model_number, upload_time, corrected FROM m_model_list WHERE cause="'.$_GET['cause'].'" AND sex='.$_GET['sex'].' ORDER BY corrected DESC, upload_time DESC;');
	while($row = mysql_fetch_array($result, MYSQL_ASSOC))
    	$rows[] = $row;
		
	// return the results in json format
	if (count($rows)) echo json_encode($rows);
	else echo '[]';
?>