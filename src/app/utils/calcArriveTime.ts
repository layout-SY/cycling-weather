/**
 * HHmm를 1시간 단위로 반올림 (날씨 API용)
 * 0~29분: 해당 시 00분 (0829 -> 0800)
 * 30~59분: 다음 시 00분 (0830 -> 0900, 0831 -> 0900)
 */
export const roundHhmmToHour = (hhmm: string): string => {
  const normalized = hhmm.replace(":", "").padStart(4, "0");
  const hh = parseInt(normalized.slice(0, 2), 10);
  const mm = parseInt(normalized.slice(2, 4), 10);

  if (mm < 30) {
    return `${hh.toString().padStart(2, "0")}00`;
  }
  const nextH = (hh + 1) % 24;
  return `${nextH.toString().padStart(2, "0")}00`;
};

/**
 * HHmm 형식에 분을 더함 (시/분 단위 합산)
 * @example addMinutesToHhmm("1140", 20) => "1200" (11:40 + 20분 = 12:00)
 */
export const addMinutesToHhmm = (
  hhmm: string,
  minutesToAdd: number
): string => {
  const normalized = hhmm.replace(":", "").padStart(4, "0");
  const hh = parseInt(normalized.slice(0, 2), 10);
  const mm = parseInt(normalized.slice(2, 4), 10);
  const totalMinutes = hh * 60 + mm + minutesToAdd;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = Math.floor(totalMinutes % 60);
  return `${newH.toString().padStart(2, "0")}${newM.toString().padStart(2, "0")}`;
};

/** startTime(HHmm)에 초를 더한 HHmm 문자열 반환 */
export const addSecondsToHhmm = (
  startHhmm: string,
  secondsToAdd: number
): string => {
  const hh = parseInt(startHhmm.slice(0, 2), 10);
  const mm = parseInt(startHhmm.slice(2, 4), 10);
  const totalMinutes = hh * 60 + mm + secondsToAdd / 60;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = Math.floor(totalMinutes % 60);
  return `${newH.toString().padStart(2, "0")}${newM.toString().padStart(2, "0")}`;
};

/**
 * 거리(m)와 평균 속력(km/h)으로 예상 도착 시간 계산
 * @param startTime - "1400" 또는 "14:00" 형식
 * @param distanceMeters - 누적 거리 (m)
 * @param speedKmh - 평균 속력 (km/h)
 * @returns HHmm 형식 예상 도착 시간
 */
export const calcArriveTime = (
  startTime: string,
  distanceMeters: number,
  speedKmh: number
): string => {
  const normalizedStartTime = startTime.replace(":", "").padStart(4, "0");
  const hoursToAdd = distanceMeters / 1000 / speedKmh;
  const secondsToAdd = hoursToAdd * 3600;
  return addSecondsToHhmm(normalizedStartTime, secondsToAdd);
};
