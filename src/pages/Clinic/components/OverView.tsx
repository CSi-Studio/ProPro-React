import React, { useEffect, useState } from 'react';
import { Col, Descriptions, Row, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import { overviewList } from '@/pages/Overview/service';

export type QtChartsProps = {
  values: any;
};

const OverView: React.FC<QtChartsProps> = (props: any) => {
  useEffect(() => {
    /* 准备数据 */
    const init = async () => {
      try {
        const result = await overviewList(props.projectId);
        console.log(result);

        return true;
      } catch (err) {
        return false;
      }
    };
    init();
  }, []);

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
          // dataSource={prepareData?.method.score.scoreTypes.map((name: any, index: number) => {
          //   return { index, type: name, key: name };
          // })}
          rowKey={'key'}
          size="small"
          search={false}
          scroll={{ x: 'max-content' }}
          toolBarRender={false}
          tableAlertRender={false}
          // rowClassName={(record: any) => {
          //   return record.key === scoreTypeRowKey ? 'clinicTableBgc' : '';
          // }}
          // onRow={(record: any) => {
          //   return {
          //     onClick: () => {
          //       setScoreTypeRowKey(record.key);
          //     },
          //   };
          // }}
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
        {/* <ProTable
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
        /> */}
      </Col>
    </Row>
  );
};

export default OverView;
