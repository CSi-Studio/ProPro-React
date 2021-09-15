import { Tag, Typography } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { blockIndexList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import { Link } from 'umi';

const { Text } = Typography;
const TableList: React.FC = (props: any) => {
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
  const projectName = props?.location?.state.projectName;
  const [idRow, setRowId] = useState<any>();

  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'level',
      dataIndex: 'level',
      search: false,
      sorter: (a, b) => (a.level < b.level ? -1 : 1),
    },
    {
      title: '文件开始位置',
      dataIndex: 'startPtr',
      search: false,
      sorter: (a, b) => (a.startPtr < b.startPtr ? -1 : 1),
    },
    {
      title: '文件结束位置',
      dataIndex: 'endPtr',
      search: false,
    },
    {
      title: 'mz范围',
      dataIndex: 'range',
      sorter: (a, b) => {
        if (a.range?.start < b.range?.start) {
          return -1;
        }
        if (a.range?.start > b.range?.start) {
          return 1;
        }
        return 0;
      },
      search: false,
      render: (dom: any, entity: any) => {
        if (entity.range) {
          return (
            <span>
              {entity?.range?.start}~{entity?.range?.end}
            </span>
          );
        }
        return false;
      },
    },

    {
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => (
        <>
          <a
            onClick={() => {
              setRowId(record.id);
              setShowDetail(true);
            }}
            key="detail"
          >
            <Tag color="blue">
              <Icon
                style={{ verticalAlign: 'middle', fontSize: '20px' }}
                icon="mdi:file-document"
              />
              详情
            </Tag>
          </a>
        </>
      ),
    },
  ];

  const columnsNew = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '实验Id',
      dataIndex: 'expId',
    },
    {
      title: '等级',
      dataIndex: 'level',
    },
    {
      title: 'startPtr',
      dataIndex: 'startPtr',
    },
    {
      title: 'endPtr',
      dataIndex: 'endPtr',
    },
  ];
  /* 点击行选中相关 */
  const selectRow = (record: any) => {
    const rowData = [...selectedRows];
    if (rowData.length == 0) {
      rowData.push(record);
      setSelectedRows(rowData);
    } else {
      if (rowData.indexOf(record) >= 0) {
        rowData.splice(rowData.indexOf(record), 1);
      } else {
        rowData.push(record);
      }
      setSelectedRows(rowData);
    }
  };
  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={
          props?.location?.state?.expName === undefined ? (
            <>
              <Text type="secondary">索引列表</Text>
            </>
          ) : (
            <>
              <Link
                to={{
                  pathname: '/project/list',
                }}
              >
                <Text type="secondary">项目列表</Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <Link
                to={{
                  pathname: '/experiment/list',
                  search: `?projectId=${props?.location?.state?.projectId}`,
                  state: { projectName },
                }}
              >
                <Text type="secondary">实验列表</Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <a>
                <Text>索引列表 所属实验：{props?.location?.state.expName}</Text>
              </a>
            </>
          )
        }
        actionRef={actionRef}
        rowKey="id"
        size="small"
        search={false}
        tableAlertRender={false}
        request={async (params) => {
          const msg = await blockIndexList({ expId: props?.location?.query?.expId, ...params });
          return Promise.resolve(msg);
        }}
        columns={columns}
        pagination={false}
        onRow={(record) => {
          return {
            onClick: () => {
              selectRow(record);
            },
          };
        }}
        rowSelection={{
          selectedRowKeys: selectedRows?.map((item) => {
            return item.id;
          }),
          onChange: (_, selectedRowKeys) => {
            setSelectedRows(selectedRowKeys);
          },
        }}
      />

      {/* 列表详情 */}
      <DetailForm
        showDetail={showDetail}
        currentRow={idRow}
        columns={columnsNew}
        onClose={() => {
          setShowDetail(false);
        }}
        expNameRow={props?.location?.state?.expName}
      />
    </>
  );
};

export default TableList;
