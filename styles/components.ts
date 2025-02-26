// styles/components.ts
import { StyleSheet, Platform } from 'react-native';
import { colors } from './theme';

export const tabNavigationStyles = {
  tabBarActiveTintColor: colors.accent,
  tabBarInactiveTintColor: colors.mediumGray,
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    height: 80,
    paddingTop: 5,
    paddingBottom: Platform.OS === 'ios' ? 30 : 30, // More padding at the bottom on iOS
    paddingHorizontal: 5,
    position: 'absolute' as 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 20, // Move it up from the bottom
    left: 0,
    right: 0,
  },
  tabBarLabelStyle: {
    fontSize: 10,
    marginBottom: 5,
  },
  tabBarIconStyle: {
    marginTop: 5,
  }
};

export const componentStyles = StyleSheet.create({
  // Component styles for the main app
  tabBarLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  tabBarIcon: {
    marginTop: 0,
  }
});