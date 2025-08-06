import { saveBackgroundLocationData } from "../api/dashboardService";

export const useSaveBackgroundLocation = () => {

  const saveBackgroundLocation = async (payload) => {
    // console.log('===useSaveBackgroundLocation==>>saveBackgroundLocation>>payload>',payload);
    try {
      const response = await saveBackgroundLocationData(payload);
      return response;
    } catch (err) {
      // console.log('===saveBackgroundLocation=>>>error>>>', err);
    }
  };

  return { saveBackgroundLocation };
};
