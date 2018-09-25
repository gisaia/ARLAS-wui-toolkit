[@gisaia-team/arlas-wui-toolkit](../README.md) > ["app/services/bookmark/bookmarkDatabase"](../modules/_app_services_bookmark_bookmarkdatabase_.md) > [BookmarkDatabase](../classes/_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md)

# Class: BookmarkDatabase

## Hierarchy

**BookmarkDatabase**

## Index

### Constructors

* [constructor](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md#constructor)

### Properties

* [bookMarkMap](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md#bookmarkmap)
* [bookmarkService](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md#bookmarkservice)
* [dataChange](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md#datachange)

### Accessors

* [data](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md#data)

### Methods

* [addBookMark](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md#addbookmark)
* [incrementBookmarkView](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md#incrementbookmarkview)
* [removeBookMark](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md#removebookmark)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BookmarkDatabase**(bookmarkService: *[ArlasBookmarkService](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md)*): [BookmarkDatabase](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md)

*Defined in app/services/bookmark/bookmarkDatabase.ts:30*

**Parameters:**

| Param | Type |
| ------ | ------ |
| bookmarkService | [ArlasBookmarkService](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md) |

**Returns:** [BookmarkDatabase](_app_services_bookmark_bookmarkdatabase_.bookmarkdatabase.md)

___

## Properties

<a id="bookmarkmap"></a>

###  bookMarkMap

**● bookMarkMap**: *`Map`<`string`, [BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md)>* =  new Map<string, BookMark>()

*Defined in app/services/bookmark/bookmarkDatabase.ts:30*

___
<a id="bookmarkservice"></a>

###  bookmarkService

**● bookmarkService**: *[ArlasBookmarkService](_app_services_bookmark_bookmark_service_.arlasbookmarkservice.md)*

*Defined in app/services/bookmark/bookmarkDatabase.ts:31*

___
<a id="datachange"></a>

###  dataChange

**● dataChange**: *`BehaviorSubject`<[BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md)[]>* =  new BehaviorSubject<BookMark[]>([])

*Defined in app/services/bookmark/bookmarkDatabase.ts:28*

Stream that emits whenever the data has been modified.

___

## Accessors

<a id="data"></a>

###  data

getdata(): [BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md)[]

*Defined in app/services/bookmark/bookmarkDatabase.ts:29*

**Returns:** [BookMark](../interfaces/_app_services_bookmark_model_.bookmark.md)[]

___

## Methods

<a id="addbookmark"></a>

###  addBookMark

▸ **addBookMark**(name: *`string`*, prettyFilter: *`string`*, url: *`string`*, type: *[BookMarkType](../enums/_app_services_bookmark_model_.bookmarktype.md)*, color: *`string`*, id?: *`string`*, date?: *`Date`*, views?: *`number`*): `void`

*Defined in app/services/bookmark/bookmarkDatabase.ts:43*

**Parameters:**

| Param | Type |
| ------ | ------ |
| name | `string` |
| prettyFilter | `string` |
| url | `string` |
| type | [BookMarkType](../enums/_app_services_bookmark_model_.bookmarktype.md) |
| color | `string` |
| `Optional` id | `string` |
| `Optional` date | `Date` |
| `Optional` views | `number` |

**Returns:** `void`

___
<a id="incrementbookmarkview"></a>

###  incrementBookmarkView

▸ **incrementBookmarkView**(id: *`string`*): `void`

*Defined in app/services/bookmark/bookmarkDatabase.ts:67*

**Parameters:**

| Param | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `void`

___
<a id="removebookmark"></a>

###  removeBookMark

▸ **removeBookMark**(id: *`string`*): `void`

*Defined in app/services/bookmark/bookmarkDatabase.ts:55*

**Parameters:**

| Param | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `void`

___

