/**
 * TCX (Training Center XML) 파일 구조 타입 정의
 * @see src/app/utils/1.xml
 * @see fast-xml-parser attributeNamePrefix: "@_" 사용 시 속성은 @_key 형태로 접근
 */

/** 위도/경도 좌표 */
export interface TcxPosition {
  LatitudeDegrees: string;
  LongitudeDegrees: string;
}

/** 속성 포함 (fast-xml-parser @_ prefix) */
export interface TcxPointAttributes {
  sectionIndex: string;
  pointIndex: string;
}

/** Trackpoint 확장 속성 */
export interface TcxTrackpointAttributes extends TcxPointAttributes {
  originalElevation?: string;
  isOriginalElevationFromOSM?: string;
}

/** 트랙 상의 각 GPS 포인트 */
export interface TcxTrackpoint {
  "@_sectionIndex"?: string;
  "@_pointIndex"?: string;
  "@_originalElevation"?: string;
  "@_isOriginalElevationFromOSM"?: string;
  Time: string;
  Position: TcxPosition;
  AltitudeMeters: string;
  DistanceMeters: string;
}

/** 트랙 포인트 배열 */
export interface TcxTrack {
  Trackpoint: TcxTrackpoint | TcxTrackpoint[];
}

/** 코스 웨이포인트 (S/F, CP, 식사 지점 등) */
export interface TcxCoursePoint {
  "@_sectionIndex"?: string;
  "@_pointIndex"?: string;
  Name: string;
  Time: string;
  Position: TcxPosition;
  AltitudeMeters: string;
  PointType: string; // "Generic" | "Food" | "Danger" | ...
  Notes?: string;
}

/** Lap 요약 정보 */
export interface TcxLap {
  TotalTimeSeconds: string;
  DistanceMeters: string;
  BeginPosition: TcxPosition;
  EndPosition: TcxPosition;
  Intensity: string; // "Active" | ...
}

/** 단일 코스 (트랙 + 웨이포인트) */
export interface TcxCourse {
  Name: string;
  Lap: TcxLap;
  Track: TcxTrack;
  CoursePoint: TcxCoursePoint | TcxCoursePoint[];
}

/** TrainingCenterDatabase 루트 */
export interface TcxTrainingCenterDatabase {
  Folders?: unknown;
  Courses?: {
    Course: TcxCourse | TcxCourse[];
  };
}

/**
 * 파싱 결과 루트 (fast-xml-parser 출력)
 * XML 루트 요소명이 키가 됨
 */
export interface TcxParsedRoot {
  TrainingCenterDatabase: TcxTrainingCenterDatabase;
}
