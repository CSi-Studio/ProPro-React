import React from 'react';
import { Drawer, Tooltip } from 'antd';
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
        if(entity.range) {
          return <span>start:{entity?.range?.start}<br/>
          end:{entity?.range?.end}<br/>
          mz:{entity?.range?.mz}<br/>
          </span>
          ;
        }
        return false;
      },
    },
    // {
    //   title: 'range',
    //   dataIndex:'range',
    //   render: (dom: any, entity: { range: Record<string, any>; }) => [
    //     <div
    //       style={{
    //         width: '600px',
    //         color: '#666666',
    //         display: 'flex',
    //         justifyContent: 'space-around',
    //       }}
    //     >
  
    //       <div
    //         key="1"
    //         style={{
    //           color: '#666666',
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //         }}
    //       >
    //         start
    //           <div
    //             key={entity.range.start}
    //             style={{
    //               margin: 0,
    //             }}
    //           >
    //             <p
    //               style={{
    //                 margin: '0 2px',
    //                 width: '160px',
    //                 whiteSpace: 'nowrap',
    //                 overflow: 'hidden',
    //                 textOverflow: 'ellipsis',
    //               }}
    //             >
    //               {entity.range.start}
    //             </p>
    //           </div>
    //       </div>
    //       <div
    //         key="3"
    //         style={{
    //           color: '#666666',
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //         }}
    //       >
    //         end
    //         <div
    //             key={entity.range.end}
    //             style={{
    //               margin: 0,
    //             }}
    //           >
    //             <p
    //               style={{
    //                 margin: '0 2px',
    //                 width: '160px',
    //                 whiteSpace: 'nowrap',
    //                 overflow: 'hidden',
    //                 textOverflow: 'ellipsis',
    //               }}
    //             >
    //               {entity.range.end}
    //             </p>
    //           </div>
    //       </div>
    //       <div
    //         key="4"
    //         style={{
    //           color: '#666666',
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         }}
    //       >
    //         m/z
    //         <div
    //             key={entity.range.mz}
    //             style={{
    //               margin: 0,
    //             }}
    //           >
    //             <p
    //               style={{
    //                 margin: '0 2px',
    //                 width: '160px',
    //                 whiteSpace: 'nowrap',
    //                 overflow: 'hidden',
    //                 textOverflow: 'ellipsis',
    //               }}
    //             >
    //               {entity.range.mz}
    //             </p>
    //           </div>
    //       </div>
       
    //     </div>,
    //   ],
    // },
  ];
  columns.push(props.columns.pop());

  return (
    <Drawer width={800} visible={props.showDetail} onClose={props.onClose} closable={false}>
        <ProDescriptions<TableListDetail>
          column={1}
          title={props.currentRow}
          request={async () => {
            console.log('currentrow的id',props.currentRow)
            const msg = await blockIndexDetail( {id:props.currentRow});
            return Promise.resolve(msg);
          }}
          params={{
            id: props.currentRow
          }}
          columns={columns as ProDescriptionsItemProps<TableListDetail>[]}
        />
    </Drawer>
  );
};

export default DetailForm;
