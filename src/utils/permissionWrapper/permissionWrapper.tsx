
interface props {
    permission: any;
    children: any;
    setActiveFalse:() => void;
    setActiveTrue:() => void;
 }

 const ShowForPermissionComponent:React.FunctionComponent<props> = ({permission,children}) => {

    const couldShow = JSON.parse( localStorage?.getItem("roles")!);
    // const tempProps = JSON.parse(JSON.stringify(children.props));
    if(!couldShow) {
        return children;
    }
    return !permission.length || permission.some((r: any) => couldShow.includes(r.title)) ? children : []
    //   return JSON.parse(couldShow)?.includes(permission) ? children : [];
   
     
    
};
export const ShowForPermission = ShowForPermissionComponent;
