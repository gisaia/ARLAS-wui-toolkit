
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





