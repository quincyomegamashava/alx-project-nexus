import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RouteGuard from '../components/RouteGuard';
import type { RootState } from '../store';

interface ProfileFormData {
  name: string;
  email: string;
}

function ProfileContent() {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [originalData, setOriginalData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(originalData);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://alx-project-nexus-production-4427.up.railway.app/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      setOriginalData(formData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - in real app you'd fetch latest user data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getRoleIcon = (role: string) => {
    return role === 'seller' ? 'storefront-outline' : 'cart-outline';
  };

  const getRoleColor = (role: string) => {
    return role === 'seller' ? '#10b981' : '#3b82f6';
  };

  const navigateToOrders = () => {
    router.push('/orders' as any);
  };

  const navigateToCart = () => {
    if (user?.role === 'buyer') {
      router.push('/cart' as any);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#ffffff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <View style={styles.roleContainer}>
              <Ionicons 
                name={getRoleIcon(user?.role || '') as any} 
                size={16} 
                color={getRoleColor(user?.role || '')} 
              />
              <Text style={[styles.roleText, { color: getRoleColor(user?.role || '') }]}>
                {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
              </Text>
            </View>
          </div>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <Text style={styles.fieldLabel}>Full Name</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
              />
            ) : (
              <View style={styles.fieldValue}>
                <Text style={styles.fieldText}>{user?.name}</Text>
              </View>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <Text style={styles.fieldLabel}>Email Address</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <View style={styles.fieldValue}>
                <Text style={styles.fieldText}>{user?.email}</Text>
              </View>
            )}
          </View>

          {/* Role Field (Read-only) */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Ionicons name="shield-outline" size={20} color="#6b7280" />
              <Text style={styles.fieldLabel}>Account Type</Text>
            </View>
            <View style={styles.fieldValue}>
              <Text style={styles.fieldText}>
                {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)} Account
              </Text>
              <Text style={styles.fieldSubtext}>
                Contact support to change account type
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-outline" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Ionicons name="close-outline" size={20} color="#6b7280" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      {!isEditing && (
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={navigateToOrders}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="receipt-outline" size={24} color="#4f46e5" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Order History</Text>
              <Text style={styles.actionSubtitle}>View your past orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {user?.role === 'buyer' && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={navigateToCart}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="cart-outline" size={24} color="#4f46e5" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Shopping Cart</Text>
                <Text style={styles.actionSubtitle}>View items in your cart</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}

          {user?.role === 'seller' && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push('/add-product' as any)}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="add-circle-outline" size={24} color="#4f46e5" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Add Product</Text>
                <Text style={styles.actionSubtitle}>List a new product for sale</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

export default function ProfileScreen() {
  return (
    <RouteGuard requireAuth={true}>
      <ProfileContent />
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  avatarSection: {
    backgroundColor: '#4f46e5',
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  formSection: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  fieldValue: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  fieldText: {
    fontSize: 16,
    color: '#111827',
  },
  fieldSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  actionButtons: {
    marginTop: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#4f46e5',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  quickActions: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});