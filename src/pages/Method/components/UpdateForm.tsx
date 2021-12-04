import React from 'react';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
  ProFormDigit,
} from '@ant-design/pro-form';
import { DomainUpdate } from '../data';
import { Row, Col } from 'antd';
import {
  YesOrNo,
  SmoothMethod,
  PeakFindingMethod,
  BaselineMethod,
  EicNoiseEstimateMethod,
  PeakNoiseEstimateMethod,
} from '@/components/Enums/Selects';

export type UpdateFormProps = {
  onSubmit: (values: DomainUpdate) => Promise<void>;
  onCancel: () => void;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="更新方法库"
      width={1200}
      visible={props.updateModalVisible}
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
          <h2 color="#beffc7">基本参数</h2>
          <ProFormText
            initialValue={props.values.name}
            name="name"
            label="方法包名"
            placeholder="name"
          />
          <ProFormTextArea
            initialValue={props.values.description}
            name="description"
            label="备注"
            placeholder="description"
          />
        </Col>

        <Col span={5}>
          <h2>XIC参数</h2>
          <ProFormDigit
            initialValue={props.values.eic?.mzWindow}
            name="mzWindow"
            label="mz窗口"
            tooltip="MZ窗口，为0.015时表示的是±0.015"
            placeholder="mzWindow"
          />
          <ProFormDigit
            initialValue={props.values.eic?.rtWindow}
            name="rtWindow"
            label="RT窗口"
            tooltip="RT窗口，为300时表示的是±300"
            placeholder="rtWindow"
            min={-1}
          />
            <ProFormDigit
            initialValue={props.values.eic?.maxIons}
            name="maxIons"
            label="最大Framents数"
            tooltip="使用的最大Fragments数目"
            placeholder="maxIons"
          />
          <ProFormSelect
            initialValue={props.values.eic?.adaptiveMzWindow}
            options={YesOrNo}
            tooltip="是否使用自适应mz窗口,自适应mz算"
            name="adaptiveMzWindow"
            label="自适应mz窗口"
          />
          <h2>IRT参数</h2>
          <ProFormSelect
            initialValue={props.values.irt?.useAnaLibForIrt}
            options={YesOrNo}
            tooltip="是否使用标准库进行Irt校准"
            name="useAnaLibForIrt"
            label="是否使用标准库进行Irt校准"
          />
          <ProFormText
            initialValue={props.values.irt?.anaLibForIrt}
            name="anaLibForIrt"
            label="标准库"
            placeholder="Library Id"
          />
          <ProFormDigit
            initialValue={props.values.irt?.minShapeScoreForIrt}
            name="minShapeScoreForIrt"
            label="最小Shape Score"
            tooltip="表示用于做irt时检测到的峰的shape分数的最小值"
            placeholder="minShapeScoreForIrt"
          />
          <ProFormDigit
            initialValue={props.values.irt?.pickedNumbers}
            name="pickedNumbers"
            label="总体取样点数"
            tooltip="从数据库中随机取出的点的数目,越少速度越快,但是容易出现没有命中的情况,当出现没有命中的情况是,最终的采样点数会少于设定的collectNumbers数目,为-1的时候表示全部取出不限制数目"
            placeholder="pickedNumbers"
          />
          <ProFormDigit
            initialValue={props.values.irt?.wantedNumber}
            name="wantedNumber"
            label="最终展示点数"
            tooltip="使用标准库进行查询时的采样点数目,默认为50个点位,不能为空"
            placeholder="wantedNumber"
          />
        </Col>
        <Col span={5}>
          <h2>选峰参数</h2>
          <ProFormSelect
            initialValue={props.values.peakFinding?.smoothMethod}
            name="smoothMethod"
            label="平滑算法"
            options={SmoothMethod}
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.smoothPoints}
            name="smoothPoints"
            label="平滑点数"
            placeholder="smoothPoints"
          />
           <ProFormDigit
            initialValue={50}
            name="ionsLow"
            label="离子碎片低信号阈值"
            placeholder="ionsLow"
          />
          <ProFormDigit
            initialValue={300}
            name="ionsHigh"
            label="离子碎片高信号阈值"
            placeholder="ionsHigh"
          />
          <ProFormSelect
            initialValue={props.values.peakFinding?.peakFindingMethod}
            name="peakFindingMethod"
            label="选峰算法"
            options={PeakFindingMethod}
          />
          <ProFormSelect
            initialValue={props.values.peakFinding?.baselineMethod}
            name="baselineMethod"
            label="基线算法"
            options={BaselineMethod}
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.baselineRtWindow}
            name="baselineRtWindow"
            label="Baseline RT Window"
          />
        </Col>
        <Col span={5}>
          <h2>降噪参数</h2>
          <ProFormSelect
            initialValue={props.values.peakFinding?.eicNoiseMethod}
            name="eicNoiseMethod"
            label="EIC降噪算法"
            options={EicNoiseEstimateMethod}
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.noiseAmplitude}
            name="noiseAmplitude"
            label="噪声振幅"
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.noisePercentage}
            name="noisePercentage"
            label="噪声百分比"
          />
          <ProFormSelect
            initialValue={props.values.peakFinding?.peakNoiseMethod}
            name="peakNoiseMethod"
            label="峰噪预估算法"
            options={PeakNoiseEstimateMethod}
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.stnThreshold}
            name="stnThreshold"
            label="信噪比阈值"
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.minPeakHeight}
            name="minPeakHeight"
            label="最小峰高"
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.minPeakWidth}
            name="minPeakWidth"
            label="最小峰宽"
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.minPeakPoints}
            name="minPeakPoints"
            label="最少含点数"
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.maxZeroPointRatio}
            name="maxZeroPointRatio"
            label="最大噪声信号点比例"
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.minObviousness}
            name="minObviousness"
            label="最小显著程度"
          />
          <ProFormDigit
            initialValue={props.values.peakFinding?.firstDerivativeCutoffFactor}
            name="firstDerivativeCutoffFactor"
            label="峰边界一阶导数与最大一阶导数的比例系数"
          />
        </Col>
        <Col span={5}>
          <h2>快筛参数</h2>
          <ProFormDigit
            initialValue={props.values.quickFilter?.minShapeScore}
            name="minShapeScore"
            label="minShapeScore"
            placeholder="minShapeScore"
            tooltip="shape的筛选阈值,一般建议在0.6左右"
          />
          <ProFormDigit
            initialValue={props.values.quickFilter?.minShapeWeightScore}
            name="minShapeWeightScore"
            label="minShapeWeightScore"
            placeholder="minShapeWeightScore"
            tooltip="shape的筛选阈值,一般建议在0.8左右"
          />
          <h2>打分参数</h2>
          <ProFormSelect
            initialValue={props.values.score?.diaScores}
            options={YesOrNo}
            tooltip="是否使用DIA打分,如果使用DIA打分的话,需要提前读取Aird文件中的谱图信息以提升系统运算速度"
            name="diaScores"
            label="是否使用DIA打分"
          />
          <ProFormSelect options={[]} tooltip="打分类型" name="scoreTypes" label="打分类型" />
          <h2>回归参数</h2>
          <ProFormDigit
            initialValue={props.values.classifier?.fdr}
            name="fdr"
            label="fdr"
            placeholder="fdr"
          />
          <ProFormSelect
            initialValue={props.values.classifier?.removeUnmatched}
            options={YesOrNo}
            tooltip="是否删除FDR不符合要求的结果"
            name="removeUnmatched"
            label="删除未鉴定结果"
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default UpdateForm;
