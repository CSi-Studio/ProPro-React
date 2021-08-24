import React from 'react';
import { Collapse, Drawer } from 'antd';
import type { TableListItem } from '@/pages/Overview/data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ProColumns } from '@ant-design/pro-table';
import { CaretRightOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
  // values: Partial<API.RuleListItem>;
};
 


const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const columns: ProColumns<TableListItem>[]=[
    {
        key: 'name',
        title: 'overView名',
        dataIndex: 'name',
    },
    {
        key: 'expName',
        title: '实验名',
        dataIndex: 'expName',
    },
    {
        key: 'params',
        title: 'overview全览',
        dataIndex: 'params',
        render: (dom: any, entity: any) => {
            if (entity.params) {
              return (
                <div>
                <ReactJson src={entity.params} />
              </div>
              );
            }
            return false;
          },
    }
  ]
  return (
    <Drawer width={800} visible={props.showDetail} onClose={props.onClose} closable={false}>
      {props.currentRow?.name && (
        <ProDescriptions<TableListItem>
          column={1}
          title={props.currentRow?.name}
          request={async () => ({
            data: props.currentRow || {},
          })}
          params={{
            id: props.currentRow?.name,
          }}
          columns={columns as ProDescriptionsItemProps<TableListItem>[]}
        />
      )}
    </Drawer>
  );
};

export default DetailForm;
