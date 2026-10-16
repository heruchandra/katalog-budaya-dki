// plain bold: no fill, padding or border, so the paragraph reads continuously
const HIGHLIGHT = "font-semibold text-gray-900";

/** Renders a content string with its **key terms** in bold */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? <strong key={i} className={HIGHLIGHT}>{part}</strong> : part
      )}
    </>
  );
}
