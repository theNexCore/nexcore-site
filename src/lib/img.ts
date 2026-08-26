import sizes from '@/data/image-sizes.json';

type Sizes = Record<string, [number, number]>;
const map = sizes as unknown as Sizes;

/**
 * Look up intrinsic dimensions for a local asset so every <Image> can carry
 * explicit width/height (project convention - prevents layout shift).
 * Falls back to a 4:3 box if an asset is missing from the manifest.
 */
export function dim(src: string, fallback: [number, number] = [1200, 900]) {
  const found = map[src];
  const [width, height] = found ?? fallback;
  return { width, height };
}

/** Scale intrinsic dimensions to a target width, preserving aspect ratio. */
export function dimAt(src: string, targetWidth: number) {
  const { width, height } = dim(src);
  return { width: targetWidth, height: Math.round((height / width) * targetWidth) };
}
