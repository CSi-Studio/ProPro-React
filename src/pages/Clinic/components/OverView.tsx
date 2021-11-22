import React, { useState } from 'react';
import { Col, Row, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage } from 'umi';

export type OverViewProps = {
  values: any;
};

const OverView: React.FC<OverViewProps> = (props: any) => {
  const [ovRowKey, setOvRowKey] = useState<any>();
  const { prepareData, runData } = props.values;

  let scoreResult: any[] = runData.map((item: any) => {
    return item?.peakGroupList?.map((_item: any, index: any) => ({
      runId: item.runId,
      alias: item.alias,
      status: item.status,
      apexRt: _item.apexRt,
      selectedRt: _item.selectedRt,
      ionsLow: _item.ionsLow,
      fine: _item.fine,
      intensitySum: _item.intensitySum,
      minTotalScore: item.minTotalScore,
      totalScore: _item.totalScore,
      index,
      key: _item.apexRt,
      selectIndex: item.selectIndex,
      peakGroupList: item?.peakGroupList,
    }));
  });
  scoreResult = [].concat(...scoreResult); // 拍平数组
  const pageSize: number = scoreResult.length;

  /* 打分结果Columns */
  let scoreColumns: any = [
    {
      title: <FormattedMessage id="table.alias" />,
      dataIndex: 'alias',
      key: 'alias',
      fixed: 'left',
      width: 50,
      render: (dom: any, entity: any) => {
        if (dom !== '-') {
          if (entity?.index === entity?.selectIndex) {
            return <Tag color="#87d068">{dom}</Tag>;
          }
          return <Tag color="blue">{dom}</Tag>;
        } else {
          return <Tag>NaN</Tag>;
        }
      },
    },
    {
      title: <FormattedMessage id="component.identStatus" />,
      dataIndex: 'status',
      key: 'status',
      fixed: 'left',
      width: 70,
      render: (dom: any, entity: any) => {
        if (entity?.index === entity?.selectIndex) {
          switch (entity?.status) {
            case 0:
              return (
                <Tag color="blue">
                  <FormattedMessage id="component.noIdentify" />
                </Tag>
              );
              break;
            case 1:
              return (
                <Tag color="success">
                  <FormattedMessage id="component.successIdentify" />
                </Tag>
              );
              break;
            case 2:
              return (
                <Tag color="error">
                  <FormattedMessage id="component.failIdentify" />
                </Tag>
              );
              break;
            case 3:
              return (
                <Tag color="warning">
                  <FormattedMessage id="component.notEnoughIdentify" />
                </Tag>
              );
              break;
            case 4:
              return (
                <Tag color="warning">
                  <FormattedMessage id="component.lackOfPeakGroup" />
                </Tag>
              );
              break;
            case 5:
              return (
                <Tag color="warning">
                  <FormattedMessage id="component.noEIC" />
                </Tag>
              );
              break;
            default:
              return (
                <Tag color="warning">
                  <FormattedMessage id="component.unknownError" />
                </Tag>
              );
              break;
          }
        }
        if (entity?.peakGroupList[entity?.index]?.scores[0] >= entity?.minTotalScore) {
          return (
            <Tag color="success">
              <FormattedMessage id="component.successIdentify" />
            </Tag>
          );
        }
        return (
          <Tag color="error">
            <FormattedMessage id="component.failIdentify" />
          </Tag>
        );
      },
    },
    {
      title: 'Ions',
      dataIndex: 'ionsLow',
      key: 'ionsLow',
      fixed: 'left',
      width: 50,
      render: (dom: any, entity: any) => {
        if (dom !== '-') {
          return <Tag color="blue">{entity?.ionsLow}</Tag>;
        } else {
          return <Tag>NaN</Tag>;
        }
      },
    },

    {
      title: 'RT',
      dataIndex: 'selectedRt',
      key: 'selectedRt',
      width: 70,
      fixed: 'left',
      render: (dom: any, entity: any) => {
        if (dom !== '-') {
          return <Tag color="blue">{entity?.selectedRt?.toFixed(1)}</Tag>;
        } else {
          return <Tag>NaN</Tag>;
        }
      },
    },
    {
      title: 'Sum',
      dataIndex: 'intensitySum',
      key: 'intensitySum',
      fixed: 'left',
      width: 70,
      render: (dom: any, entity: any) => {
        if (dom !== '-') {
          return <Tag color="blue">{entity?.intensitySum?.toFixed(0)}</Tag>;
        } else {
          return <Tag>NaN</Tag>;
        }
      },
    },
    {
      title: <FormattedMessage id="component.minTotalScore" />,
      dataIndex: 'minTotalScore',
      key: 'minTotalScore',
      width: 70,
      fixed: 'left',
      render: (dom: any, entity: any) => {
        if (dom !== '-') {
          return <Tag color="blue">{entity?.minTotalScore?.toFixed(3)}</Tag>;
        } else {
          return <Tag>NaN</Tag>;
        }
      },
    },
    {
      title: <FormattedMessage id="component.totalScore" />,
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 70,
      fixed: 'left',
      render: (dom: any, entity: any) => {
        return <Tag color={entity?.totalScore>entity?.minTotalScore? (entity?.index === entity?.selectIndex?"green":"blue"):"red"}>{entity?.totalScore?.toFixed(3)}</Tag>;
      },
    },
  ];

  if (prepareData) {
    const scoreColumn = prepareData.method.score.scoreTypes.map((type: string, index: number) => ({
      title: (value: { tooltip: any }) => {
        return <a
            style={{ width: '60px', display: 'inline-block' }}
            onClick={() => {
              setOvRowKey(value.tooltip);
            }}
          >
            {index}
          </a>;
      },
      dataIndex: index,
      key: index.toString(),
      width: 80,
      fixed: `${index === 0 ? 'left' : 'false'}`,
      tooltip: type,
      render: (dom: any, entity: any) => {
        if (
          entity?.selectIndex !== null &&
          entity?.peakGroupList !== null &&
          entity?.peakGroupList[entity?.selectIndex].scores[index] !== null &&
          entity?.peakGroupList[entity?.selectIndex].scores[index] !== 'NaN' &&
          prepareData.overviewMap[entity?.runId] != null &&
          prepareData.overviewMap[entity?.runId].length > 0
        ) {
          return <>
              {index===0?(
                <Tag
                  color={entity?.peakGroupList[entity?.index]?.fine ? 'green' : 'blue'}
                  key={entity?.peakGroupList[entity?.index]?.scores[index]?.toString()}
                >
                  {`${prepareData.overviewMap[entity?.runId][0]?.weights[type]?.toFixed(
                    3,
                  )}x${entity?.peakGroupList[entity?.index]?.scores[index]?.toFixed(2)}=${(
                    prepareData.overviewMap[entity?.runId][0]?.weights[type] *
                    entity?.peakGroupList[entity?.index]?.scores[index]
                  )?.toFixed(2)}`}
                </Tag>
              ) : (
                <Tag key={entity?.peakGroupList[entity?.index]?.scores[index]?.toString()}>
                  {`${prepareData.overviewMap[entity?.runId][0]?.weights[type]?.toFixed(
                    3,
                  )}x${entity?.peakGroupList[entity?.index]?.scores[index]?.toFixed(2)}=${(
                    prepareData.overviewMap[entity?.runId][0]?.weights[type] *
                    entity?.peakGroupList[entity?.index]?.scores[index]
                  )?.toFixed(2)}`}
                </Tag>
              )}
            </>
      }
      return <Tag color="red">NaN</Tag>;
    }}));
    scoreColumns.push(scoreColumn);
  }
  scoreColumns = [].concat(...scoreColumns); // 拍平数组

  return (
    <>
      <>
        <strong>Protein: </strong>
        <span style={{ userSelect: 'all' }}>{runData[0].proteins[0]}</span>
        &nbsp;&nbsp;
        <strong>Peptide</strong>: <span style={{ userSelect: 'all' }}>{runData[0].peptideRef}</span>
        &nbsp;&nbsp;
      </>
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
                title: <FormattedMessage id="component.scoreType" />,
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
            // scroll={{ x: 'max-content' }}
            toolBarRender={false}
            tableAlertRender={false}
            rowClassName={(record: any) => {
              return record.key === ovRowKey ? 'clinicTableBgc' : '';
            }}
            onRow={(record: any) => {
              return {
                onClick: () => {
                  setOvRowKey(record.key);
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
            dataSource={scoreResult}
            // rowKey={'key'}
            size="small"
            search={false}
            scroll={{ x: 'max-content', y: 730 }}
            toolBarRender={false}
            tableAlertRender={false}
            pagination={{
              hideOnSinglePage: true,
              pageSize,
              size: 'small',
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default OverView;
