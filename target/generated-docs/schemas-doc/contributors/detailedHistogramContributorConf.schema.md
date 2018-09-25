
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





