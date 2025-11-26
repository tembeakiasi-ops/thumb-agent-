export enum AssetType {
  LOGO = 'Logo',
  THUMBNAIL = 'Thumbnail',
  BANNER = 'Banner',
  SOCIAL_POST = 'Social Post',
  SOCIAL_STORY = 'Social Story'
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  STANDARD_PORTRAIT = '3:4',
  STANDARD_LANDSCAPE = '4:3'
}

export interface GeneratedAsset {
  id: string;
  type: AssetType;
  prompt: string;
  title?: string;
  imageUrl: string;
  createdAt: number;
  aspectRatio: AspectRatio;
}

export interface GenerationConfig {
  prompt: string;
  style: string;
  type: AssetType;
  aspectRatio: AspectRatio;
  title?: string;
}