
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





