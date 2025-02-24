// styles/components.ts
import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const tabNavigationStyles = {
  tabBarActiveTintColor: colors.accent,
  tabBarInactiveTintColor: colors.mediumGray,
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    height: 60,
  },
};

export const componentStyles = StyleSheet.create({
  // Component styles for the main app
  tabBarLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  tabBarIcon: {
    marginTop: 4,
  }
});