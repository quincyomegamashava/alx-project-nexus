import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../../src/store';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Modern tab bar icon component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

// Ionicons tab bar icon component
function IoniconsTabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

function CartTabBarIcon({ color }: { color: string }) {
  const { totalItems } = useSelector((state: RootState) => state.cart);
  
  return (
    <View style={{ position: 'relative' }}>
      <Ionicons name="bag-outline" size={24} color={color} style={{ marginBottom: -3 }} />
      {totalItems > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: '#ef4444',
            borderRadius: 12,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#ffffff',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 11,
              fontWeight: '700',
            }}
          >
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <IoniconsTabBarIcon name="storefront-outline" color={color} />,
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color="#ffffff"
                    style={{ marginRight: 15, opacity: pressed ? 0.7 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <IoniconsTabBarIcon name="receipt-outline" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <CartTabBarIcon color={color} />,
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IoniconsTabBarIcon name="person-outline" color={color} />,
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IoniconsTabBarIcon name="settings-outline" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
