"use client";

import { CataloguePage } from "@cimplify/sdk/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Category, Product } from "@cimplify/sdk";
import type { CatalogueLayoutProps } from "@cimplify/sdk/react";
import { StoreProductCard } from "@/components/store-product-card";

/**
 * Client island for the shop page. Server-side fetches all products and
 * categories (ISR-cached in `app/shop/page.tsx`), then uses the SDK catalogue
 * state with a storefront-specific layout that filters the static list locally.
 *
 * The stock SDK layout only applies search through `useProducts`; passing
 * server products disables that fetch. This keeps the SSR list and makes the
 * visible shop search/filter controls real.
 */
export function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  return (
    <CataloguePage
      title="All products"
      products={products}
      categories={categories}
      layouts={{ default: FashionCatalogueLayout }}
      renderCard={(p) => <StoreProductCard product={p} />}
      className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12"
    />
  );
}

const PAGE_SIZE = 12;

type RuntimeVariant = {
  name?: string;
  sku?: string;
  display_attributes?: { axis_name?: string; value_name?: string }[];
};

type SearchableProduct = Product & {
  category?: Category;
  category_ids?: string[];
  collection_ids?: string[];
  variants?: RuntimeVariant[];
};

function FashionCatalogueLayout(props: CatalogueLayoutProps) {
  const {
    products,
    categories,
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
    sortBy,
    sortOrder,
    onSortChange,
    inStockOnly,
    onInStockChange,
    minPrice,
    maxPrice,
    onPriceRangeChange,
    page,
    onPageChange,
    renderCard,
    title,
    className,
  } = props;

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    for (const product of products) for (const size of productSizes(product)) set.add(size);
    return [...set].sort((a, b) => sizeRank(a) - sizeRank(b));
  }, [products]);

  const filteredProducts = products
    .filter((product) => matchesCategory(product, selectedCategory))
    .filter((product) => matchesSearch(product, searchQuery))
    .filter((product) => !inStockOnly || isAvailable(product))
    .filter((product) => matchesPrice(product, minPrice, maxPrice))
    .filter((product) => matchesSize(product, selectedSizes))
    .sort((a, b) => compareProducts(a, b, sortBy, sortOrder));

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasFilters =
    Boolean(selectedCategory) ||
    searchQuery.trim().length > 0 ||
    inStockOnly ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    selectedSizes.length > 0;

  const toggleSize = (size: string) => {
    setSelectedSizes((current) =>
      current.includes(size) ? current.filter((s) => s !== size) : [...current, size],
    );
    onPageChange(1);
  };

  const handleSearchChange = (query: string) => {
    onSearchChange(query);
    onPageChange(1);
  };

  const handleCategoryChange = (id: string | null) => {
    onCategoryChange(id);
    onPageChange(1);
  };

  const handleMinPriceChange = (value: string) => {
    onPriceRangeChange(value, maxPrice);
    onPageChange(1);
  };

  const handleMaxPriceChange = (value: string) => {
    onPriceRangeChange(minPrice, value);
    onPageChange(1);
  };

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange(null);
    onInStockChange(false);
    onPriceRangeChange("", "");
    setSelectedSizes([]);
    onPageChange(1);
  };

  useEffect(() => {
    if (!filtersOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filtersOpen]);

  return (
    <section className={["space-y-8", className].filter(Boolean).join(" ")}>
      <div className="grid gap-4 border-b border-border pb-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
          </div>
          <h2 className="mt-2 text-xl font-semibold uppercase tracking-[0.08em] sm:text-2xl">
            {title}
          </h2>
        </div>

        <label className="relative block w-full lg:w-[360px]">
          <span className="sr-only">Search products</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            Search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="aviator, round, tortoise, blue-light..."
            className="h-12 w-full border border-foreground bg-background pl-[4.75rem] pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <FilterDrawer
        open={filtersOpen}
        categories={categories}
        selectedCategory={selectedCategory}
        availableSizes={availableSizes}
        selectedSizes={selectedSizes}
        inStockOnly={inStockOnly}
        minPrice={minPrice}
        maxPrice={maxPrice}
        hasFilters={hasFilters}
        onClose={() => setFiltersOpen(false)}
        onCategoryChange={handleCategoryChange}
        onToggleSize={toggleSize}
        onInStockChange={(value) => {
          onInStockChange(value);
          onPageChange(1);
        }}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onClearFilters={clearFilters}
      />

      <div>
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="w-full border border-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition hover:bg-foreground hover:text-background min-[420px]:w-auto"
              >
                Filters{hasFilters ? " / On" : ""}
              </button>
              <div className="text-sm text-muted-foreground">
                {searchQuery.trim() ? (
                  <>
                    Showing matches for{" "}
                    <span className="font-semibold text-foreground">"{searchQuery.trim()}"</span>
                  </>
                ) : (
                  "Showing the latest from Palmshades"
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sort</span>
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(event) => {
                  const [by, order] = event.target.value.split(":");
                  onSortChange(by, order);
                }}
                className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="created_at:desc">Newest</option>
                <option value="name:asc">Name A-Z</option>
                <option value="name:desc">Name Z-A</option>
                <option value="price:asc">Price low-high</option>
                <option value="price:desc">Price high-low</option>
              </select>
            </label>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) =>
                renderCard ? <div key={product.id}>{renderCard(product)}</div> : null,
              )}
            </div>
          ) : (
            <div className="grid min-h-[260px] place-items-center border border-border bg-card px-6 text-center">
              <div>
                <div className="text-lg font-semibold uppercase tracking-[0.08em]">No pieces found</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Try a different search term or clear the filters.
                </div>
                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 border border-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:bg-foreground hover:text-background"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => onPageChange(Math.max(1, safePage - 1))}
                className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
                className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FilterDrawer({
  open,
  categories,
  selectedCategory,
  availableSizes,
  selectedSizes,
  inStockOnly,
  minPrice,
  maxPrice,
  hasFilters,
  onClose,
  onCategoryChange,
  onToggleSize,
  onInStockChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClearFilters,
}: {
  open: boolean;
  categories: Category[];
  selectedCategory: string | null;
  availableSizes: string[];
  selectedSizes: string[];
  inStockOnly: boolean;
  minPrice: string;
  maxPrice: string;
  hasFilters: boolean;
  onClose: () => void;
  onCategoryChange: (id: string | null) => void;
  onToggleSize: (size: string) => void;
  onInStockChange: (value: boolean) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <div
      className={[
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-foreground/45 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <aside
        className={[
          "absolute left-0 top-0 h-full w-[min(88vw,390px)] overflow-y-auto bg-background text-foreground shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Product filters"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Shop
            </div>
            <div className="mt-1 text-lg font-semibold uppercase tracking-[0.1em]">Filters</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center border border-border text-xl leading-none transition hover:border-foreground"
            aria-label="Close filters"
          >
            X
          </button>
        </div>

        <div className="space-y-7 px-5 py-6">
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Category
            </div>
            <div className="grid gap-2">
              <FilterButton active={!selectedCategory} onClick={() => onCategoryChange(null)}>
                All
              </FilterButton>
              {categories.map((category) => (
                <FilterButton
                  key={category.id}
                  active={selectedCategory === category.id}
                  onClick={() => onCategoryChange(selectedCategory === category.id ? null : category.id)}
                >
                  {category.name}
                </FilterButton>
              ))}
            </div>
          </div>

          {availableSizes.length > 0 ? (
            <div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Size
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onToggleSize(size)}
                    aria-pressed={selectedSizes.includes(size)}
                    className={[
                      "min-w-12 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition",
                      selectedSizes.includes(size)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:border-foreground",
                    ].join(" ")}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <label className="flex cursor-pointer items-center justify-between gap-3 border border-border px-3 py-3 text-sm">
            <span>In stock only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => onInStockChange(event.target.checked)}
              className="size-4 accent-foreground"
            />
          </label>

          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Price
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                inputMode="decimal"
                value={minPrice}
                onChange={(event) => onMinPriceChange(event.target.value)}
                placeholder="Min"
                className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                inputMode="decimal"
                value={maxPrice}
                onChange={(event) => onMaxPriceChange(event.target.value)}
                placeholder="Max"
                className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid gap-2 border-t border-border pt-5">
            {hasFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="border border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition hover:border-foreground"
              >
                Clear filters
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="bg-foreground px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background transition hover:bg-primary"
            >
              View pieces
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] transition",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function matchesCategory(product: Product, categoryId: string | null) {
  if (!categoryId) return true;
  const searchable = product as SearchableProduct;
  return searchable.category_id === categoryId || searchable.category_ids?.includes(categoryId) === true;
}

function matchesSearch(product: Product, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  const searchable = product as SearchableProduct;
  const haystack = [
    searchable.name,
    searchable.slug,
    searchable.description,
    searchable.sku,
    searchable.category?.name,
    searchable.category?.slug,
    ...(searchable.tags ?? []),
    ...(searchable.variants ?? []).flatMap((variant: RuntimeVariant) => [
      variant.name,
      variant.sku,
      ...(variant.display_attributes ?? []).flatMap((attribute: NonNullable<RuntimeVariant["display_attributes"]>[number]) => [
        attribute.axis_name,
        attribute.value_name,
      ]),
    ]),
  ]
    .filter(Boolean)
    .map((value) => normalize(String(value)))
    .join(" ");

  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => haystack.includes(part));
}

const SIZE_ORDER = ["XXS", "XS", "S", "SM", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL", "4XL", "5XL"];

function sizeRank(size: string) {
  const index = SIZE_ORDER.indexOf(size.toUpperCase());
  return index === -1 ? SIZE_ORDER.length : index;
}

function productSizes(product: Product) {
  const searchable = product as SearchableProduct;
  const sizes = new Set<string>();
  for (const variant of searchable.variants ?? []) {
    for (const attribute of variant.display_attributes ?? []) {
      if ((attribute.axis_name ?? "").toLowerCase() === "size" && attribute.value_name) {
        sizes.add(attribute.value_name);
      }
    }
  }
  return [...sizes];
}

function matchesSize(product: Product, selectedSizes: string[]) {
  if (selectedSizes.length === 0) return true;
  const sizes = productSizes(product);
  return selectedSizes.some((size) => sizes.includes(size));
}

function matchesPrice(product: Product, minPrice: string, maxPrice: string) {
  const price = priceNumber(product);
  const min = parseOptionalPrice(minPrice);
  const max = parseOptionalPrice(maxPrice);

  if (min !== null && price < min) return false;
  if (max !== null && price > max) return false;
  return true;
}

function compareProducts(a: Product, b: Product, sortBy: string, sortOrder: string) {
  const direction = sortOrder === "asc" ? 1 : -1;

  if (sortBy === "name") {
    return a.name.localeCompare(b.name) * direction;
  }

  if (sortBy === "price") {
    return (priceNumber(a) - priceNumber(b)) * direction;
  }

  const aTime = Date.parse(sortBy === "updated_at" ? a.updated_at : a.created_at) || 0;
  const bTime = Date.parse(sortBy === "updated_at" ? b.updated_at : b.created_at) || 0;
  return (aTime - bTime) * direction;
}

function isAvailable(product: Product) {
  return product.is_active !== false && product.inventory_status?.in_stock !== false;
}

function priceNumber(product: Product) {
  const rawPrice = typeof product.default_price === "object" && product.default_price !== null
    ? String((product.default_price as { amount?: unknown }).amount ?? product.default_price)
    : String(product.default_price);
  const parsed = Number(rawPrice.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseOptionalPrice(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
