import { z } from 'zod'

// ===== ENUMS =====

export enum ProductGridLayoutType {
  GRID = 'grid',
  CAROUSEL = 'carousel',
  MASONRY = 'masonry',
}

export enum GridPreset {
  PRESET_1 = 'preset-1', // 4-2-1
  PRESET_2 = 'preset-2', // 3-2-1
  PRESET_3 = 'preset-3', // 6-3-2
  AUTO = 'auto',
}

export enum ImageAspect {
  SQUARE = 'square', // 1:1
  WIDE = '16:9',
  TALL = '9:16',
  COVER = 'cover',
  CONTAIN = 'contain',
}

export enum ImageHover {
  ZOOM = 'zoom',
  FADE = 'fade',
  SLIDE = 'slide',
  NONE = 'none',
}

export enum BorderRadius {
  NONE = '0',
  SMALL = '4',
  MEDIUM = '8',
  LARGE = '12',
  EXTRA_LARGE = '16',
  FULL = '9999',
}

export enum Shadow {
  NONE = 'none',
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
}

export enum PriceFormat {
  DEFAULT = 'default',
  WITH_DISCOUNT = 'with-discount',
  RANGE = 'range',
}

export enum RatingStyle {
  STARS = 'stars',
  NUMBER = 'number',
}

export enum BadgeStyle {
  SALE = 'sale',
  NEW = 'new',
  BOTH = 'both',
}

