import React from 'react';
import { Modal, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';

export type CutInfoProps = {
  handleCancel: () => void;
  cutInfoVisible: boolean;
  values: any;
};
const CutInfo: React.FC<CutInfoProps> = (props) => {
  let fragmentsColumns: any = [
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      width: 60,
      render: (dom: any) => {
        return <Tag color="blue">{dom}</Tag>;
      },
    },
    {
      title: '鉴定态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
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
            return <Tag color="warning">条件不足</Tag>;
            break;
          default:
            return <Tag color="warning">缺少峰组</Tag>;
            break;
        }
      },
    },
  ];
  let fragments: any[] = [];
  props.values.expData.forEach((value: any) => {
    Object.keys(value.cutInfoMap).forEach((key: any) => {
      fragments.push(key);
      // console.log(key);
    });
  });
  fragments = [...new Set(fragments)];

  const fragmentsColumn = fragments.map((fragment: any) => ({
    title: fragment,
    dataIndex: 'cutInfo',
    key: 'cutInfo',
    width: 70,
    render: (dom: any, entity: any) => {
      return <Tag>{entity.cutInfoMap[fragment].toFixed(4)}</Tag>;
    },
  }));
  fragmentsColumns.push(fragmentsColumn);
  fragmentsColumns = [].concat(...fragmentsColumns);

  return (
    <Modal
      width={'45vw'}
      centered={true}
      title="碎片Mz"
      visible={props.cutInfoVisible}
      onCancel={props.handleCancel}
      footer={[]}
    >
      <ProTable
        // style={{ width: '69vw' }}
        columns={fragmentsColumns}
        dataSource={props.values.expData}
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
    </Modal>
  );
};

export default CutInfo;
