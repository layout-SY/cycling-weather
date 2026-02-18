export type VFSCategoryGroup =
  | 'VILAGE_FCST'
  | 'ULTRA_SRT_NCST'
  | 'ULTRA_SRT_FCST';

export type VFSCategoryCode = 'TMP' | 'TMN' | 'TMX' | 'T1H';

export interface VFSCategoryMeta {
  name: string;
  unit: string;
  bit: number;
  groups: VFSCategoryGroup[];
}

export type VFSCategoryMetaMap = Record<VFSCategoryCode, VFSCategoryMeta>;
