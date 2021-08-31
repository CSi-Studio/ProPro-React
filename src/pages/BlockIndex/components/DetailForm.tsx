import React, { useState } from 'react';
import { Drawer, Space, Tabs, Tag, } from 'antd';
import type { TableListDetail } from '../data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { blockIndexDetail } from '../service';
import ChartsForm from './DetailChartsForm';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
  expNameRow: any;
};
const { TabPane } = Tabs;
const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const [showCharts, setShowCharts] = useState<boolean>(false);
  const [blockIndexId, setBlockIndexId] = useState<any>();
  const [rtData, setRtData] = useState<any>();
  const columns = [
    {
      title: '项目ID',
      dataIndex: 'id',
    },
    {
      title: '实验ID',
      dataIndex: 'expId',
    },
    {
      title: '等级',
      dataIndex: 'level',
    },
    {
      title: 'mz范围',
      dataIndex: 'range',
      render: (dom: any, entity: any) => {
        if (entity.range) {
          return (
            <span>
              {entity?.range?.start} ~ {entity?.range?.end}
            </span>
          );
        }
        return false;
      },
    },
    {
      title: '开始位置',
      dataIndex: 'startPtr',
    },
    {
      title: '结束位置',
      dataIndex: 'endPtr',
    },
    {
      title: 'rts',
      dataIndex: 'rts',
      render: (dom: any, entity: any) => {
        let rtsClass: any = [];
        entity.rts.forEach((item: number) => {
          const page = Math.floor(item / 500);
          if (!rtsClass[page]) {
            rtsClass[page] = [];
          }
          rtsClass[page].push(item);
        });

        return (
          <Tabs type="card" tabBarGutter={1} tabPosition="left" defaultActiveKey="0">
            {rtsClass.map((item: any, index: any) => {
              return (
                <TabPane tab={parseInt(item[0]) + '-' + parseInt(item.slice(-1))} key={index}>
                  {item.map((_item: any, _index: any) => {
                    return (
                      <Tag
                        style={{ width: '75px', textAlign: 'center' }}
                        onClick={() => {
                          setBlockIndexId(entity.id);
                          setRtData(_item);
                          setShowCharts(true);
                        }}
                      >
                        {_item}
                      </Tag>
                    );
                  })}
                </TabPane>
              );
            })}
          </Tabs>
        );
      },
    },
  ];

  return (
    <Drawer width={900} visible={props.showDetail} onClose={props.onClose} closable={false}>
      <ProDescriptions<TableListDetail>
        column={2}
        title={props.expNameRow}
        request={async () => {
          const msg = await blockIndexDetail({ id: props.currentRow });
          return Promise.resolve(msg);
        }}
        params={{
          id: props.currentRow,
        }}
        columns={columns as ProDescriptionsItemProps<TableListDetail>[]}
      />
      <ChartsForm
        onCancel={() => {
          setShowCharts(false);
          setBlockIndexId(null);
          setRtData(null);
        }}
        onSubmit={async () => {
          setShowCharts(false);
          setBlockIndexId(null);
          setRtData(null);
        }}
        rtData={rtData}
        blockIndexId={blockIndexId}
        showCharts={showCharts}
      />
    </Drawer>
  );
};

export default DetailForm;
