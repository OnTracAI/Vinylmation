import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

/**
 * Series names on the source site are hierarchical, encoded with " : " separators:
 *   "Animation 2"                      -> base "Animation 2"
 *   "Animation 2 : 9\""                -> base "Animation 2", qualifier "9\""
 *   "Animation 2 : Set : 3 Little Pigs -> base "Animation 2", qualifier "Set: 3 Little Pigs"
 * We keep the full name for display and the parsed base for grouping, so
 * "Animation 2" and its sets/9" variants collapse into one browse entry.
 */
export const series = sqliteTable(
  "series",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    baseName: text("base_name").notNull(),
    qualifier: text("qualifier"),
    figureCount: integer("figure_count").notNull().default(0),
    releaseYear: integer("release_year"),
  },
  (t) => [index("series_base_idx").on(t.baseName)],
);

export const figures = sqliteTable(
  "figures",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** Original record id from the source catalog — stable dedupe key. */
    sourceId: text("source_id").unique(),
    seriesId: integer("series_id")
      .notNull()
      .references(() => series.id),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    artist: text("artist"),

    /** common | variant | chaser */
    type: text("type").notNull().default("common"),
    /** limited | open | unknown */
    status: text("status"),
    /** Chase odds as printed, e.g. "1:12". */
    rarity: text("rarity"),
    /** "3 in." | "9 in." | "Jr." etc. */
    size: text("size"),
    /** blind | window | none */
    box: text("box"),
    hasCard: integer("has_card", { mode: "boolean" }),

    retailPrice: real("retail_price"),
    releasedAt: text("released_at"),
    releaseYear: integer("release_year"),

    /** Position within the set: "1 of 14". */
    setPosition: integer("set_position"),
    setTotal: integer("set_total"),

    /** Reference to the source image; not redistributed unless downloaded. */
    imageUrl: text("image_url"),
    /** Local path under /public if the operator opted into image download. */
    imagePath: text("image_path"),

    /** True when the figure detail page was archived and fully parsed. */
    detailComplete: integer("detail_complete", { mode: "boolean" })
      .notNull()
      .default(false),
  },
  (t) => [
    unique("figures_series_slug").on(t.seriesId, t.slug),
    index("figures_name_idx").on(t.name),
    index("figures_type_idx").on(t.type),
    index("figures_year_idx").on(t.releaseYear),
  ],
);

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

/**
 * One row per (user, figure) the user owns. Quantity covers duplicates, which
 * collectors keep for trading.
 */
export const collectionItems = sqliteTable(
  "collection_items",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    figureId: integer("figure_id")
      .notNull()
      .references(() => figures.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    /** mint_in_box | opened_complete | opened_no_box | damaged */
    condition: text("condition").notNull().default("opened_complete"),
    purchasePrice: real("purchase_price"),
    acquiredAt: text("acquired_at"),
    notes: text("notes"),
    /** Marked as a duplicate the owner will part with. */
    forTrade: integer("for_trade", { mode: "boolean" }).notNull().default(false),
    addedAt: text("added_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [primaryKey({ columns: [t.userId, t.figureId] })],
);

export const wishlistItems = sqliteTable(
  "wishlist_items",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    figureId: integer("figure_id")
      .notNull()
      .references(() => figures.id, { onDelete: "cascade" }),
    /** 1 = idle interest, 3 = actively hunting */
    priority: integer("priority").notNull().default(2),
    notes: text("notes"),
    addedAt: text("added_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [primaryKey({ columns: [t.userId, t.figureId] })],
);

export type Series = typeof series.$inferSelect;
export type Figure = typeof figures.$inferSelect;
export type User = typeof users.$inferSelect;
export type CollectionItem = typeof collectionItems.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;
