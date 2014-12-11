
define('text!../bower.json',[],function () { return '{\n  "name": "minnpost-voter-turnout-map-2014",\n  "version": "0.0.0",\n  "main": "index.html",\n  "homepage": "https://github.com/minnpost/minnpost-voter-turnout-map-2014",\n  "repository": {\n    "type": "git",\n    "url": "https://github.com/minnpost/minnpost-voter-turnout-map-2014"\n  },\n  "bugs": "https://github.com/minnpost/minnpost-voter-turnout-map-2014/issues",\n  "license": "MIT",\n  "author": {\n    "name": "MinnPost",\n    "email": "data@minnpost.com"\n  },\n  "dependencies": {\n    "mapbox.js": "1.x",\n    "ractive": "~0.5.6",\n    "ractive-events-tap": "~0.1.1",\n    "ractive-backbone": "~0.1.1",\n    "requirejs": "~2.1.15",\n    "almond": "~0.3.0",\n    "text": "~2.0.12",\n    "underscore": "~1.7.0",\n    "jquery": "~1.11.1",\n    "backbone": "~1.1.2",\n    "rgrove-lazyload": "*",\n    "minnpost-styles": "master"\n  },\n  "devDependencies": {\n    "qunit": "~1.15.0"\n  },\n  "dependencyMap": {\n    "requirejs": {\n      "rname": "requirejs",\n      "js": [\n        "requirejs/require"\n      ]\n    },\n    "almond": {\n      "rname": "almond",\n      "js": [\n        "almond/almond"\n      ]\n    },\n    "text": {\n      "rname": "text",\n      "js": [\n        "text/text"\n      ]\n    },\n    "jquery": {\n      "rname": "jquery",\n      "js": [\n        "jquery/dist/jquery"\n      ],\n      "returns": "$"\n    },\n    "underscore": {\n      "rname": "underscore",\n      "js": [\n        "underscore/underscore"\n      ],\n      "returns": "_"\n    },\n    "backbone": {\n      "rname": "backbone",\n      "js": [\n        "backbone/backbone"\n      ],\n      "returns": "Backbone"\n    },\n    "rgrove-lazyload": {\n      "rname": "lazyload",\n      "js": [\n        "rgrove-lazyload/lazyload"\n      ],\n      "returns": "Lazyload"\n    },\n    "ractive": {\n      "rname": "ractive",\n      "js": [\n        "ractive/ractive-legacy"\n      ],\n      "returns": "Ractive"\n    },\n    "ractive-backbone": {\n      "rname": "ractive-backbone",\n      "js": [\n        "ractive-backbone/ractive-adaptors-backbone"\n      ],\n      "returns": "RactiveBackbone"\n    },\n    "ractive-events-tap": {\n      "rname": "ractive-events-tap",\n      "js": [\n        "ractive-events-tap/ractive-events-tap"\n      ],\n      "returns": "RactiveEventsTap"\n    },\n    "mapbox.js": {\n      "rname": "mapbox",\n      "js": [\n        "mapbox.js/mapbox.uncompressed"\n      ],\n      "css": [\n        "mapbox.js/mapbox.uncompressed"\n      ],\n      "images": [\n        "mapbox.js/images"\n      ],\n      "returns": "L"\n    },\n    "minnpost-styles": {\n      "rname": "mpStyles",\n      "css": [\n        "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css",\n        "minnpost-styles/dist/minnpost-styles"\n      ],\n      "sass": [\n        "minnpost-styles/styles/main"\n      ]\n    },\n    "mpConfig": {\n      "rname": "mpConfig",\n      "js": [\n        "minnpost-styles/dist/minnpost-styles.config"\n      ],\n      "returns": "mpConfig"\n    },\n    "mpFormatters": {\n      "rname": "mpFormatters",\n      "js": [\n        "minnpost-styles/dist/minnpost-styles.formatters"\n      ],\n      "returns": "mpFormatters"\n    },\n    "mpMaps": {\n      "rname": "mpMaps",\n      "js": [\n        "minnpost-styles/dist/minnpost-styles.maps"\n      ],\n      "returns": "mpMaps"\n    }\n  },\n  "resolutions": {\n    "underscore": ">=1.5.0"\n  }\n}\n';});

