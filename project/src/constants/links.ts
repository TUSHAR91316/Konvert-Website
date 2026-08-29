/**
 * Centralized Repository, API, and External Service URLs
 */
export const GITHUB_REPO_URL = 'https://github.com/TUSHAR91316/Konvert';
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
export const GITHUB_LATEST_RELEASE_URL = `${GITHUB_RELEASES_URL}/latest`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const GITHUB_NEW_ISSUE_URL = `${GITHUB_ISSUES_URL}/new`;
export const GITHUB_DISCUSSIONS_URL = `${GITHUB_REPO_URL}/discussions`;

export const GITHUB_API_RELEASES = 'https://api.github.com/repos/TUSHAR91316/Konvert/releases';

export const VIRUSTOTAL_SIGNUP_URL = 'https://www.virustotal.com/gui/join-us';
export const NGROK_DASHBOARD_URL = 'https://dashboard.ngrok.com/';

/**
 * Returns the direct APK download URL for a specific release tag
 */
export const getApkDownloadUrl = (tag: string): string => {
  return `${GITHUB_RELEASES_URL}/download/${tag}/app-release.apk`;
};
