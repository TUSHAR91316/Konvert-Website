export interface GitHubAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  body: string;
  html_url: string;
  assets: GitHubAsset[];
}

export interface ReleaseStats {
  versions: number;
  latest: string;
  downloads: string;
}
