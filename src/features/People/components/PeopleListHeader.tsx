import { View, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@assets/svgs/Search.svg';
import { Text } from '@components/Text';
import { COLORS } from '@/shared/constants/COLORS';

type PeopleListHeaderProps = {
  count: number;
  searchQuery: string;
  isSearchVisible: boolean;
  onToggleSearch: () => void;
  onChangeSearch: (text: string) => void;
};

export const PeopleListHeader = ({
  count,
  searchQuery,
  isSearchVisible,
  onToggleSearch,
  onChangeSearch,
}: PeopleListHeaderProps) => {
  const { t } = useTranslation();
  return (
    <View className="px-8 pb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center justify-start gap-2">
          <Text text={t('people.listLabel')} type="title4" className="text-black" />
          <Text text={`${count}`} type="body1" className="text-gray-500 font-semibold" />
        </View>
        <TouchableOpacity
          onPress={onToggleSearch}
          className={`p-2 rounded-full ${isSearchVisible ? 'bg-neutral-100' : ''}`}
          activeOpacity={0.8}
        >
          <SearchIcon width={18} height={18} color={isSearchVisible ? COLORS.PRIMARY : COLORS.BLACK} />
        </TouchableOpacity>
      </View>
      {isSearchVisible && (
        <TextInput
          value={searchQuery}
          onChangeText={onChangeSearch}
          placeholder={t('people.searchPlaceholder')}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          className="w-full px-4 py-3 mt-3 rounded-2xl bg-white border border-gray-200 text-black"
          style={{
            fontFamily: 'NotoSansKR-Medium',
            fontSize: 15,
          }}
        />
      )}
    </View>
  );
};

