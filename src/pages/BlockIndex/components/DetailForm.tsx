import React from 'react';
import { Button, Drawer } from 'antd';
import type { TableListDetail } from '../data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { blockIndexDetail } from '../service';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
};
const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '实验Id',
      dataIndex: 'expId',
    },
    {
      title: '等级',
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
    {
      title: 'range',
      dataIndex: 'range',
      render: (dom: any, entity: any) => {
        if (entity.range) {
          return (
            <span>
              start:{entity?.range?.start}
              <br />
              end:{entity?.range?.end}
              <br />
              mz:{entity?.range?.mz}
              <br />
            </span>
          );
        }
        return false;
      },
    },
    {
      title: 'rts',
      dataIndex: 'range',
      render: (dom: any, entity: any) => {
        return (
          <ul>
            {entity?.rts?.map((item: any, index: any) => {
              return (
                <li key={index}>
                  <Button>{item}</Button>
                </li>
              );
            })}
          </ul>
        );
      },
    },
  ];

  return (
    <Drawer width={800} visible={props.showDetail} onClose={props.onClose} closable={false}>
      <ProDescriptions<TableListDetail>
        column={1}
        title={props.currentRow}
        request={async () => {
          const msg = await blockIndexDetail({ id: props.currentRow });
          return Promise.resolve(msg);
        }}
        params={{
          id: props.currentRow,
        }}
        columns={columns as ProDescriptionsItemProps<TableListDetail>[]}
      />
    </Drawer>
  );
};

export default DetailForm;
