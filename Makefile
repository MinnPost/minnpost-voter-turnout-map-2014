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

# Local sources (not that node really wants a .json file to read correctly)
local_turnout_xls := $(original)/sec-of-state-county-turnout-registration-rates-data.xlsx
local_county_geojson := $(original)/county2012.geo.json

# Converted
build_county_geojson_4326 := $(build)/county2012-4326.geo.json
build_turnout_summary := $(build)/turnout_summary.json
build_turnout_detail := $(build)/turnout_detail.json

# Final
county_turnout := $(data)/county_turnout.geo.json



# Download sources
$(local_turnout_xls):
	wget $(source_turnout_xls) -O $(local_turnout_xls)

$(local_county_geojson):
	wget $(source_county_geojson) -O $(local_county_geojson)

download: $(local_turnout_xls) $(local_county_geojson)
clean_download:
	rm -rv $(original)/*


# Convert files
$(build_county_geojson_4326): $(local_county_geojson)
	ogr2ogr -f GeoJSON -t_srs EPSG:4326 -s_srs EPSG:26915 $(build_county_geojson_4326) $(local_county_geojson)

$(build_turnout_summary): $(local_turnout_xls)
	in2csv --sheet=Summary $(local_turnout_xls) | csvjson > $(build_turnout_summary)

$(build_turnout_detail): $(local_turnout_xls)
	in2csv --sheet=Detail $(local_turnout_xls) | csvjson > $(build_turnout_detail)

convert: $(build_county_geojson_4326) $(build_turnout_summary) $(build_turnout_detail)
clean_convert:
	rm -rv $(build)/*



# Final processing
$(county_turnout): $(build_county_geojson_4326) $(build_turnout_summary) $(build_turnout_detail)
	node data/processing/county-combine.js

processing: $(county_turnout)
clean_processing:
	rm -rv $(county_turnout)


# General
all: processing
clean: clean_download clean_convert clean_processing
