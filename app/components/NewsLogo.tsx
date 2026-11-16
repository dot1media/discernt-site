// The Discernt emblem (metallic aperture-globe mark) shown inline with the
// nameplate. Sized to the surrounding text via em so it tracks the wordmark.
export default function NewsLogo({ h = "1.15em" }: { h?: string | number }) {
  return (
    <img
      src="/discernt-emblem.png"
      alt="Discernt"
      style={{ display: "inline-block", height: h, width: "auto", verticalAlign: "-0.22em", margin: "0 0.04em" }}
    />
  );
}
