
## Donuts Contributor Configuration Schema

```
donutContributorConf.schema.json
```

The Configuration of Donut Contributor

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Donuts Contributor Configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [arcMinPourcentage](#arcminpourcentage) | `number` | Optional | Donuts Contributor Configuration (this schema) |
| [title](#title) | `string` | **Required** | Donuts Contributor Configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## arcMinPourcentage

The minimum ratio of the arc in its ring needed to be plot. Otherwise the arc is considered as OTHER

`arcMinPourcentage`
* is optional
* type: `number`
* defined in this schema

### arcMinPourcentage Type


`number`






## title

Title of Donut

`title`
* is **required**
* type: `string`
* defined in this schema

### title Type


`string`





