import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, View } from 'react-native';
import { Text } from '@components/Text';
import { COLORS } from '@constants/COLORS';
import XIcon from '@assets/svgs/X.svg';
interface PlusButtonProps {
  onPress: () => void;
  text?: string;
}

export const PlusButton = ({ onPress, text }: PlusButtonProps) => {
  return (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-center h-full"
      >
            <Text text="+" type="body1" className="text-neutral-600"  style={{ lineHeight: 18}}/>
        {text && <Text text={text} type="body3" className="ml-2 text-neutral-600" />}

      </TouchableOpacity>
  );
};