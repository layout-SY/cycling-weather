import { addMinutesToHhmm, roundHhmmToHour } from "@/app/utils/calcArriveTime";
import { filteringVilageFcstResults } from "@/app/utils/filteringVilageFcstResults";
import { getVilageFcst } from "@/backend/weather/fetchVFS";
import { NextResponse } from "next/server";

interface LocationData {
  lat: number;
  lon: number;
  name: string;
  pointIndex: number;
  nx: number;
  ny: number;
  distance?: number;
  arriveTime: string;
  breakTime?: string;
  departureTime: string;
  apiTime: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    locationData?: LocationData[];
    startDate?: string;
    startTime?: string;
  };

  const now = new Date();
  const base = new Date(now.setDate(now.getDate() - 1));

  const locationData = body.locationData?.length ? body.locationData : [];
  const base_date = `${base.getFullYear()}${String(
    base.getMonth() + 1
  ).padStart(2, "0")}${String(base.getDate()).padStart(2, "0")}`;
  const base_time = `${String(base.getHours()).padStart(2, "0")}00`;
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
    const breakMinutes = parseInt(location.breakTime || "0", 10);
    const departureTime = addMinutesToHhmm(location.arriveTime, breakMinutes);
    const apiTime = roundHhmmToHour(departureTime);

    const filtered = filteringVilageFcstResults(
      vilageFcstResultsArray[idx],
      startDate,
      apiTime
    );

    return {
      location: {
        ...location,
        departureTime,
        apiTime,
      },
      weather: filtered,
    };
  });

  return NextResponse.json(weatherByLocation, { status: 200 });
}
