 # Documentation of Arlas-wui configuration
 
 ## Arlas configuration json schema files
 
 - [arlasconfig.schema.json](../schemas/arlasconfig.schema.json)
 ## Contributors json schemas files
 
 - [powerbarsContributorConf.schema.json](../schemas/powerbarsContributorConf.schema.json)
 - [chipssearchContributorConf.schema.json](../schemas/chipssearchContributorConf.schema.json)
 - [donutContributorConf.schema.json](../schemas/donutContributorConf.schema.json)
 - [swimlaneContributorConf.schema.json](../schemas/swimlaneContributorConf.schema.json)
 - [detailedHistogramContributorConf.schema.json](../schemas/detailedHistogramContributorConf.schema.json)
 - [rootContributorConf.schema.json](../schemas/rootContributorConf.schema.json)
 - [resultlistContributorConf.schema.json](../schemas/resultlistContributorConf.schema.json)
 - [analyticsContributorConf.schema.json](../schemas/analyticsContributorConf.schema.json)
 - [histogramContributorConf.schema.json](../schemas/histogramContributorConf.schema.json)
 - [mapContributorConf.schema.json](../schemas/mapContributorConf.schema.json)
 ## Components json schemas files
 
 - [powerbars.schema.json](../schemas/powerbars.schema.json)
 - [swimlane.schema.json](../schemas/swimlane.schema.json)
 - [donut.schema.json](../schemas/donut.schema.json)
 - [histogram.schema.json](../schemas/histogram.schema.json)
 - [mapgl.schema.json](../schemas/mapgl.schema.json)

## Arlas WUI application  Configuration Schema

```
arlasconfig.schema.json
```

