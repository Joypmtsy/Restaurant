import { Platform, StatusBar } from 'react-native';

export const colors = {
  
};

export const topInset = Platform.select({
  ios: 56,
  android: (StatusBar.currentHeight ?? 24) + 10,
  default: 24,
});