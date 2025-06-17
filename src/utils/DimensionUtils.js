import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const ScreenDimensions = {
  screenWidth: width,
  screenHeight: height,
};

export default ScreenDimensions;
