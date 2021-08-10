/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { peptideList } from './service';
import type { TableListItem, TableListPagination } from './data';
import { EditFilled, FileTextOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';

const TableList: React.FC = (props) => {
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();
  console.log(props?.location.query);

  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标准库名称',
      dataIndex: 'name',
      copyable: true,
      width: '150px',
      render: (dom, entity) => {
        return (
          <Tooltip title={dom} color="#eeeeee" placement="topLeft">
            <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <a
                onClick={() => {
                  setCurrentRow(entity);
                  // setPopup(true);
                }}
              >
                <FileTextOutlined />
                {dom}
              </a>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'PeptideRef',
      dataIndex: 'peptideRef',
      width: '100px',
      // hideInSearch: true,
      sorter: (a, b) => (a.peptideRef > b.peptideRef ? -1 : 1),
    },
    {
      title: 'm / z',
      dataIndex: 'mz',
      width: '120px',
    },
    {
      title: 'RT',
      width: '160px',
      // copyable: true,1
      dataIndex: 'rt',
    },
    {
      title: '肽段序列',
      width: '120px',
      dataIndex: 'fullName',
    },
    {
      title: '伪肽段',
      width: '120px',
      dataIndex: 'decoySequence',
    },
    {
      title: '离子片段',
      width: '120px',
      dataIndex: 'fragments',
      // render: (dom, entity) => [
      //   <div
      //     style={{
      //       display: 'flex',
      //       flexDirection: 'column',
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //     }}
      //   >
      //     {entity.decoyFragments.map((item) => (
      //       <p
      //         key={item.cutInfo}
      //         style={{
      //           textAlign: 'center',
      //           backgroundColor: '#eee',
      //           display: 'flex',
      //           justifyContent: 'center',
      //           alignItems: 'center',
      //           margin: 0,
      //           borderBottom: '1px solid #000',
      //         }}
      //       >
      //         <p style={{ margin: '0 2px', width: '50px' }}>{item.cutInfo}</p>
      //         <p style={{ margin: '0 2px', width: '180px' }}>{item.mz}</p>
      //         <p style={{ margin: '0 2px', width: '60px' }}>{item.intensity}</p>
      //         <p style={{ margin: '0 2px', width: '20px' }}>{item.charge}</p>
      //         <p
      //           style={{
      //             margin: '0 2px',
      //             width: '120px',
      //             whiteSpace: 'nowrap',
      //             overflow: 'hidden',
      //             textOverflow: 'ellipsis',
      //           }}
      //         >
      //           <Tooltip title={item.annotations}>{item.annotations}</Tooltip>
      //         </p>
      //       </p>
      //     ))}
      //   </div>,
      // ],
      children: [
        {
          title: 'CutInfo',
          dataIndex: 'cutInfo',
          width: '50px',
          render: (dom, entity) => [
            <div
              style={{
                color: '#666666',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {entity.decoyFragments.map((item) => (
                <p
                  key={item.cutInfo}
                  style={{
                    margin: 0,
                  }}
                >
                  <p
                    style={{
                      textAlign: 'center',
                      margin: '0 2px',
                      width: '50px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.cutInfo}
                  </p>
                </p>
              ))}
            </div>,
          ],
        },
        {
          title: '碎片荷质比',
          dataIndex: 'mz',
          width: '160px',
          render: (dom, entity) => [
            <div
              style={{
                color: '#666666',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {entity.decoyFragments.map((item) => (
                <p
                  key={item.cutInfo}
                  style={{
                    margin: 0,
                  }}
                >
                  <p
                    style={{
                      margin: '0 2px',
                      width: '160px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.mz}
                  </p>
                </p>
              ))}
            </div>,
          ],
        },
        {
          title: '强度',
          dataIndex: 'intensity',
          width: '60px',
          render: (dom, entity) => [
            <div
              style={{
                color: '#666666',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {entity.decoyFragments.map((item) => (
                <p
                  key={item.cutInfo}
                  style={{
                    margin: 0,
                  }}
                >
                  <p
                    style={{
                      margin: '0 2px',
                      width: '60px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.intensity}
                  </p>
                </p>
              ))}
            </div>,
          ],
        },
        {
          title: '带电量',
          dataIndex: 'charge',
          width: '60px',
          render: (dom, entity) => [
            <div
              style={{
                color: '#666666',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {entity.decoyFragments.map((item) => (
                <p
                  key={item.cutInfo}
                  style={{
                    margin: 0,
                  }}
                >
                  <p
                    style={{
                      margin: '0 2px',
                      width: '15px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.charge}
                  </p>
                </p>
              ))}
            </div>,
          ],
        },
        {
          title: 'Annotations',
          dataIndex: 'Annotations',
          width: '80px',
          render: (dom, entity) => [
            <div
              style={{
                color: '#666666',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {entity.decoyFragments.map((item) => (
                <p
                  key={item.cutInfo}
                  style={{
                    margin: 0,
                  }}
                >
                  <p
                    style={{
                      margin: '0 2px',
                      width: '80px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <Tooltip title={item.annotations}>{item.annotations}</Tooltip>
                  </p>
                </p>
              ))}
            </div>,
          ],
        },
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      width: '120px',
      render: (text, record) => [
        <Tooltip title={'详情'} key="edit">
          <a
            onClick={() => {
              setCurrentRow(record);
              // setPopup(true);
            }}
            key="edit"
          >
            <EditFilled style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }} />
          </a>
        </Tooltip>,
        <Tooltip title={'预测肽段碎片'} key="edit">
          <a
            onClick={() => {
              setCurrentRow(record);
              // setPopup(true);
            }}
            key="edit"
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
              icon="mdi:robot-dead"
            />
          </a>
        </Tooltip>,
        <Tooltip title={'删除'} key="edit">
          <a
            onClick={() => {
              setCurrentRow(record);
              // setPopup(true);
            }}
            key="edit"
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '18px', color: '#0D93F7' }}
              icon="mdi:delete"
            />
          </a>
        </Tooltip>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={peptideList}
        // dataSource={tableListDataSource}
        columns={columns}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // },
          }
        }
      />
    </PageContainer>
  );
};

export default TableList;
