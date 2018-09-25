[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/bookmark/bookmarkDataSource"](../modules/_app_services_bookmark_bookmarkdatasource_.md) > [BookmarkDataSource](../classes/_app_services_bookmark_bookmarkdatasource_.bookmarkdatasource.md)

# Class: BookmarkDataSource

## Hierarchy

 `DataSource`<`any`>

**↳ BookmarkDataSource**

## Index

### Constructors

* [constructor](_app_services_bookmark_bookmarkdatasource_.bookmarkdatasource.md#constructor)

### Accessors

* [filter](_app_services_bookmark_bookmarkdatasource_.bookmarkdatasource.md#filter)

### Methods

* [connect](_app_services_bookmark_bookmarkdatasource_.bookmarkdatasource.md#connect)
* [disconnect](_app_services_bookmark_bookmarkdatasource_.bookmarkdatasource.md#disconnect)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BookmarkDataSource**(_bookmarkDatabase: *[BookmarkDatabase](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md)*): [BookmarkDataSource](_app_services_bookmark_bookmarkdatasource_.bookmarkdatasource.md)

*Defined in app/services/bookmark/bookmarkDataSource.ts:30*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _bookmarkDatabase | [BookmarkDatabase](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md) |

**Returns:** [BookmarkDataSource](_app_services_bookmark_bookmarkdatasource_.bookmarkdatasource.md)

___

## Accessors

<a id="filter"></a>

###  filter

getfilter(): `string`setfilter(filter: *`string`*): `void`

*Defined in app/services/bookmark/bookmarkDataSource.ts:29*

**Returns:** `string`

*Defined in app/services/bookmark/bookmarkDataSource.ts:30*

**Parameters:**

| Param | Type |
| ------ | ------ |
| filter | `string` |

**Returns:** `void`

___

## Methods

<a id="connect"></a>

###  connect

▸ **connect**(): `Observable`<[BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md)[]>

*Overrides DataSource.connect*

*Defined in app/services/bookmark/bookmarkDataSource.ts:35*

Connect function called by the table to retrieve one stream containing the data to render.

**Returns:** `Observable`<[BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md)[]>

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `void`

*Overrides DataSource.disconnect*

*Defined in app/services/bookmark/bookmarkDataSource.ts:49*

**Returns:** `void`

___

