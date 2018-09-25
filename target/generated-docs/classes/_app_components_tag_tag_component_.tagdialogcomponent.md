[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/components/tag/tag.component"](../modules/_app_components_tag_tag_component_.md) > [TagDialogComponent](../classes/_app_components_tag_tag_component_.tagdialogcomponent.md)

# Class: TagDialogComponent

## Hierarchy

**TagDialogComponent**

## Implements

* `OnInit`

## Index

### Constructors

* [constructor](_app_components_tag_tag_component_.tagdialogcomponent.md#constructor)

### Properties

* [confirmDialogRef](_app_components_tag_tag_component_.tagdialogcomponent.md#confirmdialogref)
* [dialogRef](_app_components_tag_tag_component_.tagdialogcomponent.md#dialogref)
* [tagEvent](_app_components_tag_tag_component_.tagdialogcomponent.md#tagevent)
* [tagFormGroup](_app_components_tag_tag_component_.tagdialogcomponent.md#tagformgroup)
* [tagService](_app_components_tag_tag_component_.tagdialogcomponent.md#tagservice)
* [taggableFields](_app_components_tag_tag_component_.tagdialogcomponent.md#taggablefields)

### Methods

* [addTag](_app_components_tag_tag_component_.tagdialogcomponent.md#addtag)
* [ngOnInit](_app_components_tag_tag_component_.tagdialogcomponent.md#ngoninit)
* [removeTag](_app_components_tag_tag_component_.tagdialogcomponent.md#removetag)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new TagDialogComponent**(formBuilder: *`FormBuilder`*, tagService: *[ArlasTagService](_app_services_tag_tag_service_.arlastagservice.md)*, configService: *[ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md)*, collaborativeSearchService: *[ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)*, http: *`Http`*, dialog: *`MatDialog`*, dialogRef: *`MatDialogRef`<[TagDialogComponent](_app_components_tag_tag_component_.tagdialogcomponent.md)>*): [TagDialogComponent](_app_components_tag_tag_component_.tagdialogcomponent.md)

*Defined in app/components/tag/tag.component.ts:66*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formBuilder | `FormBuilder` |
| tagService | [ArlasTagService](_app_services_tag_tag_service_.arlastagservice.md) |
| configService | [ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md) |
| collaborativeSearchService | [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md) |
| http | `Http` |
| dialog | `MatDialog` |
| dialogRef | `MatDialogRef`<[TagDialogComponent](_app_components_tag_tag_component_.tagdialogcomponent.md)> |

**Returns:** [TagDialogComponent](_app_components_tag_tag_component_.tagdialogcomponent.md)

___

## Properties

<a id="confirmdialogref"></a>

###  confirmDialogRef

**● confirmDialogRef**: *`MatDialogRef`<[ConfirmModalComponent](_app_components_confirm_modal_confirm_modal_component_.confirmmodalcomponent.md)>*

*Defined in app/components/tag/tag.component.ts:66*

___
<a id="dialogref"></a>

###  dialogRef

**● dialogRef**: *`MatDialogRef`<[TagDialogComponent](_app_components_tag_tag_component_.tagdialogcomponent.md)>*

*Defined in app/components/tag/tag.component.ts:75*

___
<a id="tagevent"></a>

###  tagEvent

**● tagEvent**: *`Subject`<`string`>* =  new Subject<string>()

*Defined in app/components/tag/tag.component.ts:60*

___
<a id="tagformgroup"></a>

###  tagFormGroup

**● tagFormGroup**: *`FormGroup`*

*Defined in app/components/tag/tag.component.ts:63*

___
<a id="tagservice"></a>

###  tagService

**● tagService**: *[ArlasTagService](_app_services_tag_tag_service_.arlastagservice.md)*

*Defined in app/components/tag/tag.component.ts:70*

___
<a id="taggablefields"></a>

###  taggableFields

**● taggableFields**: *`Array`<`any`>* =  []

*Defined in app/components/tag/tag.component.ts:64*

___

## Methods

<a id="addtag"></a>

###  addTag

▸ **addTag**(path: *`string`*, value: * `number` &#124; `string`*): `void`

*Defined in app/components/tag/tag.component.ts:106*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `string` |
| value |  `number` &#124; `string`|

**Returns:** `void`

___
<a id="ngoninit"></a>

###  ngOnInit

▸ **ngOnInit**(): `void`

*Defined in app/components/tag/tag.component.ts:88*

**Returns:** `void`

___
<a id="removetag"></a>

###  removeTag

▸ **removeTag**(path: *`string`*, value?: * `number` &#124; `string`*): `void`

*Defined in app/components/tag/tag.component.ts:110*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `string` |
| `Optional` value |  `number` &#124; `string`|

**Returns:** `void`

___