/**
 * Base class(es) for applications.
 */

// Create main application
define('base',['jquery', 'underscore', 'backbone', 'lazyload', 'mpFormatters', 'text!../bower.json'],
  function($, _, Backbone, Lazyload, formatters, bower) {
  

  var Base = {};
  bower = JSON.parse(bower);

  // Base App constructor
  Base.BaseApp = function(options) {
    // Attach options
    this.options = _.extend(this.baseDefaults || {}, this.defaults || {}, options || {});
    this.name = this.options.name;

    // Handle element if in options
    if (this.options.el) {
      this.el = this.options.el;
      this.$el = $(this.el);
      this.$ = function(selector) { return this.$el.find(selector); };
    }

    // Determine paths and get assesets
    this.determinePaths();
    this.renderAssests();

    // Run an initializer once CSS has been loaded
    this.on('cssLoaded', function() {
      this.initialize.apply(this, arguments);
    });
  };

  // Extend with Backbone Events and other properties
  _.extend(Base.BaseApp.prototype, Backbone.Events, {
    // Attach bower info
    bower: bower,

    // Default options
    baseDefaults: {
      jsonpProxy: '//mp-jsonproxy.herokuapp.com/proxy?url=',
      availablePaths: {
        local: {
          css: ['.tmp/css/main.css'],
          images: 'images/',
          data: 'data/'
        },
        build: {
          css: [
            'dist/[[[PROJECT_NAME]]].libs.min.css',
            'dist/[[[PROJECT_NAME]]].latest.min.css'
          ],
          images: 'dist/images/',
          data: 'dist/data/'
        },
        deploy: {
          css: [
            '//s3.amazonaws.com/data.minnpost/projects/' +
              '[[[PROJECT_NAME]]]/[[[PROJECT_NAME]]].libs.min.css',
            '//s3.amazonaws.com/data.minnpost/projects/' +
              '[[[PROJECT_NAME]]]/[[[PROJECT_NAME]]].latest.min.css'
          ],
          images: '//s3.amazonaws.com/data.minnpost/projects/[[[PROJECT_NAME]]]/images/',
          data: '//s3.amazonaws.com/data.minnpost/projects/[[[PROJECT_NAME]]]/data/'
        }
      }
    },

    // Determine paths.  A bit hacky.
    determinePaths: function() {
      var query;

      // Only handle once
      if (_.isObject(this.options.paths) && !_.isUndefined(this.options.deployment)) {
        return this.options.paths;
      }

      // Deploy by default
      this.options.deployment = 'deploy';

      if (window.location.host.indexOf('localhost') !== -1) {
        this.options.deployment = 'local';

        // Check if a query string forces something
        query = this.parseQueryString();
        if (_.isObject(query) && _.isString(query.mpDeployment)) {
          this.options.deployment = query.mpDeployment;
        }
      }

      this.options.paths = this.options.availablePaths[this.options.deployment];
      return this.options.paths;
    },

    // Get assests.  We use the rgrove lazyload library since it is simple
    // and small, but it is unmaintained.
    renderAssests: function() {
      var thisApp = this;
      var scripts = [];

      // Add CSS from bower dependencies
      _.each(this.bower.dependencyMap, function(c, ci) {
        if (c.css) {
          _.each(c.css, function(s, si) {
            // If local, add script, else only add external scripts
            if (thisApp.options.deployment === 'local') {
              s = (s.match(/^(http|\/\/)/)) ? s : 'bower_components/' + s + '.css';
              scripts.push(thisApp.makePath(s));
            }
            else if (s.match(/^(http|\/\/)/)) {
              scripts.push(thisApp.makePath(s));
            }
          });
        }
      });

      // Add app CSS
      _.each(this.options.paths.css, function(c, ci) {
        scripts.push(thisApp.makePath(c));
      });

      // Load and fire event when done
      Lazyload.css(scripts, function() {
        this.trigger('cssLoaded');
      }, null, this);
    },

    // Make path
    makePath: function(path) {
      path = path.split('[[[PROJECT_NAME]]]').join(this.name);
      if (this.options.basePath && !path.match(/^(http|\/\/)/)) {
        path = this.options.basePath + path;
      }
      return path;
    },

    // Override Backbone's ajax call to use JSONP by default as well
    // as force a specific callback to ensure that server side
    // caching is effective.
    overrideBackboneAJAX: function() {
      Backbone.ajax = function() {
        var options = arguments[0];
        if (options.dataTypeForce !== true) {
          return this.jsonpRequest(options);
        }
        return Backbone.$.ajax.apply(Backbone.$, [options]);
      };
    },

    // Unfortunately we need this more often than we should
    isMSIE: function() {
      var match = /(msie) ([\w.]+)/i.exec(navigator.userAgent);
      return match ? parseInt(match[2], 10) : false;
    },

    // Read query string
    parseQueryString: function() {
      var assoc  = {};
      var decode = function(s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
      };
      var queryString = location.search.substring(1);
      var keyValues = queryString.split('&');

      _.each(keyValues, function(v, vi) {
        var key = v.split('=');
        if (key.length > 1) {
          assoc[decode(key[0])] = decode(key[1]);
        }
      });

      return assoc;
    },

    // Wrapper for a JSONP request, the first set of options are for
    // the AJAX request, while the other are from the application.
    //
    // JSONP is hackish, but there are still data sources and
    // services that we don't have control over that don't fully
    // support CORS
    jsonpRequest: function(options) {
      options.dataType = 'jsonp';

      // If no callback, use proxy
      if (this.options.jsonpProxy && options.url.indexOf('callback=') === -1) {
        options.jsonpCallback = 'mpServerSideCachingHelper' +
          formatters.hash(options.url);
        options.url = this.options.jsonpProxy + encodeURIComponent(options.url) +
          '&callback=' + options.jsonpCallback;
        options.cache = true;
      }

      return $.ajax.apply($, [options]);
    },


    // Project data source handling for data files that are not
    // embedded in the application itself.  For development, we can call
    // the data directly from the JSON file, but for production
    // we want to proxy for JSONP.
    //
    // Takes single or array of paths to data, relative to where
    // the data source should be.
    //
    // Returns jQuery's defferred object.
    dataRequest: function(datas) {
      var thisApp = this;
      var useJSONP = false;
      var defers = [];
      datas = (_.isArray(name)) ? datas : [ datas ];

      // If the data path is not relative, then use JSONP
      if (this.options.paths.data.indexOf('http') === 0) {
        useJSONP = true;
      }

      // Go through each file and add to defers
      _.each(datas, function(d) {
        var defer = (useJSONP) ?
          thisApp.jsonpRequest(thisApp.options.paths.data + d) :
          $.getJSON(thisApp.options.paths.data + d);
        defers.push(defer);
      });

      return $.when.apply($, defers);
    },

    // Empty initializer
    initialize: function() { }
  });

  // Add extend from Backbone
  Base.BaseApp.extend = Backbone.Model.extend;


  return Base;
});


