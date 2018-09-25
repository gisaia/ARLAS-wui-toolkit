[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/startup/startup.service"](../modules/_app_services_startup_startup_service_.md) > [ArlasExploreApi](../classes/_app_services_startup_startup_service_.arlasexploreapi.md)

# Class: ArlasExploreApi

## Hierarchy

 `ExploreApi`

**↳ ArlasExploreApi**

## Index

### Constructors

* [constructor](_app_services_startup_startup_service_.arlasexploreapi.md#constructor)

### Properties

* [basePath](_app_services_startup_startup_service_.arlasexploreapi.md#basepath)
* [configuration](_app_services_startup_startup_service_.arlasexploreapi.md#configuration)
* [fetch](_app_services_startup_startup_service_.arlasexploreapi.md#fetch)

### Methods

* [aggregate](_app_services_startup_startup_service_.arlasexploreapi.md#aggregate)
* [aggregatePost](_app_services_startup_startup_service_.arlasexploreapi.md#aggregatepost)
* [count](_app_services_startup_startup_service_.arlasexploreapi.md#count)
* [countPost](_app_services_startup_startup_service_.arlasexploreapi.md#countpost)
* [describe](_app_services_startup_startup_service_.arlasexploreapi.md#describe)
* [geoaggregate](_app_services_startup_startup_service_.arlasexploreapi.md#geoaggregate)
* [geoaggregatePost](_app_services_startup_startup_service_.arlasexploreapi.md#geoaggregatepost)
* [geohashgeoaggregate](_app_services_startup_startup_service_.arlasexploreapi.md#geohashgeoaggregate)
* [geosearch](_app_services_startup_startup_service_.arlasexploreapi.md#geosearch)
* [geosearchPost](_app_services_startup_startup_service_.arlasexploreapi.md#geosearchpost)
* [getArlasHit](_app_services_startup_startup_service_.arlasexploreapi.md#getarlashit)
* [list](_app_services_startup_startup_service_.arlasexploreapi.md#list)
* [opensearch](_app_services_startup_startup_service_.arlasexploreapi.md#opensearch)
* [range](_app_services_startup_startup_service_.arlasexploreapi.md#range)
* [rangePost](_app_services_startup_startup_service_.arlasexploreapi.md#rangepost)
* [search](_app_services_startup_startup_service_.arlasexploreapi.md#search)
* [searchPost](_app_services_startup_startup_service_.arlasexploreapi.md#searchpost)
* [suggest](_app_services_startup_startup_service_.arlasexploreapi.md#suggest)
* [tiledgeosearch](_app_services_startup_startup_service_.arlasexploreapi.md#tiledgeosearch)
* [tiledgeosearch_1](_app_services_startup_startup_service_.arlasexploreapi.md#tiledgeosearch_1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ArlasExploreApi**(conf: *`Configuration`*, basePath: *`string`*, fetch: *`any`*): [ArlasExploreApi](_app_services_startup_startup_service_.arlasexploreapi.md)

*Overrides BaseAPI.__constructor*

*Defined in app/services/startup/startup.service.ts:56*

**Parameters:**

| Param | Type |
| ------ | ------ |
| conf | `Configuration` |
| basePath | `string` |
| fetch | `any` |

**Returns:** [ArlasExploreApi](_app_services_startup_startup_service_.arlasexploreapi.md)

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

<a id="aggregate"></a>

###  aggregate

▸ **aggregate**(collection: *`string`*, agg: *`Array`<`string`>*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`AggregationResponse`>

*Inherited from ExploreApi.aggregate*

*Defined in /docs/node_modules/arlas-api/api.d.ts:1916*

Aggregate the elements in the collection(s), given the filters and the aggregation parameters
*__summary__*: Aggregate

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| agg | `Array`<`string`> |  The agg parameter should be given in the following formats: {type}:{field}:interval-{interval}:format-{format}:collect\_field-{collect\_field}:collect_fct-{function}:order-{order}:on-{on}:size-{size} Where : - **{type}:{field}** part is mandatory. - **interval** must be specified only when aggregation type is datehistogram, histogram and geohash. - **format** is optional for datehistogram, and must not be specified for the other types. - (**collect_field**,**collect_fct**) couple is optional for all aggregation types. - It&#39;s possible to apply multiple metric aggregations by defining multiple (**collect_field**,**collect_fct**) couples. - (**collect_field**,**collect_fct**) couples should be unique in that case. - (**order**,**on**) couple is optional for all aggregation types. - **size** is optional for term and geohash, and must not be specified for the other types. - **include** is optional for term, and must not be specified for the other types. - {type} possible values are : datehistogram, histogram, geohash and term. - {interval} possible values depends on {type}. If {type} &#x3D; datehistogram, then {interval} &#x3D; {size}(year,quarter,month,week,day,hour,minute,second). Size value must be equal to 1 for year,quarter,month and week unities. If {type} &#x3D; histogram, then {interval} &#x3D; {size}. If {type} &#x3D; geohash, then {interval} &#x3D; {size}. It&#39;s an integer between 1 and 12. Lower the length, greater is the surface of aggregation. If {type} &#x3D; term, then interval-{interval} is not needed. - format-{format} is the date format for key aggregation. The default value is yyyy-MM-dd-hh:mm:ss. - {collect\_fct} is the aggregation function to apply to collections on the specified {collect\_field}. {collect_fct} possible values are : avg,cardinality,max,min,sum - {order} is set to sort the aggregation buckets on the field name, on the count of the buckets or on the the result of a metric sub-aggregation. Its values are &#39;asc&#39; or &#39;desc&#39;. - {on} is set to specify whether the {order} is on the field name, on the count of the aggregation or on the result of a metric sub-aggregation. Its values are &#39;field&#39;, &#39;count&#39; or &#39;result&#39;. - If {on} is equal to &#x60;result&#x60; and two ore more (**collect_field**,**collect_fct**) couples are specified, then the order is applied on the first &#x60;collect_fct&#x60; that is different from geobbox and geocentroid - {size} Defines how many buckets should be returned. - {include} Specifies the values for which buckets will be created. This values are comma separated. If one value is specified then regular expressions can be used (only in this case) and buckets matching them will be created. If more than one value are specified then only buckets matching the exact values will be created. **agg** parameter is multiple. Every agg parameter specified is a subaggregation of the previous one : order matters. For more details, check [https://gitlab.com/GISAIA.ARLAS/ARLAS-server/blob/master/doc/api/API-definition.md](https://gitlab.com/GISAIA.ARLAS/ARLAS-server/blob/master/doc/api/API-definition.md). |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`AggregationResponse`>

___
<a id="aggregatepost"></a>

###  aggregatePost

▸ **aggregatePost**(collection: *`string`*, body?: *`AggregationsRequest`*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`AggregationResponse`>

*Inherited from ExploreApi.aggregatePost*

*Defined in /docs/node_modules/arlas-api/api.d.ts:1928*

Aggregate the elements in the collection(s), given the filters and the aggregation parameters
*__summary__*: Aggregate

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` body | `AggregationsRequest` |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`AggregationResponse`>

___
<a id="count"></a>

###  count

▸ **count**(collection: *`string`*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`Hits`>

*Inherited from ExploreApi.count*

*Defined in /docs/node_modules/arlas-api/api.d.ts:1947*

Count the number of elements found in the collection(s), given the filters
*__summary__*: Count

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collections |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`Hits`>

___
<a id="countpost"></a>

###  countPost

▸ **countPost**(collection: *`string`*, pretty?: *`boolean`*, body?: *`Count`*, options?: *`any`*): `Promise`<`Hits`>

*Inherited from ExploreApi.countPost*

*Defined in /docs/node_modules/arlas-api/api.d.ts:1958*

Count the number of elements found in the collection(s), given the filters
*__summary__*: Count

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collections |
| `Optional` pretty | `boolean` |
| `Optional` body | `Count` |
| `Optional` options | `any` |

**Returns:** `Promise`<`Hits`>

___
<a id="describe"></a>

###  describe

▸ **describe**(collection: *`string`*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`CollectionReferenceDescription`>

*Inherited from ExploreApi.describe*

*Defined in /docs/node_modules/arlas-api/api.d.ts:1969*

Describe the structure and the content of the given collection.
*__summary__*: Describe

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`CollectionReferenceDescription`>

___
<a id="geoaggregate"></a>

###  geoaggregate

▸ **geoaggregate**(collection: *`string`*, agg: *`Array`<`string`>*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, flat?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`FeatureCollection`>

*Inherited from ExploreApi.geoaggregate*

*Defined in /docs/node_modules/arlas-api/api.d.ts:1990*

Aggregate the elements in the collection(s) as features, given the filters and the aggregation parameters.
*__summary__*: GeoAggregate

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| agg | `Array`<`string`> |  The agg parameter should be given in the following formats: {type}:{field}:interval-{interval}:format-{format}:collect\_field-{collect\_field}:collect_fct-{function}:order-{order}:on-{on}:size-{size}:withGeoCentroid-{Boolean}:withGeoBBOX-{Boolean} Where : - **{type}:{field}** part is mandatory. - **interval** must be specified only when aggregation type is datehistogram, histogram and geohash. - **format** is optional for datehistogram, and must not be specified for the other types. - (**collect_field**,**collect_fct**) couple is optional for all aggregation types. - (**order**,**on**) couple is optional for all aggregation types. - **size** is optional for term and geohash, and must not be specified for the other types. - **include** is optional for term, and must not be specified for the other types. - {type} possible values are : geohash, datehistogram, histogram and term. geohash must be the main aggregation. - {interval} possible values depends on {type}. If {type} &#x3D; datehistogram, then {interval} &#x3D; {size}(year,quarter,month,week,day,hour,minute,second). Size value must be equal to 1 for year,quarter,month and week unities. If {type} &#x3D; histogram, then {interval} &#x3D; {size}. If {type} &#x3D; geohash, then {interval} &#x3D; {size}. It&#39;s an integer between 1 and 12. Lower the length, greater is the surface of aggregation. If {type} &#x3D; term, then interval-{interval} is not needed. - format-{format} is the date format for key aggregation. The default value is yyyy-MM-dd-hh:mm:ss. - {collect\_fct} is the aggregation function to apply to collections on the specified {collect\_field}. {collect\_fct} possible values are : avg,cardinality,max,min,sum,geobbox,geocentroid - {withGeoCentroid} : When it&#39;s true : the geoaggregation geometry is the centroid of each bucket. - {withGeoBBOX} : When it&#39;s true : the geoaggregation geometry is the data extent (bbox) of each bucket. - (collect\_field,collect\_fct) should both be specified, except when collect\_fct &#x3D; &#x60;geobbox&#x60; or &#x60;geocentroid&#x60;, it could be specified alone. The metrics &#x60;geobbox&#x60; and &#x60;geocentroid&#x60; are returned as features collections. - {order} is set to sort the aggregation buckets on the field name, on the count of the buckets or on the the result of a metric sub-aggregation. Its values are &#39;asc&#39; or &#39;desc&#39;. - {on} is set to specify whether the {order} is on the field name, on the count of the aggregation or on the result of a metric sub-aggregation. Its values are &#39;field&#39;, &#39;count&#39; or &#39;result&#39;. - When {on} &#x3D; &#x60;result&#x60;, then (collect\_field,collect\_fct) should be specified. Except when {collect\_fct} &#x3D; &#x60;geobbox&#x60; or &#x60;geocentroid&#x60;, then {on}&#x3D;&#x60;result&#x60; is prohibited - {size} Defines how many buckets should be returned. - {include} Specifies the values for which buckets will be created. This values are comma separated. If one value is specified then regular expressions can be used (only in this case) and buckets matching them will be created. If more than one value are specified then only buckets matching the exact values will be created. If {withGeoCentroid} or {withGeoBBOX} are specified, the returned geometry is the one used in the geojson. {withGeoBBOX} wins over {withGeoCentroid} If {withGeoCentroid} and {collect\_fct}&#x3D;&#x60;geocentroid&#x60; are both set, the centroid of each bucket is only returned as the geo-aggregation geometry and not in the metrics **agg** parameter is multiple. The first (main) aggregation must be geohash. Every agg parameter specified is a subaggregation of the previous one : order matters. For more details, check [https://gitlab.com/GISAIA.ARLAS/ARLAS-server/blob/master/doc/api/API-definition.md](https://gitlab.com/GISAIA.ARLAS/ARLAS-server/blob/master/doc/api/API-definition.md) |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` flat | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`FeatureCollection`>

___
<a id="geoaggregatepost"></a>

###  geoaggregatePost

▸ **geoaggregatePost**(collection: *`string`*, body?: *`AggregationsRequest`*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`FeatureCollection`>

*Inherited from ExploreApi.geoaggregatePost*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2002*

Aggregate the elements in the collection(s) as features, given the filters and the aggregation parameters.
*__summary__*: GeoAggregate

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` body | `AggregationsRequest` |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`FeatureCollection`>

___
<a id="geohashgeoaggregate"></a>

###  geohashgeoaggregate

▸ **geohashgeoaggregate**(collection: *`string`*, geohash: *`string`*, agg?: *`Array`<`string`>*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, flat?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`FeatureCollection`>

*Inherited from ExploreApi.geohashgeoaggregate*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2024*

Aggregate the elements in the collection(s) and localized in the given geohash as features, given the filters and the aggregation parameters.
*__summary__*: GeoAggregate on a geohash

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| geohash | `string` |  geohash |
| `Optional` agg | `Array`<`string`> |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` flat | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`FeatureCollection`>

___
<a id="geosearch"></a>

###  geosearch

▸ **geosearch**(collection: *`string`*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, flat?: *`boolean`*, include?: *`Array`<`string`>*, exclude?: *`Array`<`string`>*, size?: *`number`*, from?: *`number`*, sort?: *`Array`<`string`>*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`FeatureCollection`>

*Inherited from ExploreApi.geosearch*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2049*

Search and return the elements found in the collection(s) as features, given the filters
*__summary__*: GeoSearch

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` flat | `boolean` |
| `Optional` include | `Array`<`string`> |
| `Optional` exclude | `Array`<`string`> |
| `Optional` size | `number` |
| `Optional` from | `number` |
| `Optional` sort | `Array`<`string`> |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`FeatureCollection`>

___
<a id="geosearchpost"></a>

###  geosearchPost

▸ **geosearchPost**(collection: *`string`*, body?: *`Search`*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`FeatureCollection`>

*Inherited from ExploreApi.geosearchPost*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2061*

Search and return the elements found in the collection(s) as features, given the filters
*__summary__*: GeoSearch

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` body | `Search` |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`FeatureCollection`>

___
<a id="getarlashit"></a>

###  getArlasHit

▸ **getArlasHit**(collection: *`string`*, identifier: *`string`*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`Hit`>

*Inherited from ExploreApi.getArlasHit*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2073*

Returns a raw indexed document.
*__summary__*: Get an Arlas document

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| identifier | `string` |  identifier |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`Hit`>

___
<a id="list"></a>

###  list

▸ **list**(pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`CollectionReferenceDescription`>

*Inherited from ExploreApi.list*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2083*

List the collections configured in ARLAS.
*__summary__*: List

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`CollectionReferenceDescription`>

___
<a id="opensearch"></a>

###  opensearch

▸ **opensearch**(collection: *`string`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`Response`>

*Inherited from ExploreApi.opensearch*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2093*

Access to the OpenSearch Description document for the given collection
*__summary__*: OpenSearch Description Document

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`Response`>

___
<a id="range"></a>

###  range

▸ **range**(collection: *`string`*, field: *`string`*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`RangeResponse`>

*Inherited from ExploreApi.range*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2113*

Calculates the min and max values of a field in the collection, given the filters
*__summary__*: RangeRequest

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| field | `string` |  The field whose range is calculated |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`RangeResponse`>

___
<a id="rangepost"></a>

###  rangePost

▸ **rangePost**(collection: *`string`*, body?: *`RangeRequest`*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`RangeResponse`>

*Inherited from ExploreApi.rangePost*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2125*

Calculates the min and max values of a field in the collection, given the filters
*__summary__*: Aggregate

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` body | `RangeRequest` |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`RangeResponse`>

___
<a id="search"></a>

###  search

▸ **search**(collection: *`string`*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, include?: *`Array`<`string`>*, exclude?: *`Array`<`string`>*, size?: *`number`*, from?: *`number`*, sort?: *`string`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`Hits`>

*Inherited from ExploreApi.search*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2149*

Search and return the elements found in the collection, given the filters
*__summary__*: Search

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` include | `Array`<`string`> |
| `Optional` exclude | `Array`<`string`> |
| `Optional` size | `number` |
| `Optional` from | `number` |
| `Optional` sort | `string` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`Hits`>

___
<a id="searchpost"></a>

###  searchPost

▸ **searchPost**(collection: *`string`*, body?: *`Search`*, pretty?: *`boolean`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`Hits`>

*Inherited from ExploreApi.searchPost*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2161*

Search and return the elements found in the collection, given the filters
*__summary__*: Search

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| `Optional` body | `Search` |
| `Optional` pretty | `boolean` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`Hits`>

___
<a id="suggest"></a>

###  suggest

▸ **suggest**(collections: *`string`*, f?: *`Array`<`string`>*, q?: *`string`*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, size?: *`number`*, from?: *`number`*, field?: *`string`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`Response`>

*Inherited from ExploreApi.suggest*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2183*

Suggest the the n (n=size) most relevant terms given the filters
*__summary__*: Suggest

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collections | `string` |  collections, comma separated |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `string` |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` size | `number` |
| `Optional` from | `number` |
| `Optional` field | `string` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`Response`>

___
<a id="tiledgeosearch"></a>

###  tiledgeosearch

▸ **tiledgeosearch**(collection: *`string`*, x: *`number`*, y: *`number`*, z: *`number`*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, pretty?: *`boolean`*, flat?: *`boolean`*, include?: *`Array`<`string`>*, exclude?: *`Array`<`string`>*, size?: *`number`*, from?: *`number`*, sort?: *`Array`<`string`>*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`FeatureCollection`>

*Inherited from ExploreApi.tiledgeosearch*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2211*

Search and return the elements found in the collection(s) and localized in the given tile(x,y,z) as features, given the filters
*__summary__*: Tiled GeoSearch

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| x | `number` |  x |
| y | `number` |  y |
| z | `number` |  z |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` pretty | `boolean` |
| `Optional` flat | `boolean` |
| `Optional` include | `Array`<`string`> |
| `Optional` exclude | `Array`<`string`> |
| `Optional` size | `number` |
| `Optional` from | `number` |
| `Optional` sort | `Array`<`string`> |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`FeatureCollection`>

___
<a id="tiledgeosearch_1"></a>

###  tiledgeosearch_1

▸ **tiledgeosearch_1**(collection: *`string`*, x: *`number`*, y: *`number`*, z: *`number`*, f?: *`Array`<`string`>*, q?: *`Array`<`string`>*, pwithin?: *`Array`<`string`>*, gwithin?: *`Array`<`string`>*, gintersect?: *`Array`<`string`>*, notpwithin?: *`Array`<`string`>*, notgwithin?: *`Array`<`string`>*, notgintersect?: *`Array`<`string`>*, size?: *`number`*, from?: *`number`*, sort?: *`Array`<`string`>*, sampling?: *`number`*, coverage?: *`number`*, maxAgeCache?: *`number`*, options?: *`any`*): `Promise`<`Response`>

*Inherited from ExploreApi.tiledgeosearch_1*

*Defined in /docs/node_modules/arlas-api/api.d.ts:2237*

Search and return the elements found in the collection(s) and localized in the given tile(x,y,z) as features, given the filters
*__summary__*: Tiled GeoSearch

*__throws__*: {RequiredError}

*__memberof__*: ExploreApi

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  collection |
| x | `number` |  x |
| y | `number` |  y |
| z | `number` |  z |
| `Optional` f | `Array`<`string`> |
| `Optional` q | `Array`<`string`> |
| `Optional` pwithin | `Array`<`string`> |
| `Optional` gwithin | `Array`<`string`> |
| `Optional` gintersect | `Array`<`string`> |
| `Optional` notpwithin | `Array`<`string`> |
| `Optional` notgwithin | `Array`<`string`> |
| `Optional` notgintersect | `Array`<`string`> |
| `Optional` size | `number` |
| `Optional` from | `number` |
| `Optional` sort | `Array`<`string`> |
| `Optional` sampling | `number` |
| `Optional` coverage | `number` |
| `Optional` maxAgeCache | `number` |
| `Optional` options | `any` |

**Returns:** `Promise`<`Response`>

___

