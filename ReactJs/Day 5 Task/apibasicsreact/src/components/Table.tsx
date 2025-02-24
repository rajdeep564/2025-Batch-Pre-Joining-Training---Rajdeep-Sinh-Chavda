import React from 'react';
import { Table } from 'antd';

type TableProps = {
  data: any[];
  columns: { title: string; dataIndex: string; key: string }[];
};

const CustomTable: React.FC<TableProps> = ({ data, columns }) => {
  return <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />;
};

export default CustomTable;