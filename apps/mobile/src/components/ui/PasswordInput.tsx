import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { TextInput, TextInputProps } from './TextInput';
import { colors, spacing } from '../../theme';

export const PasswordInput: React.FC<TextInputProps> = (props) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        secureTextEntry={isSecure}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => setIsSecure(!isSecure)}
      >
        {isSecure ? (
          <EyeOff size={20} color={colors.textMuted} />
        ) : (
          <Eye size={20} color={colors.textMuted} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    right: spacing.md,
    top: 36, // Approximate to center vertically relative to the input field
    zIndex: 1,
  },
});
