<?php
/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		11 February 2012
	Purpose:	Download all the cause fractions for a given cause/country/sex
	Parameters:	model_number, corrected (whether or not model has been scaled to envelope), geo (iso3, or R_# to get all the data for a region)
*/

	// load in mysql server configuration
	include 'mysql_config.php';

	// connect to the database
	$link = mysql_connect($host, $username, $password);
	$db = mysql_select_db($db, $link);

	// perform the query
	$rows = array();
	if (substr($_GET['geo'], 0, 2) == 'R_') {
		if ($_GET['corrected'] == 1) $result = mysql_query('SELECT CONCAT("R_", CAST(region AS CHAR)) AS geo,year,age,mean_cf_death AS mean,upper_cf_death AS upper,lower_cf_death AS lower FROM g_region WHERE model_number='.$_GET['model_number'].' AND region='.substr($_GET['geo'], 2).' AND age <= 80 AND year < 9999');	
		else $result = mysql_query('SELECT CONCAT("R_", CAST(region AS CHAR)) AS geo,year,age,mean_cf_estimate AS mean,upper_cf_estimate AS upper,lower_cf_estimate AS lower FROM m_models_by_region WHERE model_number='.$_GET['model_number'].' AND region='.substr($_GET['geo'], 2).' AND age <= 80;');	
	}
	else {
		if ($_GET['corrected'] == 1) $result = mysql_query('SELECT year,age,mean_cf_death AS mean,upper_cf_death AS upper,lower_cf_death AS lower FROM g_country WHERE model_number='.$_GET['model_number'].' AND iso3="'.$_GET['geo'].'" AND age <= 80 AND year < 9999;');
		else $result = mysql_query('SELECT year,age,mean_cf_estimate AS mean,upper_cf_estimate AS upper,lower_cf_estimate AS lower FROM m_models_by_country WHERE model_number='.$_GET['model_number'].' AND iso3="'.$_GET['geo'].'" AND age <= 80;');	
	}
	while($row = mysql_fetch_array($result, MYSQL_ASSOC))
    	$rows[] = $row;
		
	// return the results in json format
	if (count($rows)) echo json_encode($rows);
	else echo '[]';
?>