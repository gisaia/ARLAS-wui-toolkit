
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





