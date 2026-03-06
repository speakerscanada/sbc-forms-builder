# SBC Letterhead Background Rules

## 1-Page Template (sbc_letterhead_white_1_page.pdf)
- Full centred maple leaf watermark — large, fills most of the page, very light grey (~#F2F2F2)
- White background
- Used for: 1 or 2 page forms (first page always)

## 3-Page Template (sbc_letterhead_white_leaf_3_page.pdf)
- Page 1: Full centred maple leaf (same as 1-page template)
- Page 2: Maple leaf cropped — bottom-right corner only (partial leaf, lower-right quadrant visible)
- Page 3: Maple leaf cropped — bottom-left corner only (partial leaf, lower-left quadrant visible)
- Used for: 3+ page forms

## Rules
- First page ALWAYS uses full centred maple leaf
- 1 or 2 pages: use 1-page template (full leaf only)
- 3+ pages: use 3-page template (full leaf p1, bottom-right p2, bottom-left p3+)
- NEVER end with maple leaf bottom-left as the last page
- Page 2 of 3-page template = bottom-right leaf corner
- Page 3 of 3-page template = bottom-left leaf corner (this is the "never end with" rule — so if 3 pages, page 3 uses bottom-left but that's the last — contradiction? Likely means: don't add extra blank pages that end on bottom-left)

## Implementation for Web Form Builder
- Each form "page" (SurveyJS page) gets a background
- Page 1: full centred leaf SVG/PNG watermark
- Page 2 (if exists): bottom-right leaf watermark
- Page 3+ (if exists): bottom-left leaf watermark (but never as final page if avoidable)
- Background is a fixed CSS background-image with opacity ~0.08
