
import { act, useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Divider, Modal } from 'antd';
import {
  ChonkyActions,
  FileBrowser,
  FileList,
  FileNavbar,
  FileToolbar,
  FileContextMenu,
  setChonkyDefaults,
  FileToolbar as DefaultToolbar
} from 'chonky';

import { GetDirectoryFiles } from './getDirectories';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React from 'react';
import axios from 'axios';
import { defineFileAction } from 'chonky';
import { getFileData } from 'chonky';
import { FilePdfOutlined } from "@ant-design/icons";

import { debug } from 'console';

// import {ToolbarButton} from 'chonky/src/components/external/ToolbarButton';

// Initialize Chonky with FontAwesome icons



// setChonkyDefaults({
//   iconComponent: CustomIconComponent

// });




interface FileData {
  id: string;
  Name: string; // Changed to match your API
  isDir: boolean;
  path?: string;
  type?: 'directory' | 'file';
  size?: number;
  caption?: string;
}
export interface TinyMCEEditorProps {
  getAllDataApi?: any;
  createFolderApi?: any;
  uploadFileApi?: any;
  deleteFileApi?: any;
  baseApi?:any;
}

export const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  getAllDataApi,
  createFolderApi,
  uploadFileApi,
  deleteFileApi,
  baseApi
}:any) => {
  // const [Description, setDescription] = useState<any>("");

  const [myEditor, setMyEditor] = useState<any>();
  const [selectedModal, setSelectedModal] = useState<boolean>(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [folderChain, setFolderChain] = useState<FileData[]>([]);
  const [folders, setFolders] = useState<any>([]);
  const [error, setError] = useState<string>('');
  const [renamingFileId, setRenamingFileId] = useState(null);
  const CustomIconComponent = (props:any) => {
    const { icon, size } = props;
    let iconColor = 'white';
    console.log(files)
     // Default color
    // if(file.name.endsWith(".webm") || file.name.endsWith(".mp4") || file.name.endsWith(".ogg")) {
      
  
    //   iconColor = 'blue'; // Video files
  
    // }else if(file.name.endsWith(".mp3") || file.name.endsWith(".wav")) {
    //   iconColor = 'green'; // Video files
    // }else {
      
    //   iconColor = 'red'; // Video files
  
    // }
    return (
      <ChonkyIconFA
        icon={icon}
        size={size}
       // Change the color here
      />
    );
  };
  const RenameFileAction = defineFileAction({
    id: 'rename_file',
    requiresSelection: true,
    button: {
      name: 'تغییر اسم',
      toolbar: true,
      contextMenu: true, // Enable context menu option
    },
    
  });



 

  const fecthDirectories = async (path: string) => {

    try {
      
      axios
        .get(
          `${baseApi}Browse/Directory/v1?directoryPath=${path}`,
          {
            headers: {
              Authorization: `  Bearer  ${localStorage.getItem('token')} `,
            },
          },
        )
        .then((res) => {
          const dirOrFiles = res.data;

          const chonkyFiles: FileData[] = dirOrFiles.map((folder: any) => ({
            id: folder,
            name: folder,
            isDir: true,
            modDate: new Date(folder.modifiedTime),
            size: 1000,
            parentDir: path,
            color: "#ffffff"
          }));

          setFolders(chonkyFiles);
         // Improved folder chain creation
    const chain: any[] = path === '' 
    ? [] 
    : path.split('/').filter(Boolean).map((segment, index, parts:any) =>{
      
      return ({
        id: "/" + parts.slice(0,index + 1).join("/"),
        fromNavbar: true,
        name: segment ,
        isDir: true
      });
    })
    console.log("chain",chain);
    

  setFolderChain([
    { id: '/', name: " ", isDir: true,fromNavbar:true,isParent: true},
    ...chain
  ]);
        });
    } catch (error) {
     

      setFolders([]);
      // setFolderChain([{ id: '/', name: '', isDir: true }]);
    }
  };
  const fetchFiles = (path: string) => {
    axios
      .get(
        `${baseApi}Browse/files/v1?directoryPath=${path}`,
        {
          headers: {
            Authorization: `  Bearer  ${localStorage.getItem('token')} `,
          },
        },
      )
      .then((res: any) => {
        const dirOrFiles = res.data;

        const chonkyFiles: FileData[] = dirOrFiles.map((file: any) => ({
          id: file,
          name: file,
          isDir: false,
          modDate: new Date(file.modifiedTime),
          size: 1000,
          parentDir: path,
        }));

        setFiles(chonkyFiles);
      })
      .catch((errr: any) => {
        console.error('Error fetching files:', error);

        setFiles([]);
      });
  };

  const handleFileAction = async (action: any) => {
    if (!action || !action.id) return;

    switch (action.id) {
      case ChonkyActions.OpenFiles.id: {
        if (!action || !action.id) return;

        const { targetFile, files } = action.payload;
        const fileToOpen = targetFile || files[0];
  
        if (fileToOpen?.isDir) {
          // Construct new path with proper nesting
          const newPath = currentPath 
            ? `${fileToOpen.fromNavbar ? fileToOpen.name : currentPath + "/" +fileToOpen.name}` 
            : (fileToOpen.name);
            
            
            
          
          setCurrentPath(newPath);

          fetchFiles(newPath);
          fecthDirectories(newPath);
        } else if (fileToOpen && fileToOpen?.isDir === false) {
          const fileUrl = `${baseApi}uploads/${targetFile.id}`;

          const fileExtension = fileToOpen.id.split('.').pop()?.toLowerCase();

          let content = '';

          // Handle different file types
          switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
              content = `<img src="${fileUrl}" alt="${fileToOpen.name}" style="max-width: 100%; height: auto;" />`;
              break;

            case 'pdf':
            case 'xlsx':
            case 'docx':
              
              
              
              content = `
                              
                             
                                    
                                      <a href="${fileUrl}" target="_blank">${fileUrl}</a>
                             
                      
                               
                              `;
              break;

            case 'mp4':
            case 'webm':
            case 'ogg':
              
              content = `
                                <video
                                  controls
                                  style="max-width: 100%;"
                                  preload="metadata"
                                >
                                  <source src="${fileUrl}" type="video/${fileExtension}">
                                  Your browser does not support the video tag.
                                </video>
                              `;
              break;

            case 'mp3':
            case 'wav':
              content = `
                                <audio
                                  controls
                                  style="width: 100%;"
                                  preload="metadata"
                                >
                                  <source src="${fileUrl}" type="audio/${fileExtension}">
                                  Your browser does not support the audio tag.
                                </audio>
                              `;
              break;

            default:
              // For unknown file types, create a download link
              content = `
                                <div class="file-link">
                                  <a href="${fileUrl}" target="_blank" download>
                                    Download: ${fileToOpen.name}
                                  </a>
                                </div>
                              `;
          }

          // Insert the content into TinyMCE
          myEditor.execCommand('mceInsertContent', false, content);

          // Add CSS for responsive media if not already added
          const customCSS = `
                            .mce-content-body img {
                              max-width: 100%;
                              height: auto;
                            }
                            .mce-content-body video {
                              max-width: 100%;
                              height: auto;
                            }
                            .mce-content-body .pdf-embed {
                              margin: 1em 0;
                              border: 1px solid #ddd;
                            }
                            .mce-content-body .file-link {
                              margin: 1em 0;
                              padding: 1em;
                              background: red;
                              border: 1px solid #ddd;
                              border-radius: 4px;
                            }
                          `;
          handleOk();
          setCurrentPath('');

          // Add the CSS to TinyMCE if not already added
          if (
            !myEditor.dom.styleSheets.some((sheet: any) =>
              sheet.ownerNode.textContent?.includes('.mce-content-body img'),
            )
          ) {
            myEditor.dom.addStyle(customCSS);
          }

          // Close the modal after insertion

    
        }

        break;
      }
      case ChonkyActions['DeleteFiles'].id: {
        const filesToDelete = action.state.selectedFiles;
        
        for (const file of filesToDelete) {
          if (file?.isDir) {
            const path =
            currentPath !== '' ? currentPath + '/' + file?.name : file?.name;

            await axios
              .delete(
                `${baseApi}Browse/Directory/Delete/v1`,
                {
                  data: {
                    path: path,
                  },
                  headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                  },
                },
              )
              .then((res) => {
                if (res) {
                  fecthDirectories(currentPath);
                  fetchFiles(currentPath);
                }
              });
          } else {
            const path =
              file?.id;
            await axios
              .delete(`${baseApi}Browse/File/Delete/v1`, {
                data: {
                  filePath: path,
                },
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
                },
              })
              .then((res) => {
                if (res) {
                  fecthDirectories(currentPath);
                  fetchFiles(currentPath);
                }
              });
          }
        }
        // await fetchFiles(currentFolderId);
        break;
      }

      case ChonkyActions['CreateFolder'].id: {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
          const path =
            currentPath !== '' ? currentPath + '/' + folderName : folderName;

          await axios
            .post(
              `${baseApi}Browse/Directory/Create/v1`,
              { path: path },
              {
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              },
            )
            .then((res) => {
              if (res) {
                fecthDirectories(currentPath);
                fetchFiles(currentPath);
              }
            });
          //   await fetchFiles(currentFolderId);
        }
        break;
      }

      case ChonkyActions['UploadFiles'].id: {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = async (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (!target.files) return;

          const files = Array.from(target.files);
          for (const file of files) {
            const formData = new FormData();
            formData.append('files', file);
            formData.append('path', currentPath);

            axios
              .post(
                `${baseApi}Browse/Upload/v1`,
                formData,
                {
                  headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                  },
                },
              )
              .then((res) => {
                fetchFiles(currentPath);
                fecthDirectories(currentPath);
              });
          }
          //   await fetchFiles(currentFolderId);
        };
        input.click();
        break;
      }

      case ChonkyActions['OpenParentFolder'].id: {
        const pathParts = currentPath.split('/').filter(Boolean);
        if (pathParts.length > 1) {
         
          setCurrentPath('');
          fetchFiles('');
          fecthDirectories('');
        }else {
          // Reset to root
          setCurrentPath('');
          fetchFiles('');
          fecthDirectories('');
        }
        break;
      }
      case RenameFileAction.id: {
        
        if (action.id === RenameFileAction.id) {
          const fileToRename = action.state.selectedFiles[0]; // Assumes a single selection for simplicity
          if (fileToRename) {
            const newName = prompt(
              'Enter a new name for the file:',
              fileToRename.name,
            );
            if(action.state.selectedFiles[0].isDir) {
              await axios
              .post(
                `${baseApi}Browse/Directory/Rename/v1`,
                { path: fileToRename.id.split("/")[1], newName: newName },
                {
                  headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                },
              )
              .then((res) => {
                if (res) {
                  fetchFiles(currentPath);
                  fecthDirectories(currentPath);
                }
              });

            }else {
              await axios
              .post(
                `${baseApi}Browse/File/Rename/v1`,
                { path: fileToRename.id, newName: newName },
                {
                  headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                },
              )
              .then((res) => {
                if (res) {
                  fetchFiles(currentPath);
                  fecthDirectories(currentPath);
                }
              });
            }
      
          

            getFileData(currentPath);
          }
        }
      }
    }
  };

  const fileActions = [
    ChonkyActions.OpenFiles,
    ChonkyActions['UploadFiles'],
    ChonkyActions['DeleteFiles'],
    RenameFileAction,
    ChonkyActions['CreateFolder'],

  ];

  const handleOk = () => {
    setSelectedModal(false);
  };

  const handleCancel = () => {
    setSelectedModal(false);
  };

  // Initial data fetch with error handling
  useEffect(() => {
    if (selectedModal) {
      setCurrentPath('');
      if (folders) {
        fecthDirectories(currentPath);
      }
      if (files) {
        fetchFiles(currentPath);
      }
    }
  }, [selectedModal]);
  const getThumbnail = (type:string,currentPath:string,isParent:boolean,fileId:any):any => {
    if(type.endsWith(".jpeg") || type.endsWith(".webp") || type.endsWith(".gif") || type.endsWith(".png") || type.endsWith(".jpg")) {
      return isParent ?   `${baseApi}uploads${currentPath}/${fileId}` : `${baseApi}uploads/${currentPath}/${fileId}`
      

    }else if(type.endsWith(".webm") || type.endsWith(".mp4") || type.endsWith(".ogg")) {
      
  
      return null;

    }
    else if(type.endsWith(".mp3") || type.endsWith(".wav") || type.endsWith(".docx") || type.endsWith(".xlsx")) {
      return null;
    }
  
  }
  const getIcon = (type:string):any => {
    if(type.endsWith(".webm") || type.endsWith(".mp4") || type.endsWith(".ogg")) {
      
  
      return "video";

    }else if(type.endsWith(".mp3") || type.endsWith(".wav")) {
      return "audio";
    }
    else if(type.endsWith(".docx")) {
      return "word";
    }
    else if(type.endsWith(".xlsx")) {
      return "excel";
    }
    
    else {
      
      return "pdf";

    }
  }
  const getColor = (type:string):any => {
    if(type.endsWith(".jpeg") || type.endsWith(".webp") || type.endsWith(".gif") || type.endsWith(".png") || type.endsWith(".jpg")) {
        return "#f6f6f6"
    }
    else if(type.endsWith(".webm") || type.endsWith(".mp4") || type.endsWith(".ogg") || type.endsWith(".docx")) {
      
  
      return "blue";

    }else if(type.endsWith(".mp3") || type.endsWith(".wav") || type.endsWith(".xlsx")) {
      return "green";
    }else if(type.endsWith(".pdf")) {
      
      return "red";

    }else {
      return "black"
    }
  }
  const customTheme = {
    palette: {
      // File icons
      fileIcon: '#4CAF50',          // green for files
      folderIcon: '#FFA000',        // amber for folders
      videoIcon: '#f44336',         // red for videos
      audioIcon: '#9c27b0',         // purple for audio
      imageIcon: '#2196f3',         // blue for images
      pdfIcon: '#e91e63',           // pink for PDFs
    }
  };
  // Transform your flat data structure to Chonky format with null checks
  const transformToChonkyFormat = (
    files: any,
    folders: any,
    currentPath: any,
  ) => {
    console.log("file",files);
    // Create breadcrumb for current path

    // Transform files with null check
    const fileItems = Array.isArray(files)
      ? files.map((file) => ({
        
          id: `${currentPath}/${file.name}`,
          name: truncateCaption(file.name),
          size: file.size,
          modDate: file.modDate,
          isDir: false,
          parentDir: currentPath,
          color: getColor(file.name),
     
          icon: getIcon(file.name),
        
        
          thumbnailUrl: getThumbnail(file.name,currentPath,file?.isParent,file?.id),
        }))
      : [];

    // Transform folders with null check
    const folderItems = Array.isArray(folders)
      ? folders.map((folder) => ({
          id: `${currentPath}/${folder.name}`,
          name: folder.name,
          isDir: true,
          color: "#f4d376",
          parentDir: currentPath,
        }))
      : [];

    return [...folderItems, ...fileItems];
  };

  const editor = useRef<any>(null);
  const openModal = () => {
    setSelectedModal(!selectedModal);
  };
  const handleEditorChange = (content: any) => {
    // setValue(content);
  };
  const i18nConfig = {
    messages: {
      [`chonky.actionGroups.Actions`]: 'عملیات',
      [`chonky.actionGroups.Options`]: 'گزینه ها',
      [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.name`]: 'ایجاد پوشه جدید',
      [`chonky.actions.${ChonkyActions.UploadFiles.id}.button.name`]: 'آپلود فایل',
      [`chonky.actions.${ChonkyActions.DeleteFiles.id}.button.name`]: 'حذف فایل',
      [`chonky.actions.${ChonkyActions.OpenSelection.id}.button.name`]: 'باز کردن',
      [`chonky.actions.${ChonkyActions.SelectAllFiles.id}.button.name`]: 'انتخاب همه',
      [`chonky.actions.${ChonkyActions.ClearSelection.id}.button.name`]: 'حذف فایل انتخاب شده',
      [`chonky.actions.${ChonkyActions.EnableListView.id}.button.name`]: 'مشاهده به صورت لیست',
      [`chonky.actions.${ChonkyActions.EnableGridView.id}.button.name`]: 'مشاهده به صورت Grid',
      [`chonky.actions.${ChonkyActions.SortFilesByName.id}.button.name`]: 'مرتب سازی براساس نام',
      [`chonky.actions.${ChonkyActions.SortFilesBySize.id}.button.name`]: 'مرتب سازی براساس سایز',
      [`chonky.actions.${ChonkyActions.SortFilesByDate.id}.button.name`]: 'مرتب سازی براساس تاریخ',
      [`chonky.actions.${ChonkyActions.ToggleHiddenFiles.id}.button.name`]: 'مشاهده فایل های پنهان',
      [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: 'اولویت براساس پوشه ها',
      [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: 'اولویت براساس پوشه ها',
      'chonky.toolbar.searchPlaceholder': 'جستجو',
      'chonky.toolbar.visibleFileCount': `{fileCount, plural,
       {# آیتم} one
       {# آیتم} few
       {# آیتم} many
  }`,
    
      'chonky.toolbar.selectedFileCount': `فایل`,
      'chonky.fileList.nothingToShow': 'آیتمی وجود ندارد',
    
   
    }
  
  };
  const truncateCaption = (caption:string) => {
    return caption.length > 16 ? `${caption.slice(0, 16)}...` : caption;
  };

  return (
    <>
      <Editor
        ref={editor}
        init={{
          min_chars: 10,
          setup: function (editor:any) {
            setMyEditor(editor);
            editor.ui.registry.addButton('uploadBTN', {
              text: `آپلود فایل`,
              onAction: function (_) {
                openModal();
              },
            });
          },
          language: 'fa',
          

          skin: 'oxide', // Use the default TinyMCE skin locally
          content_langs: [{ title: 'Persian', code: 'fa' }],
          font_family_formats:
            'Dana=dana-fanum;Nazanin=B Nazanin;Mitra=B Mitra; Iransharp=IRANSharp',
          plugins:
            ' preview autolink autosave save directionality  visualblocks visualchars fullscreen image link media   codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists  wordcount  help  quickbars emoticons ',
          menubar: 'file edit view insert format tools table tc help',
          image_advtab: true,
          image_title: true,
                // فقط PNG پذیرفته شود
                images_upload_handler: (blobInfo:any) => {
                  return new Promise((resolve, reject) => {
                    const file = blobInfo.blob();
        
                    if (file.type !== "image/png") {
                      reject("فقط فایل PNG پذیرفته می‌شود");
                      return;
                    }
        
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      const base64 = reader.result as string;
        
                      // بعد از insert، Alt و Title خودکار پر می‌شوند
                      setTimeout(() => {
                        const imgElm = editor?.current.dom.select("img")[0];
                        if (imgElm) {
                          editor.current.dom.setAttrib(imgElm, "alt", "تصویر PNG");
                          editor.current.dom.setAttrib(imgElm, "title", "تصویر PNG");
                        }
                      }, 100);
        
                      resolve(base64);
                    };
                    reader.onerror = () => reject("خطا در خواندن فایل");
                  });
                },
        
              
          base_url: '/tinymce',

          toolbar:
            "uploadBTN redo undo| blocks | fontfamily | fontsize  | fullscreen | bold italic | alignleft aligncenter alignright alignjustify | outdent indent",
          content_style:
          `@font-face {
            font-family: 'IRANSharp';
            font-display: swap;
            src: url('../../assets/fonts/iransharp.woff') format('woff');
            }`+
            'figure.image { display: inline-block} ' +
            'figcaption { background-color: #f3f3f3;font-size: 11px;padding: 5px;color: #7e7e7e;margin-top: -7px;text-align: center; }' +
     
            "body { font-family: IRANSharp; direction: rtl; }" +
            `.tinymce-editor {
  font-family: 'IRANSharp !important', sans-serif;
}`+
            'height:500px ',
        }}
        onEditorChange={handleEditorChange}
        onInit={(editor: any) => (editor.current = editor)}
      />
      {/* <Modal
        open={selectedModal}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'90%'}
        title="File Manager"
        footer={null}
      >
        <div style={{ height: '600px',direction: "rtl",      fontFamily: 'IranSans, Vazir, sans-serif',
      textAlign: 'right'  }}>
       
          <FileBrowser
    
            files={transformToChonkyFormat(files, folders, currentPath)}
            folderChain={folderChain}
            fileActions={fileActions}
            onFileAction={handleFileAction}
            disableDefaultFileActions={false}
            i18n={i18nConfig}
            iconComponent={CustomIconComponent}
            
            
            
            
          >
            <FileNavbar  />
            <FileToolbar
                
             />
            <FileList />
            <FileContextMenu />
          </FileBrowser>
        </div>
      </Modal> */}
    </>
  );
};
