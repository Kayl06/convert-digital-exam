# Lookbook

Merchants create the definition and entries in the Shopify admin. The theme reads those entries and fetches product data at runtime through the Storefront API.

## 1. Create Lookbook metaobject definition

In **Settings → Custom data → Metaobjects**, add a definition that matches this schema. Field keys must be exactly `title`, `description`, and `products`.


| Property          | Value      |
| ----------------- | ---------- |
| Name              | Lookbook   |
| Type              | `lookbook` |
| Display name      | Title      |
| Storefront access | Read       |



| Field key     | Name        | Type             | Required |
| ------------- | ----------- | ---------------- | -------- |
| `title`       | Title       | Single line text | Yes      |
| `description` | Description | Multi-line text  | No       |
| `products`    | Products    | List of products | Yes      |


Storefront read access is required so Liquid (`metaobjects.lookbook`) and the theme picker can load entries.

The same definition is in `docs/lookbook-metaobject-definition.graphql`.

## 2. Create lookbook entries

In **Content → Metaobjects → Lookbook**, add an entry:

1. Set a handle such as `lookbook-1`.
2. Enter a title and description.
3. Choose products in the **Products** list.

Entries are edited in the admin. The theme only reads product **handles** from that list; titles, images, and prices are fetched later with the Storefront API.

## 3. Storefront API token

The exam store (**[ConvertDigitalExam](http://convert-digital-exam.myshopify.com)**) has already been configured with a public Storefront API access token (from **Headless** app). If the theme is installed on another store, add a public token under **Theme settings → Lookbook**. Never use an Admin API token or private Storefront token.

## 4. How the theme uses lookbooks

**Homepage** (`sections/lookbook.liquid`): the merchant picks one Lookbook metaobject in the theme editor.

**Product page** (`sections/lookbook-product.liquid`): if the section is present, the theme shows lookbooks whose `products` list contains the current product, up to two.

**Runtime product data**: Liquid passes those handles into the React island. `frontend/lookbook` queries the Storefront API with `@inContext` so market prices (AUD / JPY) and compare-at prices are correct.