import React from 'react';
import { Col, Drawer, Row } from 'antd';
import type { TableListItem } from '@/pages/Project/data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { useIntl } from 'umi';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
};

const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  return (
    <Drawer width={650} visible={props.showDetail} onClose={props.onClose} closable={false}>
      {props.currentRow?.name && (
        <>
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
          <Row>
            <Col span={4}>
              {intl.formatMessage({
                id: 'component.projectDescription',
                defaultMessage: '项目描述',
              })}
            </Col>
            <Col span={21}>{props.currentRow.description}</Col>
          </Row>
        </>
      )}
    </Drawer>
  );
};

export default DetailForm;
