/**
 * Combines data sources.
 */

var path = require('path');
var os = require('os');
var fs = require('fs');
var _ = require('lodash');

// Get data
var countyGeo = require('../build/county2012-4326.geo.json');
var turnoutSummary = require('../build/turnout_summary.json');
var turnoutDetail = require('../build/turnout_detail.json');

// Define some vars
var outputFile = path.join(__dirname, '../county_turnout.geo.json');

// Process
turnoutSummary = _.map(turnoutSummary, function(s, si) {
  /*
  { '2008.0': '0.728822381262',
  '2012.0': '0.693706293706',
  County: 'Yellow Medicine',
  '2010.0': '0.528020240354',
  'Registration Rate (Nov 3, 2014)': '0.685337093053',
  '2014.0': '0.515124327096' }
  */
  return {
    t2008: parseFloat(s['2008.0']),
    t2010: parseFloat(s['2010.0']),
    t2012: parseFloat(s['2012.0']),
    t2014: parseFloat(s['2014.0']),
    r20141103: parseFloat(s['Registration Rate (Nov 3, 2014)']),
    county: s['County'],
    county_id: s['County'].replace(/\W/g, '').toLowerCase()
  };
});

// Detail does not seem to be needed
// There are some empty rows.
turnoutDetail = _.filter(turnoutDetail, function(d, di) {
  return !!d['2010 Turnout Percent'];
});
turnoutDetail = _.map(turnoutDetail, function(d, di) {
});

// GeoJson match up
countyGeo.features = _.map(countyGeo.features, function(f, fi) {
  var county_id = f.properties.NAME.replace(/\W/g, '').toLowerCase();
  var turnout = _.findWhere(turnoutSummary, { county_id: county_id });

  if (!turnout) {
    console.log(d.properties);
  }
  else {
    f.properties = _.extend(f.properties, turnout);
  }

  return f;
});


// Write out file
fs.writeFile(outputFile, JSON.stringify(countyGeo), function(error) {
  if (error) {
    console.log('Error when saving.');
    console.error(error);
  }
  else {
    console.log('Combined county data.');
  }
});
