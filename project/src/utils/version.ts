/**
 * Utility functions for release versioning
 */

/**
 * Determines whether a release tag represents a Major version (1.x / 1.x.0)
 * or a Patch version (1.x.x where patch > 0).
 */
export const isMajorRelease = (tagName: string): boolean => {
  const clean = tagName.replace(/^v/i, '').trim();
  const parts = clean.split('.');

  // 1.x format (e.g., 1.6, 1.5, 1.0, 0.9) has 2 segments -> Major
  if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
    return true;
  }

  // 1.x.0 format (e.g., 1.7.0, 1.6.0) where patch is 0 -> Major
  if (parts.length === 3 && parts[2] === '0') {
    return true;
  }

  // Any 3-segment version with non-zero patch (e.g., 1.6.4, 1.6.1, 1.0.1) -> Patch
  return false;
};
