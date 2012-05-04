/*
Author:		Kyle Foreman
Date:		18 February 2012
Updated:	18 February 2012
Purpose:	Download the current CoD database and save it into csv files for offline access
*/

// output directory
global out_dir "/home/j/Project/Causes of Death/Sandbox/icodx"

// make subdirectories
capture mkdir "$out_dir/parameters/"
capture mkdir "$out_dir/pop_env/"
capture mkdir "$out_dir/models/"
capture mkdir "$out_dir/data/"
capture mkdir "$out_dir/meta_data/"

// setup stata
clear
set mem 20g
set maxvar 30000
set more off
set odbcmgr unixodbc
global dsn CODMOD

// cause list
odbc load, exec("SELECT cause, cause_name FROM id_causes ORDER BY cause_sort;") dsn($dsn) clear
outsheet using "$out_dir/parameters/cause_list.csv", comma replace
levelsof cause, local(causes) c

// model list (corrected only!)
odbc load, exec("SELECT model_name, model_number, upload_time, corrected, cause, sex FROM m_model_list WHERE corrected=1;") dsn($dsn) clear
foreach c of local causes {
	capture mkdir "$out_dir/models/`c'/"
	local cc = subinstr("`c'", ".", "_", .)
	foreach s in 1 2 {
		preserve
		capture mkdir "$out_dir/models/`c'/`s'/"
		keep if cause == "`c'" & sex == `s'
		levelsof model_number, l(mod_`cc'_s`s') c
		outsheet model_name model_number upload_time corrected using "$out_dir/models/`c'/`s'/model_list.csv", comma replace
		restore
	}
}

// model results
foreach c of local causes {
	local cc = subinstr("`c'", ".",  "_", .)
	foreach s in 1 2 {
		display "`c', `s', `mod_`cc'_s`s''"
		if missing("`mod_`cc'_s`s''") continue
		odbc load, exec("SELECT iso3,year,age,mean_cf_corrected AS mean, upper_cf_corrected AS upper, lower_cf_corrected AS lower FROM g_country WHERE model_number=`mod_`cc'_s`s'' AND year<9999 AND age<=80") dsn($dsn) clear
		keep if age <= 80
		if _N == 0 continue
		levelsof iso3, l(isos) c
		foreach i of local isos {
			preserve
			keep if iso3 == "`i'"
			outsheet year age mean upper lower using "$out_dir/models/`c'/`s'/results_`mod_`cc'_s`s''_`i'.csv", comma replace
			restore
		}
		odbc load, exec("SELECT CONCAT('R_', CAST(region AS char)) AS region,year,age,mean_cf_corrected AS mean, upper_cf_corrected AS upper, lower_cf_corrected AS lower FROM g_region WHERE model_number=`mod_`cc'_s`s'' AND year<9999 AND age<=80") dsn($dsn) clear
		keep if age <= 80
		levelsof region, l(regions) c
		foreach r of local regions {
			preserve
			keep if region == "`r'"
			outsheet year age mean upper lower using "$out_dir/models/`c'/`s'/results_`mod_`cc'_s`s''_`r'.csv", comma replace
			restore
		}
	}
}

// envelopes
odbc load, exec("SELECT iso3 AS geo,year,age,pop,envelope,envelope_death AS env_corr FROM id_populations LEFT JOIN id_envelopes USING (iso3,year,sex,age) LEFT JOIN e_country USING (iso3,year,sex,age) WHERE  age<=80 AND year < 9999;") dsn($dsn) clear
keep if age <= 80
levelsof geo, l(geos) c
foreach g of local geos {
	capture mkdir "$out_dir/pop_env/`g'/"
	foreach s in 1 2 {
		capture mkdir "$out_dir/pop_env/`g'/`s'/"
		preserve
		keep if sex == `s' & geo == "`g'"
		outsheet geo year age pop envelope env_corr using "$out_dir/pop_env/`g'/`s'/pop_env.csv", comma replace
		restore
	}
}
odbc load, exec("SELECT CONCAT('R_', CAST(region AS CHAR)) AS geo,year,age,pop,envelope,envelope_death AS env_corr FROM id_populations_region LEFT JOIN id_envelopes_region USING (region,year,sex,age) LEFT JOIN e_region USING (region,year,sex,age) WHERE age<=80 AND year < 9999;") dsn($dsn) clear
keep if age <= 80
levelsof geo, l(geos) c
foreach g of local geos {
	capture mkdir "$out_dir/pop_env/`g'/"
	foreach s in 1 2 {
		capture mkdir "$out_dir/pop_env/`g'/`s'/"
		preserve
		keep if sex == `s' & geo == "`g'"
		outsheet geo year age pop envelope env_corr using "$out_dir/pop_env/`g'/`s'/pop_env.csv", comma replace
		restore
	}
}

// outliers
odbc load, exec("SELECT * from all_outliers;") dsn($dsn) clear
capture mkdir "$out_dir/outliers"
outsheet using "$out_dir/outliers/outliers.csv", comma replace

// data
foreach c of local causes {
	capture mkdir "$out_dir/data/`c'/"
	foreach s in 1 2 {	
		capture mkdir "$out_dir/data/`c'/`s'/"
		odbc load, exec("SELECT iso3 AS geo, year, age, obs_id, source_id, sample_size, cf, cf_raw FROM icod_data WHERE cause='`c'' AND sex=`s';") dsn($dsn) clear
		if _N == 0 continue
		levelsof geo, l(geos) c
		foreach g of local geos {
			preserve
			keep if geo == "`g'"
			outsheet using "$out_dir/data/`c'/`s'/data_`g'.csv", comma replace
			restore
		}
	}
}

// meta data
odbc load, exec("SELECT iso3, source_id, source, source_type, source_label, icd_vers, national FROM icod_meta;") dsn($dsn) clear
levelsof iso3, local(isos) c
foreach i of local isos {
	preserve
	keep if iso3 == "`i'"
	outsheet using "$out_dir/meta_data/meta_data_`i'.csv", comma replace
	restore
}

