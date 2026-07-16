import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  color: string;
  initials: string;
}

interface FileItem {
  id: string;
  name: string;
  category: string;
  uri: string;
  date: string;
}

const CONTACTS_KEY = '@vaultease_contacts_db';
const DB_PATH = `${FileSystem.documentDirectory}vaultease_db.json`;

const AVATAR_COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function FamilyScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [localFiles, setLocalFiles] = useState<FileItem[]>([]);
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const stored = await AsyncStorage.getItem(CONTACTS_KEY);
      if (stored) {
        setContacts(JSON.parse(stored));
      } else {
        // Initial Seed Contacts
        const seedContacts: Contact[] = [
          {
            id: 'contact-1',
            name: 'David (Son)',
            relation: 'Son & Primary Helper',
            phone: '555-0192',
            email: 'david.family@email.com',
            color: '#3b82f6',
            initials: 'DS',
          },
          {
            id: 'contact-2',
            name: 'Sarah (Daughter)',
            relation: 'Daughter',
            phone: '555-0143',
            email: 'sarah.family@email.com',
            color: '#ec4899',
            initials: 'SF',
          },
          {
            id: 'contact-3',
            name: 'Leo (Grandson)',
            relation: 'Grandson',
            phone: '555-0188',
            email: 'leo.grandson@email.com',
            color: '#10b981',
            initials: 'LG',
          },
        ];
        await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(seedContacts));
        setContacts(seedContacts);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load contacts database.');
    }
  };

  const saveContacts = async (updated: Contact[]) => {
    try {
      await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(updated));
      setContacts(updated);
    } catch (err) {
      Alert.alert('Error', 'Failed to save contact.');
    }
  };

  const handleCall = (contact: Contact) => {
    const telUri = `tel:${contact.phone}`;
    Linking.canOpenURL(telUri)
      .then((supported) => {
        if (supported) {
          Linking.openURL(telUri);
        } else {
          Alert.alert('Calling Unavailable', `Dialer is not supported on this device. Phone number: ${contact.phone}`);
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to open dialer application.');
      });
  };

  // Share file workflow
  const handleOpenShareSheet = async (contact: Contact) => {
    setSelectedContact(contact);
    try {
      const dbInfo = await FileSystem.getInfoAsync(DB_PATH);
      if (dbInfo.exists) {
        const dbContent = await FileSystem.readAsStringAsync(DB_PATH);
        setLocalFiles(JSON.parse(dbContent));
      } else {
        setLocalFiles([]);
      }
      setIsShareSheetOpen(true);
    } catch (error) {
      setLocalFiles([]);
      setIsShareSheetOpen(true);
    }
  };

  const handleSendFileNatively = async (file: FileItem) => {
    setIsShareSheetOpen(false);
    if (!selectedContact) return;

    try {
      if (file.uri === 'placeholder' || !(await FileSystem.getInfoAsync(file.uri)).exists) {
        Alert.alert(
          'Mock File Sent',
          `Successfully simulated sending "${file.name}" to ${selectedContact.name}.`,
          [{ text: 'OK' }]
        );
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this platform.');
        return;
      }

      await Sharing.shareAsync(file.uri, {
        dialogTitle: `Send ${file.name} to ${selectedContact.name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not open native sharing options.');
    }
  };

  const handleSaveContact = async () => {
    if (!name.trim() || !relation.trim() || !phone.trim()) {
      Alert.alert('Missing Fields', 'Please fill in Name, Relationship, and Phone Number.');
      return;
    }

    const initials = name
      .trim()
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: name.trim(),
      relation: relation.trim(),
      phone: phone.trim(),
      email: email.trim(),
      color: randomColor,
      initials: initials || 'C',
    };

    const updated = [newContact, ...contacts];
    await saveContacts(updated);
    
    // Reset Form
    setName('');
    setRelation('');
    setPhone('');
    setEmail('');
    setIsAddOpen(false);
    
    Alert.alert('Success!', `"${newContact.name}" added to Trusted Contacts.`);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} className="flex-1">
        
        {/* Intro Banner */}
        <View className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 mb-8">
          <Text className="text-xl font-bold text-emerald-900">
            🤝 Trusted Contacts
          </Text>
          <Text className="text-lg font-semibold text-emerald-800 mt-1 leading-6">
            These are your family and friends. You can call them or share documents with them with just one tap.
          </Text>
        </View>

        {/* Add Contact Button */}
        <TouchableOpacity
          onPress={() => setIsAddOpen(true)}
          className="bg-blue-600 border-2 border-blue-700 h-16 rounded-3xl flex-row items-center justify-center mb-8 active:scale-95 active:bg-blue-700"
        >
          <Ionicons name="person-add" size={28} color="white" className="mr-2" />
          <Text className="text-xl font-bold text-white">Add Family or Friend</Text>
        </TouchableOpacity>

        {/* Contact List */}
        <View className="gap-y-6">
          {contacts.map((contact) => (
            <View
              key={contact.id}
              className="bg-white border-3 border-slate-200 rounded-3xl p-5"
            >
              {/* Profile Header */}
              <View className="flex-row items-center mb-5">
                <View 
                  className="h-16 w-16 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: contact.color }}
                >
                  <Text className="text-2xl font-black text-white">{contact.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-black text-slate-900 leading-7">{contact.name}</Text>
                  <Text className="text-lg font-bold text-slate-500 mt-1">{contact.relation}</Text>
                </View>
              </View>

              {/* Contact Actions */}
              <View className="flex-row gap-4">
                {/* Call Button */}
                <TouchableOpacity
                  onPress={() => handleCall(contact)}
                  className="flex-1 bg-green-600 border-2 border-green-700 h-16 rounded-2xl flex-row items-center justify-center active:scale-95 active:bg-green-700"
                >
                  <Ionicons name="call" size={26} color="white" className="mr-2" />
                  <Text className="text-xl font-extrabold text-white">Call</Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity
                  onPress={() => handleOpenShareSheet(contact)}
                  className="flex-1 bg-blue-600 border-2 border-blue-700 h-16 rounded-2xl flex-row items-center justify-center active:scale-95 active:bg-blue-700"
                >
                  <Ionicons name="share-social" size={26} color="white" className="mr-2" />
                  <Text className="text-xl font-extrabold text-white">Send File</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* ➕ Add Contact Modal */}
      <Modal visible={isAddOpen} animationType="slide">
        <SafeAreaView className="flex-1 bg-slate-50 p-6 justify-between">
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b-2 border-slate-200 pb-4 mb-6">
              <TouchableOpacity
                onPress={() => setIsAddOpen(false)}
                className="flex-row items-center bg-slate-200 px-5 py-3 rounded-2xl active:scale-95"
              >
                <Ionicons name="chevron-back" size={24} color="#1e293b" />
                <Text className="text-lg font-bold text-slate-800 ml-1">Back</Text>
              </TouchableOpacity>
              <Text className="text-xl font-extrabold text-slate-900">Add New Contact</Text>
              <View className="w-16" />
            </View>

            {/* Form */}
            <ScrollView className="flex-1">
              <Text className="text-lg font-bold text-slate-900 mb-2">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="bg-white border-2 border-slate-300 h-14 rounded-2xl px-4 text-lg font-semibold mb-4 focus:border-blue-600"
                placeholder="e.g. David Smith"
              />

              <Text className="text-lg font-bold text-slate-900 mb-2">Relationship</Text>
              <TextInput
                value={relation}
                onChangeText={setRelation}
                className="bg-white border-2 border-slate-300 h-14 rounded-2xl px-4 text-lg font-semibold mb-4 focus:border-blue-600"
                placeholder="e.g. Son, Sister, Caretaker"
              />

              <Text className="text-lg font-bold text-slate-900 mb-2">Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="bg-white border-2 border-slate-300 h-14 rounded-2xl px-4 text-lg font-semibold mb-4 focus:border-blue-600"
                placeholder="e.g. 555-0199"
              />

              <Text className="text-lg font-bold text-slate-900 mb-2">Email (Optional)</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                className="bg-white border-2 border-slate-300 h-14 rounded-2xl px-4 text-lg font-semibold mb-4 focus:border-blue-600"
                placeholder="e.g. helper@email.com"
              />
            </ScrollView>
          </View>

          {/* Action Trigger */}
          <TouchableOpacity
            onPress={handleSaveContact}
            className="bg-emerald-600 border-2 border-emerald-700 h-16 rounded-3xl flex-row items-center justify-center active:scale-95"
          >
            <Ionicons name="checkmark-circle" size={28} color="white" className="mr-2" />
            <Text className="text-xl font-extrabold text-white">Save Trusted Contact</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* 📤 Send File Selector Modal */}
      <Modal visible={isShareSheetOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-slate-50 rounded-t-[40px] p-6 max-h-[75%]">
            
            {/* Header */}
            <View className="flex-row justify-between items-center border-b border-slate-200 pb-4 mb-4">
              <Text className="text-xl font-extrabold text-slate-900">
                Select File to Send to {selectedContact?.name.split(' ')[0]}
              </Text>
              <TouchableOpacity 
                onPress={() => setIsShareSheetOpen(false)}
                className="bg-slate-200 p-2 rounded-full"
              >
                <Ionicons name="close" size={24} color="#1e293b" />
              </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView className="mb-4">
              {localFiles.length === 0 ? (
                <View className="items-center py-10">
                  <Ionicons name="folder-open" size={60} color="#94a3b8" />
                  <Text className="text-lg font-bold text-slate-500 mt-2 text-center leading-6">
                    You don't have any files saved yet.{"\n"}Go back to Home and tap "Scan Paper".
                  </Text>
                </View>
              ) : (
                <View className="gap-y-3">
                  {localFiles.map((file) => (
                    <TouchableOpacity
                      key={file.id}
                      onPress={() => handleSendFileNatively(file)}
                      className="bg-white border-2 border-slate-200 rounded-3xl p-4 flex-row items-center justify-between active:bg-blue-50 active:border-blue-300"
                    >
                      <View className="flex-1 pr-2">
                        <Text className="text-lg font-bold text-slate-900" numberOfLines={1}>{file.name}</Text>
                        <Text className="text-base font-semibold text-slate-500 mt-1">{file.category}</Text>
                      </View>
                      <Ionicons name="send" size={24} color="#2563eb" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
