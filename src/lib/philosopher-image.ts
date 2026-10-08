import cloudinaryUrls from '../../philosophers-urls.json';

const LOCAL_BASE = '/images/philosophers';

const urlMap: Record<string, string> = {};

for (const [key, url] of Object.entries(cloudinaryUrls)) {
  if (key.endsWith('.json')) continue;
  const baseName = key.replace(/_[a-z0-9]+$/, '');
  urlMap[baseName] = url;
}

export type AvatarSize = 'small' | 'medium' | 'large';

const SIZE_TRANSFORMS: Record<AvatarSize, string> = {
  small: 'f_auto,q_auto,w_80,h_80,c_fill,g_auto',
  medium: 'f_auto,q_auto,w_160,h_160,c_fill,g_auto',
  large: 'f_auto,q_auto,w_600/',
};

export function getPhilosopherImageUrl(imageUrl: string, size: AvatarSize = 'medium'): string {
  const localPath = imageUrl || `${LOCAL_BASE}/unknown.jpg`;
  
  const match = localPath.match(/\/([^/]+)\.jpg$/);
  if (!match) return localPath;
  
  const filename = match[1];
  const baseName = filename.replace(/_[a-z0-9]+$/, '');
  
  let cloudinaryUrl = '';
  if (urlMap[baseName]) {
    cloudinaryUrl = urlMap[baseName];
  } else {
    return localPath;
  }
  
  if (cloudinaryUrl.startsWith('https://res.cloudinary.com')) {
    const transform = SIZE_TRANSFORMS[size];
    if (size === 'large') {
      return cloudinaryUrl.replace('/upload/', `/upload/${transform}`);
    }
    return cloudinaryUrl.replace('/upload/', `/upload/${transform}/`);
  }
  
  return localPath;
}

export function getPhilosopherAvatarUrl(imageUrl: string, size: AvatarSize = 'medium'): string {
  return getPhilosopherImageUrl(imageUrl, size);
}

export function hasPhilosopherImage(imageUrl: string): boolean {
  const match = imageUrl.match(/\/([^/]+)\.jpg$/);
  if (!match) return false;
  const filename = match[1];
  const baseName = filename.replace(/_[a-z0-9]+$/, '');
  return !!urlMap[baseName];
}

export function getPhilosopherInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function getLocalImagePath(imageUrl: string): string {
  return imageUrl || `${LOCAL_BASE}/unknown.jpg`;
}
