import React from 'react';
import { Modal, Tag } from 'antd';

export type spectrumProps = {
  handleCancel: () => void;
  spectrumVisible: boolean;
  values: any;
};
const Spectrum: React.FC<spectrumProps> = (props) => {
  return (
    <Modal
      width={'45vw'}
      centered={true}
      // title="光谱图"
      onCancel={props.handleCancel}
      visible={props.spectrumVisible}
      footer={[]}
    >
      123
    </Modal>
  );
};

export default Spectrum;
