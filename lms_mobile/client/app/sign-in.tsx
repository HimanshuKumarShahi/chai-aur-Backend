import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOAuth, useAuth } from '@clerk/clerk-expo'; 
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: githubAuth } = useOAuth({ strategy: 'oauth_github' });
  
  const { isSignedIn } = useAuth(); 
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) router.replace('/(tabs)');
  }, [isSignedIn, router]);

  const handleSocialLogin = async (strategy: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const authFlow = strategy === 'google' ? googleAuth : githubAuth;
      
      const { createdSessionId, setActive } = await authFlow({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'client' }),
      });
      
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('OAuth error', err);
      setIsLoading(false); 
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      <View className="items-center mb-10">
        <View className="bg-orange-600 p-4 rounded-3xl mb-4 shadow-lg shadow-orange-500/50">
          <Ionicons name="school" size={60} color="white" />
        </View>
        <Text className="text-4xl font-bold text-black mb-2">AH Academy</Text>
        <Text className="text-gray-500 text-center text-base">
          Master your tech skills today.
        </Text>
      </View>

      {isLoading ? (
        <View className="items-center justify-center p-5">
          <ActivityIndicator size="large" color="#EA580C" />
          <Text className="text-gray-500 mt-4 font-medium text-lg">Authenticating...</Text>
        </View>
      ) : (
        <View className="space-y-4">
          <TouchableOpacity onPress={() => handleSocialLogin('google')} className="flex-row items-center justify-center bg-black p-4 rounded-2xl">
            <Ionicons name="logo-google" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-3">Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSocialLogin('github')} className="flex-row items-center justify-center bg-gray-800 p-4 rounded-2xl">
            <Ionicons name="logo-github" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-3">Continue with GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Email UI coming soon!")} className="flex-row items-center justify-center bg-gray-100 border border-gray-300 p-4 rounded-2xl">
            <Ionicons name="mail" size={24} color="black" />
            <Text className="text-black font-bold text-lg ml-3">Continue with Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}