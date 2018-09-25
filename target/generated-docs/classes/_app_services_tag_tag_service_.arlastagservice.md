[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/tag/tag.service"](../modules/_app_services_tag_tag_service_.md) > [ArlasTagService](../classes/_app_services_tag_tag_service_.arlastagservice.md)

# Class: ArlasTagService

Constants used to fill up our data base.

## Hierarchy

**ArlasTagService**

## Index

### Constructors

* [constructor](_app_services_tag_tag_service_.arlastagservice.md#constructor)

### Properties

* [isProcessing](_app_services_tag_tag_service_.arlastagservice.md#isprocessing)
* [status](_app_services_tag_tag_service_.arlastagservice.md#status)
* [taggableFields](_app_services_tag_tag_service_.arlastagservice.md#taggablefields)

### Methods

* [addTag](_app_services_tag_tag_service_.arlastagservice.md#addtag)
* [createPayload](_app_services_tag_tag_service_.arlastagservice.md#createpayload)
* [postTagData](_app_services_tag_tag_service_.arlastagservice.md#posttagdata)
* [removeTag](_app_services_tag_tag_service_.arlastagservice.md#removetag)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ArlasTagService**(collaborativeSearchService: *[ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)*, configService: *[ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md)*, http: *`Http`*, snackBar: *`MatSnackBar`*): [ArlasTagService](_app_services_tag_tag_service_.arlastagservice.md)

*Defined in app/services/tag/tag.service.ts:32*

**Parameters:**

| Param | Type |
| ------ | ------ |
| collaborativeSearchService | [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md) |
| configService | [ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md) |
| http | `Http` |
| snackBar | `MatSnackBar` |

**Returns:** [ArlasTagService](_app_services_tag_tag_service_.arlastagservice.md)

___

## Properties

<a id="isprocessing"></a>

###  isProcessing

**● isProcessing**: *`boolean`* = false

*Defined in app/services/tag/tag.service.ts:31*

___
<a id="status"></a>

###  status

**● status**: *`Subject`<`Map`<`string`, `boolean`>>* =  new Subject<Map<string, boolean>>()

*Defined in app/services/tag/tag.service.ts:32*

___
<a id="taggablefields"></a>

###  taggableFields

**● taggableFields**: *`Array`<`any`>* =  []

*Defined in app/services/tag/tag.service.ts:30*

___

## Methods

<a id="addtag"></a>

###  addTag

▸ **addTag**(path: *`string`*, value: * `string` &#124; `number`*): `void`

*Defined in app/services/tag/tag.service.ts:43*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `string` |
| value |  `string` &#124; `number`|

**Returns:** `void`

___
<a id="createpayload"></a>

###  createPayload

▸ **createPayload**(path: *`string`*, value?: * `string` &#124; `number`*): `Object`

*Defined in app/services/tag/tag.service.ts:53*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `string` |
| `Optional` value |  `string` &#124; `number`|

**Returns:** `Object`

___
<a id="posttagdata"></a>

###  postTagData

▸ **postTagData**(data: *`any`*, mode?: *`string`*): `void`

*Defined in app/services/tag/tag.service.ts:72*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| data | `any` | - |
| `Default value` mode | `string` | &quot;tag&quot; |

**Returns:** `void`

___
<a id="removetag"></a>

###  removeTag

▸ **removeTag**(path: *`string`*, value?: * `string` &#124; `number`*): `void`

*Defined in app/services/tag/tag.service.ts:48*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `string` |
| `Optional` value |  `string` &#124; `number`|

**Returns:** `void`

___

