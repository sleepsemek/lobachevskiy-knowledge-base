export function sanitizedExtension(extension?: string): string {
  if (!extension) return 'txt';
  return extension.split('/')[1] ? extension.split('/')[1] : extension;
}
