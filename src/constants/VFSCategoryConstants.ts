import { VFSCategoryMetaMap } from '../model/constantsInterface';

export const VFS_CATEGORY_META = {
  TMP: {
    name: '1시간 기온',
    unit: '°C',
    bit: 10,
    groups: ['VILAGE_FCST'],
  },
  TMN: {
    name: '일 최저기온',
    unit: '°C',
    bit: 10,
    groups: ['VILAGE_FCST'],
  },
  TMX: {
    name: '일 최고기온',
    unit: '°C',
    bit: 10,
    groups: ['VILAGE_FCST'],
  },
  T1H: {
    name: '기온',
    unit: '°C',
    bit: 10,
    groups: ['ULTRA_SRT_NCST', 'ULTRA_SRT_FCST'],
  },
} as const satisfies VFSCategoryMetaMap;
