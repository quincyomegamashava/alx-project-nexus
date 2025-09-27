import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { RootState } from '../store';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'buyer' | 'seller';
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function RouteGuard({
  children,
  requireAuth = false,
  requiredRole,
  redirectTo = '/login',
  fallback
}: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      // Skip check if auth is still loading
      if (isLoading) {
        return;
      }

      // Check authentication requirement
      if (requireAuth && !isAuthenticated) {
        Alert.alert(
          'Authentication Required',
          'Please sign in to access this feature.',
          [
            {
              text: 'Sign In',
              onPress: () => router.push(redirectTo as any)
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => router.back()
            }
          ]
        );
        return;
      }

      // Check role requirement
      if (requiredRole && user?.role !== requiredRole) {
        if (!isAuthenticated) {
          Alert.alert(
            'Authentication Required',
            'Please sign in to access this feature.',
            [
              {
                text: 'Sign In',
                onPress: () => router.push(redirectTo as any)
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => router.back()
              }
            ]
          );
        } else {
          // User is authenticated but wrong role
          Alert.alert(
            'Access Denied',
            `This feature is only available for ${requiredRole}s.`,
            [
              {
                text: 'Go Back',
                onPress: () => router.back()
              }
            ]
          );
        }
        return;
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [isAuthenticated, user?.role, isLoading, requireAuth, requiredRole, redirectTo, router]);

  // Show loading while checking auth
  if (isLoading || isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show access denied if user doesn't have permission
  if (requireAuth && isAuthenticated && requiredRole && user?.role !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={styles.accessDeniedContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#ef4444" />
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedText}>
          You don't have permission to access this feature.
        </Text>
        {user && (
          <Text style={styles.userInfo}>
            Signed in as {user.name} ({user.role})
          </Text>
        )}
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // User has access, render children
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafbff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#fafbff',
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 20,
    marginBottom: 12,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  goBackButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});