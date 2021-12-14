import React from 'react';
import { Divider, Drawer, Space, Tag, Timeline } from 'antd';
import type { TableListItem } from '@/pages/Project/data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
};

const DetailForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <Drawer width={700} visible={props.showDetail} onClose={props.onClose} closable={false}>
      {props.currentRow?.name && (
        <ProDescriptions<TableListItem>
          column={2}
          title={props.currentRow?.name}
          request={async () => ({
            data: props.currentRow || {},
          })}
          params={{
            id: props.currentRow?.name,
          }}
          columns={props.columns as ProDescriptionsItemProps<TableListItem>[]}
        />
      )}
      <Divider plain>Timeline</Divider>
      <Timeline mode="left">
        {props.currentRow?.logs.map((item: any) => {
          return <Timeline.Item label={item.time}>{item.content}</Timeline.Item>;
        })}
      </Timeline>
    </Drawer>
  );
};

export default DetailForm;
