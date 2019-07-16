## GenericMap

The Equal Earth projection, by Bojan Šavrič et al., 2018.

```react
<div>
  <CsvChart
    config={{
      "type": "GenericMap",
      "colorLegend": false,
      "heightRatio": 0.5,
      "points": true,
      "features": {
        "url": "https://cdn.repub.ch/s3/republik-assets/assets/geo/world-atlas-110m.json",
        "object": "land"
      }
    }}
    values={`
lat,lon
47.366667,8.55
`.trim()} />
  <Editorial.Note>Geobasis: <Editorial.A href="https://github.com/topojson/world-atlas">World Atlas TopoJSON</Editorial.A></Editorial.Note>
</div>
```

### Map with data points and tooltips

```react
<div>
  <CsvChart
    config={{
      "type": "GenericMap",
      "colorLegend": false,
      "heightRatio": 0.5,
      "points": true,
      "pointLabel": "Name",
      "pointTooltips": ["Einwohner"],
      "sizes": [100,500],
      "unit": "km²",
      "features": {
        "url": "https://cdn.repub.ch/s3/republik-assets/assets/geo/world-atlas-110m.json",
        "object": "land"
      }
    }}
    values={`
      lat,lon,value,Name,Einwohner
      40.707, -74.009,1783.8,"New York",862300
      47.366667,8.55,51.2,"Bern",141833
    `.trim()} />
  <Editorial.Note>Geobasis: <Editorial.A href="https://github.com/topojson/world-atlas">World Atlas TopoJSON</Editorial.A></Editorial.Note>
</div>
```

## ProjectedMap

Want a special projection? Use `ProjectedMap` to render an pre-projected topojson file. `d3.geoIdentity` is used to fit the map into the viewport.

### Projecting WGS84 Data

