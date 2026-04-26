import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, BackHandler, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useEffect } from 'react';

const APP_URL = 'https://punto-pizza.vercel.app';

// JavaScript injected into the WebView on every page load.
// This guarantees App Mode is detected BEFORE React hydrates,
// eliminating the race condition entirely.
const INJECTED_JS = `
  (function() {
    // 1. Set localStorage flag so Zustand picks it up immediately
    try {
      var stored = localStorage.getItem('cart-storage');
      if (stored) {
        var parsed = JSON.parse(stored);
        if (parsed && parsed.state) {
          parsed.state.isAppMode = true;
          localStorage.setItem('cart-storage', JSON.stringify(parsed));
        }
      } else {
        localStorage.setItem('cart-storage', JSON.stringify({
          state: { isAppMode: true },
          version: 0
        }));
      }
    } catch(e) {}

    // 2. Set a global flag the web app can read synchronously
    window.__NATIVE_APP_MODE__ = true;

    // 3. Dispatch a custom event so ClientLayout can react to it
    window.dispatchEvent(new CustomEvent('nativeAppMode'));
  })();
  true; // Required by react-native-webview
`;

export default function App() {
  const webviewRef = useRef(null);

  // Handle Android back button to navigate back in WebView
  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBack = () => {
        if (webviewRef.current) {
          webviewRef.current.goBack();
          return true; // Prevent app from closing
        }
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBack);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#FF5722" />
      <WebView
        ref={webviewRef}
        source={{ uri: APP_URL + '?mode=app' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        injectedJavaScriptBeforeContentLoaded={INJECTED_JS}
        // CRITICAL: Do NOT set a custom userAgent.
        // The default React Native WebView UA already contains "Android" and "wv" (WebView),
        // which is exactly what ClientLayout.tsx checks for.
        // Setting a custom one REMOVES those markers and breaks detection.
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        cacheEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error:', nativeEvent);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5722',
  },
  webview: {
    flex: 1,
  },
});
