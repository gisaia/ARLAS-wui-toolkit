
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





