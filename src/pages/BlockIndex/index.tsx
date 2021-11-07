import { Tag, Typography } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { blockIndexList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import { Link, FormattedMessage } from 'umi';

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
      showSorterTooltip: false,
      sorter: (a, b) => (a.level < b.level ? -1 : 1),
    },
    {
      title: <FormattedMessage id="table.startPtr" />,
      dataIndex: 'startPtr',
      search: false,
      showSorterTooltip: false,
      sorter: (a, b) => (a.startPtr < b.startPtr ? -1 : 1),
    },
    {
      title: <FormattedMessage id="table.endPtr" />,
      dataIndex: 'endPtr',
      search: false,
    },
    {
      title: <FormattedMessage id="table.mzRange" />,
      dataIndex: 'range',
      showSorterTooltip: false,
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
      title: <FormattedMessage id="table.option" />,
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
              <FormattedMessage id="table.detail" />
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
      title: <FormattedMessage id="table.expId" />,
      dataIndex: 'expId',
    },
    {
      title: <FormattedMessage id="table.level" />,
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
              <Text type="secondary">
                <FormattedMessage id="table.BlockIndexList" />
              </Text>
            </>
          ) : (
            <>
              <Link
                to={{
                  pathname: '/project/list',
                }}
              >
                <Text type="secondary">
                  <FormattedMessage id="table.projectList" />
                </Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <Link
                to={{
                  pathname: '/experiment/list',
                  search: `?projectId=${props?.location?.state?.projectId}`,
                  state: { projectName },
                }}
              >
                <Text type="secondary">
                  <FormattedMessage id="table.expList" />
                </Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <a>
                <Text>
                  <FormattedMessage id="table.BlockIndexList" />{' '}
                  <FormattedMessage id="table.belongExp" />：{props?.location?.state.expName}
                </Text>
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