define('text!templates/application.mustache',[],function () { return '<div class="application-container">\n  <div class="message-container"></div>\n\n  <div class="content-container">\n\n    <div class="component-label">Turnout of voting-age population for the 2014 general election</div>\n\n    <div class="caption">Rate is calculated by dividing ballots cast by estimated number of citizens who are 18 years and older&dagger;.</div>\n\n    <ul class="legend-container small">\n      {{#legendTurnout}}\n        <li><span class="legend-swatch" style="background-color: {{ color }}"></span> <span class="legend-label">{{ label }}</span></li>\n      {{/legend}}\n    </ul>\n\n    <div class="map" id="voter-turnout-2014"></div>\n\n\n\n    <div class="component-label">Voters per those registered for the 2014 general election</div>\n\n    <div class="caption">Rate calculated by dividing ballots cast by estimated number of people registered as of the morning of election day, November 4th, 2014.</div>\n\n    <ul class="legend-container small">\n      {{#legendRegistered}}\n      <li><span class="legend-swatch" style="background-color: {{ color }}"></span> <span class="legend-label">{{ label }}</span></li>\n      {{/legend}}\n    </ul>\n\n    <div class="map" id="voter-turnout-registered-2014"></div>\n  </div>\n\n  <div class="footnote-container">\n    <div class="footnote">\n      <p>&dagger;Per the Minnesota Secretary of State, "Minnesota\'s statewide turnout is officially reported using the eligible voter estimate from the United States Elections Project, which more accurately accounts for all eligibility factors. The data [provided] does not take into account some eligibility factors, and so varies slightly from the official statewide number. For comparison, 2014 statewide turnout is officially 50.51%, versus 51.29% using the data below.  Registration rate data based on number of registrations by start of voting on Election Day, November 4, 2014. It does not include voters who registered on Election Day."</p>\n\n      <p>Voter data from the <a href="http://www.sos.state.mn.us/Modules/ShowDocument.aspx?documentid=14558" target="_blank">MN Secretary of State\'s office</a>.  County boundaries from the <a href="http://www.gis.leg.mn/html/download.html" target="_blank">MN State Legislative Coordinating Commission GIS department</a>.</p>\n\n      <p>Some map data © OpenStreetMap contributors; licensed under the <a href="http://www.openstreetmap.org/copyright" target="_blank">Open Data Commons Open Database License</a>.  Some map design © MapBox; licensed according to the <a href="http://mapbox.com/tos/" target="_blank">MapBox Terms of Service</a>.</p>\n\n      <p>Some code, techniques, and data on <a href="https://github.com/minnpost/minnpost-voter-turnout-map-2014" target="_blank">Github</a>.</p>\n    </div>\n  </div>\n</div>\n';});


