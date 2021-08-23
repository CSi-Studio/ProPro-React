/* 靶库 */
export const LibraryType = [
  { value: 'INS', label: '内标库' },
  { value: 'ANA', label: '标准库' },
];

/* 蛋白 */
export const ProteinType = {
  createLibrary: [
    { value: 'true', label: '新建库' },
    { value: 'false', label: '不建库' },
  ],
  reviewed: [
    { value: 'true', label: '已review' },
    { value: 'false', label: '未review' },
  ],
};

/* 项目 */
export const ProjectType = {
  type: [{ value: 'DIA', label: 'DIA' }],
};

/* 碰撞方式SpModel */
export const SpModelType = [
  { value: 'HCD', label: 'HCD' },
  { value: 'CID', label: 'CID' },
];

export const YesOrNo = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

export const SmoothMethod = [
  { value: 'LINEAR', label: 'LINEAR' },
  { value: 'GAUSS', label: 'GAUSS' },
  { value: 'SAVITZKY_GOLAY', label: 'SAVITZKY_GOLAY' },
  { value: 'PROPRO_GAUSS', label: 'PROPRO_GAUSS' },
];

export const PeakFindingMethod = [
  { value: 'PROPRO', label: 'PROPRO' },
  { value: 'MZMINE', label: 'MZMINE' },
  { value: 'WAVELET', label: 'WAVELET' },
  { value: 'LOCAL_MINIMUM', label: 'LOCAL_MINIMUM' },
  { value: 'SAVITZKY_GOLAY', label: 'SAVITZKY_GOLAY' },
];

export const BaselineMethod = [{ value: 'TOLERANCE', label: 'TOLERANCE' }];

export const EicNoiseEstimateMethod = [
  { value: 'PROPRO_EIC', label: 'PROPRO_EIC' },
  { value: 'AMPLITUDE_EIC', label: 'AMPLITUDE_EIC' },
  { value: 'PERCENTAGE_EIC', label: 'PERCENTAGE_EIC' },
];

export const PeakNoiseEstimateMethod = [
  { value: 'SLIDING_WINDOW_PEAK', label: 'SLIDING_WINDOW_PEAK' },
  { value: 'WAVELET_COEFF_PEAK', label: 'WAVELET_COEFF_PEAK' },
];
