/**
 * Main application file for: minnpost-voter-turnout-map-2014
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

// Create main application
require([
  'jquery', 'underscore', 'backbone', 'lazyload', 'ractive', 'ractive-backbone', 'ractive-events-tap', 'mapbox', 'mpConfig', 'mpFormatters', 'mpMaps', 
  'base',
  
  
  'text!templates/application.mustache'
], function(
  $, _, Backbone, Lazyload, Ractive, RactiveBackbone, RactiveEventsTap, L, mpConfig, mpFormatters, mpMaps, 
  Base,
  
  
  tApplication
  ) {
  'use strict';

  // Create new class for app
  var App = Base.BaseApp.extend({

    defaults: {
      name: 'minnpost-voter-turnout-map-2014',
      el: '.minnpost-voter-turnout-map-2014-container'
    },

    initialize: function() {
      var thisApp = this;

      
      // Create main application view
      this.mainView = new Ractive({
        el: this.$el,
        template: tApplication,
        data: {
        },
        partials: {
        }
      });
      

      
      // Run examples.  Please remove for real application.
      //
      // Because of how Ractive initializes and how Highcharts work
      // there is an inconsitency of when the container for the chart
      // is ready and when highcharts loads the chart.  So, we put a bit of
      // of a pause.
      //
      // In production, intializing a chart should be tied to data which
      // can be used with a Ractive observer.
      //
      // This should not happen with underscore templates.
      _.delay(function() { thisApp.makeExamples(); }, 400);
      
    },

    
    // Make some example depending on what parts were asked for in the
    // templating process.  Remove, rename, or alter this.
    makeExamples: function() {
      

      

      
      var markerMap = mpMaps.makeLeafletMap('example-markers-features-map');
      var tooltipControl = new mpMaps.TooltipControl();
      markerMap.setZoom(9);
      markerMap.addControl(tooltipControl);

      // Markers
      var iconCinema = mpMaps.makeMakiIcon('cinema', 'm');
      var iconBlank = mpMaps.makeMakiIcon('', 's', '222222');
      L.marker(mpMaps.minneapolisPoint, { icon: iconCinema })
        .addTo(markerMap).bindPopup('Minneapolis', {
          closeButton: false
        });
      L.marker(mpMaps.stPaulPoint, { icon: iconBlank })
        .addTo(markerMap).bindPopup('St. Paul', {
          closeButton: false
        });

      // GeoJSON example
      $.getJSON('//boundaries.minnpost.com/1.0/boundary/27-county-2010/?callback=?', function(data) {
        if (data.simple_shape) {
          L.geoJson(data.simple_shape, {
            style: mpMaps.mapStyle,
            onEachFeature: function(feature, layer) {
              layer.on('mouseover', function(e) {
                tooltipControl.update('Hennepin County');
              });
              layer.on('mouseout', function(e) {
                tooltipControl.hide();
              });
            }
          }).addTo(markerMap);
        }
      });
      
    },
    
  });

  // Create instance and return
  return new App({});
});
