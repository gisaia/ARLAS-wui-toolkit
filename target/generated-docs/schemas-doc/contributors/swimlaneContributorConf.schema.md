
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













