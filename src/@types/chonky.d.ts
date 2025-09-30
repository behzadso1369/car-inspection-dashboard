

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

  export const ChonkyActions: {
    OpenFiles: { id: 'open_files' };
    EnableListView: { id: 'enable_list_view' };
    EnableGridView: { id: 'enable_grid_view' };
    SortFilesByName: { id: 'sort_files_by_name' };
    SortFilesBySize: { id: 'sort_files_by_size' };
    SortFilesByDate: { id: 'sort_files_by_date' };
    ToggleHiddenFiles: { id: 'toggle_hidden_files' };
    OpenParentFolder: {id: 'open_parent_folder'},
    CopyFiles: { id: 'copy_files' };
    RenameFile: { id: 'rename_files' };
    [key: string]: { id: string };
  };

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
  export const FileList: FC;
  export const FileNavbar: FC;
  export const FileToolbar: FC;
  export const FileContextMenu: FC;

  export function setChonkyDefaults(options: { iconComponent?: any }): void;
}

declare module 'chonky-icon-fontawesome' {
  export const ChonkyIconFA: any;
}