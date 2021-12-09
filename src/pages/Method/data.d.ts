export type DomainCell = {
  id: string;
  name: string;
  eic:{
    mzWindow: number;
    rtWindow: number;
    adaptiveMzWindow: boolean;
  }
  irt:{
    useAnaLibForIrt:boolean
    minShapeScoreForIrt:number
    anaLibForIrt:string
    pickedNumbers:number
    wantedNumber:number
  }
  peakFinding:{
    smoothMethod:string
    smoothPoints:number
    peakFindingMethod:string
    baselineMethod:string
    baselineRtTolerance:number
    eicNoiseMethod:string
    noiseAmplitude:number
    noisePercentage:number
    peakNoiseMethod:string
    stnThreshold:number
    minPeakHeight:number
    minPeakWidth:number
    minPeakPoints:number
    maxZeroPointRatio:number
    minObviousness:number
    firstDerivativeCutoffFactor:number
  }
  quickFilter:{
    minShapeScore: number;
    minShapeWeightScore: number;
  }

  score:{
    scoreTypes:Array
    diaScores:boolean
  }

  classifier:{
    algorithm: string
    fdr:number
  }
  description: string

  createDate:Date
  lastModifiedDate:Date
};

export type Domain = {
  name: string;
  mzWindow: number;
  rtWindow: number;
  adaptiveMzWindow: boolean;
  minMzWindow: number;
  minShapeScore: number;
  minShapeWeightScore: number;
  classifier: string;
  fdr: number;
  description: string;
}

export type DomainUpdate = {
  id:string

  name: string
  mzWindow: number
  rtWindow: number
  adaptiveMzWindow: boolean
 
  useAnaLibForIrt:boolean
  anaLibForIrt:string
  minShapeScoreForIrt:number
  pickedNumbers:number
  wantedNumber:number

  smoothMethod:string
  smoothPoints:number
  peakFindingMethod:string
  baselineMethod:string
  baselineRtTolerance:number
  eicNoiseMethod:string
  noiseAmplitude:number
  noisePercentage:number
  peakNoiseMethod:string
  stnThreshold:number
  minPeakHeight:number
  minPeakWidth:number
  minPeakPoints:number
  maxZeroPointRatio:number
  minObviousness:number
  firstDerivativeCutoffFactor:number

  minShapeScore: number
  minShapeWeightScore: number

  scoreTypes:Array
  diaScores:boolean

  fdr: number
  classifier: string
  description: string
}
