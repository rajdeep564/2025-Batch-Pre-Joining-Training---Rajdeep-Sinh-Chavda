import React, { useState } from 'react';
import { Table, Button, Modal, message, Tooltip, Input, Space } from 'antd';
import { Edit, Trash2, Plus, Search, Eye, Package } from 'lucide-react';
import { Product } from '../../types';
import ProductForm from '../ProductForm/ProductForm';
import ProductView from '../ProductView/ProductView';
import { useProducts } from '../../context/ProductContext';
import styles from './ProductTable.module.scss';

const { confirm } = Modal;

const ProductTable: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const showEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsEditModalVisible(true);
  };

  const showViewModal = (product: Product) => {
    setCurrentProduct(product);
    setIsViewModalVisible(true);
  };

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    setLoading(true);
    setTimeout(() => {
      addProduct(productData);
      setIsAddModalVisible(false);
      setLoading(false);
      message.success('Product added successfully');
    }, 500);
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!currentProduct) return;
    
    setLoading(true);
    setTimeout(() => {
      updateProduct({
        ...productData,
        id: currentProduct.id,
        createdAt: currentProduct.createdAt,
      });
      setIsEditModalVisible(false);
      setCurrentProduct(undefined);
      setLoading(false);
      message.success('Product updated successfully');
    }, 500);
  };

  const handleDeleteProduct = (id: string) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteProduct(id);
        message.success('Product deleted successfully');
      },
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase()) ||
    product.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: Array.from(new Set(products.map((p) => p.category))).map((category) => ({
        text: category,
        value: category,
      })),
      onFilter: (value: string | number | boolean, record: Product) => 
        record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a: Product, b: Product) => a.stock - b.stock,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a: Product, b: Product) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <div className={styles.actionColumn}>
          <Tooltip title="View">
            <Button 
              type="text" 
              icon={<Eye size={16} />} 
              onClick={() => showViewModal(record)} 
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<Edit size={16} />} 
              onClick={() => showEditModal(record)} 
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text" 
              danger 
              icon={<Trash2 size={16} />} 
              onClick={() => handleDeleteProduct(record.id)} 
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="page-title"><Package size={24} /> Product Management</h1>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Products</h2>
          <div className={styles.tableActions}>
            <Space>
              <Input
                placeholder="Search products"
                value={searchText}
                onChange={handleSearch}
                prefix={<Search size={16} />}
                allowClear
                className={styles.searchInput}
              />
              <Button 
                type="primary" 
                icon={<Plus size={16} />} 
                onClick={showAddModal}
              >
                Add Product
              </Button>
            </Space>
          </div>
        </div>
        
        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ y: 350 }} 
        />

        <Modal
          title="Add New Product"
          open={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddModalVisible(false)}
            loading={loading}
          />
        </Modal>

        <Modal
          title="Edit Product"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setCurrentProduct(undefined);
          }}
          footer={null}
          destroyOnClose
        >
          {currentProduct && (
            <ProductForm
              initialValues={currentProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => {
                setIsEditModalVisible(false);
                setCurrentProduct(undefined);
              }}
              loading={loading}
            />
          )}
        </Modal>

        <Modal
          title="Product Details"
          open={isViewModalVisible}
          onCancel={() => {
            setIsViewModalVisible(false);
            setCurrentProduct(undefined);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setIsViewModalVisible(false);
              setCurrentProduct(undefined);
            }}>
              Close
            </Button>,
          ]}
          destroyOnClose
        >
          {currentProduct && <ProductView product={currentProduct} />}
        </Modal>
      </div>
    </div>
  );
};

export default ProductTable;