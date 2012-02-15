<?php
/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		11 February 2012
	Purpose:	Download all the cause fractions for a given cause/country/sex
	Parameters:	cause (old "analytical" cause used by CoD team), sex (1 = Male, 2 = Female), geo (iso3, or R_# to get all the data for a region), start_year
*/

	// load in mysql server configuration
	include 'mysql_config.php';

	// connect to the database
	$link = mysql_connect($host, $username, $password);
	$db = mysql_select_db($db, $link);

	// perform the query
	$rows = array();
	if (substr($_GET['geo'], 0, 2) == 'R_') $result = mysql_query('SELECT iso3 AS geo,year,age,obs_id,source_id,sample_size,cf,cf_raw FROM icod_data LEFT JOIN id_countries USING (iso3) WHERE cause="'.$_GET['cause'].'" AND sex='.$_GET['sex'].' AND region='.substr($_GET['geo'], 2).';');
	else $result = mysql_query('SELECT iso3 AS geo,year,age,obs_id,source_id,sample_size,cf,cf_raw FROM icod_data WHERE cause="'.$_GET['cause'].'" AND sex='.$_GET['sex'].' AND iso3="'.$_GET['geo'].'";');
	while($row = mysql_fetch_array($result, MYSQL_ASSOC))
    	$rows[] = $row;
		
	// return the results in json format
	if (count($rows)) echo json_encode($rows);
	else echo '[]';
?>