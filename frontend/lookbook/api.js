import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const QUERY = `
  query LookbookProducts(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 50, query: $query) {
      nodes {
        handle
        title
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function fetchLookbookProducts({
  storeDomain,
  storefrontToken,
  apiVersion,
  country,
  language,
  handles,
}) {
  const unique = [...new Set(handles.filter(Boolean))];
  if (!unique.length) return [];

  const client = createStorefrontApiClient({
    storeDomain,
    apiVersion,
    publicAccessToken: storefrontToken,
  });

  const { data, errors } = await client.request(QUERY, {
    variables: {
      query: unique.map((handle) => `handle:${handle}`).join(` OR `),
      country: country.toUpperCase(),
      language: language.toUpperCase(),
    },
  });

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(', '));
  }

  const byHandle = new Map((data?.products?.nodes ?? []).map((product) => [product.handle, product]));
  return unique.map((handle) => byHandle.get(handle)).filter(Boolean);
}
