// The mail-client card shown on /try-it-free (live, typed out as you fill the form)
// and on the homepage (a static worked example). Shared so the two pages cannot drift
// into two different pictures of the same product.
//
// Colours are literal rather than var(--...) on purpose: the try-it-free palette is
// scoped to .tif-root, and this also renders on the homepage, outside it.

const CSS = `
  .cag-email { background:#0a1020; border:1px solid #1a2638; border-radius:10px; overflow:hidden; }
  .cag-email-header { padding:12px 16px; border-bottom:1px solid #1a2638; display:flex; flex-direction:column; gap:5px; }
  .cag-email-row { display:flex; gap:10px; font-size:14px; line-height:1.45; }
  .cag-email-lbl { color:#4a6080; font-family:var(--cag-mono); min-width:44px; flex-shrink:0; }
  .cag-email-val { color:#8fa3bf; min-width:0; overflow-wrap:anywhere; }
  .cag-email-time { margin-left:auto; color:#4a6080; font-size:12px; white-space:nowrap; flex-shrink:0; }
  .cag-email-body { padding:16px; font-size:15px; line-height:1.75; color:#8fa3bf;
                    font-family:'Inter',system-ui,sans-serif; min-height:120px; }
  .cag-email-body p { margin:0 0 14px; }
  .cag-email-body p:last-child { margin-bottom:0; }
  .cag-email-foot { padding:12px 16px; border-top:1px solid #1a2638; font-size:12px; line-height:1.6; color:#4a6080; }
`;

export default function EmailPreview({ from, to, subject, timestamp, bodyHtml, footnote, children }) {
  return (
    <div className="cag-email">
      <style>{CSS}</style>
      <div className="cag-email-header">
        <div className="cag-email-row">
          <span className="cag-email-lbl">From:</span>
          <span className="cag-email-val">{from}</span>
          {timestamp && <span className="cag-email-time">{timestamp}</span>}
        </div>
        {to && (
          <div className="cag-email-row">
            <span className="cag-email-lbl">To:</span>
            <span className="cag-email-val">{to}</span>
          </div>
        )}
        <div className="cag-email-row">
          <span className="cag-email-lbl">Subject:</span>
          <span className="cag-email-val">{subject}</span>
        </div>
      </div>

      {/* bodyHtml drives the typing animation on /try-it-free; children is the static case. */}
      {bodyHtml != null
        ? <div className="cag-email-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        : <div className="cag-email-body">{children}</div>}

      {footnote && <div className="cag-email-foot">{footnote}</div>}
    </div>
  );
}
