import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.37aca488709d4bd189b196886a4cf2eb',
  appName: 'Wakezilla',
  webDir: 'dist',
  server: {
    url: "https://37aca488-709d-4bd1-89b1-96886a4cf2eb.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#45B7D1",
      showSpinner: true,
      spinnerColor: "#ffffff"
    }
  }
};

export default config;