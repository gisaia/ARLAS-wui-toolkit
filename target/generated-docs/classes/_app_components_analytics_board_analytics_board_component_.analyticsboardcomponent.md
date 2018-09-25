[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/components/analytics-board/analytics-board.component"](../modules/_app_components_analytics_board_analytics_board_component_.md) > [AnalyticsBoardComponent](../classes/_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md)

# Class: AnalyticsBoardComponent

## Hierarchy

**AnalyticsBoardComponent**

## Implements

* `OnInit`

## Index

### Constructors

* [constructor](_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md#constructor)

### Properties

* [boardOutputs](_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md#boardoutputs)
* [groups](_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md#groups)
* [groupsDisplayStatusMap](_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md#groupsdisplaystatusmap)

### Methods

* [listenOutput](_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md#listenoutput)
* [ngOnInit](_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md#ngoninit)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new AnalyticsBoardComponent**(): [AnalyticsBoardComponent](_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md)

*Defined in app/components/analytics-board/analytics-board.component.ts:39*

**Returns:** [AnalyticsBoardComponent](_app_components_analytics_board_analytics_board_component_.analyticsboardcomponent.md)

___

## Properties

<a id="boardoutputs"></a>

###  boardOutputs

**● boardOutputs**: *`Subject`<`object`>* =  new Subject<{ origin: string, event: string, data?: any }>()

*Defined in app/components/analytics-board/analytics-board.component.ts:38*

___
<a id="groups"></a>

###  groups

**● groups**: *`Array`<`any`>*

*Defined in app/components/analytics-board/analytics-board.component.ts:33*

___
<a id="groupsdisplaystatusmap"></a>

###  groupsDisplayStatusMap

**● groupsDisplayStatusMap**: *`Map`<`string`, `boolean`>*

*Defined in app/components/analytics-board/analytics-board.component.ts:37*

*__description__*: Map of <groupId, displayStatus> that informs which groupIds to display/hide

___

## Methods

<a id="listenoutput"></a>

###  listenOutput

▸ **listenOutput**(event: *`object`*): `void`

*Defined in app/components/analytics-board/analytics-board.component.ts:49*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | `object` |

**Returns:** `void`

___
<a id="ngoninit"></a>

###  ngOnInit

▸ **ngOnInit**(): `void`

*Defined in app/components/analytics-board/analytics-board.component.ts:42*

**Returns:** `void`

___

