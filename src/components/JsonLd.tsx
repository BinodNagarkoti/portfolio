import { isAdminPath } from '@/lib/seo/paths';
import { ADMIN_PATH_PREFIXES } from '@/lib/seo/config';

type AggregateRating = {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
};

type Offer = {
  price: number;
  priceCurrency: string;
  availability?: string;
  url?: string;
  priceValidUntil?: string;
};

type PostalAddress = {
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode: string;
  addressCountry: string;
};

type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

type FaqItem = {
  question: string;
  answer: string;
};

export type JsonLdSchema =
  | {
      type: 'Product';
      name: string;
      description: string;
      image?: string | string[];
      sku?: string;
      brand?: string;
      aggregateRating?: AggregateRating;
      offers?: Offer;
    }
  | {
      type: 'LocalBusiness';
      name: string;
      description: string;
      url: string;
      telephone?: string;
      image?: string | string[];
      address: PostalAddress;
      geo?: GeoCoordinates;
    }
  | {
      type: 'FAQPage';
      items: FaqItem[];
    };

type JsonLdProps = {
  schema: JsonLdSchema;
  /** When true, suppresses all structured data output. */
  isAdmin?: boolean;
  /** Optional pathname guard — blocks admin/dashboard leakage without prop. */
  pathname?: string;
};

const ADMIN_PATH_REGEX = new RegExp(
  `^(${ADMIN_PATH_PREFIXES.map((p) => p.replace(/\//g, '\\/')).join('|')})`,
  'i',
);

function escapeJsonLd(value: string): string {
  return value
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function buildProductSchema(
  schema: Extract<JsonLdSchema, { type: 'Product' }>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: schema.name,
    description: schema.description,
  };

  if (schema.image) payload.image = schema.image;
  if (schema.sku) payload.sku = schema.sku;
  if (schema.brand) payload.brand = { '@type': 'Brand', name: schema.brand };

  if (schema.aggregateRating) {
    payload.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: schema.aggregateRating.ratingValue,
      reviewCount: schema.aggregateRating.reviewCount,
      bestRating: schema.aggregateRating.bestRating ?? 5,
      worstRating: schema.aggregateRating.worstRating ?? 1,
    };
  }

  if (schema.offers) {
    payload.offers = {
      '@type': 'Offer',
      price: schema.offers.price,
      priceCurrency: schema.offers.priceCurrency,
      availability: schema.offers.availability ?? 'https://schema.org/InStock',
      url: schema.offers.url,
      priceValidUntil: schema.offers.priceValidUntil,
    };
  }

  return payload;
}

function buildLocalBusinessSchema(
  schema: Extract<JsonLdSchema, { type: 'LocalBusiness' }>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: schema.name,
    description: schema.description,
    url: schema.url,
    address: {
      '@type': 'PostalAddress',
      ...schema.address,
    },
  };

  if (schema.telephone) payload.telephone = schema.telephone;
  if (schema.image) payload.image = schema.image;

  if (schema.geo) {
    payload.geo = {
      '@type': 'GeoCoordinates',
      latitude: schema.geo.latitude,
      longitude: schema.geo.longitude,
    };
  }

  return payload;
}

function buildFaqSchema(
  schema: Extract<JsonLdSchema, { type: 'FAQPage' }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: schema.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function toJsonLdPayload(schema: JsonLdSchema): Record<string, unknown> {
  switch (schema.type) {
    case 'Product':
      return buildProductSchema(schema);
    case 'LocalBusiness':
      return buildLocalBusinessSchema(schema);
    case 'FAQPage':
      return buildFaqSchema(schema);
    default: {
      const _exhaustive: never = schema;
      return _exhaustive;
    }
  }
}

function shouldSuppressJsonLd(isAdmin?: boolean, pathname?: string): boolean {
  if (isAdmin) return true;
  if (pathname && (isAdminPath(pathname) || ADMIN_PATH_REGEX.test(pathname))) {
    return true;
  }
  return false;
}

export default function JsonLd({ schema, isAdmin, pathname }: JsonLdProps) {
  if (shouldSuppressJsonLd(isAdmin, pathname)) {
    return null;
  }

  const payload = toJsonLdPayload(schema);
  const serialized = escapeJsonLd(JSON.stringify(payload));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
