import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import Dropdown from '../../../libs/dropdown/dropdown';
interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;
  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const CreateBlogPostTag: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
  const { register, control,getValues} = useForm({});
  const [posts,setPosts] = useState<any>([]);
  const [tags,setTags] = useState<any>([]);
  const onSubmit = () => {
  instance.post(ApiHelper.get("CreateBlogPostTag"),getValues()).then((res:any) => {
    if(res.data) {
        setShowAddUserModal(false);
    }
  }) 
  };
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
    getPosts();
    getTags();
  
  },[])
  return (
    <Dialog
      className="w-full  "
      onClose={() => setShowAddUserModal(false)}
      open={showAddUserModal}
      maxWidth={false}
    
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
        
          width: "80% "
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن  اسلاید </span>
        
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
              onClick={() =>setShowAddUserModal(false)}
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

export default CreateBlogPostTag;
