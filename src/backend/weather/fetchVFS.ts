import { AxiosInstance } from "../../lib/axios";
import { VFS_ERROR_CODE_META } from "../../constants/VFSResponseConstants";
import type {
  VFSErrorCode,
  VFSResponse,
  UltraSrtNcstResponse,
  VilageFcstResponse,
  WeatherCommonRequestParams,
} from "../../model/VFSInterface";

const VFS_BASE_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";

const SERVICE_KEY = process.env.VITE_SHORT_WEATHER_API_KEY as string;

if (!SERVICE_KEY) {
  throw new Error("VITE_VFS_SERVICE_KEY가 설정되지 않았습니다.");
}

const vfsErrorExtractor = (data: unknown) => {
  const header = (data as VFSResponse<unknown> | undefined)?.response?.header;
  if (!header?.resultCode) {
    return null;
  }
  if (header.resultCode !== "00") {
    const meta = VFS_ERROR_CODE_META[header.resultCode as VFSErrorCode];
    return {
      code: header.resultCode,
      message: meta.message,
      data: {
        description: meta.description,
        rawMessage: header.resultMsg,
      },
    };
  }
  return null;
};

export const vfsAxios = AxiosInstance(VFS_BASE_URL, {
  timeout: 15_000,
  errorExtractor: vfsErrorExtractor,
});

export async function getUltraSrtNcst(
  params: WeatherCommonRequestParams
): Promise<UltraSrtNcstResponse[]> {
  const { data } = await vfsAxios.get<VFSResponse<UltraSrtNcstResponse>>(
    "/getUltraSrtNcst",
    {
      params: {
        serviceKey: SERVICE_KEY, // 인증키
        ...params,
      },
    }
  );

  return data.response.body?.items?.item ?? [];
}

export async function getVilageFcst(
  params: WeatherCommonRequestParams
): Promise<VilageFcstResponse[]> {
  const { data } = await vfsAxios.get<VFSResponse<VilageFcstResponse>>(
    "/getVilageFcst",
    {
      params: {
        serviceKey: SERVICE_KEY,
        ...params,
      },
    }
  );
  return data.response.body?.items?.item ?? [];
}
