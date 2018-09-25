[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/startup/startup.service"](../modules/_app_services_startup_startup_service_.md) > [ArlasWriteApi](../classes/_app_services_startup_startup_service_.arlaswriteapi.md)

# Class: ArlasWriteApi

## Hierarchy

 `WriteApi`

**↳ ArlasWriteApi**

## Index

### Constructors

* [constructor](_app_services_startup_startup_service_.arlaswriteapi.md#constructor)

### Properties

* [basePath](_app_services_startup_startup_service_.arlaswriteapi.md#basepath)
* [configuration](_app_services_startup_startup_service_.arlaswriteapi.md#configuration)
* [fetch](_app_services_startup_startup_service_.arlaswriteapi.md#fetch)

### Methods

* [tagPost](_app_services_startup_startup_service_.arlaswriteapi.md#tagpost)
* [untagPost](_app_services_startup_startup_service_.arlaswriteapi.md#untagpost)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ArlasWriteApi**(conf: *`Configuration`*, basePath: *`string`*, fetch: *`any`*): [ArlasWriteApi](_app_services_startup_startup_service_.arlaswriteapi.md)

*Overrides BaseAPI.__constructor*

*Defined in app/services/startup/startup.service.ts:64*

**Parameters:**

| Param | Type |
| ------ | ------ |
| conf | `Configuration` |
| basePath | `string` |
| fetch | `any` |

**Returns:** [ArlasWriteApi](_app_services_startup_startup_service_.arlaswriteapi.md)

___

## Properties

<a id="basepath"></a>

### `<Protected>` basePath

**● basePath**: *`string`*

*Inherited from BaseAPI.basePath*

*Defined in /docs/node_modules/arlas-api/api.d.ts:36*

___
<a id="configuration"></a>

### `<Protected>` configuration

**● configuration**: *`Configuration`*

*Inherited from BaseAPI.configuration*

*Defined in /docs/node_modules/arlas-api/api.d.ts:38*

___
<a id="fetch"></a>

### `<Protected>` fetch

**● fetch**: *`FetchAPI`*

*Inherited from BaseAPI.fetch*

*Defined in /docs/node_modules/arlas-api/api.d.ts:37*

___

## Methods

<a id="tagpost"></a>

###  tagPost

▸ **tagPost**(collection: *`string`*, body?: *`TagRequest`*, pretty?: *`boolean`*, options?: *`any`*): `Promise`<`UpdateResponse`>

*Inherited from WriteApi.tagPost*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2280*

Search and tag the elements found in the collection, given the filters
*__summary__*: Tag

*__throws__*: {RequiredError}

*__memberof__*: WriteApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` body | `TagRequest` |
| `Optional` pretty | `boolean` |
| `Optional` options | `any` |

**Returns:** `Promise`<`UpdateResponse`>

___
<a id="untagpost"></a>

###  untagPost

▸ **untagPost**(collection: *`string`*, body?: *`TagRequest`*, pretty?: *`boolean`*, options?: *`any`*): `Promise`<`UpdateResponse`>

*Inherited from WriteApi.untagPost*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2291*

Search and untag the elements found in the collection, given the filters
*__summary__*: Untag

*__throws__*: {RequiredError}

*__memberof__*: WriteApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` body | `TagRequest` |
| `Optional` pretty | `boolean` |
| `Optional` options | `any` |

**Returns:** `Promise`<`UpdateResponse`>

___

