import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';

const categories = [
  { label: 'All', value: undefined },
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Shoes', value: 'Shoes' },
  { label: 'Electronics', value: 'Electronics' },
];

const sortOptions = [
  { label: 'Default', value: { sortBy: undefined, sortOrder: undefined } },
  { label: 'Name A-Z', value: { sortBy: 'title', sortOrder: 'asc' } },
  { label: 'Name Z-A', value: { sortBy: 'title', sortOrder: 'desc' } },
  { label: 'Price Low to High', value: { sortBy: 'price', sortOrder: 'asc' } },
  { label: 'Price High to Low', value: { sortBy: 'price', sortOrder: 'desc' } },
  { label: 'Highest Rated', value: { sortBy: 'rating', sortOrder: 'desc' } },
];

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedSort, setSelectedSort] = useState<any>({ sortBy: undefined, sortOrder: undefined });
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const handleCategorySelect = (category: string | undefined) => {
    setSelectedCategory(category);
    setCategoryModalVisible(false);
    onFilterChange({ category, page: 1 });
  };

  const handleSortSelect = (sortValue: any) => {
    setSelectedSort(sortValue);
    setSortModalVisible(false);
    onFilterChange({ ...sortValue, page: 1 });
  };

  const getCategoryLabel = () => {
    const category = categories.find(cat => cat.value === selectedCategory);
    return category ? category.label : 'All';
  };

  const getSortLabel = () => {
    const sort = sortOptions.find(
      opt => opt.value.sortBy === selectedSort.sortBy && 
             opt.value.sortOrder === selectedSort.sortOrder
    );
    return sort ? sort.label : 'Default';
  };

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        selectedCategory === item.value && styles.selectedItem
      ]}
      onPress={() => handleCategorySelect(item.value)}
    >
      <Text style={[
        styles.modalItemText,
        selectedCategory === item.value && styles.selectedItemText
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderSortItem = ({ item }: { item: typeof sortOptions[0] }) => {
    const isSelected = selectedSort.sortBy === item.value.sortBy && 
                      selectedSort.sortOrder === item.value.sortOrder;
    
    return (
      <TouchableOpacity
        style={[styles.modalItem, isSelected && styles.selectedItem]}
        onPress={() => handleSortSelect(item.value)}
      >
        <Text style={[
          styles.modalItemText,
          isSelected && styles.selectedItemText
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Text style={styles.filterLabel}>Category</Text>
        <Text style={styles.filterValue}>{getCategoryLabel()}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setSortModalVisible(true)}
      >
        <Text style={styles.filterLabel}>Sort</Text>
        <Text style={styles.filterValue}>{getSortLabel()}</Text>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.label}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSortModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={sortOptions}
              renderItem={renderSortItem}
              keyExtractor={(item) => item.label}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
    gap: 12,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e7ff',
  },
  filterLabel: {
    fontSize: 12,
    color: '#4338ca',
    fontWeight: '600',
    marginBottom: 4,
  },
  filterValue: {
    fontSize: 14,
    color: '#1e1b4b',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e1b4b',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#4338ca',
    fontWeight: 'bold',
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedItem: {
    backgroundColor: '#eef2ff',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1e1b4b',
  },
  selectedItemText: {
    color: '#4f46e5',
    fontWeight: '700',
  },
});