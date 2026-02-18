"use client";

import { AxiosInstance } from "@/lib/axios";
import {
  SKY_CODE_LABELS,
  PTY_CODE_LABELS,
} from "@/constants/weatherStateConstants";
import type {
  GetWeatherResponse,
  WeatherResultItem,
} from "@/model/WeatherResultInterface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSecondContext } from "../context/SecndContext";
import { useFormData } from "../context/FormDataContext";

function formatTime(hhmm: string) {
  if (!hhmm || hhmm.length < 4) return "-";
  return `${hhmm.slice(0, 2)}:${hhmm.slice(2, 4)}`;
}

function decodeName(name: string) {
  return name.replace(/&#x2F;/g, "/").replace(/&#x27;/g, "'");
}

function getWeatherSummary(item: WeatherResultItem) {
  const tmp = item.weather.filteredTMP[0]?.fcstValue;
  const pop = item.weather.filteredPOP[0]?.fcstValue;
  const sky = item.weather.filteredSKY[0]?.fcstValue;
  const pty = item.weather.filteredPTY[0]?.fcstValue;

  const skyLabel = SKY_CODE_LABELS[Number(sky)] ?? (sky ? String(sky) : "-");
  const ptyLabel =
    PTY_CODE_LABELS[Number(pty)] ??
    (pty === "0" ? "없음" : pty ? String(pty) : "-");

  return {
    temp: tmp != null ? `${tmp}°C` : "-",
    pop: pop != null ? `${pop}%` : "-",
    sky: skyLabel,
    pty: ptyLabel,
  };
}

export default function ResultPage() {
  const router = useRouter();
  const { locationFormData } = useSecondContext();
  const { formData } = useFormData();
  const [weatherData, setWeatherData] = useState<GetWeatherResponse | null>(
    null
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const instance = AxiosInstance(
    "/api/getWeather",
    { timeout: 15_000 },
    "POST"
  );

  const getWeatherData = async () => {
    if (
      !locationFormData?.length ||
      !formData?.startDate ||
      !formData?.startTime
    ) {
      router.replace("/");
      return;
    }

    setStatus("loading");

    try {
      const response = await instance.post("/", {
        locationData: locationFormData,
        startDate: formData.startDate,
        startTime: formData.startTime,
      });

      if (response.status !== 200) {
        throw new Error("Failed to get weather data");
      }

      setWeatherData(response.data as GetWeatherResponse);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    getWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading")
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            날씨 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );

  if (status === "error")
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 dark:bg-slate-900">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <p className="text-lg font-medium text-red-700 dark:text-red-400">
            날씨 정보를 불러오는 중 오류가 발생했습니다.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            처음으로
          </button>
        </div>
      </div>
    );

  if (!weatherData?.length)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">
          표시할 구간이 없습니다.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            구간별 날씨
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            각 구간의 예상 도착 시각과 날씨를 확인하세요
          </p>
        </div>

        <div className="relative">
          {/* Vertical timeline axis - runs through center of dots */}
          <div
            className="absolute left-[7px] top-8 bottom-8 w-0.5 bg-slate-300 dark:bg-slate-600"
            aria-hidden
          />

          <div className="space-y-0">
            {weatherData.map((item, idx) => {
              const summary = getWeatherSummary(item);
              const { location } = item;

              return (
                <div
                  key={idx}
                  className="relative flex items-stretch gap-0 pb-6 last:pb-0"
                >
                  {/* Left: dot + horizontal connector */}
                  <div className="flex w-10 shrink-0 items-center pt-6">
                    <div className="relative flex h-full w-full items-center">
                      <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-slate-800 dark:bg-slate-200" />
                      <div className="absolute left-3 top-1/2 h-px w-4 -translate-y-1/2 bg-slate-300 dark:bg-slate-600" />
                    </div>
                  </div>

                  {/* Right: content box */}
                  <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                          {decodeName(location.name)}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <span>
                            도착 {formatTime(location.arriveTime)} · 출발{" "}
                            {formatTime(location.departureTime)}
                          </span>
                          <span>
                            {((location.distance ?? 0) / 1000).toFixed(1)}km
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                          {summary.temp}
                        </span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {summary.sky}
                        </span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          강수 {summary.pop}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            다시 시작하기
          </button>
        </div>
      </main>
    </div>
  );
}
