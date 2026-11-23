/**
 * Copy text without ever lying about it.
 *
 * The button may only say "Copied" when the clipboard really took the text:
 * a failed copy that claims success sends people to a terminal with an empty
 * paste buffer.
 */
export interface ClipboardTarget {
  readonly writeText?: (text: string) => Promise<void>;
}

export async function copyText(text: string, target?: ClipboardTarget): Promise<boolean> {
  const source = target ?? (typeof navigator === "undefined" ? undefined : navigator.clipboard);
  const write = source?.writeText;
  if (!write) return false;

  try {
    await write.call(source, text);
    return true;
  } catch {
    return false;
  }
}
