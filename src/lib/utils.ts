export function cn(...inputs: (string | Record<string, boolean> | null | undefined | false)[]) {
  return inputs
    .map(input => {
      if (!input) return '';
      if (typeof input === 'string') return input;
      return Object.entries(input)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(' ');
    })
    .filter(Boolean)
    .join(' ');
}
