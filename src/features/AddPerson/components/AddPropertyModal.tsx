import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { Text } from '@components/Text';
import { PropertyValues } from '@/shared/types/personType';

interface AddPropertyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: PropertyValues) => void;
  existingTypes: PropertyValues[];
}

const AVAILABLE_PROPERTIES: { type: PropertyValues; label: string }[] = [
  { type: 'phone', label: '연락처' },
  { type: 'birthday', label: '생일' },
  { type: 'likes', label: '좋아하는 것' },
  { type: 'dislikes', label: '싫어하는 것' },
  { type: 'personality', label: '성격' },
];

const AnimatedContent = Animated.createAnimatedComponent(TouchableOpacity);

export const AddPropertyModal = ({
  visible,
  onClose,
  onSelect,
  existingTypes,
}: AddPropertyModalProps) => {
  const availableProperties = AVAILABLE_PROPERTIES.filter(
    (prop) => !existingTypes.includes(prop.type)
  );

  const [isMounted, setIsMounted] = useState(visible);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsMounted(false);
        }
      });
    }
  }, [slideAnim, visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50 justify-end"
      >
        <AnimatedContent
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl p-4 max-h-[80%]"
          style={{ transform: [{ translateY }] }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text text="Property 추가" type="title4" className="text-black" />
            <TouchableOpacity onPress={onClose}>
              <Text text="닫기" type="body1" className="text-primary" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={availableProperties}
            keyExtractor={(item) => item.type}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item.type);
                  onClose();
                }}
                className="py-3 border-b border-gray-200"
              >
                <Text text={item.label} type="body1" className="text-black" />
              </TouchableOpacity>
            )}
          />
        </AnimatedContent>
      </TouchableOpacity>
    </Modal>
  );
};

