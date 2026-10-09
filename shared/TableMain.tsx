'use client';
import React from 'react';
import { ConfigProvider, Table } from 'antd';
import type { TableProps } from 'antd';

type Props<T> = TableProps<T> & { className?: string };

const theme = {
  components: {
    Table: {
      headerBg: '#3e3e3f',
      rowHoverBg: '#2a2a2b',
    },
  },
  token: {
    colorPrimary: '#abab9e',
    colorText: '#abab9e',
    borderRadius: 8,
    colorBgContainer: 'transparent',
  },
};

const TableMain = <T extends object = any,>({ className, pagination, rowKey, ...rest }: Props<T>) => {
  const defaultPagination =
    pagination ?? (Array.isArray(rest?.dataSource) ? { pageSize: 10, total: rest?.dataSource?.length } : undefined);

  const defaultRowKey =
    rowKey ??
    ((record: any) =>
      record?.key ?? record?.id ?? record?._id ?? '');

  return (
    <ConfigProvider theme={theme}>
      <Table
        rowKey={defaultRowKey}
        {...(rest as TableProps<T>)}
        dataSource={Array.isArray(rest?.dataSource) ? rest.dataSource : []}
        pagination={defaultPagination}
        scroll={{ x: "max-content" }}
        className={[className, 'custom-table'].filter(Boolean).join(' ')}
      />
    </ConfigProvider>
  );
};

export default TableMain;