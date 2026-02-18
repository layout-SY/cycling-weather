import { VFS_ERROR_CODE_META } from '../constants/VFSResponseConstants';

export type VFSErrorCode = keyof typeof VFS_ERROR_CODE_META;

// 공통 응답 타입
export interface VFSResponse<TItem> {
  response: {
    header: { resultCode: string; resultMsg: string };
    body?: {
      dataType: 'JSON' | 'XML';
      items?: { item: TItem[] };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export interface WeatherCommonRequestParams {
  numOfRows?: number;
  pageNo: number;
  dataType: 'JSON' | 'XML';
  base_date: string;
  base_time: string;
  nx: number;
  ny: number;
}

export interface WeatherCommonResponse {
  category?: string;
  nx: number;
  ny: number;
  base_date: string;
  base_time: string;
}

export interface UltraSrtNcstResponse extends WeatherCommonResponse {
  obsrValue: string | number;
}

export interface VilageFcstResponse extends WeatherCommonResponse {
  fcstDate: string;
  fcstTime: string;
  fcstValue: string | number;
}
