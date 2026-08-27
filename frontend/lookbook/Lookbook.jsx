import { useLookbookProducts } from './useLookbookProduct';

function money({ amount, currencyCode }) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

function Price({ product }) {
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount);

  return (
    <div className={onSale ? 'price price--on-sale' : 'price'}>
      <div className="price__container">
        {onSale ? (
          <div className="price__sale">
            <span>
              <s className="price-item price-item--regular">{money(compareAt)}</s>
            </span>
            <span className="price-item price-item--sale price-item--last">{money(price)}</span>
          </div>
        ) : (
          <div className="price__regular">
            <span className="price-item price-item--regular">{money(price)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Cards({ products }) {
  return (
    <ul className="grid product-grid grid--4-col-desktop grid--2-col-tablet-down" role="list">
      {products.map((product) => {
        const href = `${window.Shopify?.routes?.root || '/'}products/${product.handle}`;
        const image = product.featuredImage;

        return (
          <li className="grid__item" key={product.handle}>
            <div className="card-wrapper product-card-wrapper underline-links-hover">
              <a className="full-unstyled-link" href={href}>
                {image ? (
                  <div className="lookbook__media media media--transparent media--square">
                    <img
                      src={image.url}
                      alt={image.altText || product.title}
                      width={image.width}
                      height={image.height}
                    />
                  </div>
                ) : null}
                <h3 className="card__heading h5">{product.title}</h3>
                <Price product={product} />
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Lookbook({ payload }) {
  const { status, byHandle } = useLookbookProducts(payload);

  if (!payload.lookbooks.length) return <p>No lookbok found.</p>;

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Error fetching lookbook.</p>;


  return payload.lookbooks.map((lookbook) => {
    const products = lookbook.productHandles.map((handle) => byHandle[handle]).filter(Boolean);

    return (
      <div className="lookbook" key={lookbook.handle}>
        {lookbook.title ? <h2 className="title inline-richtext h2">{lookbook.title}</h2> : null}
        {lookbook.description ? (
          <p className='description'>{lookbook.description}</p>
        ) : null}
        {status === 'ready' && products.length === 0 ? <p>No products found.</p> : null}
        {status === 'ready' && products.length > 0 ? <Cards products={products} /> : null}
      </div>
    );
  });
}
