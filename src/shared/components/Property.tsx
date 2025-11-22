import React from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Text } from '@components/Text';
import { PropertyValues, PropertyType } from '@/shared/types/personType';
import { ChipInput } from '../../features/AddPerson/components/ChipInput';
import { Chip } from '@components/Chip';
import TagIcon from '@assets/svgs/Tag.svg';
import GlobeIcon from '@assets/svgs/Globe.svg';
import PhoneIcon from '@assets/svgs/Phone.svg';
import CalendarIcon from '@assets/svgs/Calendar.svg';
import LikeIcon from '@assets/svgs/Like.svg';
import DisLikeIcon from '@assets/svgs/DisLike.svg';
import FaceIcon from '@assets/svgs/Face.svg';
import { COLORS } from '@constants/COLORS';

interface PropertyProps {
  property: PropertyType;
  onUpdate?: (property: PropertyType) => void;
  readOnly?: boolean;
  onRemoveValue?: (valueIndex: number) => void;
}

export const getPropertyLabel = (type: PropertyValues): string => {
  switch (type) {
    case 'tags':
      return 'tags';
    case 'organizations':
      return '단체';
    case 'phone':
      return '연락처';
    case 'birthday':
      return '생일';
    case 'likes':
      return '좋아하는 것';
    case 'dislikes':
      return '싫어하는 것';
    case 'personality':
      return '성격';
    default:
      return '';
  }
};

export const getPropertyIcon = (type: PropertyValues): React.ComponentType<any> => {
  switch (type) {
    case 'tags':
      return TagIcon;
    case 'organizations':
      return GlobeIcon;
    case 'phone':
      return PhoneIcon;
    case 'birthday':
      return CalendarIcon;
    case 'likes':
      return LikeIcon;
    case 'dislikes':
      return DisLikeIcon;
    case 'personality':
      return FaceIcon;
    default:
      return () => <Text text="•" type="body1" />;
  }
};

export const Property = ({ property, onUpdate, readOnly = false, onRemoveValue }: PropertyProps) => {
  const handleChipChange = (values: string[]) => {
    if (onUpdate) {
      onUpdate({ ...property, values });
    }
  };

  const isChipType = property.type === 'tags' || property.type === 'organizations' || property.type === 'phone' || property.type === 'likes' || property.type === 'dislikes';
  const variant = property.type === 'tags' ? 'light' : 'default';

  const IconComponent = getPropertyIcon(property.type);
  const headerHeight = 18;
  const iconWidth = headerHeight - 3;

  // 읽기 전용 모드
  if (readOnly) {
    const hasValues = property.values.length > 0;
    if (!hasValues) {
      return null;
    }

    return (
      <View className="mb-4">
        <View className="flex-row items-center mb-2" style={{ height: headerHeight }}>
          <View className="mr-1 justify-end items-center" style={{ width: headerHeight, height: headerHeight }}>
            <IconComponent width={iconWidth} height={iconWidth} color={COLORS.NEUTRAL_600} />
          </View>
          <Text text={getPropertyLabel(property.type)} type="body3" className="text-neutral-600 font-semibold" style={{ lineHeight: Platform.OS === 'ios' ? headerHeight : 18 }} />
        </View>
        {isChipType ? (
          <View className="flex-row flex-wrap gap-2">
            {property.values.map((value, index) => (
              <Chip
                key={index}
                label={value}
                onRemove={undefined}
                variant={variant}
              />
            ))}
          </View>
        ) : (
          property.values[0] && (
            <Text text={property.values[0]} type="body1" className="text-black" />
          )
        )}
      </View>
    );
  }

  // 편집 모드
  return (
    <View className="mb-6 border-b border-gray-300">
      {/* Icon & Label & Action Button */}
      <View className="flex-row items-center mb-2" style={{ height: headerHeight }}>
        <View className="mr-1 justify-end items-center" style={{ width: headerHeight, height: headerHeight }}>
          <IconComponent width={iconWidth} height={iconWidth} color={COLORS.NEUTRAL_600} />
        </View>
        <Text text={getPropertyLabel(property.type)} type="body3" className="text-neutral-600 font-semibold" style={{ lineHeight: Platform.OS === 'ios' ? headerHeight : 18 }} />
      </View>

      {isChipType ? (
        <View>
          <ChipInput
            values={property.values}
            onChange={handleChipChange}
            placeholder={`${getPropertyLabel(property.type)} 추가`}
            variant={variant}
          />
        </View>
      ) : (
        <View className="px-4 py-3" style={{ position: 'relative' }}>

          <TextInput
            value={property.values[0] || ''}
            onChangeText={(text) => {
              if (onUpdate) {
                onUpdate({ ...property, values: [text] });
              }
            }}
            selectionColor={COLORS.PRIMARY}
            placeholder={`${getPropertyLabel(property.type)} 입력`}
            className="text-black"
            style={{
              fontFamily: 'NotoSansKR-Medium',
              fontSize: 15,
            }}
            placeholderTextColor="#999"
          />
        </View>
      )}
    </View>
  );
};

