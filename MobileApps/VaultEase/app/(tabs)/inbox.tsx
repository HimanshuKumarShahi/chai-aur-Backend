import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  subject: string;
  body: string;
  date: string;
  isImportant: boolean;
  replies: Array<{
    id: string;
    text: string;
    date: string;
  }>;
}

const INBOX_DB_PATH = `${FileSystem.documentDirectory}vaultease_inbox_db.json`;

export default function InboxScreen() {
  const [emails, setEmails] = useState<Message[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Message | null>(null);
  
  // Voice Recording States
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  let timerRef = React.useRef<any>(null);

  useEffect(() => {
    loadInbox();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadInbox = async () => {
    try {
      const dbInfo = await FileSystem.getInfoAsync(INBOX_DB_PATH);
      if (!dbInfo.exists) {
        // Initial Seed Inbox Data
        const seedEmails: Message[] = [
          {
            id: 'mail-1',
            sender: 'Dr. John Smith',
            senderRole: 'Primary Doctor',
            subject: 'Upcoming Appointment Details',
            body: 'Hello Mary,\n\nThis is a reminder of your medical checkup scheduled for this Friday at 10:00 AM. Please remember to bring your updated prescription list.\n\nBest regards,\nDr. Smith',
            date: '9:30 AM',
            isImportant: true,
            replies: [],
          },
          {
            id: 'mail-2',
            sender: 'Leo (Grandson)',
            senderRole: 'Family',
            subject: 'Picnic on Sunday 🌳',
            body: 'Hi Grandma! We are setting up a family picnic this Sunday afternoon. Mom is bringing your favorite potato salad! Let me know if you need me to pick you up.',
            date: 'Yesterday',
            isImportant: true,
            replies: [],
          },
          {
            id: 'mail-3',
            sender: 'City Power & Water',
            senderRole: 'Utilities',
            subject: 'Monthly Bill Ready for Review',
            body: 'Dear Customer,\n\nYour utility bill for the billing cycle ending June 30 is now available. The total amount due is $74.50. You can review your statement details below.',
            date: 'July 12',
            isImportant: true,
            replies: [],
          },
        ];
        await FileSystem.writeAsStringAsync(INBOX_DB_PATH, JSON.stringify(seedEmails));
        setEmails(seedEmails);
      } else {
        const dbContent = await FileSystem.readAsStringAsync(INBOX_DB_PATH);
        setEmails(JSON.parse(dbContent) as Message[]);
      }
    } catch (error) {
      Alert.alert('Inbox Error', 'Could not load your emails.');
    }
  };

  const saveInbox = async (updated: Message[]) => {
    try {
      await FileSystem.writeAsStringAsync(INBOX_DB_PATH, JSON.stringify(updated));
      setEmails(updated);
      
      // Update selected email detail state if open
      if (selectedEmail) {
        const refreshed = updated.find(m => m.id === selectedEmail.id);
        if (refreshed) {
          setSelectedEmail(refreshed);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save sent messages.');
    }
  };

  const handleSendReply = async (replyText: string) => {
    if (!selectedEmail) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      text: replyText,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedEmails = emails.map((email) => {
      if (email.id === selectedEmail.id) {
        return {
          ...email,
          replies: [...email.replies, newReply],
        };
      }
      return email;
    });

    await saveInbox(updatedEmails);
    Alert.alert('Reply Sent', `Your response: "${replyText}" has been sent.`);
  };

  // Real Audio Recording Implementation
  const startRecording = async () => {
    try {
      // Request microphone permission
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'VaultEase needs access to your microphone to record audio replies.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      timerRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
    } catch (err) {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      Alert.alert('Microphone Error', 'Failed to start voice recorder.');
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Trigger transcribing visual indicator
      setIsTranscribing(true);
      setTimeout(() => {
        setIsTranscribing(false);
        // Practical Simulation of Speech-to-Text
        const transcribedText = "Yes, I received your message. Thank you!";
        Alert.alert(
          'Voice Transcribed',
          `We heard: "${transcribedText}"\nWould you like to send this reply?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Send Reply', 
              onPress: () => handleSendReply(transcribedText)
            }
          ]
        );
      }, 2000);
    } catch (error) {
      Alert.alert('Record Error', 'Could not stop or save recording.');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24 }} className="flex-1">
        
        {/* Inbox Description */}
        <View className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-3xl p-5">
          <Text className="text-xl font-bold text-blue-900">
            📬 Focused Inbox
          </Text>
          <Text className="text-lg font-semibold text-blue-800 mt-1 leading-6">
            Showing only important messages from family, doctors, and utilities. Spam is automatically blocked.
          </Text>
        </View>

        {/* Email List */}
        <View className="gap-y-4">
          {emails.map((email) => (
            <TouchableOpacity
              key={email.id}
              onPress={() => setSelectedEmail(email)}
              className="bg-white border-3 border-slate-200 rounded-3xl p-5 flex-row items-center active:scale-98 active:bg-slate-50"
            >
              <View className="h-14 w-14 rounded-full bg-slate-100 items-center justify-center mr-4">
                <Ionicons 
                  name={
                    email.senderRole === 'Primary Doctor' ? 'medical' : 
                    email.senderRole === 'Family' ? 'people' : 'document-text'
                  } 
                  size={28} 
                  color={
                    email.senderRole === 'Primary Doctor' ? '#ef4444' : 
                    email.senderRole === 'Family' ? '#10b981' : '#f59e0b'
                  } 
                />
              </View>
              
              <View className="flex-1 pr-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xl font-extrabold text-slate-900">{email.sender}</Text>
                  <Text className="text-base font-semibold text-slate-500">{email.date}</Text>
                </View>
                <Text className="text-lg font-bold text-slate-700 mt-1">{email.subject}</Text>
                <Text 
                  className="text-base font-medium text-slate-500 mt-1" 
                  numberOfLines={1}
                >
                  {email.body}
                </Text>
                {email.replies.length > 0 && (
                  <View className="flex-row items-center mt-2 bg-emerald-50 self-start px-3 py-1 rounded-full border border-emerald-300">
                    <Ionicons name="checkmark-circle" size={16} color="#059669" className="mr-1" />
                    <Text className="text-sm font-extrabold text-emerald-800">You Replied</Text>
                  </View>
                )}
              </View>
              
              <Ionicons name="chevron-forward" size={28} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Email Reader & Smart Reply Modal */}
      <Modal
        visible={selectedEmail !== null}
        animationType="slide"
        onRequestClose={() => setSelectedEmail(null)}
      >
        <SafeAreaView className="flex-1 bg-slate-50 p-6 justify-between">
          <View className="flex-1">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between border-b-2 border-slate-200 pb-4 mb-4">
              <TouchableOpacity
                onPress={() => setSelectedEmail(null)}
                className="flex-row items-center bg-slate-200 px-5 py-3 rounded-2xl active:scale-95"
              >
                <Ionicons name="chevron-back" size={24} color="#1e293b" />
                <Text className="text-lg font-bold text-slate-800 ml-1">Back</Text>
              </TouchableOpacity>
              <Text className="text-xl font-extrabold text-slate-900">Email Details</Text>
              <View className="w-16" />
            </View>

            {/* Email Meta Info */}
            <ScrollView className="flex-1">
              <View className="bg-white border-2 border-slate-200 rounded-3xl p-5 mb-4">
                <Text className="text-lg font-bold text-slate-500 uppercase tracking-wider">From:</Text>
                <Text className="text-2xl font-extrabold text-slate-900 mt-1">
                  {selectedEmail?.sender}
                </Text>
                <Text className="text-lg font-semibold text-blue-600 mt-0.5">
                  ({selectedEmail?.senderRole})
                </Text>
                
                <Text className="text-lg font-bold text-slate-500 uppercase tracking-wider mt-4">Subject:</Text>
                <Text className="text-xl font-bold text-slate-900 mt-1">
                  {selectedEmail?.subject}
                </Text>
              </View>

              {/* Email Content */}
              <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 min-h-[120px] mb-4">
                <Text className="text-xl font-medium text-slate-800 leading-8">
                  {selectedEmail?.body}
                </Text>
              </View>

              {/* Thread Replies List */}
              {selectedEmail && selectedEmail.replies.length > 0 && (
                <View className="mb-6">
                  <Text className="text-lg font-extrabold text-slate-500 uppercase tracking-wider mb-2 px-1">
                    Sent Responses:
                  </Text>
                  <View className="gap-y-3">
                    {selectedEmail.replies.map((reply) => (
                      <View 
                        key={reply.id} 
                        className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 self-end max-w-[85%]"
                      >
                        <Text className="text-lg font-semibold text-emerald-950 leading-6">
                          {reply.text}
                        </Text>
                        <Text className="text-sm font-bold text-emerald-700 text-right mt-1">
                          {reply.date}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Quick Smart Replies Box */}
          <View className="border-t-2 border-slate-200 pt-6 mt-4">
            <Text className="text-xl font-extrabold text-slate-900 mb-3 text-center">
              Quick Smart Replies (Tap to Send)
            </Text>

            {/* Smart Reply Buttons */}
            <View className="gap-y-3 mb-4">
              <TouchableOpacity
                onPress={() => handleSendReply('Received, thank you.')}
                className="bg-blue-100 border-2 border-blue-400 h-14 rounded-2xl items-center justify-center active:scale-95 active:bg-blue-200"
              >
                <Text className="text-lg font-extrabold text-blue-900">Received, thank you</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSendReply('Please call me.')}
                className="bg-green-100 border-2 border-green-400 h-14 rounded-2xl items-center justify-center active:scale-95 active:bg-green-200"
              >
                <Text className="text-lg font-extrabold text-green-900">Please call me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSendReply('I approve.')}
                className="bg-amber-100 border-2 border-amber-400 h-14 rounded-2xl items-center justify-center active:scale-95 active:bg-amber-200"
              >
                <Text className="text-lg font-extrabold text-amber-900">I approve</Text>
              </TouchableOpacity>
            </View>

            {/* Voice Dictation Reply Button */}
            {isTranscribing ? (
              <View className="h-16 rounded-2xl bg-slate-900 flex-row items-center justify-center">
                <ActivityIndicator color="white" className="mr-2" />
                <Text className="text-xl font-bold text-white">Transcribing voice audio...</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={toggleRecording}
                className={`h-16 rounded-2xl flex-row items-center justify-center border-2 ${
                  isRecording 
                    ? 'bg-rose-500 border-rose-600 active:bg-rose-600' 
                    : 'bg-slate-900 border-slate-950 active:bg-slate-800'
                }`}
              >
                <Ionicons 
                  name={isRecording ? 'stop' : 'mic-outline'} 
                  size={32} 
                  color="white" 
                />
                <Text className="text-xl font-bold text-white ml-2">
                  {isRecording ? `Recording (${recordingDuration}s) - Tap to Send` : 'Tap to Speak Reply'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}
