
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









