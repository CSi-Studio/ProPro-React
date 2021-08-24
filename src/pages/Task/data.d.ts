export type TaskTableItem = {
  id: string;
  expIds: string[];
  status: string;
  name: string;
  taskTemplate: string;
  createDate: string;
  lastModifiedDate: string;
  logs: Log[];
  totalCost: null;
  features: null;
  startTime: number;
};
