import { Divider, Radio, Table } from 'antd';
import React, { useState } from 'react'

const TableComponent = (props) => {
const {selectionType = 'checkbox'} = props

    const columns = [
        {
        title: 'Name',
        dataIndex: 'name',
        render: (text) => <a>{text}</a>,
        },
        {
        title: 'Age',
        dataIndex: 'age',
        },
        {
        title: 'Address',
        dataIndex: 'address',
        },
    ];
    const data = [
        {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        },
        {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        },
        {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        },
        {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sydney No. 1 Lake Park',
        },
    ];

  return (
    <Table
        rowSelection={{
            type: selectionType,
            ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
    />
  )
}

export default TableComponent
