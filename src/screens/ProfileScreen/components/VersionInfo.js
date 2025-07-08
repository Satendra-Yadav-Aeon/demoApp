import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import { AEON_SOFTWARE, VERSION_LABEL } from '../../../constants/MainConstant';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import ScreenDimensions from '../../../utils/DimensionUtils';

const {screenHeight} = ScreenDimensions
const VersionInfo = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    const loadVersion = async () => {
      const v = await getAsyncItem(ASYNC_CONSTANT.APP_VERSION);
      setVersion(v);
    };

    loadVersion();
  }, []);
  
  return(
    <View style={styles.container}>
        <Text style={styles.companyText}>{AEON_SOFTWARE}</Text>
        <Text style={styles.versionText}>{VERSION_LABEL}{version}</Text>
    </View>
  )
};

export default VersionInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: screenHeight * 0.25,
        padding:10
    },
    companyText: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18
    },
    versionText: {
        width: '100%',
        textAlign: 'center',
        fontSize: 16
    }

})