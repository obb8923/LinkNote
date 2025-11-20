import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Chip } from '@components/index';

interface ChipInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  variant?: 'default' | 'light';
  onFocus?: () => void;
}

export const ChipInput = ({
  values,
  onChange,
  placeholder = '입력 후 엔터',
  variant = 'default',
  onFocus,
}: ChipInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddChip = () => {
    if (!inputValue.trim()) return;

    const newValues = [...values, inputValue.trim()];
    onChange(newValues);
    setInputValue('');
  };

  const handleRemoveChip = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <View className="px-4 py-3" style={{ position: 'relative' }}>
      <View className="flex-row flex-wrap items-center">
        {values.map((value, index) => (
          <Chip
            key={index}
            label={value}
            onRemove={() => handleRemoveChip(index)}
            variant={variant}
          />
        ))}
        <View style={{ flex: 1 }}>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            onSubmitEditing={handleAddChip}
            onFocus={onFocus}
            returnKeyType="done"
            className="text-black"
            style={{
              fontFamily: 'NotoSansKR-Medium',
              fontSize: 15,
            }}
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>
  );
};

