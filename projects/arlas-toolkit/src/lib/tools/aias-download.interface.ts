export interface AiasDownloadDialogData {
  nbProducts: number;
  itemDetail:  Map<string, any>;
  wktAoi: string | null;
  ids: string[] | null;
  collection: string;
}
