declare module '@react-navigation/bottom-tabs' {
  import React from 'react';

  export function createBottomTabNavigator<T = any>(): {
    Navigator: React.ComponentType<any>;
    Screen: React.ComponentType<any>;
  };
}
