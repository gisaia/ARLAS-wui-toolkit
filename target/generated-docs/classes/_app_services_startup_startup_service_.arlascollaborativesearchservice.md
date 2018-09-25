[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/startup/startup.service"](../modules/_app_services_startup_startup_service_.md) > [ArlasCollaborativesearchService](../classes/_app_services_startup_startup_service_.arlascollaborativesearchservice.md)

# Class: ArlasCollaborativesearchService

## Hierarchy

 `CollaborativesearchService`

**↳ ArlasCollaborativesearchService**

## Index

### Constructors

* [constructor](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#constructor)

### Properties

* [collaborationBus](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#collaborationbus)
* [collaborationErrorBus](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#collaborationerrorbus)
* [collaborations](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#collaborations)
* [collection](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#collection)
* [contribFilterBus](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#contribfilterbus)
* [countAll](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#countall)
* [max_age](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#max_age)
* [ongoingSubscribe](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#ongoingsubscribe)
* [registry](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#registry)
* [totalSubscribe](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#totalsubscribe)

### Methods

* [dataModelBuilder](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#datamodelbuilder)
* [describe](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#describe)
* [disable](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#disable)
* [enable](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#enable)
* [getAllContributors](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getallcontributors)
* [getCollaboration](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getcollaboration)
* [getConfigService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getconfigservice)
* [getDisableContributors](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getdisablecontributors)
* [getEnableContributors](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getenablecontributors)
* [getExploreApi](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getexploreapi)
* [getFetchOptions](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getfetchoptions)
* [getFinalFilter](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getfinalfilter)
* [getUrl](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#geturl)
* [getWriteApi](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#getwriteapi)
* [isEnable](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#isenable)
* [register](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#register)
* [removeAll](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#removeall)
* [removeFilter](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#removefilter)
* [resolveAggregation](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#resolveaggregation)
* [resolveButNotAggregation](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#resolvebutnotaggregation)
* [resolveButNotFeatureCollection](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#resolvebutnotfeaturecollection)
* [resolveButNotFieldRange](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#resolvebutnotfieldrange)
* [resolveButNotHits](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#resolvebutnothits)
* [resolveComputeHits](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#resolvecomputehits)
* [resolveFeatureCollection](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#resolvefeaturecollection)
* [resolveHits](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#resolvehits)
* [setCollaborations](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#setcollaborations)
* [setConfigService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#setconfigservice)
* [setCountAll](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#setcountall)
* [setExploreApi](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#setexploreapi)
* [setFetchOptions](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#setfetchoptions)
* [setFilter](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#setfilter)
* [setWriteApi](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#setwriteapi)
* [tag](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#tag)
* [untag](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#untag)
* [urlBuilder](_app_services_startup_startup_service_.arlascollaborativesearchservice.md#urlbuilder)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ArlasCollaborativesearchService**(): [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)

*Overrides CollaborativesearchService.__constructor*

*Defined in app/services/startup/startup.service.ts:72*

**Returns:** [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)

___

## Properties

<a id="collaborationbus"></a>

###  collaborationBus

**● collaborationBus**: *`Subject`<`CollaborationEvent`>*

*Inherited from CollaborativesearchService.collaborationBus*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:11*

Bus of CollaborationEvent.

___
<a id="collaborationerrorbus"></a>

###  collaborationErrorBus

**● collaborationErrorBus**: *`Subject`<`Error`>*

*Inherited from CollaborativesearchService.collaborationErrorBus*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:47*

Bus of Error.

___
<a id="collaborations"></a>

###  collaborations

**● collaborations**: *`Map`<`string`, `Collaboration`>*

*Inherited from CollaborativesearchService.collaborations*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:19*

Registry of Collaborations, Map of contributor identifier,Collaboration.

___
<a id="collection"></a>

###  collection

**● collection**: *`string`*

*Inherited from CollaborativesearchService.collection*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:27*

ARLAS SERVER collection used by the collaborativesearchService.

___
<a id="contribfilterbus"></a>

###  contribFilterBus

**● contribFilterBus**: *`Subject`<`Contributor`>*

*Inherited from CollaborativesearchService.contribFilterBus*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:15*

Bus of CollaborationEvent.

___
<a id="countall"></a>

###  countAll

**● countAll**: *`Observable`<`number`>*

*Inherited from CollaborativesearchService.countAll*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:35*

Number of entity return by the collaborativesearchService at any time

___
<a id="max_age"></a>

###  max_age

**● max_age**: *`number`*

*Inherited from CollaborativesearchService.max_age*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:31*

ARLAS SERVER max age cache used by the collaborativesearchService.

___
<a id="ongoingsubscribe"></a>

###  ongoingSubscribe

**● ongoingSubscribe**: *`Subject`<`number`>*

*Inherited from CollaborativesearchService.ongoingSubscribe*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:39*

Bus number of ongoing subscribe to the collaborativesearchService

___
<a id="registry"></a>

###  registry

**● registry**: *`Map`<`string`, `Contributor`>*

*Inherited from CollaborativesearchService.registry*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:23*

Registry of Contributor, Map of contributor identifier,Contributor.

___
<a id="totalsubscribe"></a>

###  totalSubscribe

**● totalSubscribe**: *`number`*

*Inherited from CollaborativesearchService.totalSubscribe*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:43*

Bus number of ongoing subscribe to the collaborativesearchService

___

## Methods

<a id="datamodelbuilder"></a>

###  dataModelBuilder

▸ **dataModelBuilder**(filter: *`string`*): `Object`

*Inherited from CollaborativesearchService.dataModelBuilder*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:127*

**Parameters:**

| Param | Type |
| ------ | ------ |
| filter | `string` |

**Returns:** `Object`

___
<a id="describe"></a>

###  describe

▸ **describe**(collection: *`string`*, pretty?: *`boolean`*): `Observable`<`CollectionReferenceDescription`>

*Inherited from CollaborativesearchService.describe*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:252*

Describe the structure and the content of the given collection.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection name |
| `Optional` pretty | `boolean` |  Whether pretty print or not |

**Returns:** `Observable`<`CollectionReferenceDescription`>

___
<a id="disable"></a>

###  disable

▸ **disable**(contributorId: *`string`*): `void`

*Inherited from CollaborativesearchService.disable*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:216*

Disable a contributor collaboration from its identifier.

**Parameters:**

| Param | Type |
| ------ | ------ |
| contributorId | `string` |

**Returns:** `void`

___
<a id="enable"></a>

###  enable

▸ **enable**(contributorId: *`string`*): `void`

*Inherited from CollaborativesearchService.enable*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:212*

Enable a contributor collaboration from its identifier.

**Parameters:**

| Param | Type |
| ------ | ------ |
| contributorId | `string` |

**Returns:** `void`

___
<a id="getallcontributors"></a>

###  getAllContributors

▸ **getAllContributors**(): `Array`<`string`>

*Inherited from CollaborativesearchService.getAllContributors*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:221*

Retrieve all the contributor identifiers.

**Returns:** `Array`<`string`>
List of contributor idenfiers.

___
<a id="getcollaboration"></a>

###  getCollaboration

▸ **getCollaboration**(contributorId: *`string`*): `Collaboration`

*Inherited from CollaborativesearchService.getCollaboration*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:139*

Retrieve the collaboration from a contributor identifier.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contributorId | `string` |  Identifier of a contributor. |

**Returns:** `Collaboration`
Collaboration.

___
<a id="getconfigservice"></a>

###  getConfigService

▸ **getConfigService**(): `ConfigService`

*Inherited from CollaborativesearchService.getConfigService*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:101*

Return the Configuraion Service.

**Returns:** `ConfigService`
ConfigService.

___
<a id="getdisablecontributors"></a>

###  getDisableContributors

▸ **getDisableContributors**(): `Array`<`string`>

*Inherited from CollaborativesearchService.getDisableContributors*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:231*

Retrieve the contributor identifiers for which the collaboration is disabled.

**Returns:** `Array`<`string`>
List of contributor idenfiers.

___
<a id="getenablecontributors"></a>

###  getEnableContributors

▸ **getEnableContributors**(): `Array`<`string`>

*Inherited from CollaborativesearchService.getEnableContributors*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:226*

Retrieve the contributor identifiers for which the collaboration is enabled.

**Returns:** `Array`<`string`>
List of contributor idenfiers.

___
<a id="getexploreapi"></a>

###  getExploreApi

▸ **getExploreApi**(): `ExploreApi`

*Inherited from CollaborativesearchService.getExploreApi*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:81*

Return the ARLAS Explore API.

**Returns:** `ExploreApi`
ExploreApi.

___
<a id="getfetchoptions"></a>

###  getFetchOptions

▸ **getFetchOptions**(): `object`

*Inherited from CollaborativesearchService.getFetchOptions*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:69*

Return options used to fetch call.

**Returns:** `object`
Object.

___
<a id="getfinalfilter"></a>

###  getFinalFilter

▸ **getFinalFilter**(filters: *`Array`<`Filter`>*): `Filter`

*Inherited from CollaborativesearchService.getFinalFilter*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:246*

**Parameters:**

| Param | Type |
| ------ | ------ |
| filters | `Array`<`Filter`> |

**Returns:** `Filter`

___
<a id="geturl"></a>

###  getUrl

▸ **getUrl**(projection: *[`geoaggregate` &#124; `geosearch` &#124; `aggregate` &#124; `count` &#124; `geohashgeoaggregate` &#124; `search` &#124; `tiledgeosearch`, `Array`<`Aggregation`>]*, filters: *`Array`<`Filter`>*): `string`

*Inherited from CollaborativesearchService.getUrl*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:245*

Build query parameters from aggregation and filters

**Parameters:**

| Param | Type |
| ------ | ------ |
| projection | [`geoaggregate` &#124; `geosearch` &#124; `aggregate` &#124; `count` &#124; `geohashgeoaggregate` &#124; `search` &#124; `tiledgeosearch`, `Array`<`Aggregation`>] |
| filters | `Array`<`Filter`> |

**Returns:** `string`
Url encoded string

___
<a id="getwriteapi"></a>

###  getWriteApi

▸ **getWriteApi**(): `WriteApi`

*Inherited from CollaborativesearchService.getWriteApi*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:91*

Return the ARLAS Write API.

**Returns:** `WriteApi`
WriteApi.

___
<a id="isenable"></a>

###  isEnable

▸ **isEnable**(contributorId: *`string`*): `boolean`

*Inherited from CollaborativesearchService.isEnable*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:236*

Retrieve enabled parameter of collaboration from a contributor identifier.

**Parameters:**

| Param | Type |
| ------ | ------ |
| contributorId | `string` |

**Returns:** `boolean`
Contributor collaboration enabled properties.

___
<a id="register"></a>

###  register

▸ **register**(identifier: *`string`*, contributor: *`Contributor`*): `void`

*Inherited from CollaborativesearchService.register*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:110*

Register contributor with its identifier in the map contributor registry.

**Parameters:**

| Param | Type |
| ------ | ------ |
| identifier | `string` |
| contributor | `Contributor` |

**Returns:** `void`

___
<a id="removeall"></a>

###  removeAll

▸ **removeAll**(): `void`

*Inherited from CollaborativesearchService.removeAll*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:126*

Remove all the collaborations filters, notify the collaborationBus of a all removing changement.

**Returns:** `void`

___
<a id="removefilter"></a>

###  removeFilter

▸ **removeFilter**(contributorId: *`string`*): `void`

*Inherited from CollaborativesearchService.removeFilter*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:122*

Remove Filter from the registry of collaboration , notify the collaborationBus of a removing changement.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contributorId | `string` |  Sting identifier of contributor. |

**Returns:** `void`

___
<a id="resolveaggregation"></a>

###  resolveAggregation

▸ **resolveAggregation**(projection: *[`aggregate`, `Array`<`Aggregation`>]*, collaborations: *`Map`<`string`, `Collaboration`>*, contributorId?: *`string`*, filter?: *`Filter`*): `Observable`<`AggregationResponse`>

*Inherited from CollaborativesearchService.resolveAggregation*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:199*

Resolve an ARLAS Server Aggregation request for an optional contributor and optional filters.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| projection | [`aggregate`, `Array`<`Aggregation`>] |  Type of projection of ARLAS Server request :Aggregation. |
| collaborations | `Map`<`string`, `Collaboration`> |
| `Optional` contributorId | `string` |  Identifier contributor to resolve the request with the collaboration of this contributor. |
| `Optional` filter | `Filter` |  ARLAS API filter to resolve the request with this filter in addition. |

**Returns:** `Observable`<`AggregationResponse`>
ARLAS Server observable.

___
<a id="resolvebutnotaggregation"></a>

###  resolveButNotAggregation

▸ **resolveButNotAggregation**(projection: *[`aggregate`, `Array`<`Aggregation`>]*, collaborations: *`Map`<`string`, `Collaboration`>*, contributorId?: *`string`*, filter?: *`Filter`*): `Observable`<`AggregationResponse`>

*Inherited from CollaborativesearchService.resolveButNotAggregation*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:191*

Resolve an ARLAS Server Aggregation request with all the collaborations enabled in the collaboration registry expect for the contributor given in second optionnal parameter.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| projection | [`aggregate`, `Array`<`Aggregation`>] |  Type of projection of ARLAS Server request:Aggregation. |
| collaborations | `Map`<`string`, `Collaboration`> |
| `Optional` contributorId | `string` |  Identifier contributor to resolve the request without the collaboration of this contributor. |
| `Optional` filter | `Filter` |  ARLAS API filter to resolve the request with this filter in addition. |

**Returns:** `Observable`<`AggregationResponse`>
ARLAS Server observable.

___
<a id="resolvebutnotfeaturecollection"></a>

###  resolveButNotFeatureCollection

▸ **resolveButNotFeatureCollection**(projection: * [`geosearch`, `Search`] &#124; [`tiledgeosearch`, `TiledSearch`] &#124; [`geohashgeoaggregate`, `GeohashAggregation`] &#124; [`geoaggregate`, `Array`<`Aggregation`>]*, collaborations: *`Map`<`string`, `Collaboration`>*, isFlat?: *`boolean`*, contributorId?: *`string`*, filter?: *`Filter`*): `Observable`<`FeatureCollection`>

*Inherited from CollaborativesearchService.resolveButNotFeatureCollection*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:173*

Resolve an ARLAS Server Geosearch or Geoaggregate request with all the collaborations enabled in the collaboration registry expect for the contributor given in second optionnal parameter.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| projection |  [`geosearch`, `Search`] &#124; [`tiledgeosearch`, `TiledSearch`] &#124; [`geohashgeoaggregate`, `GeohashAggregation`] &#124; [`geoaggregate`, `Array`<`Aggregation`>]|  Type of projection of ARLAS Server request:Geosearch or Geoaggregate. |
| collaborations | `Map`<`string`, `Collaboration`> |
| `Optional` isFlat | `boolean` |  Boolean option to isFlat output geojson properties. |
| `Optional` contributorId | `string` |  Identifier contributor to resolve the request without the collaboration of this contributor. |
| `Optional` filter | `Filter` |  ARLAS API filter to resolve the request with this filter in addition. |

**Returns:** `Observable`<`FeatureCollection`>
ARLAS Server observable.

___
<a id="resolvebutnotfieldrange"></a>

###  resolveButNotFieldRange

▸ **resolveButNotFieldRange**(projection: *[`range`, `RangeRequest`]*, collaborations: *`Map`<`string`, `Collaboration`>*, contributorId?: *`string`*, filter?: *`Filter`*): `Observable`<`RangeResponse`>

*Inherited from CollaborativesearchService.resolveButNotFieldRange*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:208*

Resolve an ARLAS Server Range request with all the collaborations enabled in the collaboration registry expect for the contributor given in second optionnal parameter.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| projection | [`range`, `RangeRequest`] |  Type of projection of ARLAS Server request:Aggregation. |
| collaborations | `Map`<`string`, `Collaboration`> |
| `Optional` contributorId | `string` |  Identifier contributor to resolve the request without the collaboration of this contributor. |
| `Optional` filter | `Filter` |  ARLAS API filter to resolve the request with this filter in addition. |

**Returns:** `Observable`<`RangeResponse`>
ARLAS Server observable.

___
<a id="resolvebutnothits"></a>

###  resolveButNotHits

▸ **resolveButNotHits**(projection: * [`search`, `Search`] &#124; [`count`, `Count`]*, collaborations: *`Map`<`string`, `Collaboration`>*, contributorId?: *`string`*, filter?: *`Filter`*): `Observable`<`Hits`>

*Inherited from CollaborativesearchService.resolveButNotHits*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:148*

Resolve an ARLAS Server Search or Count request with all the collaborations enabled in the collaboration registry expect for the contributor given in second optionnal parameter.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| projection |  [`search`, `Search`] &#124; [`count`, `Count`]|  Type of projection of ARLAS Server request:Search or Count. |
| collaborations | `Map`<`string`, `Collaboration`> |
| `Optional` contributorId | `string` |  Identifier contributor to resolve the request without the collaboration of this contributor. |
| `Optional` filter | `Filter` |  ARLAS API filter to resolve the request with this filter in addition. |

**Returns:** `Observable`<`Hits`>
ARLAS Server observable.

___
<a id="resolvecomputehits"></a>

###  resolveComputeHits

▸ **resolveComputeHits**(projection: * [`search`, `Search`] &#124; [`count`, `Count`]*, filters: *`Array`<`Filter`>*): `Observable`<`Hits`>

*Inherited from CollaborativesearchService.resolveComputeHits*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:163*

Resolve an ARLAS Server Search or Count request for an array of filter.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| projection |  [`search`, `Search`] &#124; [`count`, `Count`]|  Type of projection of ARLAS Server request :Search or Count . |
| filters | `Array`<`Filter`> |  ARLAS API filters to resolve the request with compute |

**Returns:** `Observable`<`Hits`>
ARLAS Server observable.

___
<a id="resolvefeaturecollection"></a>

###  resolveFeatureCollection

▸ **resolveFeatureCollection**(projection: * [`geosearch`, `Search`] &#124; [`tiledgeosearch`, `TiledSearch`] &#124; [`geohashgeoaggregate`, `GeohashAggregation`] &#124; [`geoaggregate`, `Array`<`Aggregation`>]*, isFlat: *`boolean`*, collaborations: *`Map`<`string`, `Collaboration`>*, contributorId?: *`string`*, filter?: *`Filter`*): `Observable`<`FeatureCollection`>

*Inherited from CollaborativesearchService.resolveFeatureCollection*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:182*

Resolve an ARLAS Server Geosearch or Geoaggregate request for an optional contributor and optional filters.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| projection |  [`geosearch`, `Search`] &#124; [`tiledgeosearch`, `TiledSearch`] &#124; [`geohashgeoaggregate`, `GeohashAggregation`] &#124; [`geoaggregate`, `Array`<`Aggregation`>]|  Type of projection of ARLAS Server request :Geosearch or Geoaggregate. |
| isFlat | `boolean` |  Boolean option to flat output geojson properties. |
| collaborations | `Map`<`string`, `Collaboration`> |
| `Optional` contributorId | `string` |  Identifier contributor to resolve the request with the collaboration of this contributor. |
| `Optional` filter | `Filter` |  ARLAS API filter to resolve the request with this filter in addition. |

**Returns:** `Observable`<`FeatureCollection`>
ARLAS Server observable.

___
<a id="resolvehits"></a>

###  resolveHits

▸ **resolveHits**(projection: * [`search`, `Search`] &#124; [`count`, `Count`]*, collaborations: *`Map`<`string`, `Collaboration`>*, contributorId?: *`string`*, filter?: *`Filter`*): `Observable`<`Hits`>

*Inherited from CollaborativesearchService.resolveHits*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:156*

Resolve an ARLAS Server Search or Count request for an optional contributor and optional filters.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| projection |  [`search`, `Search`] &#124; [`count`, `Count`]|  Type of projection of ARLAS Server request :Search or Count . |
| collaborations | `Map`<`string`, `Collaboration`> |
| `Optional` contributorId | `string` |  Identifier contributor to resolve the request with the collaboration of this contributor. |
| `Optional` filter | `Filter` |  ARLAS API filter to resolve the request with this filter in addition. |

**Returns:** `Observable`<`Hits`>
ARLAS Server observable.

___
<a id="setcollaborations"></a>

###  setCollaborations

▸ **setCollaborations**(dataModel: *`Object`*): `void`

*Inherited from CollaborativesearchService.setCollaborations*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:133*

Initialize all the contributor in the state of dataModel.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dataModel | `Object` |   |

**Returns:** `void`

___
<a id="setconfigservice"></a>

###  setConfigService

▸ **setConfigService**(configService: *`ConfigService`*): `void`

*Inherited from CollaborativesearchService.setConfigService*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:106*

Set the Configuraion Service.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| configService | `ConfigService` |  ConfigService. |

**Returns:** `void`

___
<a id="setcountall"></a>

###  setCountAll

▸ **setCountAll**(collaborations: *`Map`<`string`, `Collaboration`>*): `void`

*Inherited from CollaborativesearchService.setCountAll*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:240*

Update countAll property.

**Parameters:**

| Param | Type |
| ------ | ------ |
| collaborations | `Map`<`string`, `Collaboration`> |

**Returns:** `void`

___
<a id="setexploreapi"></a>

###  setExploreApi

▸ **setExploreApi**(exploreApi: *`ExploreApi`*): `void`

*Inherited from CollaborativesearchService.setExploreApi*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:86*

Set the ARLAS Explore API.

**Parameters:**

| Param | Type |
| ------ | ------ |
| exploreApi | `ExploreApi` |

**Returns:** `void`

___
<a id="setfetchoptions"></a>

###  setFetchOptions

▸ **setFetchOptions**(fetchOptions: *`any`*): `void`

*Inherited from CollaborativesearchService.setFetchOptions*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:76*

Set the fetch options.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fetchOptions | `any` |  : Object. |

**Returns:** `void`

___
<a id="setfilter"></a>

###  setFilter

▸ **setFilter**(contributorId: *`string`*, collaboration: *`Collaboration`*): `void`

*Inherited from CollaborativesearchService.setFilter*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:116*

Add Filter setted by a contributor in the registry of collaboration, notify the collaborationBus of a changement.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contributorId | `string` |  Sting identifier of contributor. |
| collaboration | `Collaboration` |  Collaboration added by the contributor. |

**Returns:** `void`

___
<a id="setwriteapi"></a>

###  setWriteApi

▸ **setWriteApi**(writeApi: *`WriteApi`*): `void`

*Inherited from CollaborativesearchService.setWriteApi*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:96*

Set the ARLAS Write API.

**Parameters:**

| Param | Type |
| ------ | ------ |
| writeApi | `WriteApi` |

**Returns:** `void`

___
<a id="tag"></a>

###  tag

▸ **tag**(collection: *`string`*, body?: *`TagRequest`*, pretty?: *`boolean`*): `Observable`<`UpdateResponse`>

*Inherited from CollaborativesearchService.tag*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:259*

Search and tag the elements found in the collection, given the filters

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection name |
| `Optional` body | `TagRequest` |  Request body |
| `Optional` pretty | `boolean` |  Whether pretty print or not |

**Returns:** `Observable`<`UpdateResponse`>

___
<a id="untag"></a>

###  untag

▸ **untag**(collection: *`string`*, body?: *`TagRequest`*, pretty?: *`boolean`*): `Observable`<`UpdateResponse`>

*Inherited from CollaborativesearchService.untag*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:266*

Search and untag the elements found in the collection, given the filters

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection name |
| `Optional` body | `TagRequest` |  Request body |
| `Optional` pretty | `boolean` |  Whether pretty print or not |

**Returns:** `Observable`<`UpdateResponse`>

___
<a id="urlbuilder"></a>

###  urlBuilder

▸ **urlBuilder**(): `string`

*Inherited from CollaborativesearchService.urlBuilder*

*Defined in /docs/node_modules/arlas-web-core/services/collaborativesearch.service.d.ts:128*

**Returns:** `string`

___

