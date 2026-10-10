import { useEffect } from 'react';

const BASE_URL = 'https://konvert-website.vercel.app';
const DEFAULT_TITLE = 'Konvert - Privacy-First File Converter for Android & Windows';
const DEFAULT_DESC = 'Konvert is a powerful, privacy-focused offline file converter. Compress images, compile PDFs, and convert documents locally with zero cloud telemetry.';

export interface PageSeoOptions {
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  schema?: Record<string, unknown>;
}

const updateMetaTag = (attributeName: string, attributeValue: string, content: string): void => {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateCanonicalLink = (url: string): void => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

/**
 * Custom hook to dynamically manage Page Title, Meta Description,
 * Canonical URL, OpenGraph, Twitter Cards, and JSON-LD schema per route.
 */
export const usePageSeo = ({
  title,
  description = DEFAULT_DESC,
  keywords,
  canonicalPath = '',
  schema,
}: PageSeoOptions): void => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update Standard Meta Description & Keywords
    updateMetaTag('name', 'description', description);
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // 3. Update Canonical URL
    const canonicalUrl = `${BASE_URL}${canonicalPath ? (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`) : ''}`;
    updateCanonicalLink(canonicalUrl);

    // 4. Update OpenGraph Tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);

    // 5. Update Twitter Cards
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:url', canonicalUrl);

    // 6. Inject / Update Page Specific JSON-LD Schema (if provided)
    let schemaScript: HTMLScriptElement | null = null;
    if (schema) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'page-jsonld-schema';
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      updateMetaTag('name', 'description', DEFAULT_DESC);
      updateCanonicalLink(BASE_URL);
      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [title, description, keywords, canonicalPath, schema]);
};
