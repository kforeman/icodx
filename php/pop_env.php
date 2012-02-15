<?php
/*	Author:		Kyle Foreman (kforeman@post.harvard.edu)
	Date:		12 February 2012
	Purpose:	Download the populations/envelopes for a country/sex
	Parameters:	sex (1 = Male, 2 = Female), geo (iso3, or R_# to get all the data for a region), start_year
*/

	// load in mysql server configuration
	include 'mysql_config.php';

	// connect to the database
	$link = mysql_connect($host, $username, $password);
	$db = mysql_select_db($db, $link);

	// perform the query
	$rows = array();
	if (substr($_GET['geo'], 0, 2) == 'R_') $result = mysql_query('SELECT CONCAT("R_", CAST(region AS CHAR)) AS geo,year,age,pop,envelope,envelope_deaths AS env_corr FROM id_populations_region LEFT JOIN id_envelopes_region USING (region,year,sex,age) LEFT JOIN m_envelopes_by_region USING (region,year,sex,age) WHERE sex='.$_GET['sex'].' AND region='.substr($_GET['geo'], 2).' AND age<=80;');
	else $result = mysql_query('SELECT iso3 AS geo,year,age,pop,envelope,envelope_deaths AS env_corr FROM id_populations LEFT JOIN id_envelopes USING (iso3,year,sex,age) LEFT JOIN m_envelopes_by_country USING (iso3,year,sex,age) WHERE sex='.$_GET['sex'].' AND iso3="'.$_GET['geo'].'" AND age<=80;');
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) $rows[] = $row;
		
	// return the results in json format
	if (count($rows)) echo json_encode($rows);
	else echo '[]';
?>