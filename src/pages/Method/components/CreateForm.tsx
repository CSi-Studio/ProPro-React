import React from 'react';
import {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-form';
import { Row, Col } from 'antd';
import type { Domain } from '../data';
import {
  SmoothMethod,
  PeakFindingMethod,
  BaselineMethod,
  Classifier,
} from '@/components/Enums/Selects';
import { useIntl, FormattedMessage } from 'umi';

export type CreateFormProps = {
  onSubmit: (values: Domain) => Promise<void>;
  onCancel: () => void;
  createModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'table.creatMethod',
        defaultMessage: '创建方法',
      })}
      width={1200}
      visible={props.createModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <Row gutter={20}>
        <Col span={4}>
          <h2 color="#beffc7">
            <FormattedMessage id="table.basic" />
          </h2>
          <ProFormText
            name="name"
            label={intl.formatMessage({
              id: 'table.methodName',
              defaultMessage: '方法包名称',
            })}
            placeholder="name"
          />
          <ProFormTextArea
            name="description"
            label={intl.formatMessage({
              id: 'table.description',
              defaultMessage: '描述',
            })}
            placeholder="description"
          />
        </Col>

        <Col span={5}>
          <h2>
            <FormattedMessage id="table.xicParams" />
          </h2>
          <ProFormDigit
            name="mzWindow"
            label={intl.formatMessage({
              id: 'table.mzWindow',
              defaultMessage: 'mz窗口',
            })}
            initialValue="15"
            tooltip={intl.formatMessage({
              id: 'table.mzTooltip',
              defaultMessage: 'MZ窗口，单位为ppm,填20时表示的是±20',
            })}
            placeholder="mzWindow"
          />
          <ProFormDigit
            name="rtWindow"
            label={intl.formatMessage({
              id: 'table.rtWindow',
              defaultMessage: 'RT窗口',
            })}
            initialValue="300"
            tooltip={intl.formatMessage({
              id: 'table.mzTooltip',
              defaultMessage: 'RT窗口，为300时表示的是±300',
            })}
            placeholder="rtWindow"
          />
          <ProFormDigit
            name="extraRtWindow"
            label={intl.formatMessage({
              id: 'table.extraRtWindow',
              defaultMessage: '额外RT窗口',
            })}
            initialValue="200"
            tooltip={intl.formatMessage({
              id: 'table.extraRtTooltip',
              defaultMessage: '额外RT窗口，为200时表示的是±200',
            })}
            placeholder="extraRtWindow"
          />
          <ProFormDigit
            name="maxIons"
            label={intl.formatMessage({
              id: 'table.maxIons',
              defaultMessage: '最大Fragments数',
            })}
            tooltip={intl.formatMessage({
              id: 'table.maxIonsTooltip',
              defaultMessage: '使用的最大Fragments数目',
            })}
            placeholder="maxIons"
          />
        </Col>
        <Col span={5}>
          <h2>IRT参数</h2>
          <ProFormDigit
            name="pickedNumbers"
            label={intl.formatMessage({
              id: 'table.pickedNumbers',
              defaultMessage: '总体取样点数',
            })}
            initialValue="500"
            tooltip={intl.formatMessage({
              id: 'table.pickedNumbersTooltip',
              defaultMessage:
                '从数据库中随机取出的点的数目,越少速度越快,但是容易出现没有命中的情况,当出现没有命中的情况是,最终的采样点数会少于设定的collectNumbers数目,为-1的时候表示全部取出不限制数目',
            })}
            placeholder="pickedNumbers"
          />
          <ProFormDigit
            name="wantedNumber"
            label={intl.formatMessage({
              id: 'table.wantedNumber',
              defaultMessage: '最终展示点数',
            })}
            initialValue="50"
            tooltip={intl.formatMessage({
              id: 'table.wantedNumberTooltip',
              defaultMessage: '使用标准库进行查询时的采样点数目,默认为50个点位,不能为空',
            })}
            placeholder="wantedNumber"
          />
        </Col>
        <Col span={5}>
          <h2>选峰参数</h2>
          <ProFormSelect
            initialValue="IONS_COUNT"
            name="peakFindingMethod"
            label={intl.formatMessage({
              id: 'table.peakFindingMethod',
              defaultMessage: '选峰算法',
            })}
            options={PeakFindingMethod}
          />
          <ProFormDigit
            initialValue={50}
            name="ionsLow"
            label={intl.formatMessage({
              id: 'table.ionsLow',
              defaultMessage: '离子碎片低信号阈值',
            })}
            placeholder="ionsLow"
          />
          <ProFormDigit
            initialValue={300}
            name="ionsHigh"
            label={intl.formatMessage({
              id: 'table.ionsHigh',
              defaultMessage: '离子碎片高信号阈值',
            })}
            placeholder="ionsHigh"
          />
          <ProFormSelect
            initialValue="PROPRO_GAUSS"
            name="smoothMethod"
            label={intl.formatMessage({
              id: 'table.smoothMethod',
              defaultMessage: '平滑算法',
            })}
            options={SmoothMethod}
          />
          <ProFormDigit
            initialValue={5}
            name="smoothPoints"
            label={intl.formatMessage({
              id: 'table.smoothPoints',
              defaultMessage: '平滑点数',
            })}
            placeholder="smoothPoints"
          />
          <ProFormSelect
            initialValue="TOLERANCE"
            name="baselineMethod"
            label="基线算法"
            options={BaselineMethod}
          />
          <ProFormDigit initialValue={0.2} name="baselineRtWindow" label="Baseline RT Window" />
        </Col>
        {/* <Col span={5}>
          <h2>降噪参数</h2>
          <ProFormSelect
            initialValue="PROPRO_EIC"
            name="eicNoiseMethod"
            label="EIC降噪算法"
            options={EicNoiseEstimateMethod}
          />
          <ProFormDigit initialValue={10000} name="noiseAmplitude" label="噪声振幅" />
          <ProFormDigit initialValue={20} name="noisePercentage" label="噪声百分比" />
          <ProFormSelect
            initialValue="SLIDING_WINDOW_PEAK"
            name="peakNoiseMethod"
            label="峰噪预估算法"
            options={PeakNoiseEstimateMethod}
          />
          <ProFormDigit initialValue={1} name="stnThreshold" label="信噪比阈值" />
          <ProFormDigit initialValue={10000} name="minPeakHeight" label="最小峰高" />
          <ProFormDigit initialValue={0.02} name="minPeakWidth" label="最小峰宽" />
          <ProFormDigit initialValue={5} name="minPeakPoints" label="最少含点数" />
          <ProFormDigit initialValue={0.5} name="maxZeroPointRatio" label="最大噪声信号点比例" />
          <ProFormDigit initialValue={1} name="minObviousness" label="最小显著程度" />
          <ProFormDigit
            initialValue={0.05}
            name="firstDerivativeCutoffFactor"
            label="峰边界一阶导数与最大一阶导数的比例系数"
          />
        </Col> */}
        <Col span={5}>
          <h2>打分参数</h2>
          <ProFormSelect options={[]} tooltip="打分类型" name="scoreTypes" label="打分类型" />
          <h2>回归参数</h2>
          <ProFormSelect
            initialValue={'LDA'}
            name="algorithm"
            label={intl.formatMessage({
              id: 'table.algorithm',
              defaultMessage: '分类器',
            })}
            options={Classifier}
          />
          <ProFormDigit initialValue={0.01} name="fdr" label="fdr" placeholder="fdr" />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default CreateForm;
