"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Price,
  ProductCustomizer,
  ProductPage as SdkProductPage,
  useCart,
} from "@cimplify/sdk/react";
import { parsePrice, resolveGallery } from "@cimplify/sdk";
import type { CurrencyCode, Product, ProductWithDetails } from "@cimplify/sdk";
import type { ProductLayoutProps } from "@cimplify/sdk/react";
import { StoreProductCard } from "@/components/store-product-card";
import { brand } from "@/lib/brand";

type VariantView = NonNullable<ProductWithDetails["variants"]>[number];
type VariantAxisWithValues = NonNullable<ProductWithDetails["variant_axes"]>[number];
type VariantDisplayAttribute = NonNullable<VariantView["display_attributes"]>[number];

const SIZE_AXIS_NAME = "Size";
const COLOR_AXIS_NAME = "Color";
const OPTION_AXIS_NAME = "Option";
const SIZE_ORDER = ["XXS", "XS", "S", "SM", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL", "4XL", "5XL"];
const SIZE_ALIASES: Array<[RegExp, string]> = [
  [/\bextra\s*small\b/i, "XS"],
  [/\bextra\s*large\b/i, "XL"],
  [/\b2\s*x\s*l\b|\bxxl\b/i, "XXL"],
  [/\b3\s*x\s*l\b|\bxxxl\b/i, "XXXL"],
  [/\b4\s*x\s*l\b/i, "4XL"],
  [/\b5\s*x\s*l\b/i, "5XL"],
  [/\bsmall\b/i, "SM"],
  [/\bmedium\b/i, "M"],
  [/\blarge\b/i, "L"],
];
const SIZE_TOKEN_PATTERN = /\b(XXXL|XXL|XXS|XS|XL|SM|[SMLX]|[2-5]XL)\b/i;
const PLACEHOLDER_VARIANT_PATTERN = /^(default|standard|regular)$/i;
const COLOR_AXIS_PATTERN = /\b(colou?r|shade|tone|finish)\b/i;
const SWATCH_COLORS: Array<[RegExp, string]> = [
  [/\bblack\b/i, "#0a0a0a"],
  [/\bwhite\b|\bnatural\b/i, "#f5f2eb"],
  [/\bcream\b|\bivory\b/i, "#ede3cf"],
  [/\bred\b|\boxblood\b|\bmaroon\b/i, "#8b1e24"],
  [/\bblue\b|\bsky\b/i, "#78b9ec"],
  [/\bpink\b|\brose\b/i, "#c98d82"],
  [/\bgreen\b|\bolive\b/i, "#647247"],
  [/\bgrey\b|\bgray\b|\bsilver\b/i, "#a7a7a7"],
  [/\bbrown\b|\btan\b/i, "#8a6548"],
];
const VARIANT_SPLIT_PATTERN = /\s*(?:\/|\||,|\s[-–—]\s)\s*/;

function normalizeSizeLabel(value: string) {
  const trimmed = value.trim();
  for (const [pattern, label] of SIZE_ALIASES) {
    if (pattern.test(trimmed)) return label;
  }
  return trimmed.toUpperCase();
}

function isSizeLabel(value: string) {
  const normalized = normalizeSizeLabel(value);
  return SIZE_ORDER.includes(normalized) || SIZE_TOKEN_PATTERN.test(value.trim());
}

function isColorLabel(value: string) {
  return SWATCH_COLORS.some(([pattern]) => pattern.test(value));
}

function getSwatchColor(label: string) {
  return SWATCH_COLORS.find(([pattern]) => pattern.test(label))?.[1] ?? "#d8d8d8";
}

function isColorAxisLabel(value: string) {
  return COLOR_AXIS_PATTERN.test(value);
}

function cleanVariantLabel(value: string) {
  return value
    .replace(/\s*[+]\s*(?:GH₵|GHS|GHC|₵|\$|£|€)\s*[\d,.]+$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function stripProductPrefix(variantName: string, productName: string) {
  const name = cleanVariantLabel(variantName);
  if (!name) return null;
  if (PLACEHOLDER_VARIANT_PATTERN.test(name)) return null;
  if (!productName) return name;

  const product = productName.trim();
  if (name.toLowerCase() === product.toLowerCase()) return null;
  if (name.toLowerCase().startsWith(product.toLowerCase())) {
    const rest = name.slice(product.length).replace(/^[-–—:/\s]+/, "");
    return rest ? cleanVariantLabel(rest) : null;
  }

  const lastDash = name.lastIndexOf("-");
  if (lastDash > 0 && lastDash < name.length - 1) {
    const prefix = name.slice(0, lastDash).trim();
    const suffix = name.slice(lastDash + 1).trim();
    if (suffix && product.length > 0 && prefix.toLowerCase().includes(product.toLowerCase())) {
      return cleanVariantLabel(suffix);
    }
  }

  return name;
}

function getVariantLabel(variant: VariantView, productName: string) {
  if (variant.display_attributes?.length) {
    return variant.display_attributes.map((attribute) => attribute.value_name).join(" / ");
  }
  return stripProductPrefix(variant.name, productName);
}

function splitVariantLabel(label: string) {
  const parts = cleanVariantLabel(label)
    .split(VARIANT_SPLIT_PATTERN)
    .map((part) => cleanVariantLabel(part))
    .filter(Boolean);
  return parts.length > 1 && parts.length <= 3 ? parts : [cleanVariantLabel(label)];
}

function classifyAxis(name: string) {
  if (/size/i.test(name)) return "size";
  if (isColorAxisLabel(name)) return "color";
  return "option";
}

function classifyValues(values: string[]) {
  if (values.length > 0 && values.every(isSizeLabel)) return "size";
  if (values.length > 0 && values.every(isColorLabel)) return "color";
  return "option";
}

function axisNameForKind(kind: string, index = 0) {
  if (kind === "size") return SIZE_AXIS_NAME;
  if (kind === "color") return COLOR_AXIS_NAME;
  return index === 0 ? OPTION_AXIS_NAME : `${OPTION_AXIS_NAME} ${index + 1}`;
}

function normalizeValueForAxis(axisName: string, valueName: string) {
  return classifyAxis(axisName) === "size" ? normalizeSizeLabel(valueName) : cleanVariantLabel(valueName);
}

function sizeRank(size: string) {
  const index = SIZE_ORDER.indexOf(size);
  return index === -1 ? SIZE_ORDER.length : index;
}

function sortSizes(a: string, b: string) {
  const byRank = sizeRank(a) - sizeRank(b);
  return byRank === 0 ? a.localeCompare(b) : byRank;
}

function sortAxisValues(axisName: string, values: VariantAxisWithValues["values"]) {
  if (classifyAxis(axisName) !== "size") return values;
  return [...values].sort((a, b) => sortSizes(a.name, b.name));
}

function isBaseVariant(variant: VariantView, productName: string) {
  if (variant.display_attributes?.length) return false;
  return getVariantLabel(variant, productName) === null;
}

function ensureDefaultVariant(variants: VariantView[]) {
  if (variants.length === 0 || variants.some((variant) => variant.is_default)) return variants;
  return variants.map((variant, index) => ({ ...variant, is_default: index === 0 }));
}

function normalizeExistingVariantAxes(product: ProductWithDetails) {
  return product.variant_axes?.map((axis) => ({
    ...axis,
    values: sortAxisValues(
      axis.name,
      axis.values.map((value, index) => ({
        ...value,
        name: normalizeValueForAxis(axis.name, value.name),
        display_order: index,
      })),
    ).map((value, index) => ({ ...value, display_order: index })),
  }));
}

function normalizeDisplayAttributes(
  attributes: VariantDisplayAttribute[] | undefined,
  axes: VariantAxisWithValues[] | undefined,
) {
  if (!attributes?.length) return attributes;
  const axisById = new Map((axes ?? []).map((axis) => [axis.id, axis]));
  return attributes.map((attribute) => {
    const axisName = axisById.get(attribute.axis_id)?.name ?? attribute.axis_name;
    return {
      ...attribute,
      axis_name: axisName,
      value_name: normalizeValueForAxis(axisName, attribute.value_name),
    };
  });
}

function axesFromDisplayAttributes(product: ProductWithDetails, variants: VariantView[]) {
  const axisMap = new Map<string, VariantAxisWithValues>();
  for (const variant of variants) {
    for (const attribute of variant.display_attributes ?? []) {
      const axisName = attribute.axis_name || OPTION_AXIS_NAME;
      const existingAxis = axisMap.get(attribute.axis_id);
      if (!existingAxis) {
        axisMap.set(attribute.axis_id, {
          id: attribute.axis_id,
          business_id: product.business_id,
          product_id: product.id,
          name: axisName,
          display_order: axisMap.size,
          affects_recipe: false,
          created_at: product.created_at,
          updated_at: product.updated_at,
          values: [],
        });
      }

      const axis = axisMap.get(attribute.axis_id);
      if (!axis) continue;
      const valueName = normalizeValueForAxis(axis.name, attribute.value_name);
      if (axis.values.some((value) => value.id === attribute.value_id)) continue;
      axis.values.push({
        id: attribute.value_id,
        business_id: product.business_id,
        axis_id: axis.id,
        name: valueName,
        display_order: axis.values.length,
        created_at: product.created_at,
        updated_at: product.updated_at,
      });
    }
  }

  return Array.from(axisMap.values()).map((axis) => ({
    ...axis,
    values: sortAxisValues(axis.name, axis.values).map((value, index) => ({
      ...value,
      display_order: index,
    })),
  }));
}

function buildSyntheticVariantAxes(product: ProductWithDetails, variants: VariantView[]) {
  const rows = variants
    .map((variant) => {
      const label = getVariantLabel(variant, product.name);
      return label ? { variant, parts: splitVariantLabel(label) } : null;
    })
    .filter((row): row is { variant: VariantView; parts: string[] } => Boolean(row));

  if (rows.length < 2) return null;
  const columnCount = rows[0]?.parts.length ?? 0;
  if (columnCount === 0 || rows.some((row) => row.parts.length !== columnCount)) return null;

  const axes = Array.from({ length: columnCount }, (_, index) => {
    const values = rows.map((row) => row.parts[index] ?? "");
    const kind = classifyValues(values);
    const axisName = axisNameForKind(kind, index);
    return {
      id: `${product.id}:variant-axis:${index}`,
      name: axisName,
      kind,
      values: Array.from(new Set(values.map((value) => normalizeValueForAxis(axisName, value)))),
    };
  });

  if (columnCount > 1 && axes.some((axis) => axis.kind === "option")) return null;

  const variantAxes: VariantAxisWithValues[] = axes.map((axis, axisIndex) => ({
    id: axis.id,
    business_id: product.business_id,
    product_id: product.id,
    name: axis.name,
    display_order: axisIndex,
    affects_recipe: false,
    created_at: product.created_at,
    updated_at: product.updated_at,
    values: sortAxisValues(
      axis.name,
      axis.values.map((valueName, valueIndex) => ({
        id: `${axis.id}:${valueName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || valueIndex}`,
        business_id: product.business_id,
        axis_id: axis.id,
        name: valueName,
        display_order: valueIndex,
        created_at: product.created_at,
        updated_at: product.updated_at,
      })),
    ).map((value, index) => ({ ...value, display_order: index })),
  }));

  const valueIdByAxisAndName = new Map(
    variantAxes.flatMap((axis) =>
      axis.values.map((value) => [`${axis.id}:${value.name}`, value.id] as const),
    ),
  );

  const normalizedVariants = rows.map(({ variant, parts }) => ({
    ...variant,
    name: parts.join(" / "),
    display_attributes: variantAxes.map((axis, index) => {
      const valueName = normalizeValueForAxis(axis.name, parts[index] ?? "");
      return {
        axis_id: axis.id,
        axis_name: axis.name,
        value_id: valueIdByAxisAndName.get(`${axis.id}:${valueName}`) ?? `${axis.id}:${index}`,
        value_name: valueName,
      };
    }),
  }));

  return {
    variant_axes: variantAxes,
    variants: ensureDefaultVariant(normalizedVariants),
  };
}

function withFashionVariantPresentation(product: ProductWithDetails): ProductWithDetails {
  if (!product.variants || product.variants.length <= 1) return product;

  const existingAxes = normalizeExistingVariantAxes(product);
  if (existingAxes?.length) {
    const variantsWithAttributes = product.variants
      .filter((variant) => !isBaseVariant(variant, product.name))
      .map((variant) => ({
        ...variant,
        display_attributes: normalizeDisplayAttributes(variant.display_attributes, existingAxes),
      }));
    return {
      ...product,
      variants: ensureDefaultVariant(variantsWithAttributes),
      variant_axes: existingAxes,
    };
  }

  const variantsWithDisplayAttributes = product.variants.filter(
    (variant) => !isBaseVariant(variant, product.name) && variant.display_attributes?.length,
  );
  if (variantsWithDisplayAttributes.length >= 2) {
    const variantAxes = axesFromDisplayAttributes(product, variantsWithDisplayAttributes);
    return {
      ...product,
      variants: ensureDefaultVariant(
        variantsWithDisplayAttributes.map((variant) => ({
          ...variant,
          display_attributes: normalizeDisplayAttributes(variant.display_attributes, variantAxes),
        })),
      ),
      variant_axes: variantAxes,
    };
  }

  const meaningfulVariants = product.variants.filter(
    (variant) => !isBaseVariant(variant, product.name) && getVariantLabel(variant, product.name),
  );
  const synthetic = buildSyntheticVariantAxes(product, meaningfulVariants);
  if (synthetic) {
    return {
      ...product,
      variants: synthetic.variants,
      variant_axes: synthetic.variant_axes,
    };
  }

  return {
    ...product,
    variants: ensureDefaultVariant(
      product.variants.map((variant) => ({
        ...variant,
        name: getVariantLabel(variant, product.name) ?? variant.name,
      })),
    ),
  };
}

/**
 * Client island for the product detail page.
 *
 * - Receives a server-fetched `ProductWithDetails` (no client refetch).
 * - Renders the SDK `<ProductPage>` which picks the right layout
 *   (Default / Wholesale / Service / Bundle / Composite) automatically.
 * - On add-to-cart success, routes to `/cart`.
 * - Custom Next.js Image renderer for optimised, lazy-loaded gallery shots.
 * - Renders a "You may also like" rail of in-category products below.
 */
export function ProductDetail({
  product,
  related,
}: {
  product: ProductWithDetails;
  related: Product[];
}) {
  const { addItem } = useCart();
  const displayProduct = useMemo(() => withFashionVariantPresentation(product), [product]);

  return (
    <>
      <SdkProductPage
        product={displayProduct}
        templates={{
          default: FashionProductLayout,
          food: FashionProductLayout,
          physical: FashionProductLayout,
        }}
        showRelated={false}
        onAddToCart={async (p, qty, options) => {
          await addItem(p, qty, options);
        }}
        className="all-eyes-product-page max-w-6xl mx-auto px-5 sm:px-8 py-6 sm:py-8"
      />
      <FashionVariantEnhancer />

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-16 border-t border-border mt-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary mb-2">
                You may also like
              </p>
              <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold m-0 -tracking-[0.025em]">
                More from this category.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <StoreProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function FashionProductLayout({ product, onAddToCart }: ProductLayoutProps) {
  const defaultVariant = useMemo(() => getDefaultVariant(product), [product]);
  const [selectedVariant, setSelectedVariant] = useState<VariantView | undefined>(defaultVariant);
  const images = useMemo(
    () => getFashionImages(product, selectedVariant),
    [product, selectedVariant],
  );
  const displayPrice = useMemo(
    () => getSelectedVariantPrice(product, selectedVariant),
    [product, selectedVariant],
  );
  const fitLine = getFashionFitLine(product);

  useEffect(() => {
    setSelectedVariant(defaultVariant);
  }, [defaultVariant]);

  return (
    <div data-all-eyes-fashion-layout className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-12">
      <div data-all-eyes-fashion-gallery>
        <FashionImageGallery images={images} productName={product.name} />
      </div>

      <section data-all-eyes-fashion-info aria-label={`${product.name} details`}>
        <div data-all-eyes-fashion-summary>
          <div className="flex items-start justify-between gap-6">
            <h1 data-all-eyes-fashion-title>{product.name}</h1>
            <Price
              amount={displayPrice}
              currency={brand.currency as CurrencyCode}
              className="shrink-0 text-lg font-semibold"
            />
          </div>

          {fitLine && (
            <p data-all-eyes-fashion-fit>
              <strong>SIZE &amp; FIT:</strong> {fitLine}
            </p>
          )}

          {product.description && (
            <p data-all-eyes-fashion-description>{product.description}</p>
          )}
        </div>

        <ProductCustomizer
          product={product}
          onAddToCart={onAddToCart}
          onVariantChange={(_variantId, variant) => setSelectedVariant(variant)}
          showSpecialInstructions={false}
        />

      </section>
    </div>
  );
}

function getFashionImages(product: ProductWithDetails, selectedVariant?: VariantView) {
  return resolveGallery(product, selectedVariant?.id);
}

function getDefaultVariant(product: ProductWithDetails) {
  return product.variants?.find((variant) => variant.is_default) ?? product.variants?.[0];
}

function getSelectedVariantPrice(product: ProductWithDetails, selectedVariant?: VariantView) {
  return parsePrice(product.default_price) + parsePrice(selectedVariant?.price_adjustment);
}

function FashionImageGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0]);

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  if (images.length === 0) return null;
  const selectedImage = activeImage && images.includes(activeImage) ? activeImage : images[0];

  return (
    <div data-all-eyes-fashion-image-gallery data-image-count={images.length}>
      <figure data-all-eyes-fashion-image="primary">
        <Image
          src={selectedImage}
          alt={productName}
          width={1200}
          height={1600}
          sizes="(min-width: 1024px) 42vw, 100vw"
          priority
        />
      </figure>

      {images.length > 1 && (
        <div data-all-eyes-fashion-thumbnail-strip aria-label={`${productName} images`}>
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              data-all-eyes-fashion-thumbnail
              data-selected={image === selectedImage || undefined}
              aria-label={`Show ${productName} image ${index + 1}`}
              onClick={() => setActiveImage(image)}
            >
              <Image
                src={image}
                alt=""
                width={240}
                height={320}
                sizes="(min-width: 1024px) 6rem, 5rem"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getFashionFitLine(product: ProductWithDetails) {
  const material = product.material?.trim();
  const category = product.category?.name?.trim();
  if (material && category) return `${category} in ${material}`;
  if (material) return material;
  if (category) return category;
  return "Cropped, easy everyday fit";
}

function FashionVariantEnhancer() {
  useEffect(() => {
    function decorate() {
      document
        .querySelectorAll<HTMLElement>(".all-eyes-product-page [data-cimplify-variant-axis]")
        .forEach((axis) => {
          const label = axis.querySelector<HTMLElement>("[data-cimplify-variant-axis-label]");
          const axisName = label?.textContent?.trim() ?? "";
          const axisKind = classifyAxis(axisName);
          const isSizeAxis = axisKind === "size";
          const isColorAxis = axisKind === "color";
          axis.toggleAttribute("data-fashion-size-axis", isSizeAxis);
          axis.toggleAttribute("data-fashion-color-axis", isColorAxis);
          axis.toggleAttribute("data-fashion-option-axis", axisKind === "option");

          axis.querySelectorAll<HTMLElement>("[data-cimplify-variant-option]").forEach((option) => {
            if (isColorAxis) {
              option.style.setProperty("--fashion-swatch", getSwatchColor(option.textContent ?? ""));
            } else {
              option.style.removeProperty("--fashion-swatch");
            }
          });
        });

      document
        .querySelectorAll<HTMLElement>(".all-eyes-product-page [data-cimplify-variant-selector]")
        .forEach((selector) => {
          const list = selector.querySelector<HTMLElement>("[data-cimplify-variant-list]");
          if (!list) return;

          const header = selector.querySelector<HTMLElement>("[data-cimplify-variant-list-header]");
          const options = Array.from(
            list.querySelectorAll<HTMLElement>("[data-cimplify-variant-option]"),
          );
          const optionEntries = options.map((option) => {
            const name = option
              .querySelector<HTMLElement>("[data-cimplify-variant-name]")
              ?.textContent?.trim();
            return { option, name };
          });
          const names = optionEntries.map((entry) => entry.name).filter((name): name is string => Boolean(name));
          const listKind = classifyValues(names);
          const isSizeList = listKind === "size";
          const isColorList = listKind === "color";
          const listLabel = isSizeList ? "Select Size" : isColorList ? "Select Color" : "Select Option";
          const headerLabel = header?.querySelector<HTMLElement>("label");

          selector.toggleAttribute("data-fashion-size-variant-list", isSizeList);
          selector.toggleAttribute("data-fashion-color-variant-list", isColorList);
          selector.toggleAttribute("data-fashion-option-variant-list", !isSizeList && !isColorList);
          headerLabel?.setAttribute("data-fashion-list-label", listLabel);

          optionEntries.forEach(({ option, name }) => {
            const isSizeOption = Boolean(isSizeList && name && isSizeLabel(name));
            const isColorOption = Boolean(isColorList && name);
            option.toggleAttribute("data-fashion-size-variant-option", isSizeOption);
            option.toggleAttribute("data-fashion-color-variant-option", isColorOption);
            if (isColorOption && name) {
              option.style.setProperty("--fashion-swatch", getSwatchColor(name));
            } else {
              option.style.removeProperty("--fashion-swatch");
            }
          });
        });

      document
        .querySelectorAll<HTMLElement>(".all-eyes-product-page [data-cimplify-addon-group]")
        .forEach((group) => {
          const header = group.querySelector<HTMLElement>("[data-cimplify-addon-header]");
          const options = Array.from(
            group.querySelectorAll<HTMLElement>("[data-cimplify-addon-option]"),
          );
          const optionEntries = options.map((option) => {
            const name = option
              .querySelector<HTMLElement>("[data-cimplify-addon-option-name]")
              ?.textContent?.trim();
            return { option, name };
          });
          const groupName = group.querySelector<HTMLElement>("[data-cimplify-addon-name]")?.textContent?.trim() ?? "";
          const names = optionEntries.map((entry) => entry.name).filter((name): name is string => Boolean(name));
          const addonKind = classifyAxis(groupName) !== "option" ? classifyAxis(groupName) : classifyValues(names);
          const hasSizeOptions = addonKind === "size";
          const hasColorOptions = addonKind === "color";

          group.toggleAttribute("data-fashion-size-addon", hasSizeOptions);
          group.toggleAttribute("data-fashion-color-addon", hasColorOptions);
          group.toggleAttribute("data-fashion-choice-addon", !hasSizeOptions && !hasColorOptions);
          group
            .querySelector<HTMLElement>("[data-cimplify-addon-options]")
            ?.toggleAttribute("data-fashion-compact-addon-options", hasSizeOptions || hasColorOptions);

          optionEntries.forEach(({ option, name }) => {
            const isSizeOption = Boolean(hasSizeOptions && name && isSizeLabel(name));
            const isColorOption = Boolean(hasColorOptions && name);
            option.toggleAttribute("data-fashion-size-addon-option", hasSizeOptions && isSizeOption);
            option.toggleAttribute("data-fashion-color-addon-option", isColorOption);
            if (isColorOption && name) {
              option.style.setProperty("--fashion-swatch", getSwatchColor(name));
            } else {
              option.style.removeProperty("--fashion-swatch");
            }
          });
        });
    }

    decorate();
    const observer = new MutationObserver(decorate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