For example with [`geoConicConformalEurope`](https://github.com/rveciana/d3-composite-projections) for a composite map with overseas [nuts regions](https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts).

_Examples below assume `topojson` v2._

#### `geoConicConformalEurope`

Europe with composition. Double dose of Malta.

```
npm i -g d3-composite-projections ndjson-cli

# project a wgs84 geojson with geoConicConformalEurope 
npx -p d3-geo-projection geoproject --require d3=d3-composite-projections 'd3.geoConicConformalEurope()' < nuts.json > nuts-projected.json
# project a wgs84 geojson of the composition border with a different projection 
npx -p d3-geo-projection geoproject 'p = d3.geoConicConformal().rotate([-10, -53]).parallels([0, 60]).scale(750), _ = p.translate(), k = p.scale(), x = +_[0], y = +_[1], p.translate([x - 0.08 * k, y]).clipExtent([[x - 0.51 * k, y - 0.33 * k],[x + 0.5 * k, y + 0.33 * k]]), p' < nuts-composition-borders.json > nuts-composition-borders-projected.json

# plot as svg to test?
# npx -p d3-geo-projection geo2svg -w 960 -h 960 < nuts-projected.json > nuts-projected.svg

# map to get clean id and name prop
ndjson-split 'd.features' \
  < nuts-projected.json \
  > nuts-projected.ndjson
ndjson-map 'd.id = d.properties.NUTS_ID, d.properties = {name: d.properties.NUTS_NAME}, d' \
  < nuts-projected.ndjson \
  > nuts-projected-clean.ndjson
ndjson-reduce 'p.features.push(d), p' '{type: "FeatureCollection", features: []}' \
  < nuts-projected-clean.ndjson \
  > nuts-projected-clean.json

# generate topojson
npx -p topojson geo2topo -q 1e5 nuts=nuts-projected-clean.json cb=nuts-composition-borders-projected.json > nuts-topo.json

# npx -p topojson toposimplify -p 0.05 < nuts-topo.json > nuts-topo-simple.json
```

```react
<div>
  <CsvChart
    config={{
      "type": "ProjectedMap",
      "heightRatio": 0.77,
      "colorLegend": false,
      "features": {
        "url": "/static/geo/nuts2016-20m-l2.json",
        "object": "nuts",
        "compositionBorders": "cb"
      }
    }}
    values={''} />
  <Editorial.Note>Geobasis: <Editorial.A href="https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts">NUTS 2016 20M L2</Editorial.A></Editorial.Note>
</div>
```

#### `geoConicConformal`

Europe without composition.

```
npm i -g ndjson-cli d3-dsv

npx -p d3-geo-projection geoproject 'd3.geoConicConformal().rotate([-10, -53]).parallels([0, 60]).fitSize([960, 960], d)' < nuts.json > nuts-projected.json

# map to get clean id and name prop, filter out some regions
ndjson-split 'd.features' \
  < nuts-projected.json \
  > nuts-projected.ndjson
ndjson-filter '!["NO", "TR", "IS"].includes(d.properties.CNTR_CODE)' \
  < nuts-projected.ndjson \
  | ndjson-map 'd.id = d.properties.NUTS_ID, d.properties = {name: d.properties.NUTS_NAME}, d' \
  | ndjson-filter '!["FRA1", "FRA2", "FRA3", "FRA4", "FRA5", "ES70", "PT20", "PT30"].includes(d.id)' \
  > nuts-projected-filered.ndjson

# join names table and map name property
ndjson-join 'd.id' <(cat nuts-projected-filered.ndjson) <(csv2json -n names.csv) \
  | ndjson-map 'd[0].properties.name = d[1].name, d[0]' \
  > nuts-projected-clean.ndjson

ndjson-reduce 'p.features.push(d), p' '{type: "FeatureCollection", features: []}' \
  < nuts-projected-clean.ndjson \
  > nuts-projected-clean.json

# generate topojson
npx -p topojson geo2topo nuts=nuts-projected-clean.json > nuts-topo.json

npx -p topojson toposimplify -p 1 < nuts-topo.json > nuts2013-20m-l2-custom-gdp.json
```

```react
<div>
  <ChartTitle>Zentraleuropäischer Wohlstandsgürtel</ChartTitle>
  <ChartLead>2016 BIP pro Kopf nach Regionen</ChartLead>
  <CsvChart
    config={{
      "type": "ProjectedMap",
      "heightRatio": 0.879,
      "choropleth": true,
      "colorRange": [
        "#c7e9c0",
        "#a1d99b",
        "#74c476",
        "#41ab5d",
        "#238b45",
        "#006d2c",
        "#00441b"
      ],
      "thresholds": [
        10000,
        15000,
        20000,
        25000,
        30000,
        40000
      ],
      "colorLegendMinWidth": 115,
      "legendTitle": "BIP pro Kopf in Euro",
      "unit": "Euro",
      "colorLegendSize": 0.3,
      "features": {
        "url": "/static/geo/nuts2013-20m-l2-custom-gdp.json",
        "object": "nuts"
      }
    }}
    values={data.nuts13mCHdGDP} />
  <Editorial.Note>Quelle: Eurostat. Das BIP pro Kopf ist nach Kaufkraft bereinigt. Geobasis: <Editorial.A href="https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts">NUTS 2013 20M L2</Editorial.A>, ohne entlegene Gebiete, fusionierte Schweiz</Editorial.Note>
</div>
```

#### Ordinal Colors

```
# npm i -g ndjson-cli d3-dsv topojson d3-geo-projection

geoproject 'd3.geoIdentity().clipExtent([[-24.5,33.870416],[35.156250,71.910888]])' < countries.json > countries-clipped.json

geoproject 'd3.geoConicConformal().rotate([-10, -53]).parallels([0, 60]).fitSize([960, 960], d)' < countries-clipped.json > countries-projected.json

ndjson-split 'd.features' \
  < countries-projected.json \
  > countries-projected.ndjson

ndjson-filter 'd.geometry && !["MA","DZ","TN","GL","SJ","RU","UA","TR","BY","MD"].includes(d.properties.CNTR_ID)' \
  < countries-projected.ndjson \
  | ndjson-map 'd.id = d.properties.CNTR_ID, d.properties = {name: d.properties.NAME_ENGL}, d' \
  > countries-projected-filered.ndjson

ndjson-join --left 'd.id' <(cat countries-projected-filered.ndjson) <(csv2json -n names.csv) \
  | ndjson-map 'd[1] && (d[0].properties.name = d[1].name), d[0]' \
  > countries-projected-clean.ndjson

ndjson-reduce 'p.features.push(d), p' '{type: "FeatureCollection", features: []}' \
  < countries-projected-clean.ndjson \
  > countries-projected-clean.json

geo2topo countries=countries-projected-clean.json > countries-topo.json

toposimplify -p 1 < countries-topo.json > countries2016-20m-europe.json
```

```react
<div>
  <CsvChart
    config={{
      "type": "ProjectedMap",
      "heightRatio": 0.9,
      "choropleth": true,
      "color": "category",
      "colorLegendMinWidth": 100,
      "colorLegendSize": 0.3,
      "colorRange": ["#66c2a5", "#fc8d62", "#8da0cb"],
      "legendTitle": "E-ID-Angebote",
      "missingDataLegend": "Nicht untersucht",
      "features": {
        "url": "/static/geo/countries2016-20m-europe.json",
        "object": "countries"
      }
    }}
    values={`
feature,name,category
HR,Kroatien,Öffentliche Angebote dominieren
BE,Belgien,Öffentliche und private
DK,Dänemark,Private Angebote dominieren
DE,Deutschland,Öffentliche und private
EE,Estland,Öffentliche Angebote dominieren
FR,Frankreich,Öffentliche und private
UK,Grossbritannien,Private Angebote dominieren
IT,Italien,Öffentliche und private
LV,Lettland,Öffentliche und private
LT,Litauen,Öffentliche Angebote dominieren
LU,Luxemburg,Öffentliche und private
MT,Malta,Öffentliche Angebote dominieren
NL,Niederlande,Öffentliche und private
NO,Norwegen,Öffentliche und private
AT,Österreich,Öffentliche und private
PL,Polen,Öffentliche Angebote dominieren
PT,Portugal,Öffentliche Angebote dominieren
SE,Schweden,Öffentliche und private
CH,Schweiz,Private Angebote dominieren
SK,Slowakei,Öffentliche Angebote dominieren
ES,Spanien,Öffentliche Angebote dominieren
CZ,Tschechien,Öffentliche und private
SI,Slowenien,Öffentliche und private
FI,Finnland,Öffentliche und private
CY,Zypern,Öffentliche Angebote dominieren
HU,Ungarn,
BA,Bosnien und Herzegowina,
AL,Albanien,
BG,Bulgarien,
IE,Irland,
IS,Island,
EL,Griechenland,
LI,Liechtenstein,
ME,Montenegro,
MK,Nord Mazedonien,
RO,Rumänien,
RS,Serbien,
    `.trim()} />
  <Editorial.Note>Geobasis: <Editorial.A href="https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/countries">Eurostat Countries 2016 20M</Editorial.A></Editorial.Note>
</div>
```

## SwissMap

`features.url` is expected to point to an topojson file with WGS84 coordinates (EPSG:4326). A rotated mercator projection is used to look like CH1903 while also allowing to plot regular coordinates and use `projection.fitSize` for responsive design.

Convert a CH1903 shape file:

```
ogr2ogr -t_srs EPSG:4326 -s_srs EPSG:21781 -where "KT != '0'" ./wgs84.shp ./ch1903.shp

topojson \
    -o ./topo.json \
    --no-pre-quantization \
    --post-quantization=1e5 \
    --simplify=1e-9 \
    --id-property ID \
    -p name=NAME \
    -- ./wgs84.shp
```

_Example assumes `topojson` v1._


The `id` on a feature is used to match with data. And our maps assume a displayable name properties.

#### Swiss Base Data

[«Swiss Maps» by Interactive Things](https://github.com/interactivethings/swiss-maps) is a great way to get base data as topojson.

For example you can generate our cantons file with following command:

```
make topo/ch-cantons.json PROPERTIES="name --id-property=abbr" REPROJECT=true
```

### Cantons Example

```react
<div>
  <ChartTitle>Fonds zur Beschaffung des Kampfflugzeugs Gripen</ChartTitle>
  <CsvChart
    config={{
      "type": "SwissMap",
      "legendTitle": "Jastimmen",
      "unit": "Jastimmen",
      "choropleth": true,
      "numberFormat": ".0%",
      "thresholds": [0.3,0.4,0.5,0.6,0.7],
      "colorRange": ["rgb(103,0,13)", "rgb(187,21,26)", "rgb(239,69,51)", "rgb(75,151,201)", "rgb(24,100,170)", "rgb(8,48,107)"],
      "features": {
        "url": "https://cdn.repub.ch/s3/republik-assets/assets/geo/ch-cantons.json",
        "object": "cantons"
      }
    }}
    values={`
feature,value
ZH,0.487
BE,0.491
LU,0.543
UR,0.624
SZ,0.615
OW,0.638
NW,0.682
GL,0.599
ZG,0.6
FR,0.406
SO,0.503
BS,0.323
BL,0.425
SH,0.494
AR,0.511
AI,0.608
SG,0.5
GR,0.507
AG,0.519
TG,0.556
TI,0.453
VD,0.349
VS,0.381
NE,0.309
GE,0.322
JU,0.257
    `.trim()} />
  <Editorial.Note>Quelle: <Editorial.A href="https://www.bk.admin.ch/ch/d/pore/va/20140518/can584.html">Bundeskanzlei</Editorial.A></Editorial.Note>
</div>
```


### Municipalities Example

```react
<div>
  <ChartTitle>Zersiedelungsindex 2010</ChartTitle>
  <CsvChart
    config={{
      "type": "SwissMap",
      "legendTitle": "Indexwert",
      "choropleth": true,
      "thresholds": [3,6,10,20],
      "colorRange": ["rgb(24,100,170)", "rgb(75,151,201)", "rgb(239,69,51)", "rgb(187,21,26)", "rgb(103,0,13)"],
      "numberFormat": "s",
      "feature": "bfs",
      "features": {
        "url": "/static/geo/bfs-g3g12.json",
        "object": "mun"
      }
    }}
    values={data.mun} />
  <Editorial.Note>Quelle: <Editorial.A href="https://www.haupt.ch/Verlag/Buecher/Natur/Umwelt-Oekologie/Zersiedelung-messen-und-begrenzen.html">Fachbuch «Zersiedelung messen und begrenzen»</Editorial.A>, <Editorial.A href="https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/administrative-grenzen/generalisierte-gemeindegrenzen.html">BFS</Editorial.A></Editorial.Note>
</div>
```
