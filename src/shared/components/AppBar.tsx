import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from '@components/Text';
import ChevronLeft from "@assets/svgs/ChevronLeft.svg";
import XIcon from "@assets/svgs/X.svg";
import { COLORS } from '@constants/COLORS';
import { APPBAR_HEIGHT } from '@constants/NORMAL';
export type AppBarProps = {
  title?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onRightText?: string;
  className?: string;
  style?: ViewStyle | ViewStyle[];
};

export const AppBar = ({
  title,
  onLeftPress,
  onRightPress,
  onRightText,
  className = '',
  style,
}: AppBarProps) => {
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 bg-background border-b border-gray-300 ${className}`}
      style={{ height: APPBAR_HEIGHT, ...style }}
    >
      {/* Left Section */}
      <View className="flex-1 flex-row items-center justify-start">
        {onLeftPress && (
          <TouchableOpacity
            onPress={onLeftPress}
            className="w-1/2 h-14 justify-center items-start pl-2"
            activeOpacity={0.7}
            disabled={!onLeftPress}
          >
            <ChevronLeft width={10} height={19} color={COLORS.BLACK} />
          </TouchableOpacity>
        )}
      
      </View>
      {/* Title Section */}
      <View className="flex-1 flex-row items-center justify-center">
      {title && (
          <Text
            text={title}
            type="body1"
            className="text-black flex-1 text-center"
            numberOfLines={1}
          />
        )}
      </View>

      {/* Right Section */}
      <View className="flex-1 flex-row items-center justify-end">
      {onRightPress && (
        <TouchableOpacity
          onPress={onRightPress}
          className="w-full h-14 justify-center items-end pr-2"
          activeOpacity={0.7}
          disabled={!onRightPress}
        >
          {onRightText ? <Text text={onRightText} type="body1" className="text-primary" /> : <XIcon width={14} height={14} color={COLORS.BLACK} />}
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
};
