'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiShield, FiCreditCard, FiBell, FiMoon, FiMap, FiHelpCircle, FiMail, FiStar, FiShare, FiFileText, FiCode, FiLogOut, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

export default function SettingsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      dispatch(logout());
      router.push('/login');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('This action cannot be undone. Are you sure you want to delete your account permanently?')) {
      alert('Feature coming soon: Account deletion will be available in a future update.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Project Nexus',
          text: 'Check out Project Nexus - the best shopping platform!',
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: FiUser,
          type: 'navigation' as const,
          onPress: () => router.push('/profile/edit'),
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          icon: FiShield,
          type: 'navigation' as const,
          onPress: () => alert('Privacy settings will be available soon.'),
        },
        {
          id: 'payment',
          title: 'Payment Methods',
          subtitle: 'Manage cards and payment options',
          icon: FiCreditCard,
          type: 'navigation' as const,
          onPress: () => alert('Payment methods management will be available soon.'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Email Notifications',
          subtitle: 'Receive updates about orders and promotions',
          icon: FiBell,
          type: 'toggle' as const,
          value: notificationsEnabled,
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          id: 'darkmode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme throughout the website',
          icon: FiMoon,
          type: 'toggle' as const,
          value: darkModeEnabled,
          onPress: () => setDarkModeEnabled(!darkModeEnabled),
        },
        {
          id: 'marketing',
          title: 'Marketing Emails',
          subtitle: 'Receive promotional offers and updates',
          icon: FiMail,
          type: 'toggle' as const,
          value: marketingEnabled,
          onPress: () => setMarketingEnabled(!marketingEnabled),
        },
        {
          id: 'location',
          title: 'Location Services',
          subtitle: 'Allow location access for better experience',
          icon: FiMap,
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
          subtitle: 'FAQs and troubleshooting guides',
          icon: FiHelpCircle,
          type: 'navigation' as const,
          onPress: () => alert('Help Center will be available soon.'),
        },
        {
          id: 'contact',
          title: 'Contact Support',
          subtitle: 'Get help from our support team',
          icon: FiMail,
          type: 'navigation' as const,
          onPress: () => window.open('mailto:support@projectnexus.com'),
        },
        {
          id: 'rate',
          title: 'Rate Our Platform',
          subtitle: 'Leave a review and help us improve',
          icon: FiStar,
          type: 'navigation' as const,
          onPress: () => alert('Thank you for using Project Nexus! Rating feature coming soon.'),
        },
        {
          id: 'share',
          title: 'Share Project Nexus',
          subtitle: 'Tell your friends about our platform',
          icon: FiShare,
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
          icon: FiFileText,
          type: 'navigation' as const,
          onPress: () => alert('Terms of Service will be available soon.'),
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: FiShield,
          type: 'navigation' as const,
          onPress: () => alert('Privacy Policy will be available soon.'),
        },
        {
          id: 'licenses',
          title: 'Open Source Licenses',
          icon: FiCode,
          type: 'navigation' as const,
          onPress: () => alert('Open source licenses will be available soon.'),
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
        icon: FiLogOut,
        type: 'action' as const,
        onPress: handleLogout,
      },
      {
        id: 'delete',
        title: 'Delete Account',
        subtitle: 'Permanently delete your account',
        icon: FiTrash2,
        type: 'action' as const,
        destructive: true,
        onPress: handleDeleteAccount,
      },
    ],
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUser className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
              <p className="text-gray-600 mb-8">Sign in to access your settings and customize your experience.</p>
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;
    
    return (
      <div
        key={item.id}
        className={`bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md group ${
          item.destructive ? 'hover:border-red-300' : ''
        }`}
      >
        <div
          className="p-6 cursor-pointer"
          onClick={item.onPress}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${
                item.destructive 
                  ? 'bg-red-50 text-red-600 group-hover:bg-red-100' 
                  : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
              } transition-colors duration-200`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  item.destructive ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                )}
              </div>
            </div>
            {item.type === 'toggle' ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={item.onPress}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            ) : (
              <FiChevronRight className={`w-5 h-5 ${
                item.destructive ? 'text-red-400' : 'text-gray-400'
              } group-hover:translate-x-1 transition-transform duration-200`} />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (section: any) => (
    <div key={section.title} className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        {section.title}
      </h2>
      <div className="space-y-4">
        {section.items.map(renderSettingItem)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FiUser className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <div className="text-white/90">
                  <p className="text-lg font-medium">{user.name}</p>
                  <p className="text-white/70">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {settingSections.slice(0, 2).map(renderSection)}
            </div>
            <div>
              {settingSections.slice(2).map(renderSection)}
              {renderSection(dangerSection)}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 pb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Project Nexus v1.0.0</p>
              <p className="text-gray-500 text-xs">Made with ❤️ for an amazing shopping experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}