import { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@components/Text';
import { APPBAR_HEIGHT } from '@constants/NORMAL';
type ScreenHeaderProps = {
  title: string;
  rightContent?: ReactNode;
  containerClassName?: string;
};

export const ScreenHeader = ({
  title,
  rightContent,
  containerClassName,
}: ScreenHeaderProps) => {
  const containerClasses = [
    'flex-row items-center justify-between px-4 bg-background border-b border-gray-300',
    containerClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <View className={containerClasses} style={{ height: APPBAR_HEIGHT }}>
      <Text
        text={title}
        type="title4"
        className="text-center"
        numberOfLines={1}
      />
      <View className="flex-1 flex-row items-center justify-end">
        {rightContent}
      </View>
    </View>
  );
};

