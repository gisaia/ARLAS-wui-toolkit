
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





