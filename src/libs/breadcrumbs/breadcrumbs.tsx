// import React, { Fragment } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import useBreadcrumbs from 'use-react-router-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import {
//   faHouse,
//   faCubesStacked,
//   faCartArrowDown,
//   faFile,
//   faMotorcycle,
//   faChartLine,
//   faLock,
//   faCalculator,
//   faStore,
//   faHeadset,
//   faAngleLeft,
// } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// interface BreadcrumbsProps extends React.PropsWithChildren {
//   routesData: any[];
//   projectName: string;
// }

// export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
//   routesData,
//   projectName,
// }) => {
//   const { t } = useTranslation();
//   const parentBreadcrumbs = useBreadcrumbs();
//   const { pathname } = useLocation();
//   const icons = [
//     { path: 'home', icon: faHouse, ID: 1 },
//     { path: 'order', icon: faCartArrowDown, ID: 2 },
//     { path: 'item', icon: faCubesStacked, ID: 3 },
//     { path: 'notForSelling', icon: faLock, ID: 4 },
//     { path: 'document', icon: faFile, ID: 5 },
//     { path: 'accounting', icon: faCalculator, ID: 6 },
//     { path: 'inStore', icon: faStore, ID: 7 },
//     { path: 'courier', icon: faMotorcycle, ID: 8 },
//     { path: 'support', icon: faHeadset, ID: 9 },
//     { path: 'report', icon: faChartLine, ID: 10 },
//   ];

//   return (
//     <div className="flex items-center gap-1 pb-4">
//       {icons.map((icon) => {
//         return (
//           <Fragment key={icon.ID}>
//             {icon.path === pathname.split('/')[1] && (
//               <span className="text-black-opacity-70 flex justify-center items-center">
//                 <FontAwesomeIcon icon={icon.icon} size="sm" />
//               </span>
//             )}
//           </Fragment>
//         );
//       })}
//       {parentBreadcrumbs.map(({ match, breadcrumb }: any, index) => {
//         const title = breadcrumb.props.children.replace(/\s/g, '');

//         const checkExist = routesData.find(
//           (item: any) => '/' + item.path === match.pattern.path
//         );

//         return (
//           <Fragment key={index}>
//             <Link
//               className={`text-xs ${
//                 pathname === match.pattern.path
//                   ? 'font-bold text-primary '
//                   : 'text-black-opacity-50'
//               }`}
//               key={breadcrumb.key}
//               to={
//                 match.pattern.path !== '/' &&
//                 checkExist &&
//                 routesData.filter(
//                   (item: any) => '/' + item.path === match.pattern.path
//                 )[0].children
//                   ? null
//                   : match.pattern.path
//               }
//             >
//               {match.pattern.path !== '/'
//                 ? breadcrumb.props.children !== 'Home'
//                   ? isNaN(breadcrumb.props.children)
//                     ? t(
//                         `${projectName}.routes.${
//                           match.pattern.path.split('/')[1]
//                         }.breadcrumbs.${title}`
//                       )
//                     : t('common.detail') +
//                       ' ' +
//                       t(
//                         `${projectName}.routes.${
//                           match.pattern.path.split('/')[1]
//                         }.title`
//                       )
//                   : 'داشبورد'
//                 : ''}
//             </Link>
//             {index !== parentBreadcrumbs.length - 1 && index !== 0 && (
//               <FontAwesomeIcon
//                 icon={faAngleLeft}
//                 className="text-xs text-black-opacity-30 mt-0.5 px-1"
//                 size="sm"
//               />
//             )}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// };

// export default Breadcrumbs;
