import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Drawer, Space, Tooltip } from 'antd';
import { Tag } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

export type ContrastListFormProps = {
  contrastModalVisible: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
};

const ContrastList: React.FC<ContrastListFormProps> = (props) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '标准库ID',
      dataIndex: 'libraryId',
    },
    {
      title: '蛋白质名称',
      dataIndex: 'proteinIdentifier',
    },
    {
      title: 'PeptideRef',
      dataIndex: 'peptideRef',
    },
    {
      title: '荷质比（m/z）',
      dataIndex: 'mz',
    },
    {
      title: 'RT',
      dataIndex: 'rt',
    },
    {
      title: '带电量',
      dataIndex: 'charge',
    },
    {
      title: '肽段完整名称',
      dataIndex: 'fullName',
    },
    {
      title: '肽段序列',
      dataIndex: 'sequence',
    },
    {
      title: '伪肽段',
      dataIndex: 'decoySequence',
    },

    {
      title: '离子片段',
      render: (dom: any, entity: { fragments: any[] }) => [
        <div
          style={{
            width: '600px',
            color: '#666666',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div
            key="1"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            CutInfo
            {entity.fragments.map((item: any) => (
              <div
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
              </div>
            ))}
          </div>
          <div
            key="2"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            碎片荷质比（m/z）
            {entity.fragments.map((item: any) => (
              <div
                key={item.mz}
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
              </div>
            ))}
          </div>
          <div
            key="3"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            强度
            {entity.fragments.map((item: any) => (
              <div
                key={item.intensity}
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
              </div>
            ))}
          </div>
          <div
            key="4"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            带电量
            {entity.fragments.map((item: any) => (
              <div
                key={item.charge}
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
              </div>
            ))}
          </div>
          <div
            key="5"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            Annotations
            {entity.fragments.map((item: any) => (
              <div
                key={item.annotations}
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
              </div>
            ))}
          </div>
        </div>,
      ],
    },
    {
      title: '伪肽段片段',
      render: (dom: any, entity: { decoyFragments: any[] }) => [
        <div
          style={{
            width: '600px',
            color: '#666666',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div
            key="1"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            CutInfo
            {entity.decoyFragments.map((item: any) => (
              <div
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
              </div>
            ))}
          </div>
          <div
            key="2"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            碎片荷质比（m/z）
            {entity.decoyFragments.map((item: any) => (
              <div
                key={item.mz}
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
              </div>
            ))}
          </div>
          <div
            key="3"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            强度
            {entity.decoyFragments.map((item: any) => (
              <div
                key={item.intensity}
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
              </div>
            ))}
          </div>
          <div
            key="4"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            带电量
            {entity.decoyFragments.map((item: any) => (
              <div
                key={item.charge}
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
              </div>
            ))}
          </div>
          <div
            key="6"
            style={{
              color: '#666666',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            Annotations
            {entity.decoyFragments.map((item: any) => (
              <div
                key={item.annotations}
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
              </div>
            ))}
          </div>
        </div>,
      ],
    },
  ];
  columns.push(props.columns.pop());
  // eslint-disable-next-line no-console
  console.log(columns);
  // eslint-disable-next-line no-console
  console.log(props.currentRow);

  return (
    <Drawer
      width={800}
      visible={props.contrastModalVisible}
      onClose={props.onClose}
      closable={false}
    >
      {/* {props.currentRow?.peptideRef && (
        <ProDescriptions
          column={1}
          title={props.currentRow?.peptideRef}
          request={async () => ({
            data: props.currentRow || {},
          })}
          params={{
            id: props.currentRow?.peptideRef,
          }}
          columns={columns as ProDescriptionsItemProps[]}
        />
      )} */}
    </Drawer>
  );
};

export default ContrastList;
