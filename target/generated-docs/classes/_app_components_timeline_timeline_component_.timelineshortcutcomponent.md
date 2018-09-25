[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/components/timeline/timeline.component"](../modules/_app_components_timeline_timeline_component_.md) > [TimelineShortcutComponent](../classes/_app_components_timeline_timeline_component_.timelineshortcutcomponent.md)

# Class: TimelineShortcutComponent

## Hierarchy

**TimelineShortcutComponent**

## Implements

* `OnInit`

## Index

### Constructors

* [constructor](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#constructor)

### Properties

* [HIDE_SHOW](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#hide_show)
* [dateFormat](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#dateformat)
* [showRemoveIcon](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#showremoveicon)
* [showShortcuts](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#showshortcuts)
* [timeShortcuts](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#timeshortcuts)
* [timeShortcutsMap](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#timeshortcutsmap)
* [timelineComponent](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#timelinecomponent)
* [timelineContributor](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#timelinecontributor)
* [translate](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#translate)

### Methods

* [getKeys](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#getkeys)
* [ngOnInit](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#ngoninit)
* [removeTimelineCollaboration](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#removetimelinecollaboration)
* [setShortcut](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#setshortcut)
* [showSortcuts](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md#showsortcuts)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new TimelineShortcutComponent**(arlasCollaborativesearchService: *[ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)*, arlasStartupService: *[ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md)*, translate: *`TranslateService`*): [TimelineShortcutComponent](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md)

*Defined in app/components/timeline/timeline.component.ts:178*

**Parameters:**

| Param | Type |
| ------ | ------ |
| arlasCollaborativesearchService | [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md) |
| arlasStartupService | [ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md) |
| translate | `TranslateService` |

**Returns:** [TimelineShortcutComponent](_app_components_timeline_timeline_component_.timelineshortcutcomponent.md)

___

## Properties

<a id="hide_show"></a>

###  HIDE_SHOW

**● HIDE_SHOW**: *`string`* = "Show"

*Defined in app/components/timeline/timeline.component.ts:178*

___
<a id="dateformat"></a>

###  dateFormat

**● dateFormat**: *`string`*

*Defined in app/components/timeline/timeline.component.ts:171*

___
<a id="showremoveicon"></a>

###  showRemoveIcon

**● showRemoveIcon**: *`boolean`* = false

*Defined in app/components/timeline/timeline.component.ts:176*

___
<a id="showshortcuts"></a>

###  showShortcuts

**● showShortcuts**: *`boolean`* = false

*Defined in app/components/timeline/timeline.component.ts:177*

___
<a id="timeshortcuts"></a>

###  timeShortcuts

**● timeShortcuts**: *`Array`<`StringifiedTimeShortcut`>*

*Defined in app/components/timeline/timeline.component.ts:174*

___
<a id="timeshortcutsmap"></a>

###  timeShortcutsMap

**● timeShortcutsMap**: *`Map`<`string`, `Array`<`StringifiedTimeShortcut`>>*

*Defined in app/components/timeline/timeline.component.ts:175*

___
<a id="timelinecomponent"></a>

###  timelineComponent

**● timelineComponent**: *`any`*

*Defined in app/components/timeline/timeline.component.ts:170*

___
<a id="timelinecontributor"></a>

###  timelineContributor

**● timelineContributor**: *`HistogramContributor`*

*Defined in app/components/timeline/timeline.component.ts:173*

___
<a id="translate"></a>

###  translate

**● translate**: *`TranslateService`*

*Defined in app/components/timeline/timeline.component.ts:181*

___

## Methods

<a id="getkeys"></a>

###  getKeys

▸ **getKeys**(map: *`any`*): `Array`<`string`>

*Defined in app/components/timeline/timeline.component.ts:205*

**Parameters:**

| Param | Type |
| ------ | ------ |
| map | `any` |

**Returns:** `Array`<`string`>

___
<a id="ngoninit"></a>

###  ngOnInit

▸ **ngOnInit**(): `void`

*Defined in app/components/timeline/timeline.component.ts:184*

**Returns:** `void`

___
<a id="removetimelinecollaboration"></a>

###  removeTimelineCollaboration

▸ **removeTimelineCollaboration**(): `void`

*Defined in app/components/timeline/timeline.component.ts:220*

**Returns:** `void`

___
<a id="setshortcut"></a>

###  setShortcut

▸ **setShortcut**(shortCut: *`StringifiedTimeShortcut`*): `void`

*Defined in app/components/timeline/timeline.component.ts:196*

**Parameters:**

| Param | Type |
| ------ | ------ |
| shortCut | `StringifiedTimeShortcut` |

**Returns:** `void`

___
<a id="showsortcuts"></a>

###  showSortcuts

▸ **showSortcuts**(): `void`

*Defined in app/components/timeline/timeline.component.ts:209*

**Returns:** `void`

___

