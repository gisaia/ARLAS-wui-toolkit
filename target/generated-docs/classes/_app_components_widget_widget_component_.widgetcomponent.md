[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/components/widget/widget.component"](../modules/_app_components_widget_widget_component_.md) > [WidgetComponent](../classes/_app_components_widget_widget_component_.widgetcomponent.md)

# Class: WidgetComponent

## Hierarchy

**WidgetComponent**

## Implements

* `OnInit`

## Index

### Constructors

* [constructor](_app_components_widget_widget_component_.widgetcomponent.md#constructor)

### Properties

* [chartType](_app_components_widget_widget_component_.widgetcomponent.md#charttype)
* [componentParams](_app_components_widget_widget_component_.widgetcomponent.md#componentparams)
* [componentType](_app_components_widget_widget_component_.widgetcomponent.md#componenttype)
* [contributor](_app_components_widget_widget_component_.widgetcomponent.md#contributor)
* [contributorId](_app_components_widget_widget_component_.widgetcomponent.md#contributorid)
* [graphParam](_app_components_widget_widget_component_.widgetcomponent.md#graphparam)
* [highlightItems](_app_components_widget_widget_component_.widgetcomponent.md#highlightitems)
* [histogramComponent](_app_components_widget_widget_component_.widgetcomponent.md#histogramcomponent)
* [indeterminatedItems](_app_components_widget_widget_component_.widgetcomponent.md#indeterminateditems)
* [outEvents](_app_components_widget_widget_component_.widgetcomponent.md#outevents)
* [showSwimlaneDropDown](_app_components_widget_widget_component_.widgetcomponent.md#showswimlanedropdown)
* [swimSelected](_app_components_widget_widget_component_.widgetcomponent.md#swimselected)
* [swimlanes](_app_components_widget_widget_component_.widgetcomponent.md#swimlanes)
* [translate](_app_components_widget_widget_component_.widgetcomponent.md#translate)

### Methods

* [changeSwimlane](_app_components_widget_widget_component_.widgetcomponent.md#changeswimlane)
* [ngOnInit](_app_components_widget_widget_component_.widgetcomponent.md#ngoninit)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new WidgetComponent**(arlasStartupService: *[ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md)*, cdr: *`ChangeDetectorRef`*, componentFactoryResolver: *`ComponentFactoryResolver`*, arlasCollaborativesearchService: *[ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)*, translate: *`TranslateService`*): [WidgetComponent](_app_components_widget_widget_component_.widgetcomponent.md)

*Defined in app/components/widget/widget.component.ts:55*

**Parameters:**

| Param | Type |
| ------ | ------ |
| arlasStartupService | [ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md) |
| cdr | `ChangeDetectorRef` |
| componentFactoryResolver | `ComponentFactoryResolver` |
| arlasCollaborativesearchService | [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md) |
| translate | `TranslateService` |

**Returns:** [WidgetComponent](_app_components_widget_widget_component_.widgetcomponent.md)

___

## Properties

<a id="charttype"></a>

###  chartType

**● chartType**: *`ChartType`* =  ChartType

*Defined in app/components/widget/widget.component.ts:39*

___
<a id="componentparams"></a>

###  componentParams

**● componentParams**: *`any`*

*Defined in app/components/widget/widget.component.ts:51*

___
<a id="componenttype"></a>

###  componentType

**● componentType**: *`any`*

*Defined in app/components/widget/widget.component.ts:41*

___
<a id="contributor"></a>

###  contributor

**● contributor**: *`any`*

*Defined in app/components/widget/widget.component.ts:42*

___
<a id="contributorid"></a>

###  contributorId

**● contributorId**: *`string`*

*Defined in app/components/widget/widget.component.ts:50*

___
<a id="graphparam"></a>

###  graphParam

**● graphParam**: *`any`*

*Defined in app/components/widget/widget.component.ts:48*

___
<a id="highlightitems"></a>

###  highlightItems

**● highlightItems**: *`Set`<`string`>* =  new Set<string>()

*Defined in app/components/widget/widget.component.ts:46*

___
<a id="histogramcomponent"></a>

###  histogramComponent

**● histogramComponent**: *`HistogramComponent`*

*Defined in app/components/widget/widget.component.ts:55*

___
<a id="indeterminateditems"></a>

###  indeterminatedItems

**● indeterminatedItems**: *`Set`<`string`>* =  new Set<string>()

*Defined in app/components/widget/widget.component.ts:45*

___
<a id="outevents"></a>

###  outEvents

**● outEvents**: *`Subject`<`object`>* =  new Subject<{ origin: string, event: string, data?: any }>()

*Defined in app/components/widget/widget.component.ts:52*

___
<a id="showswimlanedropdown"></a>

###  showSwimlaneDropDown

**● showSwimlaneDropDown**: *`boolean`*

*Defined in app/components/widget/widget.component.ts:47*

___
<a id="swimselected"></a>

###  swimSelected

**● swimSelected**: *`any`*

*Defined in app/components/widget/widget.component.ts:43*

___
<a id="swimlanes"></a>

###  swimlanes

**● swimlanes**: *`any`[]* =  []

*Defined in app/components/widget/widget.component.ts:44*

___
<a id="translate"></a>

###  translate

**● translate**: *`TranslateService`*

*Defined in app/components/widget/widget.component.ts:60*

___

## Methods

<a id="changeswimlane"></a>

###  changeSwimlane

▸ **changeSwimlane**(event: *`any`*): `void`

*Defined in app/components/widget/widget.component.ts:74*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | `any` |

**Returns:** `void`

___
<a id="ngoninit"></a>

###  ngOnInit

▸ **ngOnInit**(): `void`

*Defined in app/components/widget/widget.component.ts:63*

**Returns:** `void`

___

