import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import RouteGuard from '../components/RouteGuard';
import type { RootState } from '../store';

interface ProductFormData {
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
  stock: string;
}

const categories = ['Clothing', 'Shoes', 'Electronics', 'Books', 'Home', 'Sports'];

function AddProductForm() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: '',
    category: 'Clothing',
    description: '',
    image: '',
    stock: '1'
  });

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Product title is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Valid price is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Product description is required');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      Alert.alert('Error', 'Valid stock quantity is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description.trim(),
        image: formData.image.trim() || '/images/default-product.png',
        stock: parseInt(formData.stock)
      };

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.103.80:4000';
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const newProduct = await response.json();
      console.log('Product created:', newProduct);
      
      Alert.alert(
        'Success!', 
        'Product created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );

      setFormData({
        title: '',
        price: '',
        category: 'Clothing',
        description: '',
        image: '',
        stock: '1'
      });

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create product');
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
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#4f46e5" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Ionicons name="add-circle" size={48} color="#10b981" />
            <Text style={styles.title}>Add New Product</Text>
            <Text style={styles.subtitle}>List your product for sale</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Title *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="pricetag-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter product title"
                value={formData.title}
                onChangeText={(value) => handleChange('title', value)}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Price ($) *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cash-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={(value) => handleChange('price', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Stock *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cube-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  value={formData.stock}
                  onChangeText={(value) => handleChange('stock', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerWrapper}>
              <Ionicons name="grid-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => handleChange('category', value)}
                style={styles.picker}
              >
                {categories.map(category => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image URL (Optional)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="image-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChangeText={(value) => handleChange('image', value)}
                keyboardType="url"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <Text style={styles.helperText}>Leave empty to use default image</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <View style={[styles.inputWrapper, { alignItems: 'flex-start' }]}>
              <Ionicons name="document-text-outline" size={20} color="#6b7280" style={[styles.inputIcon, { marginTop: 8 }]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChangeText={(value) => handleChange('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.submitButtonText}>Creating...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                  <Text style={styles.submitButtonText}>Create Product</Text>
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
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 10,
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
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
    minHeight: 48,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingLeft: 16,
    minHeight: 48,
    shadowColor: '#10b981',
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
    height: 100,
    paddingTop: 12,
  },
  picker: {
    flex: 1,
    height: 48,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
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
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
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

export default function AddProductScreen() {
  return (
    <RouteGuard requireAuth={true} requiredRole="seller">
      <AddProductForm />
    </RouteGuard>
  );
}