define('text!templates/tooltip-turnout.underscore',[],function () { return '<div class="inner-tooltip">\n  <div class="component-label"><%= data.COUNTY %></div>\n\n  <div>2008 turnout: <%= format.percent(data.t2008, 1) %></div>\n  <div>2010 turnout: <%= format.percent(data.t2010, 1) %></div>\n  <div>2012 turnout: <%= format.percent(data.t2012, 1) %></div>\n  <div>2014 turnout: <strong><%= format.percent(data.t2014, 1) %></strong></div>\n</div>\n';});


define('text!templates/tooltip-registered.underscore',[],function () { return '<div class="inner-tooltip">\n  <div class="component-label"><%= data.COUNTY %></div>\n\n\n  <div>2014 voters per number of registered as of the morning of Nov 4th, 2015: <strong><%= format.percent(data.vPerR, 1) %></strong></div>\n</div>\n';});

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
  'text!templates/tooltip-turnout.underscore',
  'text!templates/tooltip-registered.underscore'
], function(
  $, _, Backbone, Lazyload, Ractive, RactiveBackbone,
  RactiveEventsTap, L, mpConfig, mpFormatters, mpMaps, Base,
  tApplication, tTooltipTurnout, tTooltipRegistered
  ) {
  

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
      this.mapTurnout.gridControl.setTemplate(tTooltipTurnout);
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
      this.mapRegistered.gridControl.setTemplate(tTooltipRegistered);
      this.mapRegistered.gridControl.options.pinnable = false;

    },

  });

  // Create instance and return
  return new App({});
});

define("app", function(){});

