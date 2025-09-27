import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import { logout } from '../../src/store/slices/authSlice';
import type { RootState, AppDispatch } from '../../src/store';

export default function TabTwoScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            Alert.alert('Success', 'Logged out successfully!');
          }
        }
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authPrompt}>
          <Ionicons name="person-circle-outline" size={80} color="#6b7280" />
          <Text style={styles.authTitle}>Welcome to Project Nexus</Text>
          <Text style={styles.authSubtitle}>
            Sign in to access your profile, manage orders, and more
          </Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login' as any)}
          >
            <Ionicons name="log-in-outline" size={20} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/register' as any)}
          >
            <Ionicons name="person-add-outline" size={20} color="#4f46e5" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons 
            name={user?.role === 'seller' ? 'storefront' : 'person'} 
            size={60} 
            color="#4f46e5" 
          />
        </View>
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role === 'seller' ? '🏪 Seller' : '🛍️ Buyer'}
          </Text>
        </View>
      </View>

      <View style={styles.profileInfo}>
        {user?.phone && (
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        )}
        {user?.address && (
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>{user.address}</Text>
          </View>
        )}
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color="#6b7280" />
          <Text style={styles.infoText}>
            Joined {new Date(user?.createdAt || '').toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/profile/edit' as any)}
        >
          <Ionicons name="person-outline" size={20} color="#374151" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
          <Ionicons name="chevron-forward-outline" size={16} color="#9ca3af" />
        </TouchableOpacity>
        
        {user?.role === 'seller' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/add-product' as any)}
          >
            <Ionicons name="add-outline" size={20} color="#374151" />
            <Text style={styles.actionButtonText}>Add Product</Text>
            <Ionicons name="chevron-forward-outline" size={16} color="#9ca3af" />
          </TouchableOpacity>
        )}
        
        {user?.role === 'buyer' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/orders' as any)}
          >
            <Ionicons name="bag-outline" size={20} color="#374151" />
            <Text style={styles.actionButtonText}>My Orders</Text>
            <Ionicons name="chevron-forward-outline" size={16} color="#9ca3af" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={20} color="#374151" />
          <Text style={styles.actionButtonText}>Settings</Text>
          <Ionicons name="chevron-forward-outline" size={16} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbff',
  },
  // Auth Prompt Styles
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 200,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: -8,
  },
  // Profile Styles
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
  },
  profileInfo: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    paddingVertical: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  actions: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#ef4444',
    marginLeft: 12,
    fontWeight: '600',
  },
});
