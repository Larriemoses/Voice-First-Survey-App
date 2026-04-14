import { useEffect } from "react";

type Props = {
  title: string;
  description?: string;
  image?: string;
};

export default function PageMeta({
  title,
  description = "",
  image = "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1775943825/ChatGPT_Image_Apr_10_2026_12_41_04_AM_cwispp.png",
}: Props) {
  useEffect(() => {
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

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", image, "property");
    setMeta("og:type", "website", "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
  }, [title, description, image]);

  return null;
}
