
## Donut input configuration Schema

```
donut.schema.json
```

The Configuration input of donut

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Donut input configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [colorsSaturationWeight](#colorssaturationweight) | `number` | Optional | Donut input configuration (this schema) |
| [customizedCssClass](#customizedcssclass) | `string` | Optional | Donut input configuration (this schema) |
| [id](#id) | `string` | **Required** | Donut input configuration (this schema) |
| [keysToColors](#keystocolors) | `array[]` | Optional | Donut input configuration (this schema) |
| [multiselectable](#multiselectable) | `boolean` | Optional | Donut input configuration (this schema) |
| [opacity](#opacity) | `number` | Optional | Donut input configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## colorsSaturationWeight

The percentage of highest values in saturation scale. For exemple, colorsSaturationWeight = 1/5,  means that colors saturation values will be between 0.8 and 1. Knowing that saturation scale is [0 - 1]

`colorsSaturationWeight`
* is optional
* type: `number`
* defined in this schema

### colorsSaturationWeight Type


`number`






## customizedCssClass

Css class name to use to customize a specific powerbar's style.

`customizedCssClass`
* is optional
* type: `string`
* defined in this schema

### customizedCssClass Type


`string`






## id

Identifier of the donut

`id`
* is **required**
* type: `string`
* defined in this schema

### id Type


`string`






## keysToColors

List of [key, color] couples that associates a hex color to each key

`keysToColors`
* is optional
* type: `array[]` (nested array)

* defined in this schema

### keysToColors Type


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
      "description": "Key to which a color is associated",
      "type": "string"
    },
    {
      "description": "Hex color associated to the key",
      "type": "string"
    }
  ],
  "simpletype": "`array`"
}
```










## multiselectable

Whether the donut is multi-selectable

`multiselectable`
* is optional
* type: `boolean`
* defined in this schema

### multiselectable Type


`boolean`





## opacity

Opacity of unselected/unhovered arcs

`opacity`
* is optional
* type: `number`
* defined in this schema

### opacity Type


`number`





