[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/startup/startup.service"](../modules/_app_services_startup_startup_service_.md) > [ArlasStartupService](../classes/_app_services_startup_startup_service_.arlasstartupservice.md)

# Class: ArlasStartupService

## Hierarchy

**ArlasStartupService**

## Index

### Constructors

* [constructor](_app_services_startup_startup_service_.arlasstartupservice.md#constructor)

### Properties

* [analytics](_app_services_startup_startup_service_.arlasstartupservice.md#analytics)
* [collectionId](_app_services_startup_startup_service_.arlasstartupservice.md#collectionid)
* [contributorRegistry](_app_services_startup_startup_service_.arlasstartupservice.md#contributorregistry)
* [selectorById](_app_services_startup_startup_service_.arlasstartupservice.md#selectorbyid)
* [shouldRunApp](_app_services_startup_startup_service_.arlasstartupservice.md#shouldrunapp)
* [temporalContributor](_app_services_startup_startup_service_.arlasstartupservice.md#temporalcontributor)

### Methods

* [load](_app_services_startup_startup_service_.arlasstartupservice.md#load)
* [loadExtraConfig](_app_services_startup_startup_service_.arlasstartupservice.md#loadextraconfig)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ArlasStartupService**(http: *`Http`*, configService: *[ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md)*, collaborativesearchService: *[ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)*): [ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md)

*Defined in app/services/startup/startup.service.ts:87*

**Parameters:**

| Param | Type |
| ------ | ------ |
| http | `Http` |
| configService | [ArlasConfigService](_app_services_startup_startup_service_.arlasconfigservice.md) |
| collaborativesearchService | [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md) |

**Returns:** [ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md)

___

## Properties

<a id="analytics"></a>

###  analytics

**● analytics**: *`Array`<`object`>*

*Defined in app/services/startup/startup.service.ts:83*

___
<a id="collectionid"></a>

###  collectionId

**● collectionId**: *`string`*

*Defined in app/services/startup/startup.service.ts:84*

___
<a id="contributorregistry"></a>

###  contributorRegistry

**● contributorRegistry**: *`Map`<`string`, `any`>* =  new Map<string, any>()

*Defined in app/services/startup/startup.service.ts:81*

___
<a id="selectorbyid"></a>

###  selectorById

**● selectorById**: *`string`*

*Defined in app/services/startup/startup.service.ts:85*

___
<a id="shouldrunapp"></a>

###  shouldRunApp

**● shouldRunApp**: *`boolean`* = true

*Defined in app/services/startup/startup.service.ts:82*

___
<a id="temporalcontributor"></a>

###  temporalContributor

**● temporalContributor**: *`Array`<`string`>* =  new Array<string>()

*Defined in app/services/startup/startup.service.ts:86*

___

## Methods

<a id="load"></a>

###  load

▸ **load**(configRessource: *`string`*): `Promise`<`any`>

*Defined in app/services/startup/startup.service.ts:112*

**Parameters:**

| Param | Type |
| ------ | ------ |
| configRessource | `string` |

**Returns:** `Promise`<`any`>

___
<a id="loadextraconfig"></a>

###  loadExtraConfig

▸ **loadExtraConfig**(extraConfig: *[ExtraConfig](../interfaces/_app_services_startup_startup_service_.extraconfig.md)*, data: *`Object`*): `Promise`<`any`>

*Defined in app/services/startup/startup.service.ts:93*

**Parameters:**

| Param | Type |
| ------ | ------ |
| extraConfig | [ExtraConfig](../interfaces/_app_services_startup_startup_service_.extraconfig.md) |
| data | `Object` |

**Returns:** `Promise`<`any`>

___

