
## Histogram input configuration Schema

```
histogram.schema.json
```

The Configuration input of an histogram

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted |  |

## Histogram input configuration Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [applyOffsetOnAreaChart](#applyoffsetonareachart) | `boolean` | Optional | Histogram input configuration (this schema) |
| [barWeight](#barweight) | `number` | Optional | Histogram input configuration (this schema) |
| [brushHandlesHeightWeight](#brushhandlesheightweight) | `number` | Optional | Histogram input configuration (this schema) |
| [chartHeight](#chartheight) | complex | Optional | Histogram input configuration (this schema) |
| [chartTitle](#charttitle) | `string` | Optional | Histogram input configuration (this schema) |
| [chartType](#charttype) | `enum` | Optional | Histogram input configuration (this schema) |
| [chartWidth](#chartwidth) | complex | Optional | Histogram input configuration (this schema) |
| [customizedCssClass](#customizedcssclass) | `string` | Optional | Histogram input configuration (this schema) |
| [dataType](#datatype) | `enum` | Optional | Histogram input configuration (this schema) |
| [dataUnit](#dataunit) | `enum` | Optional | Histogram input configuration (this schema) |
| [descriptionPosition](#descriptionposition) | `enum` | Optional | Histogram input configuration (this schema) |
| [displayOnlyIntervalsWithData](#displayonlyintervalswithdata) | `boolean` | Optional | Histogram input configuration (this schema) |
| [id](#id) | `string` | **Required** | Histogram input configuration (this schema) |
| [isHistogramSelectable](#ishistogramselectable) | `boolean` | Optional | Histogram input configuration (this schema) |
| [isSmoothedCurve](#issmoothedcurve) | `boolean` | Optional | Histogram input configuration (this schema) |
| [leftOffsetRemoveInterval](#leftoffsetremoveinterval) | `number` | Optional | Histogram input configuration (this schema) |
| [multiselectable](#multiselectable) | `boolean` | Optional | Histogram input configuration (this schema) |
| [paletteColors](#palettecolors) | `array` | Optional | Histogram input configuration (this schema) |
| [showHorizontalLines](#showhorizontallines) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showStripes](#showstripes) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showXLabels](#showxlabels) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showXTicks](#showxticks) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showYLabels](#showylabels) | `boolean` | Optional | Histogram input configuration (this schema) |
| [showYTicks](#showyticks) | `boolean` | Optional | Histogram input configuration (this schema) |
| [ticksDateFormat](#ticksdateformat) | `string` | Optional | Histogram input configuration (this schema) |
| [topOffsetRemoveInterval](#topoffsetremoveinterval) | `number` | Optional | Histogram input configuration (this schema) |
| [xAxisPosition](#xaxisposition) | `enum` | Optional | Histogram input configuration (this schema) |
| [xLabels](#xlabels) | `integer` | Optional | Histogram input configuration (this schema) |
| [xTicks](#xticks) | `integer` | Optional | Histogram input configuration (this schema) |
| [yAxisStartsFromZero](#yaxisstartsfromzero) | `boolean` | Optional | Histogram input configuration (this schema) |
| [yLabels](#ylabels) | `integer` | Optional | Histogram input configuration (this schema) |
| [yTicks](#yticks) | `integer` | Optional | Histogram input configuration (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## applyOffsetOnAreaChart

Translates area chart by half data interval

`applyOffsetOnAreaChart`
* is optional
* type: `boolean`
* defined in this schema

### applyOffsetOnAreaChart Type


`boolean`





## barWeight

Weight applied to bars width. ]0,1].

`barWeight`
* is optional
* type: `number`
* defined in this schema

### barWeight Type


`number`






## brushHandlesHeightWeight

 A 0 to 1 weight of the brush height. It controls the brush handles height.

`brushHandlesHeightWeight`
* is optional
* type: `number`
* defined in this schema

### brushHandlesHeightWeight Type


`number`






## chartHeight

Chart's height. If set to null, the chart takes the component's container height

`chartHeight`
* is optional
* type: complex
* defined in this schema

### chartHeight Type


**One** of the following *conditions* need to be fulfilled.


#### Condition 1


`number`



#### Condition 2







## chartTitle

Chart's title

`chartTitle`
* is optional
* type: `string`
* defined in this schema

### chartTitle Type


`string`






## chartType

Chart's representation type.

`chartType`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#charttype-known-values).

### chartType Known Values
| Value | Description |
|-------|-------------|
| `bars` |  |
| `area` |  |
| `oneDimension` |  |




## chartWidth

Chart's width. If set to null, the chart takes the component's container width.

`chartWidth`
* is optional
* type: complex
* defined in this schema

### chartWidth Type


**One** of the following *conditions* need to be fulfilled.


#### Condition 1


`number`



#### Condition 2







## customizedCssClass

Css class name to use to customize a specific `arlas-histogram` component.

`customizedCssClass`
* is optional
* type: `string`
* defined in this schema

### customizedCssClass Type


`string`






## dataType

Type of data in histogram

`dataType`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#datatype-known-values).

### dataType Known Values
| Value | Description |
|-------|-------------|
| `numeric` |  |
| `time` |  |




## dataUnit

Unit of time in histogram

`dataUnit`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#dataunit-known-values).

### dataUnit Known Values
| Value | Description |
|-------|-------------|
| `millisecond` |  |
| `second` |  |




## descriptionPosition

The start/end values positon : above or below the chart.

`descriptionPosition`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#descriptionposition-known-values).

### descriptionPosition Known Values
| Value | Description |
|-------|-------------|
| `top` |  |
| `bottom` |  |




## displayOnlyIntervalsWithData

If you can select several period on histogram

`displayOnlyIntervalsWithData`
* is optional
* type: `boolean`
* defined in this schema

### displayOnlyIntervalsWithData Type


`boolean`





## id

Identifier of the histogram

`id`
* is **required**
* type: `string`
* defined in this schema

### id Type


`string`






## isHistogramSelectable

If you can select a period on histogram

`isHistogramSelectable`
* is optional
* type: `boolean`
* defined in this schema

### isHistogramSelectable Type


`boolean`





## isSmoothedCurve

 Whether the curve of an `area` chart is smoothed.

`isSmoothedCurve`
* is optional
* type: `boolean`
* defined in this schema

### isSmoothedCurve Type


`boolean`





## leftOffsetRemoveInterval

Left offset position of the remove-selection-button

`leftOffsetRemoveInterval`
* is optional
* type: `number`
* defined in this schema

### leftOffsetRemoveInterval Type


`number`






## multiselectable

If you can select several period on histogram

`multiselectable`
* is optional
* type: `boolean`
* defined in this schema

### multiselectable Type


`boolean`





## paletteColors

Either a hex string color or a color name (in English) or a saturation interval.

`paletteColors`
* is optional
* type: `array`

* defined in this schema

### paletteColors Type


Array type: `array`






## showHorizontalLines

Whether showing the horizontal dashed lines.

`showHorizontalLines`
* is optional
* type: `boolean`
* defined in this schema

### showHorizontalLines Type


`boolean`





## showStripes

Whether to add stripes in the histogram when yAxis starts from minimum of data.

`showStripes`
* is optional
* type: `boolean`
* defined in this schema

### showStripes Type


`boolean`





## showXLabels

Whether showing the X axis labels.

`showXLabels`
* is optional
* type: `boolean`
* defined in this schema

### showXLabels Type


`boolean`





## showXTicks

Whether showing the X axis ticks.m

`showXTicks`
* is optional
* type: `boolean`
* defined in this schema

### showXTicks Type


`boolean`





## showYLabels

Whether showing the Y axis labels.

`showYLabels`
* is optional
* type: `boolean`
* defined in this schema

### showYLabels Type


`boolean`





## showYTicks

Whether showing the Y axis ticks.

`showYTicks`
* is optional
* type: `boolean`
* defined in this schema

### showYTicks Type


`boolean`





## ticksDateFormat

The date format of ticks.* Please refer to this [list of specifiers](https://github.com/d3/d3-time-format/blob/master/README.md#locale_format).

`ticksDateFormat`
* is optional
* type: `string`
* defined in this schema

### ticksDateFormat Type


`string`






## topOffsetRemoveInterval

Top position of the remove-selection-button

`topOffsetRemoveInterval`
* is optional
* type: `number`
* defined in this schema

### topOffsetRemoveInterval Type


`number`






## xAxisPosition

The xAxis positon : above or below the chart.

`xAxisPosition`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#xaxisposition-known-values).

### xAxisPosition Known Values
| Value | Description |
|-------|-------------|
| `top` |  |
| `bottom` |  |




## xLabels

Number of labels in the X axis.

`xLabels`
* is optional
* type: `integer`
* defined in this schema

### xLabels Type


`integer`






## xTicks

Number of ticks in the X axis.

`xTicks`
* is optional
* type: `integer`
* defined in this schema

### xTicks Type


`integer`






## yAxisStartsFromZero

Whether the histogram values start from zero or from the minimum of data.

`yAxisStartsFromZero`
* is optional
* type: `boolean`
* defined in this schema

### yAxisStartsFromZero Type


`boolean`





## yLabels

Number of labels in the Y axis.

`yLabels`
* is optional
* type: `integer`
* defined in this schema

### yLabels Type


`integer`






## yTicks

Number of ticks in the Y axis.

`yTicks`
* is optional
* type: `integer`
* defined in this schema

### yTicks Type


`integer`





