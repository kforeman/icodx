<?php
/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		11 February 2012
	Purpose:	Download all the study meta data for a given country
	Parameters:	geo (iso3, or R_# to get all the meta data for a region), start_year
*/

	// load in mysql server configuration
	include 'mysql_config.php';

	// connect to the database
	$link = mysql_connect($host, $username, $password);
	$db = mysql_select_db($db, $link);

	// perform the query
	$rows = array();
	if (substr($_GET['geo'], 0, 2) == 'R_') $result = mysql_query('SELECT iso3,source_id,source,source_type,source_label,icd_vers,national FROM icod_meta LEFT JOIN id_countries USING (iso3) WHERE region='.substr($_GET['geo'], 2).';');
	else $result = mysql_query('SELECT iso3,source_id,source,source_type,source_label,icd_vers,national FROM icod_meta WHERE iso3="'.$_GET['geo'].'";');
	while($row = mysql_fetch_array($result, MYSQL_ASSOC))
    	$rows[] = $row;
		
	// return the results in json format
	if (count($rows)) echo json_encode($rows);
	else echo '[]';
?>