The Configuration of an arlas web application

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Arlas WUI application  Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [arlas](#arlas) | `object` | **Required** | Arlas WUI application  Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## arlas

Configuration of ARLAS Wui Project

`arlas`
* is **required**
* type: `object`
* defined in this schema

### arlas Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `server`| object | **Required** |
| `web`| object | **Required** |



#### server

Configuration of ARLAS Web Server

`server`
* is **required**
* type: `object`

##### server Type

Unknown type `object`.

```json
{
  "description": "Configuration of ARLAS Web Server",
  "type": "object",
  "properties": {
    "url": {
      "description": "URL of ARLAS Web Server",
      "type": "string"
    },
    "collection": {
      "description": "Configuration of ARLAS Collection",
      "type": "object",
      "properties": {
        "id": {
          "description": "Id of an entity in collection",
          "type": "string"
        },
        "name": {
          "description": "Name of ARLAS Collection",
          "type": "string"
        }
      },
      "required": [
        "id",
        "name"
      ]
    },
    "max_age_cache": {
      "description": "During of cache",
      "type": "integer"
    }
  },
  "required": [
    "url",
    "collection"
  ],
  "simpletype": "`object`"
}
```







#### web

Configuration of ARLAS Web Front End

`web`
* is **required**
* type: `object`

##### web Type

Unknown type `object`.

```json
{
  "description": "Configuration of ARLAS Web Front End",
  "type": "object",
  "properties": {
    "contributors": {
      "description": "Configuration of each arlas contributors",
      "type": "object",
      "patternProperties": {
        "^(histogram\\$).*$": {
          "allOf": [
            {
              "$ref": "histogramContributorConf.schema.json#"
            }
          ]
        },
        "^(detailedhistogram\\$).*$": {
          "allOf": [
            {
              "$ref": "detailedHistogramContributorConf.schema.json#"
            }
          ]
        },
        "^(powerbars\\$).*$": {
          "allOf": [
            {
              "$ref": "powerbarsContributorConf.schema.json#"
            }
          ]
        },
        "^(donut\\$).*$": {
          "allOf": [
            {
              "$ref": "donutContributorConf.schema.json#"
            }
          ]
        },
        "^(resultlist\\$).*$": {
          "allOf": [
            {
              "$ref": "resultlistContributorConf.schema.json#"
            }
          ]
        },
        "^(map\\$).*$": {
          "allOf": [
            {
              "$ref": "mapContributorConf.schema.json#"
            }
          ]
        },
        "^(swimlane\\$).*$": {
          "allOf": [
            {
              "$ref": "swimlaneContributorConf.schema.json#"
            }
          ]
        },
        "^(chipssearch\\$).*$": {
          "allOf": [
            {
              "$ref": "chipssearchContributorConf.schema.json#"
            }
          ]
        },
        "^(analytics\\$).*$": {
          "allOf": [
            {
              "$ref": "analyticsContributorConf.schema.json#"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "analytics": {
      "description": "Configuration of an Analytics Panel",
      "type": "array",
      "items": {
        "description": "Analytic components organisation configuration",
        "type": "object",
        "properties": {
          "groupId": {
            "description": "Id of group to regroup component in same line",
            "type": "string"
          },
          "filterValues": {
            "description": "Values used to filter the display of group",
            "type": "array",
            "items": {
              "description": "Value used to filter the display of group",
              "type": "string"
            }
          },
          "components": {
            "description": "List of components in group",
            "type": "array",
            "items": {
              "description": "Component configuration",
              "type": "object",
              "properties": {
                "contributorId": {
                  "description": "Identifer of contributor link to this component",
                  "type": "string"
                },
                "componentType": {
                  "description": "Type of component",
                  "enum": [
                    "histogram",
                    "powerbars",
                    "swimlane",
                    "resultlist",
                    "donut"
                  ]
                }
              },
              "required": [
                "contributorId",
                "componentType",
                "input"
              ],
              "anyOf": [
                {
                  "properties": {
                    "componentType": {
                      "enum": [
                        "histogram"
                      ]
                    },
                    "input": {
                      "description": "Input of histogram component.",
                      "allOf": [
                        {
                          "$ref": "histogram.schema.json#"
                        }
                      ]
                    }
                  }
                },
                {
                  "properties": {
                    "componentType": {
                      "enum": [
                        "resultlist"
                      ]
                    },
                    "input": {
                      "description": "Input of resultlist component.",
                      "type": "object"
                    }
                  }
                },
                {
                  "properties": {
                    "componentType": {
                      "enum": [
                        "powerbars"
                      ]
                    },
                    "input": {
                      "description": "Input of powerbars component.",
                      "allOf": [
                        {
                          "$ref": "powerbars.schema.json#"
                        }
                      ]
                    }
                  }
                },
                {
                  "properties": {
                    "componentType": {
                      "enum": [
                        "donut"
                      ]
                    },
                    "input": {
                      "description": "Input of donut component.",
                      "allOf": [
                        {
                          "$ref": "donut.schema.json#"
                        }
                      ]
                    }
                  }
                },
                {
                  "properties": {
                    "componentType": {
                      "enum": [
                        "swimlane"
                      ]
                    },
                    "input": {
                      "description": "Input of swimlane component.",
                      "allOf": [
                        {
                          "$ref": "swimlane.schema.json#"
                        }
                      ]
                    }
                  }
                }
              ]
            }
          },
          "title": {
            "description": "Title of panel group",
            "type": "string"
          },
          "icon": {
            "description": "Icon of panel group, from material design icon",
            "type": "string"
          }
        },
        "required": [
          "groupId",
          "components"
        ]
      }
    },
    "components": {
      "description": "Configuration of arlas components",
      "type": "object",
      "patternProperties": {
        "^(share)$": {
          "patternProperties": {
            "^(geojson)$": {
              "description": "Configuration of arlas share component",
              "type": "object",
              "properties": {
                "max_for_feature": {
                  "description": "Max number of elements returned by arlas-server in feature mode",
                  "type": "number"
                },
                "max_for_cluster": {
                  "description": "Max number of elements returned by arlas-server in cluster mode",
                  "type": "number"
                },
                "agg_field": {
                  "description": "Field for aggregation",
                  "type": "string"
                },
                "sort_excluded_type": {
                  "description": "List of excluded field's types in sort option",
                  "type": "array"
                }
              },
              "required": [
                "max_for_feature",
                "max_for_cluster",
                "agg_field",
                "sort_excluded_type"
              ]
            }
          }
        },
        "mapgl": {
          "description": "Mapgl component configuration",
          "type": "object",
          "properties": {
            "input": {
              "description": "Mapgl component inputs",
              "type": "object",
              "allOf": [
                {
                  "$ref": "mapgl.schema.json#"
                }
              ]
            }
          },
          "required": [
            "input"
          ]
        },
        "timeline": {
          "description": "Timeline component configuration",
          "type": "object",
          "properties": {
            "contributorId": {
              "description": "Identifier of the timeline contributor",
              "type": "string"
            },
            "input": {
              "description": "Histogram component inputs for timeline",
              "type": "object",
              "allOf": [
                {
                  "$ref": "histogram.schema.json#"
                }
              ]
            },
            "dateFormat": {
              "description": "Format of the date.",
              "type": "string"
            }
          },
          "required": [
            "contributorId",
            "input"
          ]
        },
        "detailedTimeline": {
          "description": "Detailed timeline component configuration",
          "type": "object",
          "properties": {
            "contributorId": {
              "description": "Identifier of the detailed timeline contributor. It should be a detailedhistogram contributor.",
              "type": "string"
            },
            "input": {
              "description": "Histogram component inputs for detailed timeline",
              "type": "object",
              "allOf": [
                {
                  "$ref": "histogram.schema.json#"
                }
              ]
            },
            "dateFormat": {
              "description": "Format of the date.",
              "type": "string"
            }
          },
          "required": [
            "contributorId",
            "input"
          ]
        }
      }
    }
  },
  "required": [
    "contributors"
  ],
  "simpletype": "`object`"
}
```










## Analytics Contributor Configuration Schema

```
analyticsContributorConf.schema.json
```

The Configuration of Analytics Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Analytics Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [jsonpath](#jsonpath) | `string` | Optional | Analytics Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## jsonpath

Json path to find value used in aggregation, for example  $.count or $.metrics[0].value, $.count is used by default if this property is not setted.

`jsonpath`
* is optional
* type: `string`
* defined in this schema

### jsonpath Type


`string`






## Contributors Configuration Schema

```
rootContributorConf.schema.json
```

The Configuration of Contributors

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | Yes | Experimental | No | Forbidden | Permitted |  |

## Contributors Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [aggregationmodels](#aggregationmodels) | `object[]` | **Required** | Contributors Configuration (this schema) |
| [identifier](#identifier) | `string` | **Required** | Contributors Configuration (this schema) |
| [name](#name) | `string` | **Required** | Contributors Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## aggregationmodels

List of aggregation, order matters

`aggregationmodels`
* is **required**
* type: `object[]`
* at least `1` items in the array
* defined in this schema

### aggregationmodels Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `field`| string | **Required** |
| `interval`| object | Optional |
| `type`|  | **Required** |
| `withGeoCentroid`| boolean | Optional |



#### field

Field of aggregation

`field`
* is **required**
* type: `string`

##### field Type


`string`








#### interval

Interval of aggregation

`interval`
* is optional
* type: `object`

##### interval Type

Unknown type `object`.

```json
{
  "description": "Interval of aggregation",
  "type": "object",
  "properties": {
    "value": {
      "description": "Value of interval",
      "type": "integer"
    },
    "unit": {
      "description": "Unit of interval",
      "enum": [
        "year",
        "quarter",
        "month",
        "week",
        "day",
        "hour",
        "minute",
        "second"
      ]
    }
  },
  "simpletype": "`object`"
}
```







#### type

Type of aggregation

`type`
* is **required**
* type: `enum`

The value of this property **must** be equal to one of the [known values below](#aggregationmodels-known-values).

##### type Known Values
| Value | Description |
|-------|-------------|
| `datehistogram` |  |
| `geohash` |  |
| `histogram` |  |
| `term` |  |






#### withGeoCentroid

Place the point on geocentroid

`withGeoCentroid`
* is optional
* type: `boolean`

##### withGeoCentroid Type


`boolean`












## identifier

The unique identifier for a Contributor

`identifier`
* is **required**
* type: `string`
* defined in this schema

### identifier Type


`string`






## name

The name of the Contributor

`name`
* is **required**
* type: `string`
* defined in this schema

### name Type


`string`






## Detailed Histogram Contributor Configuration Schema

```
detailedHistogramContributorConf.schema.json
```

The Configuration of Detailed Histogram Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Detailed Histogram Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [annexedContributorId](#annexedcontributorid) | `string` | **Required** | Detailed Histogram Contributor Configuration (this schema) |
| [selectionExtentPercentage](#selectionextentpercentage) | `number` | Optional | Detailed Histogram Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## annexedContributorId

Id of the histogram contributor which fetches data of the main histogram.

`annexedContributorId`
* is **required**
* type: `string`
* defined in this schema

### annexedContributorId Type


`string`






## selectionExtentPercentage

Percentage of current selection extent. This percentage will be used to calculate an offset to add to this extent : offset + selectionextent = data extent

`selectionExtentPercentage`
* is optional
* type: `number`
* defined in this schema

### selectionExtentPercentage Type


`number`






## Powerbars Contributor Configuration Schema

```
powerbarsContributorConf.schema.json
```

The Configuration of Powerbars Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Powerbars Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [jsonpath](#jsonpath) | `string` | Optional | Powerbars Contributor Configuration (this schema) |
| [title](#title) | `string` | **Required** | Powerbars Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## jsonpath

Json path to find value used in aggregation, for example  $.count or $.metrics[0].value, $.count is used by default if this property is not setted.

`jsonpath`
* is optional
* type: `string`
* defined in this schema

### jsonpath Type


`string`






## title

Title of PowerBar

`title`
* is **required**
* type: `string`
* defined in this schema

### title Type


`string`






## Swimlane Contributor Configuration Schema

```
swimlaneContributorConf.schema.json
```

The Configuration of Swimlane Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Swimlane Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [datatype](#datatype) | `enum` | Optional | Swimlane Contributor Configuration (this schema) |
| [identifier](#identifier) | `string` | **Required** | Swimlane Contributor Configuration (this schema) |
| [name](#name) | `string` | **Required** | Swimlane Contributor Configuration (this schema) |
| [numberOfBuckets](#numberofbuckets) | `number` | Optional | Swimlane Contributor Configuration (this schema) |
| [swimlanes](#swimlanes) | `object[]` | **Required** | Swimlane Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## datatype

Type of data for Swimlane

`datatype`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#datatype-known-values).

### datatype Known Values
| Value | Description |
|-------|-------------|
| `numeric` |  |
| `time` |  |




## identifier

The unique identifier for a Contributor

`identifier`
* is **required**
* type: `string`
* defined in this schema

### identifier Type


`string`






## name

The name of the Contributor

`name`
* is **required**
* type: `string`
* defined in this schema

### name Type


`string`






## numberOfBuckets

Number of buckets in the swimlane. If not specified, the interval in aggregation model is used instead.

`numberOfBuckets`
* is optional
* type: `number`
* defined in this schema

### numberOfBuckets Type


`number`






## swimlanes

List of swimlanes

`swimlanes`
* is **required**
* type: `object[]`
* at least `1` items in the array
* defined in this schema

### swimlanes Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `aggregationmodels`|  | **Required** |
| `id`|  | **Required** |
| `jsonpath`| string | Optional |
| `name`|  | **Required** |
| `termField`| string | **Required** |
| `xAxisField`| string | **Required** |



#### aggregationmodels

undefined

`aggregationmodels`
* is **required**
* type: reference

##### aggregationmodels Type


* []() – `rootContributorConf.schema.json#/definitions/aggregationmodels`







#### id

undefined

`id`
* is **required**
* type: complex

##### id Type

Unknown type ``.

```json
{
  "simpletype": "complex"
}
```







#### jsonpath

Json path to find value used in aggregation, for example  $.count or $.metrics[0].value, $.count is used by default if this property is not setted.

`jsonpath`
* is optional
* type: `string`

##### jsonpath Type


`string`








#### name

undefined

`name`
* is **required**
* type: complex

##### name Type

Unknown type ``.

```json
{
  "simpletype": "complex"
}
```







#### termField

The term field that separates the swimlane to lanes

`termField`
* is **required**
* type: `string`

##### termField Type


`string`








#### xAxisField

Numeric/temporal field represented on the x axis of the swimlane

`xAxisField`
* is **required**
* type: `string`

##### xAxisField Type


`string`














## Map Contributor Configuration Schema

```
mapContributorConf.schema.json
```

The Configuration of Map Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Map Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [drawtype](#drawtype) | `enum` | **Required** | Map Contributor Configuration (this schema) |
| [geometry](#geometry) | `string` | **Required** | Map Contributor Configuration (this schema) |
| [idFieldName](#idfieldname) | `string` | **Required** | Map Contributor Configuration (this schema) |
| [includeFeaturesFields](#includefeaturesfields) | `string[]` | Optional | Map Contributor Configuration (this schema) |
| [initZoom](#initzoom) | `number` | **Required** | Map Contributor Configuration (this schema) |
| [isFlat](#isflat) | `boolean` | Optional | Map Contributor Configuration (this schema) |
| [maxPrecision](#maxprecision) | `array` | **Required** | Map Contributor Configuration (this schema) |
| [nbMaxDefautFeatureForCluster](#nbmaxdefautfeatureforcluster) | `number` | **Required** | Map Contributor Configuration (this schema) |
| [zoomLevelForTestCount](#zoomlevelfortestcount) | `number` | **Required** | Map Contributor Configuration (this schema) |
| [zoomLevelFullData](#zoomlevelfulldata) | `number` | **Required** | Map Contributor Configuration (this schema) |
| [zoomToNbMaxFeatureForCluster](#zoomtonbmaxfeatureforcluster) | `array[]` | **Required** | Map Contributor Configuration (this schema) |
| [zoomToPrecisionCluster](#zoomtoprecisioncluster) | `array[]` | **Required** | Map Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## drawtype

Type of representation for aggregate data

`drawtype`
* is **required**
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#drawtype-known-values).

### drawtype Known Values
| Value | Description |
|-------|-------------|
| `CIRCLE` |  |
| `RECTANGLE` |  |




## geometry

Geometry field of index

`geometry`
* is **required**
* type: `string`
* defined in this schema

### geometry Type


`string`






## idFieldName

Id of entity to show on Map

`idFieldName`
* is **required**
* type: `string`
* defined in this schema

### idFieldName Type


`string`






## includeFeaturesFields

List of fields pattern or names that will be included in features mode as geojson properties.

`includeFeaturesFields`
* is optional
* type: `string[]`

* defined in this schema

### includeFeaturesFields Type


Array type: `string[]`

All items must be of the type:
`string`



  
Field pattern or name







## initZoom

Initial zoom of  Map

`initZoom`
* is **required**
* type: `number`
* defined in this schema

### initZoom Type


`number`






## isFlat

If true, geosjon properties will be flat, true by default

`isFlat`
* is optional
* type: `boolean`
* defined in this schema

### isFlat Type


`boolean`





## maxPrecision


`maxPrecision`
* is **required**
* type: `array`
* between `2` and `2` items in the array
* defined in this schema

### maxPrecision Type


Array type: `array`

All items must be of the type:
Unknown type ``.

```json
{
  "type": "array",
  "minItems": 2,
  "maxItems": 2,
  "items": [
    {
      "description": "Precision of geohash aggregation",
      "type": "number"
    },
    {
      "description": "Level of geohash to retrieve data like tile",
      "type": "number"
    }
  ],
  "isrequired": true,
  "simpletype": "`array`"
}
```








## nbMaxDefautFeatureForCluster

Defaut number of features below which we show data without agrgegation

`nbMaxDefautFeatureForCluster`
* is **required**
* type: `number`
* defined in this schema

### nbMaxDefautFeatureForCluster Type


`number`






## zoomLevelForTestCount

Zoom from which we test to retrieve data without aggregation

`zoomLevelForTestCount`
* is **required**
* type: `number`
* defined in this schema

### zoomLevelForTestCount Type


`number`






## zoomLevelFullData

Max zoom to retrieve all world data

`zoomLevelFullData`
* is **required**
* type: `number`
* defined in this schema

### zoomLevelFullData Type


`number`






## zoomToNbMaxFeatureForCluster

List of couple zoom-number to associate a number of features below which we show data without agrgegation for each zoom

`zoomToNbMaxFeatureForCluster`
* is **required**
* type: `array[]` (nested array)

* defined in this schema

### zoomToNbMaxFeatureForCluster Type


Nested array type: `array`



All items must be of the type:
Unknown type ``.

```json
{
  "type": "array",
  "minItems": 2,
  "maxItems": 2,
  "items": [
    {
      "description": "Zoom value",
      "type": "number"
    },
    {
      "description": "Number of features below which we show data without agrgegation",
      "type": "number"
    }
  ],
  "simpletype": "`array`"
}
```










## zoomToPrecisionCluster

List of triplet zoom-precison-level to associate a couple precision-level for each zoom

`zoomToPrecisionCluster`
* is **required**
* type: `array[]` (nested array)

* defined in this schema

### zoomToPrecisionCluster Type


Nested array type: `array`



All items must be of the type:
Unknown type ``.

```json
{
  "type": "array",
  "minItems": 3,
  "maxItems": 3,
  "items": [
    {
      "description": "Zoom value",
      "type": "number"
    },
    {
      "description": "Precision of geohash aggregation",
      "type": "number"
    },
    {
      "description": "Level of geohash to retrieve data like tile",
      "type": "number"
    }
  ],
  "simpletype": "`array`"
}
```










## Chipsearch Contributor Configuration Schema

```
chipssearchContributorConf.schema.json
```

The Configuration of ChipSearch Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Chipsearch Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [identifier](#identifier) | `string` | **Required** | Chipsearch Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## identifier

The unique identifier for a Contributor

`identifier`
* is **required**
* type: `string`
* defined in this schema

### identifier Type


`string`






## Donuts Contributor Configuration Schema

```
donutContributorConf.schema.json
```

The Configuration of Donut Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Donuts Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [arcMinPourcentage](#arcminpourcentage) | `number` | Optional | Donuts Contributor Configuration (this schema) |
| [title](#title) | `string` | **Required** | Donuts Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## arcMinPourcentage

The minimum ratio of the arc in its ring needed to be plot. Otherwise the arc is considered as OTHER

`arcMinPourcentage`
* is optional
* type: `number`
* defined in this schema

### arcMinPourcentage Type


`number`






## title

Title of Donut

`title`
* is **required**
* type: `string`
* defined in this schema

### title Type


`string`






## Histogram Contributor Configuration Schema

```
histogramContributorConf.schema.json
```

The Configuration of Histogram Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Histogram Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [datatype](#datatype) | `enum` | **Required** | Histogram Contributor Configuration (this schema) |
| [isOneDimension](#isonedimension) | `boolean` | **Required** | Histogram Contributor Configuration (this schema) |
| [jsonpath](#jsonpath) | `string` | Optional | Histogram Contributor Configuration (this schema) |
| [numberOfBuckets](#numberofbuckets) | `number` | Optional | Histogram Contributor Configuration (this schema) |
| [timeShortcuts](#timeshortcuts) | `enum[]` | Optional | Histogram Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## datatype

Type of data for histogram

`datatype`
* is **required**
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#datatype-known-values).

### datatype Known Values
| Value | Description |
|-------|-------------|
| `numeric` |  |
| `time` |  |




## isOneDimension

True if it's one dimension histogram

`isOneDimension`
* is **required**
* type: `boolean`
* defined in this schema

### isOneDimension Type


`boolean`





## jsonpath

Json path to find value used in aggregation, for example  $.count or $.metrics[0].value, $.count is used by default if this property is not setted.

`jsonpath`
* is optional
* type: `string`
* defined in this schema

### jsonpath Type


`string`






## numberOfBuckets

Number of buckets in the histogram. If not specified, the interval in aggregation model is used instead.

`numberOfBuckets`
* is optional
* type: `number`
* defined in this schema

### numberOfBuckets Type


`number`






## timeShortcuts

List of time shortcuts labels to be fetched from the predefined shortcuts list

`timeShortcuts`
* is optional
* type: `enum[]`

* defined in this schema

### timeShortcuts Type


Array type: `enum[]`

All items must be of the type:
`string`









## ResultList Contributor Configuration Schema

```
resultlistContributorConf.schema.json
```

The Configuration of ResultList Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## ResultList Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [columns](#columns) | `object[]` | **Required** | ResultList Contributor Configuration (this schema) |
| [details](#details) | `array` | **Required** | ResultList Contributor Configuration (this schema) |
| [fieldsConfiguration](#fieldsconfiguration) | `object` | **Required** | ResultList Contributor Configuration (this schema) |
| [identifier](#identifier) | reference | **Required** | ResultList Contributor Configuration (this schema) |
| [name](#name) | reference | **Required** | ResultList Contributor Configuration (this schema) |
| [process](#process) | complex | Optional | ResultList Contributor Configuration (this schema) |
| [search_size](#search_size) | `integer` | Optional | ResultList Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## columns

Configuration of columns

`columns`
* is **required**
* type: `object[]`

* defined in this schema

### columns Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `columnName`| string | Optional |
| `dataType`| string | Optional |
| `dropdown`| boolean | Optional |
| `dropdownsize`| number | Optional |
| `fieldName`| string | Optional |
| `process`| string | Optional |



#### columnName

Name of column view in app

`columnName`
* is optional
* type: `string`

##### columnName Type


`string`








#### dataType

Unit of column (ex: °C, km ..)

`dataType`
* is optional
* type: `string`

##### dataType Type


`string`








#### dropdown

Whether the filter column search has a dropdown list

`dropdown`
* is optional
* type: `boolean`

##### dropdown Type


`boolean`







#### dropdownsize

Size of dropdown list, 10 by default

`dropdownsize`
* is optional
* type: `number`

##### dropdownsize Type


`number`








#### fieldName

Field of column

`fieldName`
* is optional
* type: `string`

##### fieldName Type


`string`








#### process

Process transformation to display (ex : result.trim())

`process`
* is optional
* type: `string`

##### process Type


`string`








  
Columns







## details

Details for one item, list of theme

`details`
* is **required**
* type: `array`

* defined in this schema

### details Type


Array type: `array`

All items must be of the type:
Unknown type ``.

```json
{
  "description": "Details for one item, list of theme",
  "type": "array",
  "items": {
    "description": "Theme configuration",
    "properties": {
      "name": {
        "description": "Name of theme",
        "type": "string"
      },
      "order": {
        "description": "Position of theme section",
        "type": "number"
      },
      "fields": {
        "description": "List field to return in this theme",
        "type": "array",
        "items": {
          "description": "Field configuration",
          "type": "object",
          "properties": {
            "label": {
              "description": "Label of field",
              "type": "string"
            },
            "path": {
              "description": "Path of field",
              "type": "string"
            },
            "process": {
              "description": "Process transformation for the field",
              "type": "string"
            }
          },
          "required": [
            "label",
            "path",
            "process"
          ]
        }
      }
    },
    "required": [
      "name",
      "order",
      "fields"
    ],
    "simpletype": "complex"
  },
  "isrequired": true,
  "simpletype": "`array`"
}
```


  
Theme configuration







## fieldsConfiguration

Global configuration of resultlist

`fieldsConfiguration`
* is **required**
* type: `object`
* defined in this schema

### fieldsConfiguration Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `icon`| string | Optional |
| `iconCssClass`| string | Optional |
| `idFieldName`| string | Optional |
| `titleFieldNames`| array | Optional |
| `tooltipFieldNames`| array | Optional |
| `urlImageTemplate`| string | Optional |
| `urlThumbnailTemplate`| string | Optional |



#### icon

Material icon value

`icon`
* is optional
* type: `string`

##### icon Type


`string`








#### iconCssClass

Field path of field to customize css

`iconCssClass`
* is optional
* type: `string`

##### iconCssClass Type


`string`








#### idFieldName

Field name of unique identifier

`idFieldName`
* is optional
* type: `string`

##### idFieldName Type


`string`








#### titleFieldNames

Fields elements to draw title of a grid element

`titleFieldNames`
* is optional
* type: `object[]`


##### titleFieldNames Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `fieldPath`| string | Optional |
| `process`| string | Optional |



#### fieldPath

Path of field

`fieldPath`
* is optional
* type: `string`

##### fieldPath Type


`string`








#### process

Process transformation to display (ex : result.trim())

`process`
* is optional
* type: `string`

##### process Type


`string`








  
Fields









#### tooltipFieldNames

Fields elements to draw tooltip  of a grid element

`tooltipFieldNames`
* is optional
* type: `object[]`


##### tooltipFieldNames Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `fieldPath`| string | Optional |
| `process`| string | Optional |



#### fieldPath

Path of field

`fieldPath`
* is optional
* type: `string`

##### fieldPath Type


`string`








#### process

Process transformation to display (ex : result.trim())

`process`
* is optional
* type: `string`

##### process Type


`string`








  
Fields









#### urlImageTemplate

Url template of image

`urlImageTemplate`
* is optional
* type: `string`

##### urlImageTemplate Type


`string`








#### urlThumbnailTemplate

Url template of thumbnail

`urlThumbnailTemplate`
* is optional
* type: `string`

##### urlThumbnailTemplate Type


`string`











## identifier


`identifier`
* is **required**
* type: reference
* defined in this schema

### identifier Type


* []() – `rootContributorConf.schema.json#/definitions/identifier`





## name


`name`
* is **required**
* type: reference
* defined in this schema

### name Type


* []() – `rootContributorConf.schema.json#/definitions/name`





## process


`process`
* is optional
* type: complex
* defined in this schema

### process Type

Unknown type ``.

```json
{
  "urlImageTemplate": {
    "description": "Process transformation for urlImageTemplate",
    "type": "string"
  },
  "urlThumbnailTemplate": {
    "description": "Process transformation for urlThumbnailTemplate",
    "type": "string"
  },
  "simpletype": "complex"
}
```





## search_size

The size of search result on server side

`search_size`
* is optional
* type: `integer`
* defined in this schema

### search_size Type


`integer`






## Powerbars input configuration Schema

```
powerbars.schema.json
```

The Configuration input of  powerbars

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Powerbars input configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [customizedCssClass](#customizedcssclass) | `string` | Optional | Powerbars input configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## customizedCssClass

Css class name to use to customize a specific powerbar's style.

`customizedCssClass`
* is optional
* type: `string`
* defined in this schema

### customizedCssClass Type


`string`






## Histogram input configuration Schema

```
histogram.schema.json
```

The Configuration input of an histogram

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Histogram input configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [applyOffsetOnAreaChart](#applyoffsetonareachart) | `boolean` | Optional | Histogram input configuration (this schema) |
| [barWeight](#barweight) | `number` | Optional | Histogram input configuration (this schema) |
| [brushHandlesHeightWeight](#brushhandlesheightweight) | `number` | Optional | Histogram input configuration (this schema) |
| [chartHeight](#chartheight) | complex | Optional | Histogram input configuration (this schema) |
| [chartTitle](#charttitle) | `string` | Optional | Histogram input configuration (this schema) |
| [chartType](#charttype) | `enum` | Optional | Histogram input configuration (this schema) |
| [chartWidth](#chartwidth) | complex | Optional | Histogram input configuration (this schema) |
| [customizedCssClass](#customizedcssclass) | `string` | Optional | Histogram input configuration (this schema) |
| [dataType](#datatype) | `enum` | Optional | Histogram input configuration (this schema) |
| [dataUnit](#dataunit) | `enum` | Optional | Histogram input configuration (this schema) |
| [descriptionPosition](#descriptionposition) | `enum` | Optional | Histogram input configuration (this schema) |
| [displayOnlyIntervalsWithData](#displayonlyintervalswithdata) | `boolean` | Optional | Histogram input configuration (this schema) |
| [id](#id) | `string` | **Required** | Histogram input configuration (this schema) |
| [isHistogramSelectable](#ishistogramselectable) | `boolean` | Optional | Histogram input configuration (this schema) |
| [isSmoothedCurve](#issmoothedcurve) | `boolean` | Optional | Histogram input configuration (this schema) |
| [leftOffsetRemoveInterval](#leftoffsetremoveinterval) | `number` | Optional | Histogram input configuration (this schema) |
| [multiselectable](#multiselectable) | `boolean` | Optional | Histogram input configuration (this schema) |
| [paletteColors](#palettecolors) | `array` | Optional | Histogram input configuration (this schema) |
| [showHorizontalLines](#showhorizontallines) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showStripes](#showstripes) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showXLabels](#showxlabels) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showXTicks](#showxticks) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showYLabels](#showylabels) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showYTicks](#showyticks) | `boolean` | Optional | Histogram input configuration (this schema) |
| [ticksDateFormat](#ticksdateformat) | `string` | Optional | Histogram input configuration (this schema) |
| [topOffsetRemoveInterval](#topoffsetremoveinterval) | `number` | Optional | Histogram input configuration (this schema) |
| [xAxisPosition](#xaxisposition) | `enum` | Optional | Histogram input configuration (this schema) |
| [xLabels](#xlabels) | `integer` | Optional | Histogram input configuration (this schema) |
| [xTicks](#xticks) | `integer` | Optional | Histogram input configuration (this schema) |
| [yAxisStartsFromZero](#yaxisstartsfromzero) | `boolean` | Optional | Histogram input configuration (this schema) |
| [yLabels](#ylabels) | `integer` | Optional | Histogram input configuration (this schema) |
| [yTicks](#yticks) | `integer` | Optional | Histogram input configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## applyOffsetOnAreaChart

Translates area chart by half data interval

`applyOffsetOnAreaChart`
* is optional
* type: `boolean`
* defined in this schema

### applyOffsetOnAreaChart Type


`boolean`





## barWeight

Weight applied to bars width. ]0,1].

`barWeight`
* is optional
* type: `number`
* defined in this schema

### barWeight Type


`number`






## brushHandlesHeightWeight

 A 0 to 1 weight of the brush height. It controls the brush handles height.

`brushHandlesHeightWeight`
* is optional
* type: `number`
* defined in this schema

### brushHandlesHeightWeight Type


`number`






## chartHeight

Chart's height. If set to null, the chart takes the component's container height

`chartHeight`
* is optional
* type: complex
* defined in this schema

### chartHeight Type


**One** of the following *conditions* need to be fulfilled.


#### Condition 1


`number`



#### Condition 2







## chartTitle

Chart's title

`chartTitle`
* is optional
* type: `string`
* defined in this schema

### chartTitle Type


`string`






## chartType

Chart's representation type.

`chartType`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#charttype-known-values).

### chartType Known Values
| Value | Description |
|-------|-------------|
| `bars` |  |
| `area` |  |
| `oneDimension` |  |




## chartWidth

Chart's width. If set to null, the chart takes the component's container width.

`chartWidth`
* is optional
* type: complex
* defined in this schema

### chartWidth Type


**One** of the following *conditions* need to be fulfilled.


#### Condition 1


`number`



#### Condition 2







## customizedCssClass

Css class name to use to customize a specific `arlas-histogram` component.

`customizedCssClass`
* is optional
* type: `string`
* defined in this schema

### customizedCssClass Type


`string`






## dataType

Type of data in histogram

`dataType`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#datatype-known-values).

### dataType Known Values
| Value | Description |
|-------|-------------|
| `numeric` |  |
| `time` |  |




## dataUnit

Unit of time in histogram

`dataUnit`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#dataunit-known-values).

### dataUnit Known Values
| Value | Description |
|-------|-------------|
| `millisecond` |  |
| `second` |  |




## descriptionPosition

The start/end values positon : above or below the chart.

`descriptionPosition`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#descriptionposition-known-values).

### descriptionPosition Known Values
| Value | Description |
|-------|-------------|
| `top` |  |
| `bottom` |  |




## displayOnlyIntervalsWithData

If you can select several period on histogram

`displayOnlyIntervalsWithData`
* is optional
* type: `boolean`
* defined in this schema

### displayOnlyIntervalsWithData Type


`boolean`





## id

Identifier of the histogram

`id`
* is **required**
* type: `string`
* defined in this schema

### id Type


`string`






## isHistogramSelectable

If you can select a period on histogram

`isHistogramSelectable`
* is optional
* type: `boolean`
* defined in this schema

### isHistogramSelectable Type


`boolean`





## isSmoothedCurve

 Whether the curve of an `area` chart is smoothed.

`isSmoothedCurve`
* is optional
* type: `boolean`
* defined in this schema

### isSmoothedCurve Type


`boolean`





## leftOffsetRemoveInterval

Left offset position of the remove-selection-button

`leftOffsetRemoveInterval`
* is optional
* type: `number`
* defined in this schema

### leftOffsetRemoveInterval Type


`number`






## multiselectable

If you can select several period on histogram

`multiselectable`
* is optional
* type: `boolean`
* defined in this schema

### multiselectable Type


`boolean`





## paletteColors

Either a hex string color or a color name (in English) or a saturation interval.

`paletteColors`
* is optional
* type: `array`

* defined in this schema

### paletteColors Type


Array type: `array`






## showHorizontalLines

Whether showing the horizontal dashed lines.

`showHorizontalLines`
* is optional
* type: `boolean`
* defined in this schema

### showHorizontalLines Type


`boolean`





## showStripes

Whether to add stripes in the histogram when yAxis starts from minimum of data.

`showStripes`
* is optional
* type: `boolean`
* defined in this schema

### showStripes Type


`boolean`





## showXLabels

Whether showing the X axis labels.

`showXLabels`
* is optional
* type: `boolean`
* defined in this schema

### showXLabels Type


`boolean`





## showXTicks

Whether showing the X axis ticks.m

`showXTicks`
* is optional
* type: `boolean`
* defined in this schema

### showXTicks Type


`boolean`





## showYLabels

Whether showing the Y axis labels.

`showYLabels`
* is optional
* type: `boolean`
* defined in this schema

### showYLabels Type


`boolean`





## showYTicks

Whether showing the Y axis ticks.

`showYTicks`
* is optional
* type: `boolean`
* defined in this schema

### showYTicks Type


`boolean`





## ticksDateFormat

The date format of ticks.* Please refer to this [list of specifiers](https://github.com/d3/d3-time-format/blob/master/README.md#locale_format).

`ticksDateFormat`
* is optional
* type: `string`
* defined in this schema

### ticksDateFormat Type


`string`






## topOffsetRemoveInterval

Top position of the remove-selection-button

`topOffsetRemoveInterval`
* is optional
* type: `number`
* defined in this schema

### topOffsetRemoveInterval Type


`number`






## xAxisPosition

The xAxis positon : above or below the chart.

`xAxisPosition`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#xaxisposition-known-values).

### xAxisPosition Known Values
| Value | Description |
|-------|-------------|
| `top` |  |
| `bottom` |  |




## xLabels

Number of labels in the X axis.

`xLabels`
* is optional
* type: `integer`
* defined in this schema

### xLabels Type


`integer`






## xTicks

Number of ticks in the X axis.

`xTicks`
* is optional
* type: `integer`
* defined in this schema

### xTicks Type


`integer`






## yAxisStartsFromZero

Whether the histogram values start from zero or from the minimum of data.

`yAxisStartsFromZero`
* is optional
* type: `boolean`
* defined in this schema

### yAxisStartsFromZero Type


`boolean`





## yLabels

Number of labels in the Y axis.

`yLabels`
* is optional
* type: `integer`
* defined in this schema

### yLabels Type


`integer`






## yTicks

Number of ticks in the Y axis.

`yTicks`
* is optional
* type: `integer`
* defined in this schema

### yTicks Type


`integer`






## Donut input configuration Schema

```
donut.schema.json
```

The Configuration input of donut

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Donut input configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [colorsSaturationWeight](#colorssaturationweight) | `number` | Optional | Donut input configuration (this schema) |
| [customizedCssClass](#customizedcssclass) | `string` | Optional | Donut input configuration (this schema) |
| [id](#id) | `string` | **Required** | Donut input configuration (this schema) |
| [keysToColors](#keystocolors) | `array[]` | Optional | Donut input configuration (this schema) |
| [multiselectable](#multiselectable) | `boolean` | Optional | Donut input configuration (this schema) |
| [opacity](#opacity) | `number` | Optional | Donut input configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## colorsSaturationWeight

The percentage of highest values in saturation scale. For exemple, colorsSaturationWeight = 1/5,  means that colors saturation values will be between 0.8 and 1. Knowing that saturation scale is [0 - 1]

`colorsSaturationWeight`
* is optional
* type: `number`
* defined in this schema

### colorsSaturationWeight Type


`number`






## customizedCssClass

Css class name to use to customize a specific powerbar's style.

`customizedCssClass`
* is optional
* type: `string`
* defined in this schema

### customizedCssClass Type


`string`






## id

Identifier of the donut

`id`
* is **required**
* type: `string`
* defined in this schema

### id Type


`string`






## keysToColors

List of [key, color] couples that associates a hex color to each key

`keysToColors`
* is optional
* type: `array[]` (nested array)

* defined in this schema

### keysToColors Type


Nested array type: `array`



All items must be of the type:
Unknown type ``.

```json
{
  "type": "array",
  "minItems": 2,
  "maxItems": 2,
  "items": [
    {
      "description": "Key to which a color is associated",
      "type": "string"
    },
    {
      "description": "Hex color associated to the key",
      "type": "string"
    }
  ],
  "simpletype": "`array`"
}
```










## multiselectable

Whether the donut is multi-selectable

`multiselectable`
* is optional
* type: `boolean`
* defined in this schema

### multiselectable Type


`boolean`





## opacity

Opacity of unselected/unhovered arcs

`opacity`
* is optional
* type: `number`
* defined in this schema

### opacity Type


`number`






## Swimlane input configuration Schema

```
swimlane.schema.json
```

The Configuration input of a swimlane

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Swimlane input configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [swimLaneLabelsWidth](#swimlanelabelswidth) | `number` | Optional | Swimlane input configuration (this schema) |
| [swimlaneBorderRadius](#swimlaneborderradius) | `number` | Optional | Swimlane input configuration (this schema) |
| [swimlaneHeight](#swimlaneheight) | `number` | Optional | Swimlane input configuration (this schema) |
| [swimlaneMode](#swimlanemode) | `enum` | Optional | Swimlane input configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## swimLaneLabelsWidth

The width of swimlane labels space.

`swimLaneLabelsWidth`
* is optional
* type: `number`
* defined in this schema

### swimLaneLabelsWidth Type


`number`






## swimlaneBorderRadius

The radius of swimlane bars borders

`swimlaneBorderRadius`
* is optional
* type: `number`
* defined in this schema

### swimlaneBorderRadius Type


`number`






## swimlaneHeight

 The height of a single lane. If not specified, a lane height is the chartHeight devided by the number of lanes.

`swimlaneHeight`
* is optional
* type: `number`
* defined in this schema

### swimlaneHeight Type


`number`






## swimlaneMode

The swimlane representation mode.

`swimlaneMode`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#swimlanemode-known-values).

### swimlaneMode Known Values
| Value | Description |
|-------|-------------|
| `variableHeight` |  |
| `fixedHeight` |  |




## Map&#39;s inputs configuration Schema

```
mapgl.schema.json
```

The Configuration of the map's inputs

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Map&#39;s inputs configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [displayScale](#displayscale) | `boolean` | Optional | Map&#39;s inputs configuration (this schema) |
| [idFeatureField](#idfeaturefield) | `string` | **Required** | Map&#39;s inputs configuration (this schema) |
| [initCenter](#initcenter) | `array` | Optional | Map&#39;s inputs configuration (this schema) |
| [initZoom](#initzoom) | `number` | Optional | Map&#39;s inputs configuration (this schema) |
| [mapLayers](#maplayers) | `object` | **Required** | Map&#39;s inputs configuration (this schema) |
| [mapSources](#mapsources) | `object[]` | Optional | Map&#39;s inputs configuration (this schema) |
| [margePanForLoad](#margepanforload) | `number` | **Required** | Map&#39;s inputs configuration (this schema) |
| [margePanForTest](#margepanfortest) | `number` | **Required** | Map&#39;s inputs configuration (this schema) |
| [maxWidthScale](#maxwidthscale) | `number` | Optional | Map&#39;s inputs configuration (this schema) |
| [maxZoom](#maxzoom) | `number` | Optional | Map&#39;s inputs configuration (this schema) |
| [minZoom](#minzoom) | `number` | Optional | Map&#39;s inputs configuration (this schema) |
| [style](#style) | `string` | Optional | Map&#39;s inputs configuration (this schema) |
| [unitScale](#unitscale) | `string` | Optional | Map&#39;s inputs configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## displayScale

Whether the scale is displayed

`displayScale`
* is optional
* type: `boolean`
* defined in this schema

### displayScale Type


`boolean`





## idFeatureField

Field name of the identifier

`idFeatureField`
* is **required**
* type: `string`
* defined in this schema

### idFeatureField Type


`string`






## initCenter

Coordinates of the map's centre when it's initialized.

`initCenter`
* is optional
* type: `array`
* between `2` and `2` items in the array
* defined in this schema

### initCenter Type


Array type: `array`

All items must be of the type:
Unknown type ``.

```json
{
  "description": "Coordinates of the map's centre when it's initialized.",
  "type": "array",
  "minItems": 2,
  "maxItems": 2,
  "items": [
    {
      "description": "Longitude",
      "type": "number"
    },
    {
      "description": "Latitude",
      "type": "number"
    }
  ],
  "simpletype": "`array`"
}
```








## initZoom

Zoom of the map when it's initialized

`initZoom`
* is optional
* type: `number`
* defined in this schema

### initZoom Type


`number`






## mapLayers


`mapLayers`
* is **required**
* type: `object`
* defined in this schema

### mapLayers Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `events`| object | **Required** |
| `layers`| array | **Required** |
| `styleGroups`| array | **Required** |



#### events

undefined

`events`
* is **required**
* type: `object`

##### events Type

Unknown type `object`.

```json
{
  "type": "object",
  "properties": {
    "onHover": {
      "description": "List of layers ids to listen to on hover",
      "type": "array"
    },
    "emitOnClick": {
      "description": "List of layers ids to listen to on click event in order to emit features",
      "type": "array"
    },
    "zoomOnClick": {
      "description": "List of layers ids to listen to on click event in order to trigger zoom action",
      "type": "array"
    }
  },
  "required": [
    "onHover",
    "emitOnClick",
    "zoomOnClick"
  ],
  "simpletype": "`object`"
}
```







#### layers

List of mapbox-gl layers

`layers`
* is **required**
* type: `array`


##### layers Type


Array type: `array`








#### styleGroups

Either a hex string color or a color name (in English) or a saturation interval.

`styleGroups`
* is **required**
* type: `object[]`


##### styleGroups Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `base`| array | **Required** |
| `id`| string | **Required** |
| `isDefault`| boolean | Optional |
| `name`| string | **Required** |
| `styles`| array | **Required** |



#### base

Ids list of base layers that are added to the map once this style group is chosen.

`base`
* is **required**
* type: `array`


##### base Type


Array type: `array`








#### id

Id of the style group.

`id`
* is **required**
* type: `string`

##### id Type


`string`








#### isDefault

Whether this style group is the default one

`isDefault`
* is optional
* type: `boolean`

##### isDefault Type


`boolean`







#### name

Name of the style group.

`name`
* is **required**
* type: `string`

##### name Type


`string`








#### styles

List of the styles

`styles`
* is **required**
* type: `object[]`


##### styles Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `drawType`| string | Optional |
| `id`| string | **Required** |
| `isDefault`| boolean | Optional |
| `layerIds`| array | **Required** |
| `name`| string | **Required** |



#### drawType

Type of geometry of the style.

`drawType`
* is optional
* type: `enum`

The value of this property **must** be equal to one of the [known values below](#maplayers-known-values).

##### drawType Known Values
| Value | Description |
|-------|-------------|
| `RECTANGLE` |  |
| `CIRCLE` |  |






#### id

Id of the style.

`id`
* is **required**
* type: `string`

##### id Type


`string`








#### isDefault

Whether this style group is the default one

`isDefault`
* is optional
* type: `boolean`

##### isDefault Type


`boolean`







#### layerIds

Ids list of layers that are added to the map when this style is chosen.

`layerIds`
* is **required**
* type: `array`


##### layerIds Type


Array type: `array`








#### name

Name of the style.

`name`
* is **required**
* type: `string`

##### name Type


`string`


























## mapSources

List of mapboxgl sources to add to the map

`mapSources`
* is optional
* type: `object[]`

* defined in this schema

### mapSources Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `id`| string | **Required** |
| `source`| object | **Required** |



#### id

Id of the source.

`id`
* is **required**
* type: `string`

##### id Type


`string`








#### source

Mapboxgl source.

`source`
* is **required**
* type: `object`

##### source Type

Unknown type `object`.

```json
{
  "description": "Mapboxgl source.",
  "type": "object",
  "properties": {
    "type": {
      "description": "Type of the source. Possible values : 'vector' | 'raster' | 'geojson' | 'image' | 'video' | 'canvas'",
      "type": "string"
    },
    "minzoom": {
      "description": "Minimum zoom to display the source layers",
      "type": "integer"
    },
    "maxzoom": {
      "description": "Maximum zoom to display the source layers",
      "type": "integer"
    },
    "url": {
      "description": "Url to the source (for `vector`, `raster`, `image`, `video` types).",
      "type": "string"
    },
    "tiles": {
      "description": "List of tiles (for `vector` and `raster` types).",
      "type": "array"
    },
    "coordinates": {
      "description": "The 4 corners coordinates of the canvas/image/video, given as [longitude, latitude].",
      "type": "array"
    },
    "data": {
      "description": "A geojson object or a url to a geojson file (for `geosjson` type).",
      "type": "array"
    },
    "canvas": {
      "description": "Id of the canvas element (for `canvas` type)",
      "type": "string"
    },
    "animate": {
      "description": "Whether the canvas source is animated (for `canvas` type)",
      "type": "boolean"
    }
  },
  "required": [
    "type"
  ],
  "simpletype": "`object`"
}
```












## margePanForLoad

Margin applied to the map extent. Data is loaded in all this extent

`margePanForLoad`
* is **required**
* type: `number`
* defined in this schema

### margePanForLoad Type


`number`






## margePanForTest

Margin applied to the map extent. Before loading data, the components checks first if there are features already loaded in this extent.

`margePanForTest`
* is **required**
* type: `number`
* defined in this schema

### margePanForTest Type


`number`






## maxWidthScale

Max width of the scale in px. Default value is 100px.

`maxWidthScale`
* is optional
* type: `number`
* defined in this schema

### maxWidthScale Type


`number`






## maxZoom

Max zoom of the map

`maxZoom`
* is optional
* type: `number`
* defined in this schema

### maxZoom Type


`number`






## minZoom

Min zoom of the map

`minZoom`
* is optional
* type: `number`
* defined in this schema

### minZoom Type


`number`






## style

Url to the basemap style

`style`
* is optional
* type: `string`
* defined in this schema

### style Type


`string`






## unitScale

Unit of the scale. Default value is 'metric'.

`unitScale`
* is optional
* type: `string`
* defined in this schema

### unitScale Type


`string`





