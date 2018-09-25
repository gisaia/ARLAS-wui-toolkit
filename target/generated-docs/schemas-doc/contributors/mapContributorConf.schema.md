
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









