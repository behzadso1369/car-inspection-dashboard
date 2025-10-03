import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Dropdown from '../../../libs/dropdown/dropdown';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
interface EditPieceProps extends React.PropsWithChildren {
  showEditModal: boolean;
  blogPosTagId:number;
  blogPostTagName:string;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditBlogPostTag: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,blogPosTagId,blogPostTagName }) => {
  const [posts,setPosts] = useState<any>([]);
  const [tags,setTags] = useState<any>([]);
    const { register, control,reset,getValues} = useForm({
        values: {
          tagId: "0",
          blogPostId: "0"

          
        }
    });
    const onSubmit = () => {
      instance.put(ApiHelper.get("EditBlogPostTag") + "?id=" + blogPosTagId,getValues()).then((res:any) => {
        if(res.data) {
            setShowEditModal(false);
        }
      })
      };
      const  getBlofTagPostById = () => { 
        instance.get(ApiHelper.get("getBlogPostTagById"),{params:{id:blogPosTagId}}).then((res:any) => {
            reset({
              blogPostId:res.data.resultObject.blogPostId,
              tagId:res.data.resultObject.tagId
            })
       
        })
      }
      const getPosts = () => {
        instance.get(ApiHelper.get("BlogPostList"),{params: {skip:0,take:100000}}).then((res:any) => {
      if(res.data) {
          setPosts(res.data.resultObject);
      }
    })
    }
    const getTags= () => {
      instance.get(ApiHelper.get("BlogTagList"),{params: {skip:0,take:100000}}).then((res:any) => {
    if(res.data) {
        setTags(res.data.resultObject);
    }
    })
    }
      useEffect(() => {
        getBlofTagPostById();
        getPosts();
        getTags();
      
      },[])
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
     
      maxWidth="xl"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span> ویرایش  کاربر </span>
        <span> </span>
        <span>{blogPostTagName}</span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
  
      <Dropdown
                    optionTitle='title'
                  register={register}
                  control={control}
                  title="blogPostId"
                  label='پست بلاگ'
                  option={posts}
                  fullWidth={true}
                />
  
      <Dropdown
                    optionTitle='name'
                  register={register}
                  control={control}
                  title="tagId"
                  label='تگ بلاگ'
                  option={tags}
                  fullWidth={true}
                />
   <div className='col-span-4 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowEditModal(false)}
            />
              <Button
              title='اضافه کردن'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
              </div>
</div>
    
   
    </Dialog>
  );
};

export default EditBlogPostTag;
