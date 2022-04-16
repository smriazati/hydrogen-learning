import {
  useShop,
  useShopQuery,
  flattenConnection,
  Link,
  Seo,
  CacheDays,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/layouts/Layout.server';
import FeaturedCollection from '../components/FeaturedCollection';
import ProductCard from '../components/ProductCard';
import Welcome from '../components/Welcome.server';
import {Suspense} from 'react';

// import Collection1 from '../../components/Collections/Collection1/Collection1'

export default function Index({country = {isoCode: 'US'}}) {
  return (
    <Layout>
      <Suspense fallback={null}>
        <SeoForHomepage />
      </Suspense>

      <Hero2 country={country} />
      <Collection1 country={country} />

      {/* <div className="relative mb-12">
        <Welcome />
        <Suspense fallback={<BoxFallback />}>
          <FeaturedProductsBox country={country} />
        </Suspense>
        <Suspense fallback={<BoxFallback />}>
          <FeaturedCollectionBox country={country} />
        </Suspense>
      </div> */}
    </Layout>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {title, description},
    },
  } = useShopQuery({
    query: SEO_QUERY,
    cache: CacheDays(),
    preload: true,
  });

  return (
    <Seo
      type="homepage"
      data={{
        title,
        description,
      }}
    />
  );
}

function BoxFallback() {
  return <div className="bg-white p-12 shadow-xl rounded-xl mb-10 h-40"></div>;
}


function Hero2({country}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data ? flattenConnection(data.collections) : [];
  const hero2Collections = collections.filter(item =>  item.handle === 'men' || item.handle === 'women');
  // console.log(hero2Collections);

  return (
    <div className="hero hero2 hero2--100vh">
      <div className="hero2__collection1">
        <img src="https://images.pexels.com/photos/4355398/pexels-photo-4355398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" className="hero2__bg" />
        <div className="hero2__content-container">
          <div className="hero2__info">
            <Link to={`/collections/${hero2Collections[0].handle}`} className="hero2__button">
              { hero2Collections[0].title }
            </Link>
          </div>
        </div>
      </div>
      <div className="hero2__collection2">
        <img src="https://images.pexels.com/photos/4355398/pexels-photo-4355398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" className="hero2__bg" />
        <div className="hero2__content-container">
          <div className="hero2__info">
          <Link to={`/collections/${hero2Collections[1].handle}`} className="hero2__button">
              { hero2Collections[1].title }
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
  
}

function Collection1({country}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      language: languageCode,
    },
    preload: true,
  });

  const mostPopularProducts = data ? flattenConnection(data.products) : [];
  console.log(mostPopularProducts);

  return (
    <div className="collection collection1">
			<div className="container">
				<div className="row">
					<div className="col-md-4">
            { mostPopularProducts.map((item) => 
              <div className="collection1__collection-item">
              <div className="collection1__product-img collection1__product-img--rectangle">
                <div className="collection1__heart">
                  <i className="far fa-heart"></i>
                </div>
                <Link to={`/products/${item.handle}`}>
                <img
                  src={item?.featuredImage?.url}
                  alt={item?.title}
                />
                </Link>
              </div>
              <div className="collection1__product-info">
                <div className="collection1__product-details">
                  <span className="collection1__product-title">{item.title}</span>
                  <span className="collection1__product-price">{item.variants.edges[0].node.price}</span>
                </div>
                <div className="collection1__colors">
                  <div className="collection1__color collection1__color--blue"></div>
                  <div className="collection1__color collection1__color--black"></div>
                </div>
              </div>
            </div>
            )}
					</div>
				</div>
			</div>
		</div>
  );
  
}
function FeaturedProductsBox({country}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data ? flattenConnection(data.collections) : [];

  const featuredProductsCollection = collections[0];
  const featuredProducts = featuredProductsCollection
    ? flattenConnection(featuredProductsCollection.products)
    : null;

  return (
    <div className="bg-white p-12 shadow-xl rounded-xl mb-10">
      {featuredProductsCollection ? (
        <>
          <div className="flex justify-between items-center mb-8 text-md font-medium">
            <span className="text-black uppercase">
              {featuredProductsCollection.title}
            </span>
            <span className="hidden md:inline-flex">
              <Link
                to={`/collections/${featuredProductsCollection.handle}`}
                className="text-blue-600 hover:underline"
              >
                Shop all
              </Link>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="md:hidden text-center">
            <Link
              to={`/collections/${featuredProductsCollection.handle}`}
              className="text-blue-600"
            >
              Shop all
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

function FeaturedCollectionBox({country}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data ? flattenConnection(data.collections) : [];
  const featuredCollection =
    collections && collections.length > 1 ? collections[1] : collections[0];

  return <FeaturedCollection collection={featuredCollection} />;
}

const SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      description
    }
  }
`;

const QUERY = gql`
  query indexContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 25) {
      edges {
        node {
          handle
          id
          title
          image {
            id
            url
            altText
            width
            height
          }
          products(first: 3) {
            edges {
              node {
                handle
                id
                title
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                      image {
                        id
                        url
                        altText
                        width
                        height
                      }
                      priceV2 {
                        currencyCode
                        amount
                      }
                      compareAtPriceV2 {
                        currencyCode
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    products(first: 9, sortKey: BEST_SELLING) {
      edges {
        cursor
        node {
          id
          title
          description
          handle
          featuredImage{
            url
          }
          variants(first: 3) {
            edges  {
              cursor
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    }
  }
`;