export enum BadgePosition {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

export enum ActionStyle {
  BUTTON = 'button',
  ICON = 'icon',
  BUTTON_ICON = 'button-icon',
}

export enum SortBy {
  MANUAL = 'manual',
  NEWEST = 'newest',
  BESTSELLER = 'bestseller',
  PRICE_LOW = 'price-low',
  PRICE_HIGH = 'price-high',
  RATING = 'rating',
}

export enum PaginationType {
  NONE = 'none',
  PAGINATION = 'pagination',
  LOAD_MORE = 'load-more',
  INFINITE_SCROLL = 'infinite-scroll',
}

export enum ProductSource {
  CATEGORY = 'category',
  COLLECTION = 'collection',
  MANUAL = 'manual',
}

export enum GoalType {
  SALES = 'sales',
  VIEWS = 'views',
  ENGAGEMENT = 'engagement',
}

// ===== ZOD SCHEMAS =====

const ContentSchema = z.object({
  title: z.string().min(1).max(100),
  showTitle: z.boolean().default(true),
  description: z.string().max(200).optional(),
  showDescription: z.boolean().default(false),
  source: z.enum([ProductSource.CATEGORY, ProductSource.COLLECTION, ProductSource.MANUAL]),
  category: z.string().optional(),
  collection: z.string().optional(),
  products: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(50).default(12),
  featured: z.boolean().default(false),
})

const GridLayoutSchema = z.object({
  type: z.literal(ProductGridLayoutType.GRID),
  gridColumns: z
    .enum([GridPreset.PRESET_1, GridPreset.PRESET_2, GridPreset.PRESET_3, GridPreset.AUTO])
    .default(GridPreset.PRESET_2),
  gap: z.enum(['16', '24', '32', '40']).default('24'),
})

const CarouselLayoutSchema = z.object({
  type: z.literal(ProductGridLayoutType.CAROUSEL),
  carouselItems: z.enum(['1', '2', '3', '4']).default('3'),
  carouselAutoScroll: z.boolean().default(false),
  carouselSpeed: z.enum(['3', '5', '7']).optional(),
  gap: z.enum(['16', '24', '32', '40']).default('24'),
})

const MasonryLayoutSchema = z.object({
  type: z.literal(ProductGridLayoutType.MASONRY),
  gap: z.enum(['16', '24', '32', '40']).default('24'),
})

const LayoutSchema = z.discriminatedUnion('type', [
  GridLayoutSchema,
  CarouselLayoutSchema,
  MasonryLayoutSchema,
])

const CardStyleSchema = z.object({
  borderRadius: z
    .enum([
      BorderRadius.NONE,
      BorderRadius.SMALL,
      BorderRadius.MEDIUM,
      BorderRadius.LARGE,
      BorderRadius.EXTRA_LARGE,
      BorderRadius.FULL,
    ])
    .default(BorderRadius.LARGE),
  shadow: z.enum([Shadow.NONE, Shadow.LIGHT, Shadow.MEDIUM, Shadow.HEAVY]).default(Shadow.LIGHT),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .default('#ffffff'),
  showBorder: z.boolean().default(false),
  borderColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  borderWidth: z.enum(['1', '2', '3']).optional(),
})

const CardSchema = z.object({
  imageAspect: z
    .enum([
      ImageAspect.SQUARE,
      ImageAspect.WIDE,
      ImageAspect.TALL,
      ImageAspect.COVER,
      ImageAspect.CONTAIN,
    ])
    .default(ImageAspect.SQUARE),
  imageHover: z
    .enum([ImageHover.ZOOM, ImageHover.FADE, ImageHover.SLIDE, ImageHover.NONE])
    .default(ImageHover.ZOOM),
  style: CardStyleSchema,
  padding: z.enum(['8', '12', '16', '20']).default('16'),
})

const PriceDisplaySchema = z.object({
  show: z.boolean().default(true),
  format: z
    .enum([PriceFormat.DEFAULT, PriceFormat.WITH_DISCOUNT, PriceFormat.RANGE])
    .default(PriceFormat.DEFAULT),
})

const RatingDisplaySchema = z.object({
  show: z.boolean().default(true),
  style: z.enum([RatingStyle.STARS, RatingStyle.NUMBER]).default(RatingStyle.STARS),
  showCount: z.boolean().default(true),
})

const BadgeDisplaySchema = z.object({
  show: z.boolean().default(true),
  style: z.enum([BadgeStyle.SALE, BadgeStyle.NEW, BadgeStyle.BOTH]).default(BadgeStyle.BOTH),
  position: z
    .enum([
      BadgePosition.TOP_LEFT,
      BadgePosition.TOP_RIGHT,
      BadgePosition.BOTTOM_LEFT,
      BadgePosition.BOTTOM_RIGHT,
    ])
    .default(BadgePosition.TOP_RIGHT),
})

const DisplaySchema = z.object({
  image: z.boolean().default(true),
  title: z.boolean().default(true),
  price: PriceDisplaySchema,
  rating: RatingDisplaySchema,
  category: z.boolean().default(false),
  badge: BadgeDisplaySchema,
  description: z.boolean().default(false),
  stock: z.boolean().default(false),
})

const AddToCartSchema = z.object({
  show: z.boolean().default(true),
  style: z
    .enum([ActionStyle.BUTTON, ActionStyle.ICON, ActionStyle.BUTTON_ICON])
    .default(ActionStyle.BUTTON),
  text: z.string().max(30).default('Add to Cart'),
  fullWidth: z.boolean().default(false),
})

const QuickViewSchema = z.object({
  show: z.boolean().default(false),
})

const WishlistSchema = z.object({
  show: z.boolean().default(false),
})

const ActionsSchema = z.object({
  addToCart: AddToCartSchema,
  quickView: QuickViewSchema,
  wishlist: WishlistSchema,
  share: z.boolean().default(false),
})

const DataSchema = z.object({
  sortBy: z
    .enum([
      SortBy.MANUAL,
      SortBy.NEWEST,
      SortBy.BESTSELLER,
      SortBy.PRICE_LOW,
      SortBy.PRICE_HIGH,
      SortBy.RATING,
    ])
    .default(SortBy.MANUAL),
  sortAllowCustomer: z.boolean().default(false),
})

const PaginationSchema = z.object({
  type: z
    .enum([
      PaginationType.NONE,
      PaginationType.PAGINATION,
      PaginationType.LOAD_MORE,
      PaginationType.INFINITE_SCROLL,
    ])
    .default(PaginationType.NONE),
  itemsPerPage: z.number().int().min(6).max(50).default(12),
  loadMoreText: z.string().max(30).optional(),
})

const VisibilitySchema = z.object({
  showOnMobile: z.boolean().default(true),
  showOnTablet: z.boolean().default(true),
  showOnDesktop: z.boolean().default(true),
})

const AnalyticsSchema = z.object({
  trackingId: z.string().optional(),
  goalType: z.enum([GoalType.SALES, GoalType.VIEWS, GoalType.ENGAGEMENT]).optional(),
})

// ===== MAIN SCHEMA =====

export const ProductGridBlockSchema = z.object({
  _id: z.string().optional(),
  shopId: z.string(),
  templateId: z.string(),
  content: ContentSchema,
  layout: LayoutSchema,
  card: CardSchema,
  display: DisplaySchema,
  actions: ActionsSchema,
  data: DataSchema,
  pagination: PaginationSchema,
  visibility: VisibilitySchema,
  analytics: AnalyticsSchema,
  disabled: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// ===== TYPESCRIPT TYPES =====

export type ProductGridBlock = z.infer<typeof ProductGridBlockSchema>

export type ContentSettings = z.infer<typeof ContentSchema>
export type LayoutSettings = z.infer<typeof LayoutSchema>
export type CardSettings = z.infer<typeof CardSchema>
export type DisplaySettings = z.infer<typeof DisplaySchema>
export type ActionsSettings = z.infer<typeof ActionsSchema>
export type DataSettings = z.infer<typeof DataSchema>
export type PaginationSettings = z.infer<typeof PaginationSchema>
export type VisibilitySettings = z.infer<typeof VisibilitySchema>
export type AnalyticsSettings = z.infer<typeof AnalyticsSchema>

// ===== PRESET HELPERS =====

export const gridPresetsConfig = {
  [GridPreset.PRESET_1]: {
    name: 'Preset 1',
    description: '4 - 2 - 1',
    desktop: 4,
    tablet: 2,
    mobile: 1,
  },
  [GridPreset.PRESET_2]: {
    name: 'Preset 2',
    description: '3 - 2 - 1',
    desktop: 3,
    tablet: 2,
    mobile: 1,
  },
  [GridPreset.PRESET_3]: {
    name: 'Preset 3',
    description: '6 - 3 - 2',
    desktop: 6,
    tablet: 3,
    mobile: 2,
  },
} as const

export const shadowConfig = {
  [Shadow.NONE]: 'shadow-none',
  [Shadow.LIGHT]: 'shadow-sm',
  [Shadow.MEDIUM]: 'shadow-md',
  [Shadow.HEAVY]: 'shadow-lg',
} as const

export const imageHoverConfig = {
  [ImageHover.ZOOM]: 'scale-110',
  [ImageHover.FADE]: 'opacity-75',
  [ImageHover.SLIDE]: 'translate-x-2',
  [ImageHover.NONE]: '',
} as const
