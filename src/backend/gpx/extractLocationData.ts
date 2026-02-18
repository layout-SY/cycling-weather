import { parseCoords } from "@/app/utils/parseCoords";
import { calcArriveTime } from "@/app/utils/calcArriveTime";
import { TcxCoursePoint } from "@/model/TCXInterface";
import { XMLParser } from "fast-xml-parser";

interface WayPointData {
  lat: string;
  lon: string;
  pointIndex: number;
  name: string;
  distance?: number;
  nx: number;
  ny: number;
  arriveTime?: string;
}

export const extractLocationData = async (
  file: File,
  startTime: string,
  fastForward: string
) => {
  const wayPointData: WayPointData[] = [];
  const speedKmh = parseFloat(fastForward);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const text = await file.text();
  const parsed = parser.parse(text);

  parsed.TrainingCenterDatabase.Courses.Course.CoursePoint.forEach(
    (wpt: TcxCoursePoint) => {
      const parsedParams = parseCoords(
        Number(wpt.Position.LatitudeDegrees),
        Number(wpt.Position.LongitudeDegrees)
      );
      wayPointData.push({
        lat: wpt.Position.LatitudeDegrees,
        lon: wpt.Position.LongitudeDegrees,
        nx: parsedParams.x,
        ny: parsedParams.y,
        pointIndex: Number(wpt["@_pointIndex"]),
        name: wpt.Name,
        distance: 0,
      });
    }
  );

  wayPointData.forEach((wpt) => {
    const found =
      parsed.TrainingCenterDatabase.Courses.Course.Track.Trackpoint[
        wpt.pointIndex
      ];
    if (found?.DistanceMeters !== undefined) {
      const distanceMeters = Number(found.DistanceMeters);
      wpt.distance = distanceMeters;

      if (speedKmh > 0) {
        wpt.arriveTime = calcArriveTime(startTime, distanceMeters, speedKmh);
      }
    } else {
      wpt.distance = undefined;
    }
  });

  return {
    wayPointData,
  };
};
