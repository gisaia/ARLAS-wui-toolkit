
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








