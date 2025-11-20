import { useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Background, Button, ScreenHeader, TabBar, Text } from '@components/index';
import { usePersonStore } from '@stores/personStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PeopleStackParamList } from '@nav/stack/PeopleStack';
import { FlashList } from '@shopify/flash-list';
import { PersonType} from '@/shared/types/personType';
import { Chip } from '@components/Chip';
import { PeopleListHeader } from '@/features/People/components/PeopleListHeader';
import { COLORS } from '@constants/COLORS';
import AddPersonIcon from '@assets/svgs/AddPerson.svg';
import AddRelationIcon from '@assets/svgs/AddRelation.svg';

type PeopleScreenNavigationProp = NativeStackNavigationProp<PeopleStackParamList,'People'>;

export const PeopleScreen = () => {
  const navigation = useNavigation<PeopleScreenNavigationProp>();
  const people = usePersonStore((state) => state.people);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { t } = useTranslation();

  const filteredPeople = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return people;
    }

    return people.filter((person) => {
      const matchesName = person.name.toLowerCase().includes(query);
      const matchesProperties = person.properties?.some((property) =>
        property.values?.some((value) =>
          value.toLowerCase().includes(query)
        )
      );

      return matchesName || matchesProperties;
    });
  }, [people, searchQuery]);

  const handleAddPerson = () => {
    navigation.navigate('AddPerson');
  };

  const handleAddRelation = () => {
    navigation.navigate('AddRelation');
  };

  const handlePersonPress = (personId: string) => {
    console.log('Navigating to PersionDetail with personId:', personId);
    navigation.navigate('PersionDetail', { personId });
  };

  const renderPersonItem = ({ item }: { item: PersonType }) => {
    const tagsProperty = item.properties?.find((p) => p.type === 'tags');
    const organizationsProperty = item.properties?.find((p) => p.type === 'organizations');
    
    const tags = tagsProperty?.values || [];
    const organizations = organizationsProperty?.values || [];
    const totalCount = tags.length + organizations.length;
    
    // 태그에서 최대 4개까지 가져오고, 부족하면 단체에서 가져와서 총 4개 채움
    let displayTags: string[];
    let displayOrganizations: string[];
    
    if (totalCount >= 4) {
      // 태그를 최대 4개까지 가져옴
      const tagCount = Math.min(tags.length, 4);
      displayTags = tags.slice(0, tagCount);
      
      // 태그가 4개 미만이면 단체에서 나머지를 가져옴
      const remainingCount = 4 - tagCount;
      displayOrganizations = organizations.slice(0, remainingCount);
    } else {
      // 합이 4개 미만이면 있는 만큼 표시
      displayTags = tags;
      displayOrganizations = organizations;
    }
    
    return (
      <TouchableOpacity
        className="px-8 py-2 mb-3 flex-row items-center justify-start"
        activeOpacity={0.7}
        onPress={() => {
          console.log('TouchableOpacity pressed for:', item.id);
          handlePersonPress(item.id);
        }}
      >
        <Text text={item.name} type="title4" className="text-black mr-2 flex-1" numberOfLines={1} style={{ flexShrink: 1 }} />
        <View className="flex-row items-center gap-1" style={{ flexShrink: 0 }}>
          {displayTags.map((tag, index) => (
            <Chip key={`tag-${tagsProperty?.id}-${index}`} label={tag} variant="light" />
          ))}
          {displayOrganizations.map((org, index) => (
            <Chip key={`org-${organizationsProperty?.id}-${index}`} label={org} variant="default" />
          ))}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <Background isTabBarGap={true}>
      <View className="flex-1">
        <ScreenHeader
          title={t('people.title')}
          rightContent={
            <View className="flex-row items-center justify-end gap-4">
              <TouchableOpacity onPress={handleAddPerson} className="flex-row items-center justify-center gap-1">
                <AddPersonIcon width={18} height={18} color={COLORS.BLACK} />
                <Text text={t('people.actions.addPersonShort')} type="body2" numberOfLines={1} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddRelation} className="flex-row items-center justify-center gap-1">
                <AddRelationIcon width={18} height={18} color={COLORS.BLACK} />
                <Text text={t('people.actions.addRelation')} type="body2" numberOfLines={1} />
              </TouchableOpacity>
            </View>
          }
        />
         {(people.length === 0) ?
     (
        <View className="flex-1 items-center justify-center">
          <View className="items-center justify-center mb-16">
          <Text text={t('people.empty.title')} type="title4" className="text-gray-600" />
          <Text text={t('people.empty.line1')} type="title4" className="text-gray-600" />
          <Text text={t('people.empty.line2')} type="title4" className="text-gray-600" />
          </View>
          <Button text={t('people.actions.addPerson')} onPress={handleAddPerson} />
        </View>
    ) : (
      <FlashList
          data={filteredPeople}
          renderItem={renderPersonItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <PeopleListHeader
              count={filteredPeople.length}
              searchQuery={searchQuery}
              isSearchVisible={isSearchVisible}
              onToggleSearch={() => setIsSearchVisible((prev) => !prev)}
              onChangeSearch={setSearchQuery}
            />
          }
          ListEmptyComponent={
            <View className="px-8 py-10">
              <Text text={t('people.empty.searchEmpty')} type="body1" className="text-gray-500" />
            </View>
          }
        />
    )
  }
        
      </View>
      <TabBar />
    </Background>
  );
};
