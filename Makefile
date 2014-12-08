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
build_turnout_summary := $(build)/turnout_summary.json
build_turnout_detail := $(build)/turnout_detail.json

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


# Convert files
$(build_turnout_summary): $(local_turnout_xls)
	in2csv --sheet=Summary $(local_turnout_xls) | csvjson > $(build_turnout_summary)

$(build_turnout_detail): $(local_turnout_xls)
	in2csv --sheet=Detail $(local_turnout_xls) | csvjson > $(build_turnout_detail)

convert: $(build_turnout_summary) $(build_turnout_detail)
clean_convert:
	rm -rv $(build)/*


# General
all: convert
clean: clean_download clean_convert
