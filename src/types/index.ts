export interface FabricElement {
  type: string;
  left: number;
  top: number;
  [key: string]: any;
}

export interface DesignPage {
  id: string;
  elements: any[];
  thumbnail?: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category:
    | "basic"
    | "social"
    | "presentation"
    | "business"
    | "grown-ups"
    | "kids";
  width: number;
  height: number;
  isPro: boolean;
  pages: any[];
}

export interface Design {
  id: string;
  name: string;
  thumbnail?: string;
  width: number;
  height: number;
  isPublic: boolean;
  pages: DesignPage[];
  currentPage: number;
  createdAt: Date;
  updatedAt: Date;
}
