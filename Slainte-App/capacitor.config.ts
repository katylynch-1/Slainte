import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.slainte.app',
  appName: 'Sláinte',
  webDir: 'www',
  plugins: {
    Camera: {
      allowEditing: true,
      saveToGallery: false,
    },
  },
};

export default config;
