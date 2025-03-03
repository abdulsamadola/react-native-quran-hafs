declare module '@vitrion/react-native-load-fonts' {
  export const loadFont: (
    targetFont: string,
    base64: string,
    fontExtension: string,
  ) => Promise;
}
