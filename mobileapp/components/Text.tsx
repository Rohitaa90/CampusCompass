import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export interface TextProps extends RNTextProps {
  weight?: '400' | '600' | '700' | '800';
}

export function Text({ style, weight = '400', ...props }: TextProps) {
  let fontFamily = 'Sora_400Regular';
  
  if (weight === '600') fontFamily = 'Sora_600SemiBold';
  if (weight === '700' || weight === '800') fontFamily = 'Sora_700Bold';

  // If a fontWeight is passed via style, we can map it to the correct fontFamily
  // But usually we just rely on our custom component logic.
  
  return (
    <RNText 
      {...props} 
      style={[{ fontFamily }, style]} 
    />
  );
}
