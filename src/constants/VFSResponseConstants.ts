export const VFS_ERROR_CODE_META = {
  '00': {
    message: 'NORMAL_SERVICE',
    description: '정상',
  },
  '01': {
    message: 'APPLICATION_ERROR',
    description: '어플리케이션 에러',
  },
  '02': {
    message: 'DB_ERROR',
    description: '데이터베이스 에러',
  },
  '03': {
    message: 'NODATA_ERROR',
    description: '데이터없음 에러',
  },
  '04': {
    message: 'HTTP_ERROR',
    description: 'HTTP 에러',
  },
  '05': {
    message: 'SERVICETIME_OUT',
    description: '서비스 연결실패 에러',
  },
  '10': {
    message: 'INVALID_REQUEST_PARAMETER_ERROR',
    description: '잘못된 요청 파라메터 에러',
  },
  '11': {
    message: 'NO_MANDATORY_REQUEST_PARAMETERS_ERROR',
    description: '필수요청 파라메터가 없음',
  },
  '12': {
    message: 'NO_OPENAPI_SERVICE_ERROR',
    description: '해당 오픈API서비스가 없거나 폐기됨',
  },
  '20': {
    message: 'SERVICE_ACCESS_DENIED_ERROR',
    description: '서비스 접근거부',
  },
  '21': {
    message: 'TEMPORARILY_DISABLE_THE_SERVICEKEY_ERROR',
    description: '일시적으로 사용할 수 없는 서비스키',
  },
  '22': {
    message: 'LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR',
    description: '서비스 요청제한횟수 초과에러',
  },
  '30': {
    message: 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR',
    description: '등록되지 않은 서비스키',
  },
  '31': {
    message: 'DEADLINE_HAS_EXPIRED_ERROR',
    description: '기한만료된 서비스키',
  },
  '32': {
    message: 'UNREGISTERED_IP_ERROR',
    description: '등록되지 않은 IP',
  },
  '33': {
    message: 'UNSIGNED_CALL_ERROR',
    description: '서명되지 않은 호출',
  },
  '99': {
    message: 'UNKNOWN_ERROR',
    description: '기타에러',
  },
} as const;
