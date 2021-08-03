export type TableListItem = {
  id: number;
  name: string;
  type: string;
  repoProjectName: string;
  creator: string;
  libraryId: string;
  libraryName: string;
  labels: any[];
  description: string;
  totalSize: number;
  createDate: string;
  lastModifiedDate: string;
  irtLibraryName: string;
  irtLibraryId: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};
