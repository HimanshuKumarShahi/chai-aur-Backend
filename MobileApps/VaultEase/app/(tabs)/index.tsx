import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { CameraView, useCameraPermissions } from 'expo-camera';
import SecureVault from '../../components/SecureVault';

interface FileItem {
  id: string;
  name: string;
  category: string;
  uri: string;
  date: string;
}

const DB_PATH = `${FileSystem.documentDirectory}vaultease_db.json`;
const FILES_DIR = `${FileSystem.documentDirectory}files/`;

export default function HomeDashboard() {
  const [permission, requestPermission] = useCameraPermissions();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  
  // Modals and Locks
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // File Scanning States
  const [scannedPhoto, setScannedPhoto] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState('Medical Records');
  const [isSaving, setIsSaving] = useState(false);
  
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    initializeStorage();
  }, []);

  const initializeStorage = async () => {
    try {
      // Ensure file directories exist
      const dirInfo = await FileSystem.getInfoAsync(FILES_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(FILES_DIR, { intermediates: true });
      }

      // Check if DB file exists
      const dbInfo = await FileSystem.getInfoAsync(DB_PATH);
      if (!dbInfo.exists) {
        // Initial Seed Data for professional/practical demo
        const seedData: FileItem[] = [
          {
            id: 'seed-1',
            name: 'Blood Test Results - May.jpg',
            category: 'Medical Records',
            uri: 'placeholder',
            date: new Date(Date.now() - 1000 * 60 * 10).toLocaleString(),
          },
          {
            id: 'seed-2',
            name: 'Electricity Invoice - June.jpg',
            category: 'Bank Documents',
            uri: 'placeholder',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(),
          },
          {
            id: 'seed-3',
            name: 'Family Picnic Portrait.jpg',
            category: 'Family Photos',
            uri: 'placeholder',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString(),
          }
        ];
        await FileSystem.writeAsStringAsync(DB_PATH, JSON.stringify(seedData));
        setFiles(seedData);
        setRecentFiles(seedData);
      } else {
        const dbContent = await FileSystem.readAsStringAsync(DB_PATH);
        const parsedFiles = JSON.parse(dbContent) as FileItem[];
        setFiles(parsedFiles);
        
        // Get the 3 most recently added files
        const sorted = [...parsedFiles].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 3);
        setRecentFiles(sorted);
      }
    } catch (error) {
      Alert.alert('Storage Error', 'Could not initialize database.');
    }
  };

  const saveDatabase = async (updatedFiles: FileItem[]) => {
    try {
      await FileSystem.writeAsStringAsync(DB_PATH, JSON.stringify(updatedFiles));
      setFiles(updatedFiles);
      const sorted = [...updatedFiles].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 3);
      setRecentFiles(sorted);
    } catch (error) {
      Alert.alert('Database Error', 'Could not update your file index.');
    }
  };

  // Camera Actions
  const handleOpenScanner = async () => {
    if (!permission) {
      // Camera permissions are still loading
      return;
    }
    if (!permission.granted) {
      const permissionResponse = await requestPermission();
      if (!permissionResponse.granted) {
        Alert.alert('Permission Required', 'VaultEase needs access to your camera to scan documents.');
        return;
      }
    }
    setIsCameraOpen(true);
    setScannedPhoto(null);
    setNewFileName('');
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo && photo.uri) {
          setScannedPhoto(photo.uri);
          setNewFileName(`Scan - ${new Date().toLocaleDateString().replace(/\//g, '-')}`);
        }
      } catch (err) {
        Alert.alert('Camera Error', 'Could not snap the picture.');
      }
    }
  };

  const handleSaveScannedFile = async () => {
    if (!newFileName.trim()) {
      Alert.alert('Missing Name', 'Please type a name for your file.');
      return;
    }
    if (!scannedPhoto) return;

    setIsSaving(true);
    try {
      const fileName = `${newFileName.trim().replace(/[^a-zA-Z0-9 _-]/g, "")}.jpg`;
      const localUri = `${FILES_DIR}${Date.now()}_${fileName}`;
      
      // Move photo from camera cache to permanent app storage
      await FileSystem.moveAsync({
        from: scannedPhoto,
        to: localUri,
      });

      const newFile: FileItem = {
        id: `file-${Date.now()}`,
        name: fileName,
        category: newFileCategory,
        uri: localUri,
        date: new Date().toLocaleString(),
      };

      const updatedFiles = [newFile, ...files];
      await saveDatabase(updatedFiles);

      setIsSaving(false);
      setIsCameraOpen(false);
      setScannedPhoto(null);
      Alert.alert('Success!', `"${fileName}" has been saved in ${newFileCategory}.`);
    } catch (err) {
      setIsSaving(false);
      Alert.alert('Save Error', 'Failed to write file to local database.');
    }
  };

  // Sharing and Deleting Actions
  const handleShareFile = async (file: FileItem) => {
    try {
      if (file.uri === 'placeholder' || !(await FileSystem.getInfoAsync(file.uri)).exists) {
        Alert.alert(
          'Mock File Share',
          `Sharing template message: "Sending ${file.name} to you."`,
          [{ text: 'OK' }]
        );
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Unavailable', 'Native sharing is not supported on this device.');
        return;
      }

      await Sharing.shareAsync(file.uri, {
        mimeType: 'image/jpeg',
        dialogTitle: `Share ${file.name}`,
      });
    } catch (error) {
      Alert.alert('Share Error', 'Could not open share dialogue.');
    }
  };

  const handleDeleteFile = (fileId: string, fileName: string) => {
    Alert.alert(
      'Delete File?',
      `Are you sure you want to permanently delete "${fileName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const fileToDelete = files.find(f => f.id === fileId);
              if (fileToDelete && fileToDelete.uri !== 'placeholder') {
                const fileInfo = await FileSystem.getInfoAsync(fileToDelete.uri);
                if (fileInfo.exists) {
                  await FileSystem.deleteAsync(fileToDelete.uri);
                }
              }
              const updated = files.filter(f => f.id !== fileId);
              await saveDatabase(updated);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete the file.');
            }
          }
        }
      ]
    );
  };

  // Folder Navigation with Security Verification
  const handleCategoryPress = (category: string) => {
    if (category === 'Bank Documents') {
      if (isVaultLocked) {
        setIsVaultModalOpen(true);
      } else {
        setSelectedCategory(category);
      }
    } else {
      setSelectedCategory(category);
    }
  };

  const handleVaultUnlocked = () => {
    setIsVaultLocked(false);
    setIsVaultModalOpen(false);
    setSelectedCategory('Bank Documents');
  };

  const handleCloseCategoryViewer = () => {
    setSelectedCategory(null);
    // Auto-lock the bank documents vault when leaving the folder for security
    setIsVaultLocked(true);
  };

  const getCategoryFiles = () => {
    return files.filter(f => f.category === selectedCategory);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} className="flex-1">
        
        {/* Welcome Header */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-extrabold text-slate-900">
                Good Morning, Mary!
              </Text>
              <Text className="text-xl font-semibold text-slate-600 mt-2">
                What would you like to do today?
              </Text>
            </View>
            <View className="h-16 w-16 rounded-full bg-blue-100 border-2 border-blue-300 items-center justify-center">
              <Ionicons name="person" size={32} color="#2563eb" />
            </View>
          </View>
        </View>

        {/* Gmail Alert Indicator */}
        <View className="bg-orange-50 border-3 border-orange-500 rounded-3xl p-5 mb-8 flex-row items-center justify-between active:scale-98">
          <View className="flex-row items-center flex-1 pr-4">
            <View className="bg-orange-500 rounded-2xl p-3 mr-4">
              <Ionicons name="mail" size={32} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-900">
                New Email from Dr. Smith
              </Text>
              <Text className="text-lg font-medium text-slate-700 mt-1">
                "Please review the medical..."
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={32} color="#f97316" />
        </View>

        {/* Quick Add Section */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-slate-900 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity 
              onPress={handleOpenScanner}
              className="flex-1 bg-blue-600 border-2 border-blue-700 h-20 rounded-3xl flex-row items-center justify-center px-4 active:scale-95 active:bg-blue-700"
            >
              <Ionicons name="camera" size={32} color="white" className="mr-3" />
              <Text className="text-xl font-bold text-white">
                Scan Paper
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2x2 Category Tiles */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-slate-900 mb-4">
            My Folders (Categories)
          </Text>
          
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {/* Medical Records */}
            <TouchableOpacity 
              onPress={() => handleCategoryPress('Medical Records')}
              className="w-[48%] bg-rose-50 border-3 border-rose-500 rounded-3xl p-5 flex-col justify-between h-44 active:scale-95 active:bg-rose-100"
            >
              <View className="bg-rose-500 rounded-2xl p-2.5 self-start">
                <Ionicons name="medical" size={32} color="white" />
              </View>
              <Text className="text-xl font-extrabold text-slate-950 mt-4 leading-6">
                🏥 Medical Records
              </Text>
            </TouchableOpacity>

            {/* Bank Documents */}
            <TouchableOpacity 
              onPress={() => handleCategoryPress('Bank Documents')}
              className="w-[48%] bg-amber-50 border-3 border-amber-500 rounded-3xl p-5 flex-col justify-between h-44 active:scale-95 active:bg-amber-100"
            >
              <View className="bg-amber-500 rounded-2xl p-2.5 self-start">
                <Ionicons name="business" size={32} color="white" />
              </View>
              <View className="flex-row items-center justify-between mt-4">
                <Text className="text-xl font-extrabold text-slate-950 leading-6">
                  🏦 Bank Documents
                </Text>
                {isVaultLocked && (
                  <Ionicons name="lock-closed" size={20} color="#b45309" />
                )}
              </View>
            </TouchableOpacity>

            {/* Family Photos */}
            <TouchableOpacity 
              onPress={() => handleCategoryPress('Family Photos')}
              className="w-[48%] bg-emerald-50 border-3 border-emerald-500 rounded-3xl p-5 flex-col justify-between h-44 active:scale-95 active:bg-emerald-100"
            >
              <View className="bg-emerald-500 rounded-2xl p-2.5 self-start">
                <Ionicons name="images" size={32} color="white" />
              </View>
              <Text className="text-xl font-extrabold text-slate-950 mt-4 leading-6">
                👨‍👩‍👧‍👦 Family Photos
              </Text>
            </TouchableOpacity>

            {/* Daily Notes */}
            <TouchableOpacity 
              onPress={() => handleCategoryPress('Daily Notes')}
              className="w-[48%] bg-blue-50 border-3 border-blue-500 rounded-3xl p-5 flex-col justify-between h-44 active:scale-95 active:bg-blue-100"
            >
              <View className="bg-blue-500 rounded-2xl p-2.5 self-start">
                <Ionicons name="document-text" size={32} color="white" />
              </View>
              <Text className="text-xl font-extrabold text-slate-950 mt-4 leading-6">
                📝 Daily Notes
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Hub Section */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-slate-900 mb-4">
            Recently Opened Files
          </Text>
          
          <View className="bg-white border-2 border-slate-200 rounded-3xl p-2">
            {recentFiles.length === 0 ? (
              <Text className="text-lg font-bold text-slate-400 p-4 text-center">
                No files saved yet.
              </Text>
            ) : (
              recentFiles.map((file) => (
                <TouchableOpacity 
                  key={file.id}
                  onPress={() => {
                    if (file.category === 'Bank Documents' && isVaultLocked) {
                      Alert.alert('Folder Locked', 'Please open the "Bank Documents" folder first using your PIN.');
                    } else {
                      handleShareFile(file);
                    }
                  }}
                  className="flex-row items-center p-4 border-b border-slate-100 last:border-b-0 active:bg-slate-50"
                >
                  <Ionicons 
                    name={
                      file.category === 'Medical Records' ? 'medical' : 
                      file.category === 'Bank Documents' ? 'business' : 
                      file.category === 'Family Photos' ? 'images' : 'document-text'
                    } 
                    size={32} 
                    color={
                      file.category === 'Medical Records' ? '#ef4444' : 
                      file.category === 'Bank Documents' ? '#f59e0b' : 
                      file.category === 'Family Photos' ? '#10b981' : '#3b82f6'
                    } 
                    className="mr-4" 
                  />
                  <View className="flex-1 pr-2">
                    <Text className="text-lg font-bold text-slate-900" numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text className="text-base font-semibold text-slate-500 mt-0.5">
                      {file.category} • {file.date.split(',')[0]}
                    </Text>
                  </View>
                  <Ionicons name="share-social" size={24} color="#3b82f6" />
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

      </ScrollView>

      {/* 🔐 Secure Vault Unlock Screen */}
      <SecureVault
        visible={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onUnlock={handleVaultUnlocked}
      />

      {/* 📂 Category Documents Viewer Modal */}
      <Modal
        visible={selectedCategory !== null}
        animationType="slide"
        onRequestClose={handleCloseCategoryViewer}
      >
        <SafeAreaView className="flex-1 bg-slate-50 p-6 justify-between">
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b-2 border-slate-200 pb-4 mb-4">
              <TouchableOpacity
                onPress={handleCloseCategoryViewer}
                className="flex-row items-center bg-slate-200 px-5 py-3 rounded-2xl active:scale-95"
              >
                <Ionicons name="chevron-back" size={24} color="#1e293b" />
                <Text className="text-lg font-bold text-slate-800 ml-1">Back</Text>
              </TouchableOpacity>
              <Text className="text-xl font-extrabold text-slate-900">
                {selectedCategory}
              </Text>
              <View className="w-16" />
            </View>

            {/* File List */}
            <ScrollView className="flex-1">
              {getCategoryFiles().length === 0 ? (
                <View className="items-center justify-center p-8 mt-12">
                  <Ionicons name="folder-open-outline" size={80} color="#94a3b8" />
                  <Text className="text-xl font-bold text-slate-500 mt-4 text-center">
                    This folder is empty.
                  </Text>
                </View>
              ) : (
                <View className="gap-y-4">
                  {getCategoryFiles().map((file) => (
                    <View
                      key={file.id}
                      className="bg-white border-2 border-slate-200 rounded-3xl p-5 flex-row items-center justify-between"
                    >
                      <View className="flex-1 pr-4">
                        <Text className="text-lg font-bold text-slate-900">{file.name}</Text>
                        <Text className="text-base font-semibold text-slate-500 mt-1">{file.date}</Text>
                      </View>
                      
                      <View className="flex-row gap-2">
                        {/* Share */}
                        <TouchableOpacity
                          onPress={() => handleShareFile(file)}
                          className="bg-blue-100 border-2 border-blue-400 p-3.5 rounded-2xl active:scale-95 active:bg-blue-200"
                        >
                          <Ionicons name="share-social" size={24} color="#2563eb" />
                        </TouchableOpacity>

                        {/* Delete */}
                        <TouchableOpacity
                          onPress={() => handleDeleteFile(file.id, file.name)}
                          className="bg-rose-100 border-2 border-rose-400 p-3.5 rounded-2xl active:scale-95 active:bg-rose-200"
                        >
                          <Ionicons name="trash" size={24} color="#dc2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 📷 Live Document Scanner Modal */}
      <Modal visible={isCameraOpen} animationType="slide">
        <SafeAreaView className="flex-1 bg-black justify-between">
          {!scannedPhoto ? (
            // Camera Viewfinder
            <View className="flex-1 justify-between p-6">
              {/* Header */}
              <View className="flex-row justify-between items-center z-10">
                <TouchableOpacity
                  onPress={() => setIsCameraOpen(false)}
                  className="bg-white/20 p-4 rounded-full"
                >
                  <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Scan Document</Text>
                <View className="w-12" />
              </View>

              {/* Viewfinder Wrapper */}
              <View className="flex-1 border-3 border-blue-400 border-dashed rounded-3xl overflow-hidden my-4">
                <CameraView
                  ref={cameraRef}
                  style={{ flex: 1 }}
                  facing="back"
                />
              </View>

              {/* Snap Button */}
              <View className="items-center mb-6">
                <TouchableOpacity
                  onPress={handleCapture}
                  className="h-20 w-20 rounded-full border-4 border-white bg-white/30 items-center justify-center active:scale-90"
                >
                  <View className="h-14 w-14 rounded-full bg-white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Save Capture Form
            <View className="flex-1 bg-white p-6 justify-between">
              <View className="flex-1">
                <Text className="text-2xl font-black text-slate-900 mb-4">
                  Document Scanned Successfully!
                </Text>

                {/* Preview Thumbnail */}
                <View className="h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-300 mb-6">
                  <Image source={{ uri: scannedPhoto }} style={{ flex: 1, resizeMode: 'cover' }} />
                </View>

                {/* Input Fields */}
                <Text className="text-xl font-bold text-slate-900 mb-2">
                  File Name
                </Text>
                <TextInput
                  value={newFileName}
                  onChangeText={setNewFileName}
                  className="bg-slate-50 border-2 border-slate-300 h-14 rounded-2xl px-4 text-xl font-semibold mb-6 focus:border-blue-600"
                  placeholder="Enter file name"
                  selectTextOnFocus
                />

                <Text className="text-xl font-bold text-slate-900 mb-2">
                  Select Folder
                </Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {['Medical Records', 'Bank Documents', 'Family Photos', 'Daily Notes'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setNewFileCategory(cat)}
                      className={`px-4 py-3.5 rounded-2xl border-2 ${
                        newFileCategory === cat 
                          ? 'bg-blue-600 border-blue-700' 
                          : 'bg-slate-50 border-slate-300'
                      }`}
                    >
                      <Text className={`text-lg font-bold ${
                        newFileCategory === cat ? 'text-white' : 'text-slate-700'
                      }`}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => setScannedPhoto(null)}
                  className="flex-1 bg-slate-200 border-2 border-slate-300 h-16 rounded-2xl items-center justify-center active:scale-95"
                >
                  <Text className="text-xl font-extrabold text-slate-800">Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveScannedFile}
                  disabled={isSaving}
                  className="flex-1 bg-emerald-600 border-2 border-emerald-700 h-16 rounded-2xl items-center justify-center active:scale-95"
                >
                  {isSaving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-xl font-extrabold text-white">Save File</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}
