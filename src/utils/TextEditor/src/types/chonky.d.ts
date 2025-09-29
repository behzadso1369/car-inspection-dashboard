

declare module 'chonky' {
  import { FC, ReactNode } from 'react';

  export interface FileData {
    id: string;
    name: any;
    isDir?: "directory" | "file";
    parentDir?: string;
    [key: string]: any;
  }

  export type FileArray = FileData[];
  export const defineFileAction: any;
  export const getFileData = any;


  export interface ChonkyFileActionData {
    id: string;
    payload?: {
      targetFile?: FileData;
      files?: FileArray;
      [key: string]: any;
    };
  }

  export const ChonkyActions: any;

  export interface FileBrowserProps {
    files: any;
    folderChain?: any;
    onFileAction?: (data: ChonkyFileActionData) => any;
    defaultFileViewActionId?: string;
    disableDragAndDrop?: boolean;
    clearSelectionOnOutsideClick?: boolean;
    children?: ReactNode;
    [key: string]: any;
  }

  export const FileBrowser: FC<FileBrowserProps>;
  export const FileList: any;
  export const FileNavbar: FC;
  export const FileToolbar: FC;
  export const FileContextMenu: FC;


  export function setChonkyDefaults(options:any): void;
}

declare module 'chonky-icon-fontawesome' {
  export const ChonkyIconFA: any;
}