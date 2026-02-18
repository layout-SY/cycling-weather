"use client";

import { useFormData } from "@/app/(anon)/context/FormDataContext";
import { AxiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSecondContext } from "../context/SecndContext";

export type LocationDataType = {
  lat: number;
  lon: number;
  nx: number;
  ny: number;
  pointIndex: string;
  name: string;
  distance: number;
  arriveTime: string;
  breakTime: string | null;
};

export default function SecondPage() {
  const router = useRouter();
  const { formData } = useFormData();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [locations, setLocations] = useState<LocationDataType[]>([]);
  const { setLocationFormData } = useSecondContext();
  const hasRun = useRef(false);

  const parseInstance = AxiosInstance(
    "/api/parseGpxTcx",
    { timeout: 15_000 },
    "POST"
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLocationFormData(locations);
    router.push("/result");
  };

  const handleBreakTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    locationIdx: number
  ) => {
    const breakTime = e.target.value;
    setLocations((prev) =>
      prev.map((location, idx) =>
        idx === locationIdx ? { ...location, breakTime } : location
      )
    );
  };

  useEffect(() => {
    if (!formData?.file) {
      return;
    }
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      setStatus("loading");

      try {
        const body = new FormData();
        body.append("startDate", formData.startDate);
        body.append("startTime", formData.startTime);
        body.append("fastForward", formData.fastForward);
        body.append("file", formData.file!);

        const parsedLocationsWithBreakTime = await parseInstance.post(
          "/",
          body
        );
        const { wayPointData } = parsedLocationsWithBreakTime.data;

        setLocations(wayPointData);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  if (status === "loading")
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            경로 정보를 분석 중...
          </p>
        </div>
      </div>
    );

  if (status === "error")
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 dark:bg-slate-900">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <p className="text-lg font-medium text-red-700 dark:text-red-400">
            파일을 처리하는 중 오류가 발생했습니다.
          </p>
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            TCX/GPX 파일 형식을 확인해 주세요.
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

  if (status === "success")
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <main className="mx-auto max-w-2xl px-6 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              구간별 쉬는 시간 설정
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              각 웨이포인트에서 쉴 예정인 시간(분)을 입력하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {locations.map((location, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-800 dark:text-slate-100">
                      {location.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        거리 {((location.distance ?? 0) / 1000).toFixed(1)}km
                      </span>
                      <span>
                        예상 도착{" "}
                        {location.arriveTime
                          ? `${location.arriveTime.slice(0, 2)}:${location.arriveTime.slice(2, 4)}`
                          : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      쉬는 시간
                    </label>
                    <input
                      type="number"
                      min="0"
                      onChange={(e) => handleBreakTimeChange(e, idx)}
                      value={location.breakTime ?? ""}
                      placeholder="0"
                      className="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      분
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                날씨 보기
              </button>
            </div>
          </form>
        </main>
      </div>
    );

  return null;
}
