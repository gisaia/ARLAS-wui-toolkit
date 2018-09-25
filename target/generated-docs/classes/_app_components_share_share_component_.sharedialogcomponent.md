[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/components/share/share.component"](../modules/_app_components_share_share_component_.md) > [ShareDialogComponent](../classes/_app_components_share_share_component_.sharedialogcomponent.md)

# Class: ShareDialogComponent

## Hierarchy

**ShareDialogComponent**

## Implements

* `OnInit`

## Index

### Constructors

* [constructor](_app_components_share_share_component_.sharedialogcomponent.md#constructor)

### Properties

* [allFields](_app_components_share_share_component_.sharedialogcomponent.md#allfields)
* [dialogRef](_app_components_share_share_component_.sharedialogcomponent.md#dialogref)
* [displayedUrl](_app_components_share_share_component_.sharedialogcomponent.md#displayedurl)
* [excludedType](_app_components_share_share_component_.sharedialogcomponent.md#excludedtype)
* [excludedTypeString](_app_components_share_share_component_.sharedialogcomponent.md#excludedtypestring)
* [geojsonTypeGroup](_app_components_share_share_component_.sharedialogcomponent.md#geojsontypegroup)
* [isCopied](_app_components_share_share_component_.sharedialogcomponent.md#iscopied)
* [paramFormGroup](_app_components_share_share_component_.sharedialogcomponent.md#paramformgroup)
* [precisions](_app_components_share_share_component_.sharedialogcomponent.md#precisions)
* [selectedFields](_app_components_share_share_component_.sharedialogcomponent.md#selectedfields)
* [selectedOrderField](_app_components_share_share_component_.sharedialogcomponent.md#selectedorderfield)
* [sortDirection](_app_components_share_share_component_.sharedialogcomponent.md#sortdirection)

### Methods

* [changeStep](_app_components_share_share_component_.sharedialogcomponent.md#changestep)
* [copyTextToClipboard](_app_components_share_share_component_.sharedialogcomponent.md#copytexttoclipboard)
* [ngOnInit](_app_components_share_share_component_.sharedialogcomponent.md#ngoninit)
* [onSelectionChange](_app_components_share_share_component_.sharedialogcomponent.md#onselectionchange)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ShareDialogComponent**(_formBuilder: *`FormBuilder`*, http: *`Http`*, collaborativeService: *[ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)*, configService: *[ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md)*, dialogRef: *`MatDialogRef`<[ShareDialogComponent](_app_components_share_share_component_.sharedialogcomponent.md)>*): [ShareDialogComponent](_app_components_share_share_component_.sharedialogcomponent.md)

*Defined in app/components/share/share.component.ts:92*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _formBuilder | `FormBuilder` |
| http | `Http` |
| collaborativeService | [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md) |
| configService | [ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md) |
| dialogRef | `MatDialogRef`<[ShareDialogComponent](_app_components_share_share_component_.sharedialogcomponent.md)> |

**Returns:** [ShareDialogComponent](_app_components_share_share_component_.sharedialogcomponent.md)

___

## Properties

<a id="allfields"></a>

###  allFields

**● allFields**: *[ArlasSearchField](_app_components_share_model_arlassearchfield_.arlassearchfield.md)[]* =  new Array<ArlasSearchField>()

*Defined in app/components/share/share.component.ts:90*

___
<a id="dialogref"></a>

###  dialogRef

**● dialogRef**: *`MatDialogRef`<[ShareDialogComponent](_app_components_share_share_component_.sharedialogcomponent.md)>*

*Defined in app/components/share/share.component.ts:99*

___
<a id="displayedurl"></a>

###  displayedUrl

**● displayedUrl**: *`string`*

*Defined in app/components/share/share.component.ts:66*

___
<a id="excludedtype"></a>

###  excludedType

**● excludedType**: *`Set`<`string`>* =  new Set<string>()

*Defined in app/components/share/share.component.ts:91*

___
<a id="excludedtypestring"></a>

###  excludedTypeString

**● excludedTypeString**: *`string`* = ""

*Defined in app/components/share/share.component.ts:92*

___
<a id="geojsontypegroup"></a>

###  geojsonTypeGroup

**● geojsonTypeGroup**: *`FormGroup`*

*Defined in app/components/share/share.component.ts:83*

___
<a id="iscopied"></a>

###  isCopied

**● isCopied**: *`boolean`* = false

*Defined in app/components/share/share.component.ts:82*

___
<a id="paramformgroup"></a>

###  paramFormGroup

**● paramFormGroup**: *`FormGroup`*

*Defined in app/components/share/share.component.ts:84*

___
<a id="precisions"></a>

###  precisions

**● precisions**: *( `string` &#124; `number`)[][]* =  [
    [1, '5,009.4km x 4,992.6km'],
    [2, '1,252.3km x 624.1km'],
    [3, '156.5km x 156km'],
    [4, '39.1km x 19.5km'],
    [5, '4.9km x 4.9km'],
    [6, '1.2km x 609.4m'],
    [7, '152.9m x 152.4m'],
    [8, '38.2m x 19m'],
    [9, '4.8m x 4.8m'],
    [10, '1.2m x 59.5cm'],
    [11, '14.9cm x 14.9cm'],
    [12, '3.7cm x 1.9cm']
  ]

*Defined in app/components/share/share.component.ts:67*

___
<a id="selectedfields"></a>

###  selectedFields

**● selectedFields**: *[ArlasSearchField](_app_components_share_model_arlassearchfield_.arlassearchfield.md)[]* =  new Array<ArlasSearchField>()

*Defined in app/components/share/share.component.ts:86*

___
<a id="selectedorderfield"></a>

###  selectedOrderField

**● selectedOrderField**: *[ArlasSearchField](_app_components_share_model_arlassearchfield_.arlassearchfield.md)*

*Defined in app/components/share/share.component.ts:87*

___
<a id="sortdirection"></a>

###  sortDirection

**● sortDirection**: *`string`*

*Defined in app/components/share/share.component.ts:88*

___

## Methods

<a id="changestep"></a>

###  changeStep

▸ **changeStep**(event: *`any`*): `void`

*Defined in app/components/share/share.component.ts:124*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | `any` |

**Returns:** `void`

___
<a id="copytexttoclipboard"></a>

###  copyTextToClipboard

▸ **copyTextToClipboard**(text: *`string`*): `void`

*Defined in app/components/share/share.component.ts:189*

**Parameters:**

| Param | Type |
| ------ | ------ |
| text | `string` |

**Returns:** `void`

___
<a id="ngoninit"></a>

###  ngOnInit

▸ **ngOnInit**(): `void`

*Defined in app/components/share/share.component.ts:102*

**Returns:** `void`

___
<a id="onselectionchange"></a>

###  onSelectionChange

▸ **onSelectionChange**(selectedOptionsList: *`any`*): `void`

*Defined in app/components/share/share.component.ts:202*

**Parameters:**

| Param | Type |
| ------ | ------ |
| selectedOptionsList | `any` |

**Returns:** `void`

___

