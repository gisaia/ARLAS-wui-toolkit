[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/components/timeline/timeline.component"](../modules/_app_components_timeline_timeline_component_.md) > [TimelineComponent](../classes/_app_components_timeline_timeline_component_.timelinecomponent.md)

# Class: TimelineComponent

## Hierarchy

**TimelineComponent**

## Implements

* `OnInit`

## Index

### Constructors

* [constructor](_app_components_timeline_timeline_component_.timelinecomponent.md#constructor)

### Properties

* [detailedTimelineComponent](_app_components_timeline_timeline_component_.timelinecomponent.md#detailedtimelinecomponent)
* [detailedTimelineContributor](_app_components_timeline_timeline_component_.timelinecomponent.md#detailedtimelinecontributor)
* [detailedTimelineHistogramComponent](_app_components_timeline_timeline_component_.timelinecomponent.md#detailedtimelinehistogramcomponent)
* [detailedTimelineIntervalSelection](_app_components_timeline_timeline_component_.timelinecomponent.md#detailedtimelineintervalselection)
* [showDetailedTimeline](_app_components_timeline_timeline_component_.timelinecomponent.md#showdetailedtimeline)
* [timelineComponent](_app_components_timeline_timeline_component_.timelinecomponent.md#timelinecomponent)
* [timelineContributor](_app_components_timeline_timeline_component_.timelinecomponent.md#timelinecontributor)
* [timelineHistogramComponent](_app_components_timeline_timeline_component_.timelinecomponent.md#timelinehistogramcomponent)

### Methods

* [afterDetailedDataPlotted](_app_components_timeline_timeline_component_.timelinecomponent.md#afterdetaileddataplotted)
* [ngOnInit](_app_components_timeline_timeline_component_.timelinecomponent.md#ngoninit)
* [onDetailedIntervalBrushed](_app_components_timeline_timeline_component_.timelinecomponent.md#ondetailedintervalbrushed)
* [onTimelineIntervalBrushed](_app_components_timeline_timeline_component_.timelinecomponent.md#ontimelineintervalbrushed)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new TimelineComponent**(arlasCollaborativesearchService: *[ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)*, cdr: *`ChangeDetectorRef`*, arlasStartupService: *[ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md)*): [TimelineComponent](_app_components_timeline_timeline_component_.timelinecomponent.md)

*Defined in app/components/timeline/timeline.component.ts:49*

**Parameters:**

| Param | Type |
| ------ | ------ |
| arlasCollaborativesearchService | [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md) |
| cdr | `ChangeDetectorRef` |
| arlasStartupService | [ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md) |

**Returns:** [TimelineComponent](_app_components_timeline_timeline_component_.timelinecomponent.md)

___

## Properties

<a id="detailedtimelinecomponent"></a>

###  detailedTimelineComponent

**● detailedTimelineComponent**: *`any`*

*Defined in app/components/timeline/timeline.component.ts:37*

___
<a id="detailedtimelinecontributor"></a>

###  detailedTimelineContributor

**● detailedTimelineContributor**: *`DetailedHistogramContributor`*

*Defined in app/components/timeline/timeline.component.ts:43*

___
<a id="detailedtimelinehistogramcomponent"></a>

###  detailedTimelineHistogramComponent

**● detailedTimelineHistogramComponent**: *`HistogramComponent`*

*Defined in app/components/timeline/timeline.component.ts:40*

___
<a id="detailedtimelineintervalselection"></a>

###  detailedTimelineIntervalSelection

**● detailedTimelineIntervalSelection**: *`SelectedOutputValues`*

*Defined in app/components/timeline/timeline.component.ts:45*

___
<a id="showdetailedtimeline"></a>

###  showDetailedTimeline

**● showDetailedTimeline**: *`boolean`* = false

*Defined in app/components/timeline/timeline.component.ts:42*

___
<a id="timelinecomponent"></a>

###  timelineComponent

**● timelineComponent**: *`any`*

*Defined in app/components/timeline/timeline.component.ts:38*

___
<a id="timelinecontributor"></a>

###  timelineContributor

**● timelineContributor**: *`HistogramContributor`*

*Defined in app/components/timeline/timeline.component.ts:44*

___
<a id="timelinehistogramcomponent"></a>

###  timelineHistogramComponent

**● timelineHistogramComponent**: *`HistogramComponent`*

*Defined in app/components/timeline/timeline.component.ts:39*

___

## Methods

<a id="afterdetaileddataplotted"></a>

###  afterDetailedDataPlotted

▸ **afterDetailedDataPlotted**(): `void`

*Defined in app/components/timeline/timeline.component.ts:91*

Runs when the detailed timeline is plotted. Sets current selection of detailed timeline after it is plotted Applies the current selection of detailed timeline on the main timeline

**Returns:** `void`

___
<a id="ngoninit"></a>

###  ngOnInit

▸ **ngOnInit**(): `void`

*Defined in app/components/timeline/timeline.component.ts:55*

**Returns:** `void`

___
<a id="ondetailedintervalbrushed"></a>

###  onDetailedIntervalBrushed

▸ **onDetailedIntervalBrushed**(selections: *`SelectedOutputValues`[]*): `void`

*Defined in app/components/timeline/timeline.component.ts:72*

Recalculates the new data of detailed timeline and resets its own current selection.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| selections | `SelectedOutputValues`[] |  List containing only the current selection of detailed timeline |

**Returns:** `void`

___
<a id="ontimelineintervalbrushed"></a>

###  onTimelineIntervalBrushed

▸ **onTimelineIntervalBrushed**(selections: *`SelectedOutputValues`[]*): `void`

*Defined in app/components/timeline/timeline.component.ts:82*

Runs when the selection is brushed on timeline.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| selections | `SelectedOutputValues`[] |  List containing only the current selection of detailed timeline |

**Returns:** `void`

___

