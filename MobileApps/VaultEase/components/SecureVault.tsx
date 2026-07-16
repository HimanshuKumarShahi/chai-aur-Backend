import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface SecureVaultProps {
  visible: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const PIN_STORAGE_KEY = '@vaultease_vault_pin';

export default function SecureVault({ visible, onClose, onUnlock }: SecureVaultProps) {
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [pin, setPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'unlock' | 'setup_new' | 'setup_confirm'>('unlock');

  useEffect(() => {
    if (visible) {
      checkPinStatus();
    }
  }, [visible]);

  const checkPinStatus = async () => {
    try {
      const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      if (storedPin) {
        setHasPin(true);
        setStep('unlock');
      } else {
        setHasPin(false);
        setStep('setup_new');
      }
      setPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (error) {
      Alert.alert('Error', 'Failed to read security configuration.');
    }
  };

  const handleKeyPress = (digit: string) => {
    if (step === 'unlock') {
      if (pin.length < 4) {
        const updatedPin = pin + digit;
        setPin(updatedPin);
        if (updatedPin.length === 4) {
          verifyUnlockPin(updatedPin);
        }
      }
    } else if (step === 'setup_new') {
      if (newPin.length < 4) {
        const updatedNew = newPin + digit;
        setNewPin(updatedNew);
        if (updatedNew.length === 4) {
          setStep('setup_confirm');
        }
      }
    } else if (step === 'setup_confirm') {
      if (confirmPin.length < 4) {
        const updatedConfirm = confirmPin + digit;
        setConfirmPin(updatedConfirm);
        if (updatedConfirm.length === 4) {
          saveNewPin(newPin, updatedConfirm);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === 'unlock') {
      setPin(pin.slice(0, -1));
    } else if (step === 'setup_new') {
      setNewPin(newPin.slice(0, -1));
    } else if (step === 'setup_confirm') {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const verifyUnlockPin = async (enteredPin: string) => {
    try {
      const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      if (enteredPin === storedPin) {
        onUnlock();
      } else {
        Alert.alert('Incorrect PIN', 'Please try again.', [
          { text: 'Try Again', onPress: () => setPin('') }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Verification failed.');
    }
  };

  const saveNewPin = async (p1: string, p2: string) => {
    if (p1 !== p2) {
      Alert.alert('PINs Do Not Match', 'Please start over.', [
        { 
          text: 'Restart', 
          onPress: () => {
            setNewPin('');
            setConfirmPin('');
            setStep('setup_new');
          } 
        }
      ]);
      return;
    }

    try {
      await AsyncStorage.setItem(PIN_STORAGE_KEY, p1);
      Alert.alert('Vault Set Up!', 'Your Emergency Vault is now locked and secure.', [
        { 
          text: 'Open Vault', 
          onPress: () => {
            onUnlock();
          } 
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save security PIN.');
    }
  };

  const resetPinSetup = () => {
    setNewPin('');
    setConfirmPin('');
    setPin('');
    setStep(hasPin ? 'unlock' : 'setup_new');
  };

  const renderDots = () => {
    let activeCount = 0;
    if (step === 'unlock') activeCount = pin.length;
    else if (step === 'setup_new') activeCount = newPin.length;
    else if (step === 'setup_confirm') activeCount = confirmPin.length;

    return (
      <View className="flex-row justify-center gap-6 my-8">
        {[1, 2, 3, 4].map((index) => (
          <View
            key={index}
            className={`h-6 w-6 rounded-full border-2 border-slate-400 ${
              index <= activeCount ? 'bg-slate-900 border-slate-900' : 'bg-transparent'
            }`}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['clear', '0', 'backspace']
    ];

    return (
      <View className="w-full gap-y-4 px-6 mt-4">
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between gap-4">
            {row.map((key) => {
              if (key === 'clear') {
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={resetPinSetup}
                    className="flex-1 h-16 rounded-2xl bg-slate-200 justify-center items-center active:bg-slate-300"
                  >
                    <Text className="text-lg font-extrabold text-slate-800">RESET</Text>
                  </TouchableOpacity>
                );
              }
              if (key === 'backspace') {
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={handleBackspace}
                    className="flex-1 h-16 rounded-2xl bg-slate-200 justify-center items-center active:bg-slate-300"
                  >
                    <Ionicons name="backspace" size={28} color="#1e293b" />
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleKeyPress(key)}
                  className="flex-1 h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 justify-center items-center active:bg-slate-200"
                >
                  <Text className="text-3xl font-extrabold text-slate-900">{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white p-6 justify-between items-center">
        
        {/* Top Header */}
        <View className="w-full flex-row justify-between items-center border-b-2 border-slate-100 pb-4">
          <TouchableOpacity 
            onPress={onClose}
            className="flex-row items-center bg-slate-100 px-5 py-3 rounded-2xl active:bg-slate-200"
          >
            <Ionicons name="close" size={24} color="#1e293b" />
            <Text className="text-lg font-bold text-slate-800 ml-1">Cancel</Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Ionicons name="lock-closed" size={24} color="#dc2626" />
            <Text className="text-xl font-extrabold text-slate-900 ml-2">Secure Vault</Text>
          </View>
          <View className="w-16" />
        </View>

        {/* Informative Guidance */}
        <View className="items-center px-4 my-4 flex-1 justify-center">
          <Ionicons 
            name={step === 'unlock' ? 'shield-checkmark' : 'keypad-outline'} 
            size={72} 
            color={step === 'unlock' ? '#2563eb' : '#eab308'} 
          />
          
          <Text className="text-2xl font-black text-slate-900 mt-4 text-center">
            {step === 'unlock' && 'Enter Security PIN'}
            {step === 'setup_new' && 'Choose a 4-Digit PIN'}
            {step === 'setup_confirm' && 'Confirm Your PIN'}
          </Text>

          <Text className="text-lg font-semibold text-slate-600 mt-2 text-center leading-6">
            {step === 'unlock' && 'Please type your secret 4-digit code to access your important documents.'}
            {step === 'setup_new' && 'Setup a new PIN. Memorize this code, you will need it to unlock secure files.'}
            {step === 'setup_confirm' && 'Type the 4-digit PIN again to confirm.'}
          </Text>

          {renderDots()}
        </View>

        {/* Keypad */}
        {renderKeypad()}

      </View>
    </Modal>
  );
}
