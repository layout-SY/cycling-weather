import { VilageFcstResponse } from "@/model/VFSInterface";

export const filteringVilageFcstResults = (
  vilageFcstResults: VilageFcstResponse[],
  startDate: string,
  apiTime: string
) => {
  const fcstDateResults = vilageFcstResults.filter((result) => {
    return result.fcstDate === startDate && result.fcstTime === apiTime;
  });

  const filteredPOP = fcstDateResults.filter(
    (result) => result.category === "POP"
  );

  const filteredPTY = fcstDateResults.filter(
    (result) => result.category === "PTY"
  );

  const filteredPCP = fcstDateResults.filter(
    (result) => result.category === "PCP"
  );

  const filteredSKY = fcstDateResults.filter(
    (result) => result.category === "SKY"
  );

  const filteredTMP = fcstDateResults.filter(
    (result) => result.category === "TMP"
  );

  return {
    filteredPOP,
    filteredPTY,
    filteredPCP,
    filteredSKY,
    filteredTMP,
    fcstDateResults,
  };
};
