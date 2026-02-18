import {
  addMinutesToHhmm,
  addSecondsToHhmm,
  roundHhmmToHour,
} from "@/app/utils/calcArriveTime";
import { filteringVilageFcstResults } from "@/app/utils/filteringVilageFcstResults";
import { getVilageFcst } from "@/backend/weather/fetchVFS";
import { NextResponse } from "next/server";

interface LocationData {
  lat: number;
  lon: number;
  name: string;
  pointIndex: number | string;
  nx: number;
  ny: number;
  distance?: number;
  arriveTime: string;
  breakTime?: string | null;
  departureTime?: string;
  apiTime?: string;
}

/**
 * 이전 지점 출발 시각 + 쉬는 시간을 반영하여 arriveTime, departureTime 계산
 * - 지점 0: arrive = startTime + 이동(0→0), depart = arrive + break0
 * - 지점 i: arrive = 이전 지점 depart + 이동(i-1→i), depart = arrive + breaki
 */
function computeScheduleWithBreaks(
  locationData: LocationData[],
  startTime: string,
  speedKmh: number
): { arriveTime: string; departureTime: string }[] {
  const normalizedStart = startTime.replace(":", "").padStart(4, "0");
  const results: { arriveTime: string; departureTime: string }[] = [];
  let prevDeparture = normalizedStart;

  for (let i = 0; i < locationData.length; i++) {
    const loc = locationData[i];
    const prevDistance = i > 0 ? (locationData[i - 1].distance ?? 0) : 0;
    const currDistance = loc.distance ?? 0;
    const segmentMeters = Math.max(0, currDistance - prevDistance);

    const secondsToTravel =
      speedKmh > 0 ? (segmentMeters / 1000 / speedKmh) * 3600 : 0;
    const arriveTime = addSecondsToHhmm(prevDeparture, secondsToTravel);
    const breakMinutes = parseInt(String(loc.breakTime ?? "0"), 10);
    const departureTime = addMinutesToHhmm(arriveTime, breakMinutes);

    results.push({ arriveTime, departureTime });
    prevDeparture = departureTime;
  }

  return results;
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    locationData?: LocationData[];
    startDate?: string;
    startTime?: string;
    fastForward?: string;
  };

  const now = new Date();
  const base = new Date(now.setDate(now.getDate() - 1));

  const locationData = body.locationData?.length ? body.locationData : [];
  const startTime = body.startTime ?? "";
  const speedKmh = Math.max(0, parseFloat(body.fastForward ?? "0"));

  const schedule = computeScheduleWithBreaks(locationData, startTime, speedKmh);

  const base_date = `${base.getFullYear()}${String(
    base.getMonth() + 1
  ).padStart(2, "0")}${String(base.getDate()).padStart(2, "0")}`;
  const startDate = body.startDate ?? "";

  const vilageFcstPromises = locationData.map((location) =>
    getVilageFcst({
      base_date: base_date,
      base_time: "2300",
      nx: location.nx,
      ny: location.ny,
      pageNo: 1,
      numOfRows: 1000,
      dataType: "JSON",
    })
  );

  const vilageFcstResultsArray = await Promise.all(vilageFcstPromises);
  const weatherByLocation = locationData.map((location, idx) => {
    const { arriveTime, departureTime } = schedule[idx];
    const apiTime = roundHhmmToHour(departureTime);

    const filtered = filteringVilageFcstResults(
      vilageFcstResultsArray[idx],
      startDate,
      apiTime
    );

    return {
      location: {
        ...location,
        arriveTime,
        departureTime,
        apiTime,
      },
      weather: filtered,
    };
  });

  return NextResponse.json(weatherByLocation, { status: 200 });
}
