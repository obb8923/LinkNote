import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@components/Text';
import { Chip } from '@components/Chip';

export interface SearchableListItem {
  id: string;
  label: string;
}

interface SearchableListProps {
  items: SearchableListItem[];
  onSelect: (item: SearchableListItem | null) => void;
  placeholder?: string;
  selectedItemId?: string | null;
  maxHeight?: number;
}

export const SearchableList = ({
  items,
  onSelect,
  placeholder = '검색...',
  selectedItemId,
  maxHeight = 200,
}: SearchableListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const selectedItem = items.find((item) => item.id === selectedItemId);
  const displayValue = isFocused ? searchQuery : selectedItem?.label || '';

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: SearchableListItem) => {
    onSelect(item);
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleClear = () => {
    onSelect(null);
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setSearchQuery(selectedItem?.label || '');
  };

  const handleBlur = () => {
    // 약간의 지연을 두어 onPress가 먼저 실행되도록 함
    setTimeout(() => {
      setIsFocused(false);
      setSearchQuery('');
    }, 200);
  };

  // 선택된 값이 있으면 Chip 표시, 없으면 TextInput 표시
  if (selectedItem && !isFocused) {
    return (
      <View className="relative items-center justify-center">
        <TouchableOpacity onPress={handleClear} className="items-center justify-center flex-row rounded-full bg-blue-chip-400 px-4 py-1 ">
          <Text text={selectedItem.label} type="body2" className="text-white mr-2 font-semibold" />
          <Text text="X" type="body3" className="text-white font-semibold" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="relative">
      <TextInput
        value={displayValue}
        onChangeText={setSearchQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
        style={{
          fontFamily: 'NotoSansKR-Medium',
          fontSize: 15,
        }}
        placeholderTextColor="#999"
      />
      {isFocused && filteredItems.length > 0 && (
        <View
          className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-lg bg-white z-50"
          style={{ maxHeight }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelect(item)}
                className={`px-4 py-3 border-b border-gray-200 ${
                  selectedItemId === item.id ? 'bg-gray-100' : ''
                }`}
              >
                <Text text={item.label} type="body1" className="text-black" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

