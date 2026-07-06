import { useEffect } from "react";

export const useSEO = ({ title, description, keywords, image }) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title || "Shop Our Exquisite Collection | AriyaShop";

    // 2. Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content =
      description ||
      "Discover timeless luxury jewellery crafted for every occasion. Shop earrings, necklaces, rings, bracelets, bangles, and organizers at AriyaShop.";

    // 3. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content =
      keywords || "jewellery, luxury jewelry, gold bangles, silver earrings, necklaces, rings, AriyaShop";

    // 4. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.href;

    // 5. Open Graph Tags
    const ogTags = {
      "og:title": title || "Shop Our Exquisite Collection | AriyaShop",
      "og:description":
        description ||
        "Discover timeless luxury jewellery crafted for every occasion. Shop earrings, necklaces, rings, bracelets, bangles, and organizers at AriyaShop.",
      "og:type": "website",
      "og:url": window.location.href,
      "og:image":
        image ||
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80",
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // 6. Twitter Card Tags
    const twitterTags = {
      "twitter:card": "summary_large_image",
      "twitter:title": title || "Shop Our Exquisite Collection | AriyaShop",
      "twitter:description":
        description ||
        "Discover timeless luxury jewellery crafted for every occasion. Shop earrings, necklaces, rings, bracelets, bangles, and organizers at AriyaShop.",
      "twitter:image":
        image ||
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80",
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // 7. Inject JSON-LD Schema (Breadcrumbs)
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shop All",
          "item": window.location.href,
        },
      ],
    };

    let schemaScript = document.getElementById("breadcrumb-schema");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "breadcrumb-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify(breadcrumbSchema);

    // Cleanup functions
    return () => {
      // Keep meta tags for SPA but clean up schema if navigating away
      const script = document.getElementById("breadcrumb-schema");
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords, image]);
};
