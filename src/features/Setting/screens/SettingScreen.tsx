import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import { Background, ScreenHeader, TabBar, Text } from '@components/index';
import {
  SupportedLanguage,
  changeLanguage,
  loadSavedLanguage,
  supportedLanguages,
} from '@i18n/index';

const normalizeLanguage = (language?: string | null): SupportedLanguage => {
  if (language && supportedLanguages.includes(language as SupportedLanguage)) {
    return language as SupportedLanguage;
  }
  return 'en';
};

const getDeviceLanguage = (): SupportedLanguage => {
  const locales = RNLocalize.getLocales();
  const deviceLanguage = locales[0]?.languageCode;
  return normalizeLanguage(deviceLanguage);
};

export const SettingScreen = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() =>
    normalizeLanguage(i18n.language),
  );
  const [isLoading, setIsLoading] = useState(true);
  const deviceLanguage = useMemo(() => getDeviceLanguage(), []);

  useEffect(() => {
    let isMounted = true;
    const syncLanguage = async () => {
      const savedLanguage = await loadSavedLanguage();
      if (!isMounted) return;
      const normalized = normalizeLanguage(savedLanguage);
      setSelectedLanguage(normalized);
      setIsLoading(false);
    };
    syncLanguage();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectLanguage = async (code: SupportedLanguage) => {
    if (code === selectedLanguage || isLoading) return;
    await changeLanguage(code);
    setSelectedLanguage(code);
  };

  return (
    <Background isTabBarGap={true}>
      <View className="flex-1">
        <ScreenHeader title={t('setting.title')} />
        <View className="flex-1 px-6 py-6">
          <View className="mb-6">
            <Text text={t('setting.language.sectionTitle')} type="title4" className="text-black" />
            <Text text={t('setting.language.description')} type="body2" className="text-neutral-500 mt-2" />
          </View>

          <View className="gap-3">
            {supportedLanguages.map((languageCode) => {
              const labelKey = `common.languages.${languageCode}`;
              const isSelected = languageCode === selectedLanguage;
              return (
                <Pressable
                  key={languageCode}
                  className={`flex-row items-center justify-between rounded-2xl border px-4 py-4 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => handleSelectLanguage(languageCode)}
                  disabled={isLoading}
                >
                  <Text text={t(labelKey)} type="body1" className="text-black" />
                  <View
                    className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isSelected ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    {isSelected ? <View className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
      <TabBar />
    </Background>
  );
};