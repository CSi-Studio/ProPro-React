import type { IdName, IdNameAlias } from "@/components/Commons/common";

export type PrepareData = {
  project: any
  insLib: IdName
  anaLib: IdName
  method: any
  // insProteins: string[]
  proteins: string[]
  expList: array<IdNameAlias>
  overviewMap: Map<string, any>
}