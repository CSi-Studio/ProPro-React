import React, { useState } from 'react';
import { Col, Row, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';

export type ScoreProps = {
  values: any;
};

const ScoreResults: React.FC<ScoreProps> = (props: any) => {
  const [scoreTypeRowKey, setScoreTypeRowKey] = useState<any>();
  const { prepareData, expData } = props.values;
  /* 打分结果Columns */
  let scoreColumns: any = [
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      render: (dom: any) => {
        return <Tag color="blue">{dom}</Tag>;
      },
    },
    {
      title: '鉴定态',
      dataIndex: 'status',
      key: 'status',
      render: (dom: any, entity: any) => {
        switch (entity.status) {
          case 0:
            return <Tag color="blue">尚未鉴定</Tag>;
            break;
          case 1:
            return <Tag color="success">鉴定成功</Tag>;
            break;
          case 2:
            return <Tag color="error">鉴定失败</Tag>;
            break;
          case 3:
            return <Tag color="warning">碎片不足</Tag>;
            break;
          case 4:
            return <Tag color="warning">没有峰组</Tag>;
            break;
          case 5:
            return <Tag color="warning">EIC为空</Tag>;
            break;
          default:
            return <Tag color="warning">没有峰组</Tag>;
            break;
        }
      },
    },
    {
      title: 'RealRT',
      dataIndex: 'realRt',
      key: 'realRt',
      width: 70,
      render: (dom: any, entity: any) => {
        return <Tag color="blue">{entity.realRt?.toFixed(1)}</Tag>;
      },
    },
    {
      title: 'Sum',
      dataIndex: 'sum',
      key: 'sum',
      width: 70,
      render: (dom: any, entity: any) => {
        return <Tag color="blue">{entity.sum?.toFixed(0)}</Tag>;
      },
    },
    {
      title: '最低总分',
      dataIndex: 'minTotalScore',
      key: 'minTotalScore',
      width: 70,
      render: (dom: any, entity: any) => {
        return <Tag color="blue">{entity.minTotalScore?.toFixed(3)}</Tag>;
      },
    },
  ];
  if (prepareData) {
    const scoreColumn = prepareData.method.score.scoreTypes.map((type: string, index: number) => ({
      title: (value: { tooltip: any }) => {
        return index === 0 ? (
          <a
            style={{ width: '60px', display: 'inline-block' }}
            onClick={() => {
              setScoreTypeRowKey(value.tooltip);
            }}
          >
            0(总分)
          </a>
        ) : (
          <a
            style={{ width: '60px', display: 'inline-block' }}
            onClick={() => {
              setScoreTypeRowKey(value.tooltip);
            }}
          >
            {index}
          </a>
        );
      },
      dataIndex: index,
      key: index,
      width: 80,
      tooltip: type,
      render: (dom: any, entity: any) => {
        if (
          entity.selectIndex !== null &&
          entity.scoreList !== null &&
          entity.scoreList[entity.selectIndex].scores[index] !== null &&
          entity.scoreList[entity.selectIndex].scores[index] !== 'NaN' &&
          prepareData.overviewMap[entity.expId] != null &&
          prepareData.overviewMap[entity.expId].length > 0
        ) {
          return (
            <>
              {index === 0 ? (
                <Tag color="blue">
                  {entity.scoreList[entity.selectIndex]?.scores[index]?.toFixed(3)}
                </Tag>
              ) : (
                <Tag color="success">
                  {`${prepareData.overviewMap[entity.expId][0]?.weights[type]?.toFixed(
                    3,
                  )}x${entity.scoreList[entity.selectIndex]?.scores[index]?.toFixed(2)}=${(
                    prepareData.overviewMap[entity.expId][0]?.weights[type] *
                    entity.scoreList[entity.selectIndex]?.scores[index]
                  )?.toFixed(4)}`}
                </Tag>
              )}
            </>
          );
        }
        return <Tag color="red">NaN</Tag>;
      },
    }));
    scoreColumns.push(scoreColumn);
  }
  scoreColumns = [].concat(...scoreColumns); // 拍平数组

  return (
    <Row>
      <Col span={3.5}>
        <ProTable
          columns={[
            {
              title: 'Index',
              dataIndex: 'index',
              key: 'index',
            },
            {
              title: '打分类别',
              dataIndex: 'type',
              key: 'type',
            },
          ]}
          dataSource={prepareData?.method.score.scoreTypes.map((name: any, index: number) => {
            return { index, type: name, key: name };
          })}
          rowKey={'key'}
          size="small"
          search={false}
          scroll={{ x: 'max-content' }}
          toolBarRender={false}
          tableAlertRender={false}
          rowClassName={(record: any) => {
            return record.key === scoreTypeRowKey ? 'clinicTableBgc' : '';
          }}
          onRow={(record: any) => {
            return {
              onClick: () => {
                setScoreTypeRowKey(record.key);
              },
            };
          }}
          pagination={{
            hideOnSinglePage: true,
            size: 'small',
            showSizeChanger: false,
            showQuickJumper: false,
            pageSize: 24,
            showTotal: () => null,
            position: ['bottomRight'],
          }}
        />
      </Col>
      <Col span={20}>
        <ProTable
          style={{ width: '69vw' }}
          columns={scoreColumns}
          dataSource={expData}
          rowKey={'id'}
          size="small"
          search={false}
          scroll={{ x: 'max-content' }}
          toolBarRender={false}
          tableAlertRender={false}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 24,
            size: 'small',
          }}
        />
      </Col>
    </Row>
  );
};

export default ScoreResults;
