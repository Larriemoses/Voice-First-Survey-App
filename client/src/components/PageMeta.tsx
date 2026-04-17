import { useEffect } from "react";
import {
  BRAND_NAME,
  BRAND_SHARE_IMAGE_URL,
  DEFAULT_SHARE_DESCRIPTION,
} from "../lib/branding";

type Props = {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: string;
};

export default function PageMeta({
  title,
  description = DEFAULT_SHARE_DESCRIPTION,
  image = BRAND_SHARE_IMAGE_URL,
  imageAlt = title,
  url,
  type = "website",
}: Props) {
  useEffect(() => {
    const resolvedDescription = description || DEFAULT_SHARE_DESCRIPTION;
    const resolvedUrl = url || window.location.href;

    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(
        `meta[${attr}="${name}"]`,
      ) as HTMLMetaElement | null;

      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }

      el.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(
        `link[rel="${rel}"]`,
      ) as HTMLLinkElement | null;

      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }

      el.setAttribute("href", href);
    };

    setMeta("description", resolvedDescription);
    setMeta("og:title", title, "property");
    setMeta("og:description", resolvedDescription, "property");
    setMeta("og:image", image, "property");
    setMeta("og:image:secure_url", image, "property");
    setMeta("og:image:alt", imageAlt, "property");
    setMeta("og:url", resolvedUrl, "property");
    setMeta("og:site_name", BRAND_NAME, "property");
    setMeta("og:type", type, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", resolvedDescription);
    setMeta("twitter:image", image);
    setMeta("twitter:image:alt", imageAlt);
    setMeta("twitter:url", resolvedUrl);
    setMeta("theme-color", "#2457f5");

    setLink("canonical", resolvedUrl);
  }, [description, image, imageAlt, title, type, url]);

  return null;
}
