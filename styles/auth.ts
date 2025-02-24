// styles/auth.ts
import { StyleSheet } from 'react-native';
import { colors, spacing, typography, layout } from './theme';

export const authNavigationStyles = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.authBackground },
  animation: 'slide_from_right'
};

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authBackground
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl
  },
  logo: {
    width: 200,
    height: 60,
  },
  logoText: {
    fontSize: typography.logo.primary.fontSize,
    fontWeight: typography.logo.primary.fontWeight,
    color: colors.authText,
    marginBottom: -5
  },
  schoolText: {
    fontSize: typography.logo.secondary.fontSize,
    color: colors.accent,
    letterSpacing: typography.logo.secondary.letterSpacing
  },
  screenTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: typography.heading.fontWeight,
    color: colors.authText,
    alignSelf: 'center',
    marginBottom: spacing.xl
  },
  formContainer: {
    width: '100%'
  },
  input: {
    height: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: layout.borderRadius,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.transparent,
    color: colors.authText
  },
  primaryButton: {
    backgroundColor: colors.accent,
    height: layout.buttonHeight,
    borderRadius: layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.m
  },
  primaryButtonText: {
    color: colors.authText,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight
  },
  secondaryButton: {
    height: layout.buttonHeight,
    borderRadius: layout.borderRadius,
    borderWidth: 1,
    borderColor: colors.buttonBorder,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: colors.authText,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight
  }
});