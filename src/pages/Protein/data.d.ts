export type TableListItem = {
  id: string;
  identifier: string;
  reviewed: boolean;
  name: string[];
  organism: string;
  gene: string;
  sequence: string;
  uniPortLink: string;
  alphaFoldLink: string;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  current: number;
};
export type TableAddItem = {
  createTage?: string;
  reviewed: boolean;
  createLibrary: boolean;
  libraryName?: string;
  spModel?: string;
  isotope?: boolean;
  minPepLen?: number;
  maxPepLen?: number;
  filePath: string;
};
