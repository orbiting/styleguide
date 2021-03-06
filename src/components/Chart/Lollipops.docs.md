Lollipop charts are just lighter bar charts. The circle at the end makes it ideal for displaying uncertainty.

```react
<div>
  <ChartTitle>Armutsrisikoquote nach Altersgruppen 2014</ChartTitle>
  <CsvChart
    config={{
      "type": "Lollipop",
      "numberFormat": "%",
      "y": "facet_value",
      "sort": "none",
      "band": "confidence95",
      "bandLegend": "95-Prozent-Konfidenzintervall"
    }}
    values={`
facet,facet_value,year,value,confidence95_lower,confidence95_upper
Altersgruppen,unter 10 Jahre,2014,0.219,0.207,0.232
Altersgruppen,10-17 Jahre,2014,0.201,0.183,0.219
Altersgruppen,18-24 Jahre,2014,0.243,0.194,0.292
Altersgruppen,25-34 Jahre,2014,0.208,0.189,0.226
Altersgruppen,35-44 Jahre,2014,0.128,0.113,0.144
Altersgruppen,45-54 Jahre,2014,0.106,0.083,0.130
Altersgruppen,55-64 Jahre,2014,0.132,0.112,0.151
Altersgruppen,65-74 Jahre,2014,0.141,0.110,0.171
Altersgruppen,über 74 Jahre,2014,0.133,0.120,0.146
    `.trim()} />
  <ChartLegend>Quelle: Berechnungen des DIW Berlin, SOEPv32.1.</ChartLegend>
</div>
```

```react
<div>
  <ChartTitle>Erneuerungsrate</ChartTitle>
  <CsvChart
    config={{
      "type": "Lollipop",
      "numberFormat": ".0%",
      "y": "label",
      "showBarValues": true
    }}
    values={`
label,value
Januar 2019,0.61
Januar 2020,0.75
    `.trim()} />
</div>
```

## Negative Values

```react
<div>
  <ChartTitle>Branchen, die zum Stillstand kamen</ChartTitle>
  <CsvChart
    config={{
      "type": "Lollipop",
      "y": "branche",
      "sort": "none",
      "numberFormat": "+.0%",
      "domain": [
        -1.1,
        0
      ],
      "colorRange": [
        "#6A3D9A"
      ],
      "showBarValues": true,
      "band": "band"
    }}
    values={`
branche,value,band_lower,band_upper
Persönliche Dienstleistungen,-0.875,-0.950,-0.800
Gastgewerbe und Beherbergung,-0.875,-0.950,-0.800
Luftfahrt,-0.950,-1.000,-0.900
"Kunst, Unterhaltung und Erholung",-0.950,-1.000,-0.900
Reisebüros,-0.975,-1.000,-0.950
    `.trim()} />
</div>
```
