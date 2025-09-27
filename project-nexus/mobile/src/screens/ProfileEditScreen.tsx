import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RouteGuard from '../components/RouteGuard';
import { setUser } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

function ProfileEditForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormChanged = () => {
    return (
      formData.name !== (user?.name || '') ||
      formData.email !== (user?.email || '') ||
      formData.phone !== (user?.phone || '') ||
      formData.address !== (user?.address || '')
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://alx-project-nexus-production-4427.up.railway.app';
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const { user: updatedUser } = await response.json();
      
      // Update user in Redux store
      dispatch(setUser(updatedUser));
      
      Alert.alert(
        'Success!',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#4f46e5" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle" size={60} color="#4f46e5" />
            </View>
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>Update your account information</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <View style={[styles.inputWrapper, { alignItems: 'flex-start' }]}>
              <Ionicons name="location-outline" size={20} color="#6b7280" style={[styles.inputIcon, { marginTop: 12 }]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your address"
                value={formData.address}
                onChangeText={(value) => handleChange('address', value)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!isFormChanged() || isSubmitting) && styles.saveButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!isFormChanged() || isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.saveButtonText}>Updating...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function ProfileEditScreen() {
  return (
    <RouteGuard requireAuth={true}>
      <ProfileEditForm />
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 10,
    padding: 8,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 12,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  buttonContainer: {
    marginTop: 32,
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowColor: '#9ca3af',
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});