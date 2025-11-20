import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/Text';
import XIcon from '@assets/svgs/X.svg';
import { COLORS } from '@constants/COLORS';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'light';
}

export const Chip = ({ label, onRemove, variant = 'default' }: ChipProps) => {
  const bgColor = variant === 'light' ? COLORS.BLUE_CHIP_50 : COLORS.BLUE_CHIP_400;
  const textColor = variant === 'light' ? COLORS.BLUE_CHIP_600 : COLORS.WHITE;
  // const bgColor = COLORS.BLUE_CHIP_50;
  // const textColor = COLORS.BLUE_CHIP_600;
  return (
    <View
      className="flex-row items-center rounded-full"
      style={{ backgroundColor: bgColor ,paddingVertical: 4 ,paddingHorizontal: 8}}
    >
      <Text
        text={label}
        type="body3"
        style={{ color: textColor,fontWeight: '600' }}
      />
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="ml-2"
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <XIcon width={9} height={9} color={textColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

