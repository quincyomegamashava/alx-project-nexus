import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { logout } from '../../src/store/slices/authSlice';
import type { RootState, AppDispatch } from '../../src/store';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account permanently?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out Project Nexus - the best shopping app! Download it now.',
        url: 'https://projectnexus.app',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRate = () => {
    Alert.alert('Rate App', 'Thank you for using Project Nexus! Please rate us on the app store.');
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'Need help? Contact us at support@projectnexus.com or check our FAQ section.',
      [
        { text: 'OK', style: 'default' },
        { text: 'Send Email', onPress: () => {/* Open email app */} },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: 'person-outline',
          type: 'navigation' as const,
          onPress: () => router.push('/profile/edit'),
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          icon: 'shield-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon.'),
        },
        {
          id: 'payment',
          title: 'Payment Methods',
          subtitle: 'Manage cards and payment options',
          icon: 'card-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Coming Soon', 'Payment methods management will be available soon.'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive updates about orders and promotions',
          icon: 'notifications-outline',
          type: 'toggle' as const,
          value: notificationsEnabled,
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          id: 'darkmode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme throughout the app',
          icon: 'moon-outline',
          type: 'toggle' as const,
          value: darkModeEnabled,
          onPress: () => setDarkModeEnabled(!darkModeEnabled),
        },
        {
          id: 'biometrics',
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or Face ID to sign in',
          icon: 'finger-print-outline',
          type: 'toggle' as const,
          value: biometricsEnabled,
          onPress: () => setBiometricsEnabled(!biometricsEnabled),
        },
        {
          id: 'location',
          title: 'Location Services',
          subtitle: 'Allow location access for better experience',
          icon: 'location-outline',
          type: 'toggle' as const,
          value: locationEnabled,
          onPress: () => setLocationEnabled(!locationEnabled),
        },
      ],
    },
    {
      title: 'Support & Feedback',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'FAQs and troubleshooting',
          icon: 'help-circle-outline',
          type: 'navigation' as const,
          onPress: handleSupport,
        },
        {
          id: 'contact',
          title: 'Contact Support',
          subtitle: 'Get help from our team',
          icon: 'mail-outline',
          type: 'navigation' as const,
          onPress: handleSupport,
        },
        {
          id: 'rate',
          title: 'Rate App',
          subtitle: 'Leave a review on the app store',
          icon: 'star-outline',
          type: 'navigation' as const,
          onPress: handleRate,
        },
        {
          id: 'share',
          title: 'Share App',
          subtitle: 'Tell your friends about Project Nexus',
          icon: 'share-outline',
          type: 'navigation' as const,
          onPress: handleShare,
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: 'document-text-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Coming Soon', 'Terms of Service will be available soon.'),
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: 'shield-checkmark-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Coming Soon', 'Privacy Policy will be available soon.'),
        },
        {
          id: 'licenses',
          title: 'Open Source Licenses',
          icon: 'code-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Coming Soon', 'Open source licenses will be available soon.'),
        },
      ],
    },
  ];

  const dangerSection = {
    title: 'Account Actions',
    items: [
      {
        id: 'logout',
        title: 'Sign Out',
        subtitle: 'Sign out of your account',
        icon: 'log-out-outline',
        type: 'action' as const,
        onPress: handleLogout,
      },
      {
        id: 'delete',
        title: 'Delete Account',
        subtitle: 'Permanently delete your account',
        icon: 'trash-outline',
        type: 'action' as const,
        destructive: true,
        onPress: handleDeleteAccount,
      },
    ],
  };

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = Ionicons;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingItem,
          item.destructive && styles.destructiveItem,
        ]}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingContent}>
          <View style={[
            styles.iconContainer,
            item.destructive && styles.destructiveIconContainer,
          ]}>
            <IconComponent
              name={item.icon as any}
              size={24}
              color={item.destructive ? '#ef4444' : '#3b82f6'}
            />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={[
              styles.settingTitle,
              item.destructive && styles.destructiveText,
            ]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={item.value ? '#ffffff' : '#f3f4f6'}
            />
          ) : (
            <IconComponent
              name="chevron-forward"
              size={20}
              color="#9ca3af"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section: any) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.backgroundGradient}>
          <View style={styles.centeredContent}>
            <Ionicons name="settings-outline" size={80} color="rgba(255,255,255,0.7)" />
            <Text style={styles.emptyTitle}>Please Sign In</Text>
            <Text style={styles.emptySubtitle}>
              Sign in to access settings and customize your experience
            </Text>
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.backgroundGradient}>
        {/* Header */}
        <BlurView intensity={20} style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#ffffff" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </BlurView>

        {/* Settings Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {settingSections.map(renderSection)}
          
          {/* Danger Section */}
          {renderSection(dangerSection)}

          {/* App Version */}
          <View style={styles.versionSection}>
            <Text style={styles.versionText}>Project Nexus v1.0.0</Text>
            <Text style={styles.versionSubtext}>Made with ❤️ for amazing shopping</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    marginLeft: 5,
  },
  sectionContent: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 1,
  },
  destructiveItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  destructiveIconContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#ef4444',
  },
  settingSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    marginBottom: 5,
  },
  versionSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
});