###
# Make file for project.
#
# Downloads, filters, and converts data
#
###

# Directories
data := data
original := $(data)/original
build := $(data)/build
processing := $(data)/processing

# Scripts
script_tracts := $(processing)/some-data-processing-script.js

# Sources
source_turnout_xls := http://www.sos.state.mn.us/Modules/ShowDocument.aspx?documentid=14558
source_county_geojson := http://www.gis.leg.mn/php/shptoGeojson.php?file=/geo/data/county/county2012

# Local sources
local_turnout_xls := $(original)/sec-of-state-county-turnout-registration-rates-data.xlsx
local_county_geojson := $(original)/county2012.geojson

# Converted
build_example := $(build)/swlrt-route.geo.json

# Final
example := $(data)/swlrt-route.geo.json



# Download sources
$(local_turnout_xls):
	wget $(source_turnout_xls) -O $(local_turnout_xls)

$(local_county_geojson):
	wget $(source_county_geojson) -O $(local_county_geojson)

download: $(local_turnout_xls) $(local_county_geojson)
clean_download:
	rm -rv $(original)/*


# Convert and filter data files
$(example): $(local_example_shp)
	mkdir -p $(build)
	ogr2ogr -f "GeoJSON" $(build_example) $(local_example_shp) -overwrite -where "NAME = 'Southwest LRT'" -t_srs "EPSG:4326"
	cp $(build_example) $(example)

convert: $(example)
clean_convert:
	rm -rv $(build)/*
	rm -rv $(example)


# General
all: convert
clean: clean_download clean_convert
