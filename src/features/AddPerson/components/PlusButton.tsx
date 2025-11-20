import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, View } from 'react-native';
import { Text } from '@components/Text';
import { COLORS } from '@constants/COLORS';
interface PlusButtonProps {
  onPress: () => void;
  text?: string;
  icon?: React.ComponentType<any>;
  iconSize?: number;
}

export const PlusButton = ({ onPress, text, icon: Icon, iconSize = 18 }: PlusButtonProps) => {
  return (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-center h-full"
      >
            {Icon ? (
              <Icon width={iconSize} height={iconSize} color={COLORS.NEUTRAL_600} />
            ) : (
              <Text text="+" type="body1" className="text-neutral-600"  style={{ lineHeight: 18}}/>
            )}
        {text && <Text text={text} type="body3" className="ml-2 text-neutral-600" />}

      </TouchableOpacity>
  );
};