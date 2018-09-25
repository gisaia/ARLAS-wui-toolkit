[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/startup/startup.service"](../modules/_app_services_startup_startup_service_.md) > [ArlasConfigService](../classes/_app_services_startup_startup_service_.arlasconfigservice.md)

# Class: ArlasConfigService

## Hierarchy

 `ConfigService`

**↳ ArlasConfigService**

## Index

### Constructors

* [constructor](_app_services_startup_startup_service_.arlasconfigservice.md#constructor)

### Properties

* [confErrorBus](_app_services_startup_startup_service_.arlasconfigservice.md#conferrorbus)

### Methods

* [errorCallBack](_app_services_startup_startup_service_.arlasconfigservice.md#errorcallback)
* [getConfig](_app_services_startup_startup_service_.arlasconfigservice.md#getconfig)
* [getValue](_app_services_startup_startup_service_.arlasconfigservice.md#getvalue)
* [setConfig](_app_services_startup_startup_service_.arlasconfigservice.md#setconfig)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ArlasConfigService**(): [ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md)

*Overrides ConfigService.__constructor*

*Defined in app/services/startup/startup.service.ts:49*

**Returns:** [ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md)

___

## Properties

<a id="conferrorbus"></a>

###  confErrorBus

**● confErrorBus**: *`Subject`<`string`>*

*Inherited from ConfigService.confErrorBus*

*Defined in /docs/node_modules/arlas-web-core/services/config.service.d.ts:6*

Bus of configuration error.

___

## Methods

<a id="errorcallback"></a>

###  errorCallBack

▸ **errorCallBack**(key: *`string`*): `void`

*Inherited from ConfigService.errorCallBack*

*Defined in /docs/node_modules/arlas-web-core/services/config.service.d.ts:20*

Notify bus error.

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `void`

___
<a id="getconfig"></a>

###  getConfig

▸ **getConfig**(): `Object`

*Inherited from ConfigService.getConfig*

*Defined in /docs/node_modules/arlas-web-core/services/config.service.d.ts:25*

Get configuration object.

**Returns:** `Object`
configuration Object

___
<a id="getvalue"></a>

###  getValue

▸ **getValue**(key: *`string`*): `any`

*Inherited from ConfigService.getValue*

*Defined in /docs/node_modules/arlas-web-core/services/config.service.d.ts:16*

Retrieve Value from key in configuration object.

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `any`
configuration value

___
<a id="setconfig"></a>

###  setConfig

▸ **setConfig**(config: *`Object`*): `void`

*Inherited from ConfigService.setConfig*

*Defined in /docs/node_modules/arlas-web-core/services/config.service.d.ts:30*

Set configuration object.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| config | `Object` |  Object |

**Returns:** `void`

___

