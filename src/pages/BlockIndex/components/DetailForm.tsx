import React, { useEffect, useState } from 'react';
import { Drawer, Tabs, Tag, Typography } from 'antd';
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
const { Text } = Typography;
const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const [reqData, setReqData] = useState<any>([]);
  const [rtsClass, setRtsClass] = useState<any>([]);
  const [showCharts, setShowCharts] = useState<boolean>(false);
  const [blockIndexId, setBlockIndexId] = useState<any>();
  const [rtData, setRtData] = useState<any>();

  useEffect(() => {
    if (props.currentRow) {
      const getData = async () => {
        try {
          const data = await blockIndexDetail({ id: props.currentRow });
          setReqData(data.data);

          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      };
      getData();
    }
  }, [props]);
  useEffect(() => {
    let rtsData: any = [];
    reqData?.rts?.forEach((item: number) => {
      const page = Math.floor(item / 500);
      if (!rtsData[page]) {
        rtsData[page] = [];
      }
      rtsData[page].push(item);
    });
    setRtsClass(rtsData);
  }, [reqData]);
  const columns = [
    {
      title: '项目ID',
      dataIndex: 'id',
      render: (dom: any, entity: any) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '实验ID',
      dataIndex: 'expId',
      render: (dom: any, entity: any) => {
        return <Tag>{dom}</Tag>;
      },
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
    // {
    //   title: 'rts',
    //   dataIndex: 'rts',
    //   render: (dom: any, entity: any) => {
    //     let rtsClass: any = [];
    //     entity.rts.forEach((item: number) => {
    //       const page = Math.floor(item / 500);
    //       if (!rtsClass[page]) {
    //         rtsClass[page] = [];
    //       }
    //       rtsClass[page].push(item);
    //     });

    //     return (
    //       <Tabs type="card" tabBarGutter={1} tabPosition="left" defaultActiveKey="0">
    //         {rtsClass.map((item: any, index: any) => {
    //           return (
    //             <TabPane tab={parseInt(item[0]) + '-' + parseInt(item.slice(-1))} key={index}>
    //               {item.map((_item: any, _index: any) => {
    //                 return (
    //                   <Tag
    //                     style={{ width: '75px', textAlign: 'center' }}
    //                     onClick={() => {
    //                       setBlockIndexId(entity.id);
    //                       setRtData(_item);
    //                       setShowCharts(true);
    //                     }}
    //                   >
    //                     {_item}
    //                   </Tag>
    //                 );
    //               })}
    //             </TabPane>
    //           );
    //         })}
    //       </Tabs>
    //     );
    //   },
    // },
  ];

  // useEffect(() => {
  //   if (props.currentRow) {
  //     const getData = async () => {
  //       try {
  //         const data = await blockIndexDetail({ id: props.currentRow });
  //         setReqData(data.data);
  //         return data;
  //       } catch (error) {
  //         console.log(error);
  //         return false;
  //       }
  //     };
  //     getData();
  //     console.log(reqData);

  //     let rtsData: any = [];
  //     reqData?.rts?.forEach((item: number) => {
  //       const page = Math.floor(item / 500);
  //       if (!rtsData[page]) {
  //         rtsData[page] = [];
  //       }
  //       rtsData[page].push(item);
  //     });
  //     setRtsClass(rtsData);
  //     console.log(rtsData);
  //   }
  // }, [props.currentRow]);

  return (
    <Drawer width={900} visible={props.showDetail} onClose={props.onClose} closable={false}>
      <ProDescriptions<TableListDetail>
        column={2}
        title={props.expNameRow}
        // request={reqData}
        dataSource={reqData}
        params={{
          id: props.currentRow,
        }}
        columns={columns as ProDescriptionsItemProps<TableListDetail>[]}
      />
      <Text>RT范围：</Text>
      {rtsClass.length > 0 && (
        <Tabs type="card" tabBarGutter={1} tabPosition="left" defaultActiveKey="0">
          {rtsClass.map((item: any, index: any) => {
            return (
              <TabPane tab={parseInt(item[0]) + '-' + parseInt(item.slice(-1))} key={index}>
                {item.map((_item: any, _index: any) => {
                  return (
                    <Tag
                      style={{ width: '75px', textAlign: 'center' }}
                      onClick={() => {
                        setBlockIndexId(props?.currentRow);
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
      )}
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
