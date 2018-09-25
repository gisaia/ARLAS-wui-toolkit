[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/bookmark/bookmark.service"](../modules/_app_services_bookmark_bookmark_service_.md) > [ArlasBookmarkService](../classes/_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md)

# Class: ArlasBookmarkService

Constants used to fill up our data base.

## Hierarchy

**ArlasBookmarkService**

## Index

### Constructors

* [constructor](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#constructor)

### Properties

* [bookMarkMap](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#bookmarkmap)
* [dataBase](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#database)
* [dataSource](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#datasource)
* [selectorById](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#selectorbyid)
* [snackBar](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#snackbar)

### Methods

* [addBookmark](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#addbookmark)
* [createCombineBookmark](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#createcombinebookmark)
* [openSnackBar](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#opensnackbar)
* [removeBookmark](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#removebookmark)
* [setBookMarkCount](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#setbookmarkcount)
* [viewBookMark](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#viewbookmark)
* [viewCombineBookmark](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md#viewcombinebookmark)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ArlasBookmarkService**(collaborativesearchService: *[ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md)*, activatedRoute: *`ActivatedRoute`*, snackBar: *`MatSnackBar`*, arlasStartupService: *[ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md)*, router: *`Router`*): [ArlasBookmarkService](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md)

*Defined in app/services/bookmark/bookmark.service.ts:41*

**Parameters:**

| Param | Type |
| ------ | ------ |
| collaborativesearchService | [ArlasCollaborativesearchService](_app_services_startup_startup_service_.arlascollaborativesearchservice.md) |
| activatedRoute | `ActivatedRoute` |
| snackBar | `MatSnackBar` |
| arlasStartupService | [ArlasStartupService](_app_services_startup_startup_service_.arlasstartupservice.md) |
| router | `Router` |

**Returns:** [ArlasBookmarkService](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md)

___

## Properties

<a id="bookmarkmap"></a>

###  bookMarkMap

**● bookMarkMap**: *`Map`<`string`, [BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md)>* =  new Map<string, BookMark>()

*Defined in app/services/bookmark/bookmark.service.ts:40*

___
<a id="database"></a>

###  dataBase

**● dataBase**: *[BookmarkDatabase](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md)*

*Defined in app/services/bookmark/bookmark.service.ts:38*

___
<a id="datasource"></a>

###  dataSource

**● dataSource**: * [BookmarkDataSource](_app_services_bookmark_bookmarkdatasource_.bookmarkdatasource.md) &#124; `null`
*

*Defined in app/services/bookmark/bookmark.service.ts:39*

___
<a id="selectorbyid"></a>

###  selectorById

**● selectorById**: *`any`*

*Defined in app/services/bookmark/bookmark.service.ts:41*

___
<a id="snackbar"></a>

###  snackBar

**● snackBar**: *`MatSnackBar`*

*Defined in app/services/bookmark/bookmark.service.ts:44*

___

## Methods

<a id="addbookmark"></a>

###  addBookmark

▸ **addBookmark**(newBookMarkName: *`string`*, selectedItem?: *`Set`<`string`>*): `void`

*Defined in app/services/bookmark/bookmark.service.ts:54*

**Parameters:**

| Param | Type |
| ------ | ------ |
| newBookMarkName | `string` |
| `Optional` selectedItem | `Set`<`string`> |

**Returns:** `void`

___
<a id="createcombinebookmark"></a>

###  createCombineBookmark

▸ **createCombineBookmark**(newBookMarkName: *`string`*, selectedBookmark: *`Set`<`string`>*): `void`

*Defined in app/services/bookmark/bookmark.service.ts:82*

**Parameters:**

| Param | Type |
| ------ | ------ |
| newBookMarkName | `string` |
| selectedBookmark | `Set`<`string`> |

**Returns:** `void`

___
<a id="opensnackbar"></a>

###  openSnackBar

▸ **openSnackBar**(message: *`string`*): `void`

*Defined in app/services/bookmark/bookmark.service.ts:130*

**Parameters:**

| Param | Type |
| ------ | ------ |
| message | `string` |

**Returns:** `void`

___
<a id="removebookmark"></a>

###  removeBookmark

▸ **removeBookmark**(id: *`string`*): `void`

*Defined in app/services/bookmark/bookmark.service.ts:106*

**Parameters:**

| Param | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `void`

___
<a id="setbookmarkcount"></a>

###  setBookMarkCount

▸ **setBookMarkCount**(bookMark: *[BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md)*): `void`

*Defined in app/services/bookmark/bookmark.service.ts:138*

**Parameters:**

| Param | Type |
| ------ | ------ |
| bookMark | [BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md) |

**Returns:** `void`

___
<a id="viewbookmark"></a>

###  viewBookMark

▸ **viewBookMark**(id: *`string`*): `void`

*Defined in app/services/bookmark/bookmark.service.ts:112*

**Parameters:**

| Param | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `void`

___
<a id="viewcombinebookmark"></a>

###  viewCombineBookmark

▸ **viewCombineBookmark**(selectedBookmark: *`Set`<`string`>*): `void`

*Defined in app/services/bookmark/bookmark.service.ts:142*

**Parameters:**

| Param | Type |
| ------ | ------ |
| selectedBookmark | `Set`<`string`> |

**Returns:** `void`

___

