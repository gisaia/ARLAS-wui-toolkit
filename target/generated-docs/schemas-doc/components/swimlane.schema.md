
## Swimlane input configuration Schema

```
swimlane.schema.json
```

The Configuration input of a swimlane

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Swimlane input configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [swimLaneLabelsWidth](#swimlanelabelswidth) | `number` | Optional | Swimlane input configuration (this schema) |
| [swimlaneBorderRadius](#swimlaneborderradius) | `number` | Optional | Swimlane input configuration (this schema) |
| [swimlaneHeight](#swimlaneheight) | `number` | Optional | Swimlane input configuration (this schema) |
| [swimlaneMode](#swimlanemode) | `enum` | Optional | Swimlane input configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## swimLaneLabelsWidth

The width of swimlane labels space.

`swimLaneLabelsWidth`
* is optional
* type: `number`
* defined in this schema

### swimLaneLabelsWidth Type


`number`






## swimlaneBorderRadius

The radius of swimlane bars borders

`swimlaneBorderRadius`
* is optional
* type: `number`
* defined in this schema

### swimlaneBorderRadius Type


`number`






## swimlaneHeight

 The height of a single lane. If not specified, a lane height is the chartHeight devided by the number of lanes.

`swimlaneHeight`
* is optional
* type: `number`
* defined in this schema

### swimlaneHeight Type


`number`






## swimlaneMode

The swimlane representation mode.

`swimlaneMode`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#swimlanemode-known-values).

### swimlaneMode Known Values
| Value | Description |
|-------|-------------|
| `variableHeight` |  |
| `fixedHeight` |  |



