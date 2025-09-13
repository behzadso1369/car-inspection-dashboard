
 interface props {
    role: string[];
    children: any;
 }

 const ShowForPermissionComponent:React.FunctionComponent<props> = ({role,children}) => {

  const userRole = JSON.parse( localStorage?.getItem("roles")!);
  // console.log(role.every((r: any) => userRole.includes(r)));

  return !userRole.length || userRole.some((r: any) => role.includes(r.title)) ? children : []

    
};
export const ShowForPermission = ShowForPermissionComponent;
