"use client";

import { useFormData } from "@/app/(anon)/context/FormDataContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MainPage() {
  const router = useRouter();
  const { setFormData } = useFormData();
  const [form, setForm] = useState({
    startDate: "",
    startTime: "",
    fastForward: "25",
    file: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.file) {
      alert("파일을 선택해주세요.");
      return;
    }

    setFormData({
      startDate: form.startDate.replaceAll("-", ""),
      startTime: form.startTime.replace(":", "").padStart(4, "0"),
      fastForward: form.fastForward,
      file: form.file,
    });

    router.push("/second");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, file: e.target.files?.[0] ?? null });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, startDate: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, startTime: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              라이딩 날씨
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              TCX/GPX 파일을 업로드하고 출발 정보를 입력하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                파일 선택
              </label>
              <input
                type="file"
                accept=".tcx,.gpx"
                onChange={handleFileChange}
                className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:hover:bg-amber-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:file:bg-amber-600 dark:file:hover:bg-amber-700"
              />
              {form.file && (
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  선택됨: {form.file.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  출발일
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={handleDateChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  출발 시간
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={handleTimeChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                평균 속력 (km/h)
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={form.fastForward}
                onChange={(e) =>
                  setForm({ ...form, fastForward: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              다음 단계로
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
