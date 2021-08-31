import React, { useState } from 'react';
import { Button, Drawer, message, Slider, Space, Tag, Tooltip } from 'antd';
import type { TableListDetail } from '../data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { blockIndexDetail, spectrumCharts, spectrumGauss } from '../service';
import { parseInt } from 'lodash';
import ChartsForm from './DetailChartsForm';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
  expNameRow: any;
};

const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const [sliderValue, setValue] = useState<any>();
  // const [maxRT, setMaxRT] = useState<any>();
  // const [minRT, setMintRT] = useState<any>();
  const [showCharts, setShowCharts] = useState<boolean>(false);
  const [smallRange, setSmallRange] = useState<boolean>(true);
  const [chartsData, setChartsData] = useState<any>();
  const [rtData, setRtData] = useState<any>(12);
  const [maxRange, setMaxRange] = useState<any>();
  const [minRange, setMinRange] = useState<any>();
  const [detailValue, setDetailValue] = useState<any>([0, 0]);
  var getRandomColor = function () {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  // const onFinish = (values: any) => {
  //   setMaxRT(values.max);
  //   setMintRT(values.min);
  // };

  // const onFinishFailed = (errorInfo: any) => {};
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
      // render: (dom: any, entity: any) => {
      //   if (entity.range) {
      //     return (
      //       <span>
      //         start:{entity?.range?.start}
      //         <br />
      //         end:{entity?.range?.end}
      //         <br />
      //         mz:{entity?.range?.mz}
      //         <br />
      //       </span>
      //     );
      //   }
      //   return false;
      // },
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
        return (
          <>
            {/* <Slider vertical reverse={true} dots onChange={setValue} value={sliderValue} style={{height: 400}}   range={{draggableTrack:true}}  max={entity.rts.length} min={0} /> */}

            {/* <Space direction="vertical" >
              <span>
                当前的rt时间范围为:{entity.rts[0]}~~{entity.rts[entity.rts.length - 1]}
              </span>
              <span>当前的rt标签数目为:{entity.rts.length}</span>

              <Slider
                range={{ draggableTrack: true }}
                onChange={setValue}
                value={sliderValue}
                max={entity.rts.length}
                min={0}
                style={{ width: 400 }}
              />
              <Button
                onClick={async () => {
                  setMaxRange(sliderValue[1]);
                  setMinRange(sliderValue[0]);
                  setSmallRange(false);
                }}
              >
                大范围锁定
              </Button>
              <span hidden={smallRange}>
                <Slider
                  range={{ draggableTrack: true }}
                  onChange={setDetailValue}
                  value={detailValue}
                  max={maxRange}
                  min={minRange}
                  style={{ width: 400 }}
                />
              </span>
            </Space> */}

            <span style={{ width: '800px' }}>
              {
                entity?.rts.map((item: any, index: any) => {
                  return (
                    <Space key={index} direction={"horizontal"} size={1}>
                      <Tag onClick={async () => {
                        setShowCharts(true);
                        const hide = message.loading('正在加载');
                        // const msg = await spectrumCharts({ blockIndexId: entity.id, rt: item });
                        const msg = await spectrumGauss({ blockIndexId: entity.id, rt: item, pointNum: 5 });
                        hide();
                        setChartsData(msg.data);
                        setRtData(item);
                      }}>{item}
                      </Tag>
                    </Space>
                  );
                  return null;
                })
              }
            </span>

          </>
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
          setChartsData(undefined);
          setRtData('');
        }}
        onSubmit={() => {
          setShowCharts(false);
        }}
        rtData={rtData}
        chartsData={chartsData}
        showCharts={showCharts}
      />
    </Drawer>
  );
};

export default DetailForm;
