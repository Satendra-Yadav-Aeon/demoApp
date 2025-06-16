import { StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import Routes from './src/navigations/Routes'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Routes/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})

export default App