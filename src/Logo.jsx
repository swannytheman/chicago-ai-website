// The mark comes from the brand files in public/brand/. Those originals are Canva
// exports -- PNG artwork inside an SVG wrapper, each with an opaque background plate
// baked in -- so they cannot be dropped straight into a dark page. public/brand/mark.png
// is the arc symbol lifted out of the dark (reversed) export with the plate removed,
// trimmed to its ink and sized for retina at the largest place it appears.
//
// The wordmark is live text rather than part of the image on purpose. The supplied
// lockup stacks the name over three lines with a tagline under it, which is unreadable
// in a 40px header; setting it as text keeps it crisp at every size, lets it inherit
// the page's colour, and keeps the nav asset small. public/brand/lockup.png holds the
// designer's full stacked lockup for places with room for it.

const SIZES = {
  small:   { mark: 32, text: '13px' },
  default: { mark: 40, text: '15px' },
  large:   { mark: 64, text: '22px' },
};

export default function Logo({ size = 'default', showText = true }) {
  const { mark, text } = SIZES[size] ?? SIZES.default;

  return (
    <div className="flex items-center gap-3">
      <img
        src="/brand/mark.png"
        alt=""
        aria-hidden="true"
        width={Math.round(mark * 0.67)}
        height={mark}
        style={{ height: mark, width: 'auto', display: 'block' }}
        decoding="async"
      />
      {showText && (
        <span
          className="font-bold text-white whitespace-nowrap"
          style={{ fontSize: text, letterSpacing: '-0.01em', lineHeight: 1 }}
        >
          The Chicago <span className="text-emerald-400">AI</span> Group
        </span>
      )}
      {/* The mark is decorative; the name is the accessible label, and when the text is
          hidden this carries it instead. */}
      {!showText && <span className="sr-only">The Chicago AI Group</span>}
    </div>
  );
}
