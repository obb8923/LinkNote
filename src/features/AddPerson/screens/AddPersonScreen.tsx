import React, { useState } from 'react';
import { View, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Background, AppBar ,Property} from '@components/index';
import { usePersonStore } from '@stores/personStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PeopleStackParamList } from '@nav/stack/PeopleStack';
import { PropertyValues, PropertyType } from '@/shared/types/personType';
import { AddPropertyModal } from '@features/AddPerson/components/AddPropertyModal';
import { PlusButton } from '@features/AddPerson/components/PlusButton';
import uuid from 'react-native-uuid';

type AddPersonScreenNavigationProp = NativeStackNavigationProp<PeopleStackParamList,'AddPerson'>

export const AddPersonScreen = () => {
  const navigation = useNavigation<AddPersonScreenNavigationProp>();
  const addPerson = usePersonStore((state) => state.addPerson);
  const people = usePersonStore((state) => state.people);

  const [name, setName] = useState('');
  const [properties, setProperties] = useState<PropertyType[]>([
    {
      id: uuid.v4() as string,
      type: 'tags',
      values: [],
    },
    {
      id: uuid.v4() as string,
      type: 'organizations',
      values: [],
    },
  ]);
  const [memo, setMemo] = useState('');
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  const handleUpdateProperty = (updatedProperty: PropertyType) => {
    setProperties((prev) =>
      prev.map((prop) => (prop.id === updatedProperty.id ? updatedProperty : prop))
    );
  };

  const handleAddProperty = (type: PropertyValues) => {
    const newProperty: PropertyType = {
      id: uuid.v4() as string,
      type,
      values: [],
    };
    setProperties((prev) => [...prev, newProperty]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      // 이름만 필수
      return;
    }

    await addPerson({
      name: name.trim(),
      properties,
      memo: memo.trim(),
    });

    navigation.goBack();
  };

  const peopleNames = people.map((p) => p.name);
  const existingPropertyTypes = properties.map((p) => p.type);

  return (
    <Background isTabBarGap={false}>
      <AppBar 
      title="지인 정보 등록" 
      onLeftPress={() => navigation.goBack()} 
      onRightPress={handleSave} 
      onRightText="저장"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 이름 입력 - 큰 제목 */}
          <View className="mb-8">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="이름"
              className="text-black"
              style={{
                fontFamily: 'NotoSansKR-SemiBold',
                fontSize: 28,
                lineHeight: 28 * 1.4,
              }}
              placeholderTextColor="#999"
            />
          </View>

          {/* Properties 섹션 */}
          <View className="mb-6">
            {properties.map((property) => (
              <Property
                key={property.id}
                property={property}
                onUpdate={handleUpdateProperty}
              />
            ))}
            <View className="h-6 w-full items-start">
            <PlusButton text="Add property" onPress={() => setShowAddPropertyModal(true)} />
            </View>
          </View>
          <View className="border-b border-gray-300"/>
          {/* 메모 섹션 */}
          <View className="my-6">
            <TextInput
              value={memo}
              onChangeText={setMemo}
              placeholder="메모를 입력하세요"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className="rounded-lg px-4 py-3 text-black"
              style={{
                fontFamily: 'NotoSansKR-Medium',
                fontSize: 16,
                minHeight: 120,
              }}
              placeholderTextColor="#999"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AddPropertyModal
        visible={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onSelect={handleAddProperty}
        existingTypes={existingPropertyTypes}
      />
    </Background>
  );
};

