/**
 * Main application file for: minnpost-voter-turnout-map-2014
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

// Create main application
require([
  'jquery', 'underscore', 'backbone', 'lazyload', 'ractive',
  'ractive-backbone', 'ractive-events-tap', 'mapbox',
  'mpConfig', 'mpFormatters', 'mpMaps', 'base',
  'text!templates/application.mustache',
  'text!templates/tooltip.underscore'
], function(
  $, _, Backbone, Lazyload, Ractive, RactiveBackbone,
  RactiveEventsTap, L, mpConfig, mpFormatters, mpMaps, Base,
  tApplication, tTooltip
  ) {
  'use strict';

  // Create new class for app
  var App = Base.BaseApp.extend({

    defaults: {
      name: 'minnpost-voter-turnout-map-2014',
      el: '.minnpost-voter-turnout-map-2014-container',
      mapboxCompTurnout: 'minnpost.map-vhjzpwel,minnpost.usbxogvi,minnpost.map-dotjndlk',
      mapboxCompRegistered: 'minnpost.map-vhjzpwel,minnpost.1dvg3nmi,minnpost.map-dotjndlk',
      mapboxBase: '//{s}.tiles.mapbox.com/v3/',
      mapboxToken: 'pk.eyJ1IjoibWlubnBvc3QiLCJhIjoicUlOUkpvWSJ9.djE93rNktev9eWRJVav6xA'
    },

    initialize: function() {
      var thisApp = this;

      // Create main application view
      this.mainView = new Ractive({
        el: this.$el,
        template: tApplication,
        data: {
          legendTurnout: [
            { label: '< 45%', color: '#bfdcd9' },
            { label: '45 - 50%', color: '#7cb8c5' },
            { label: '50 - 55%', color: '#4691ba' },
            { label: '55 - 60%', color: '#3c64a7' },
            { label: '>= 60%', color: '#55307e' }
          ],
          legendRegistered: [
            { label: '< 60%', color: '#d6e6ce' },
            { label: '60 - 65%', color: '#c4c693' },
            { label: '65 - 70%', color: '#c2a25c' },
            { label: '70 - 75%', color: '#c67736' },
            { label: '>= 75%', color: '#c83d2d' }
          ]
        },
        partials: {
        }
      });

      // Get tilejsons
      $.ajax({
        url: this.options.mapboxBase.replace('{s}', 'a') + this.options.mapboxCompTurnout + '.json?callback=?',
        dataType: 'jsonp',
        cache: true,
        success: function(data) {
          thisApp.tilejsonTurnout = data;

          $.ajax({
            url: thisApp.options.mapboxBase.replace('{s}', 'a') + thisApp.options.mapboxCompRegistered + '.json?callback=?',
            dataType: 'jsonp',
            cache: true,
            success: function(data) {
              thisApp.tilejsonRegistered = data;
              thisApp.makeMaps();
            }
          });
        }
      });
    },


    // Make map.  Note that Mapbox 2.x does not support jsonp anymore but grid
    // tiles still seem to be in jsonp, so we use a 1.x version
    makeMaps: function() {
      L.mapbox.accessToken = this.options.mapboxToken;

      // First map
      this.mapTurnout = L.mapbox.map('voter-turnout-2014', this.tilejsonTurnout, {
        scrollWheelZoom: false,
        trackResize: true,
        minZoom: 6,
        maxZoom: 12
      });
      this.mapTurnout.setView(mpMaps.minnesotaPoint);
      this.mapTurnout.removeControl(this.mapTurnout.attributionControl);

      // Override the template function in Mapbox's grid control because
      // it doesn't expose more options and Mustache is stupid
      this.mapTurnout.gridControl._template = function(format, data) {
        if (!data) {
          return;
        }
        var template = this.options.template || this._layer.getTileJSON().template;
        if (template) {
          return this.options.sanitizer(
            _.template(template)({
              format: mpFormatters,
              data: data
            })
          );
        }
      };
      this.mapTurnout.gridControl.setTemplate(tTooltip);
      this.mapTurnout.gridControl.options.pinnable = false;

      // Second map
      this.mapRegistered = L.mapbox.map('voter-turnout-registered-2014', this.tilejsonRegistered, {
        scrollWheelZoom: false,
        trackResize: true,
        minZoom: 6,
        maxZoom: 12
      });
      this.mapRegistered.setView(mpMaps.minnesotaPoint);
      this.mapRegistered.removeControl(this.mapRegistered.attributionControl);

      // Override the template function in Mapbox's grid control because
      // it doesn't expose more options and Mustache is stupid
      this.mapRegistered.gridControl._template = function(format, data) {
        if (!data) {
          return;
        }
        var template = this.options.template || this._layer.getTileJSON().template;
        if (template) {
          return this.options.sanitizer(
            _.template(template)({
              format: mpFormatters,
              data: data
            })
          );
        }
      };
      this.mapRegistered.gridControl.setTemplate(tTooltip);
      this.mapRegistered.gridControl.options.pinnable = false;

    },

  });

  // Create instance and return
  return new App({});
});
