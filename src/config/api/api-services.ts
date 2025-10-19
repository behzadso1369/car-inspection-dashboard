import DeleteSlider from "../../pages/Slider/DeleteSlider";


export default {
//login    
login: "Auth/login",
//register
register: "Auth/register",
//RefreshToken
refreshToken: "Auth/refreshToken",
//Role
createRole: "Auth/CreateRole",
AssignRole: "Auth/AssignRole",
UpdateUserRoles: "Auth/UpdateUserRoles",
GetUserRoles: "Auth/GetUserRoles",
//User
GetUser:"Auth/GetUser",
GetAllUsers:"Auth/GetAllUsers",
GetAllRolse: "Auth/GetAllRolse",
DeleteRole: "Auth/DeleteRole",
DeActiveUser: "Auth/DeActiveUser",
ActiveUser: "Auth/ActiveUser",
//Slider
CreateSlider: "/Slider/CreateWithFile",
UpdateSlider: "/Slider/UpdateWithFile",
DeleteSlider: "/Slider/Delete",
SliderList:"/Slider/List",
CreateSliderWithFile : "Slider/CreateWithFile",
UpdateSliderWithFile : "Slider/UpdateSliderWithFile",
getSliderById:"Slider/Get",
//BlogPost
CreateBlogPost: "BlogPost/CreateWithFile",
BlogPostList: "BlogPost/List",
DeleteBlogPost: "BlogPost/Delete",
EditBlogPost: "BlogPost/UpdateWithFile",
getBlogPostById: "BlogPost/Get",
//BlobCategories
CreateBlogCategories: "BlogCategories/Create",
BlogCategoriesList: "BlogCategories/List",
DeleteBlogCategories: "BlogCategories/Delete",
EditBlogCategories: "BlogCategories/Update",
getBlogCategoriesById: "BlogCategories/Get",
//BlogComment
CreateBlogComment: "BlogComment/CreateWithFile",
BlogCommentList: "BlogComment/List",
DeleteBlogComment: "BlogComment/Delete",
EditBlogComment: "BlogComment/UpdateWithFile",
getBlogCommentById: "BlogComment/Get",
//BlogPostTag
CreateBlogPostTag: "BlogPostTag/Create",
BlogPostTagList: "BlogPostTag/List",
DeleteBlogPostTag: "BlogPostTag/Delete",
EditBlogPostTag: "BlogPostTag/Update",
getBlogPostTagById: "BlogPostTag/Get",
//BlogTag
CreateBlogTag: "BlogTag/Create",
BlogTagList: "BlogTag/List",
DeleteBlogTag: "BlogTag/Delete",
EditBlogTag: "BlogTag/Update",
GetBlogTagById: "BlogTag/Get",
//CarInspectionService
CarInspectionServiceList: "CarInspectionService/List",
CreateCarInspectionService: "CarInspectionService/CreateWithFile",
DeleteCarInspectionService: "CarInspectionService/Delete",
EditCarInspectionService: "CarInspectionService/UpdateWithFile",
GetCarInspectionServiceById: "CarInspectionService/Get",
//secretOfOurServiceQuality
secretOfOurServiceQualityList: "secretOfOurServiceQuality/List",
CreateSecretOfOurServiceQuality: "secretOfOurServiceQuality/CreateWithFile",
DeleteSecretOfOurServiceQuality: "secretOfOurServiceQuality/Delete",
EditSecretOfOurServiceQuality: "secretOfOurServiceQuality/UpdateWithFile",
GetSecretOfOurServiceQuality: "secretOfOurServiceQuality/Get",
//CarBrand
CarBrandList: "CarBrand/List",
CreateCarBrand: "CarBrand/CreateWithFile",
DeleteCarBrand: "CarBrand/Delete",
EditCarBrand: "CarBrand/UpdateWithFile",
GetCarBrand: "CarBrand/Get",
//CarGroup
CarGroupList: "CarGroup/List",
CreateCarGroup: "CarGroup/CreateWithFile",
DeleteCarGroup: "CarGroup/Delete",
EditCarGroup: "CarGroup/UpdateWithFile",
GetCarGroup: "CarGroup/Get",
//CarInspection
CarInspectionList: "CarInspection/List",
CreateCarInspection: "CarInspection/CreateWithFile",
DeleteCarInspection: "CarInspection/Delete",
EditCarInspection: "CarInspection/UpdateWithFile",
GetCarInspection: "CarInspection/Get",
//CarInspectionDateType
CarInspectionDateTypeList: "CarInspectionDateType/List",
CreateCarInspectionDateType: "CarInspectionDateType/CreateWithFile",
DeleteCarInspectionDateType: "CarInspectionDateType/Delete",
EditCarInspectionDateType: "CarInspectionDateType/UpdateWithFile",
GetCarInspectionDateType: "CarInspectionDateType/Get",
//CarInspectionFeature
CarInspectionFeatureList: "CarInspectionFeatureType/List",
CreateCarInspectionFeature: "CarInspectionFeatureType/CreateWithFile",
DeleteCarInspectionFeature: "CarInspectionFeatureType/Delete",
EditCarInspectionFeature: "CarInspectionFeatureType/UpdateWithFile",
GetCarInspectionFeature: "CarInspectionFeatureType/Get",
//CarInspectionLocation
CarInspectionLocationList: "CarInspectionLocationType/List",
CreateCarInspectionLocation: "CarInspectionLocationType/CreateWithFile",
DeleteCarInspectionLocation: "CarInspectionLocationType/Delete",
EditCarInspectionLocation: "CarInspectionLocationType/UpdateWithFile",
GetCarInspectionLocation: "CarInspectionLocationType/Get",
//CarInspectionType
CarInspectionTypeList: "CarInspectionType/List",
CreateCarInspectionType: "CarInspectionType/Create",
DeleteCarInspectionType: "CarInspectionType/Delete",
EditCarInspectionType: "CarInspectionType/Update",
GetCarInspectionType: "CarInspectionType/Get",
//FlowLifeCycle
FlowLifeCycleList: "FlowLifeCycle/List",
CreateFlowLifeCycle: "FlowLifeCycle/CreateWithFile",
DeleteFlowLifeCycle: "FlowLifeCycle/Delete",
EditFlowLifeCycle: "FlowLifeCycle/UpdateWithFile",
GetFlowLifeCycle: "FlowLifeCycle/Get",
//FlowState
FlowStateList: "FlowState/List",
CreateFlowState: "FlowState/CreateWithFile",
DeleteFlowState: "FlowState/Delete",
EditFlowState: "FlowState/UpdateWithFile",
GetFlowState: "FlowState/Get",
//FlowType
FlowTypeList: "FlowType/List",
CreateFlowType: "FlowType/CreateWithFile",
DeleteFlowType: "FlowType/Delete",
EditFlowType: "FlowType/UpdateWithFile",
GetFlowType: "FlowType/Get",
//MasterSiteDetail
MasterSiteDetailList: "MasterSiteData/List",
CreateMasterSiteDetail: "MasterSiteData/CreateWithFile",
DeleteMasterSiteDetail: "MasterSiteData/Delete",
EditMasterSiteDetail: "MasterSiteData/UpdateWithFile",
GetMasterSiteDetail: "MasterSiteData/Get",
//WhyWe
WhyWeList: "WhyWe/List",
CreateWhyWe: "WhyWe/CreateWithFile",
DeleteWhyWe: "WhyWe/Delete",
EditWhyWe: "WhyWe/UpdateWithFile",
GetWhyWe: "WhyWe/Get",

//File manager
FileManagerList: "FileManager/list",
FileManagerCreateFolder: "FileManager/CreateFolder",
FileManagerUploadFile: "FileManager/upload",
FileManagerDelete: "FileManager/delete",
//AboutUs
AboutUsList: "AboutUs/List",
CreateAboutUs: "AboutUs/Create",
DeleteAboutUs: "AboutUs/Delete",
EdtiAboutUs: "AboutUs/Update",
GetAboutUs: "AboutUs/Get",




} as { [type: string]: string };
