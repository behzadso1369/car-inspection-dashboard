import http from "./httpService";

export const GetDirectoryFolder = () => {
  return http.get(`https://public-statics.okcs.com/browse/`, {
    headers: {
      Authorization: `bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBBNDMyMzQwRDg2QzkzNkZEMUVFNUFCNkM4Mzg5MkZFIiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwczovL2F1dGgub2tjcy5jb20iLCJuYmYiOjE3MzEzOTgxNzMsImlhdCI6MTczMTM5ODE3MywiZXhwIjoxNzMxNDAxNzczLCJhdWQiOlsiT0tQb3J0YWxOZXdzQXBpIiwiT0tQb3J0YWxOb3RpY2VBcGkiLCJPS1BvcnRhbExpbmtBcGkiLCJPS1BvcnRhbEFwcHJvdmFsQXBpIiwiT0tQb3J0YWxFdmVudEFwaSIsIk9LUG9ydGFsRGVwYXJ0bWVudEFwaSIsIk9LUG9ydGFsRXhwZXJpZW5jZUFwaSIsIk9LUG9ydGFsQWdncmVnYXRvckFkbWluIl0sInNjb3BlIjpbIm9wZW5pZCIsInJvbGVzIiwicHJvZmlsZSIsIk9LUG9ydGFsTmV3c0FwaSIsIk9LUG9ydGFsTm90aWNlQXBpIiwiT0tQb3J0YWxMaW5rQXBpIiwiT0tQb3J0YWxBcHByb3ZhbEFwaSIsIk9LUG9ydGFsRXZlbnRBcGkiLCJPS1BvcnRhbERlcGFydG1lbnRBcGkiLCJPS1BvcnRhbEV4cGVyaWVuY2VBcGkiLCJPS1BvcnRhbEFnZ3JlZ2F0b3JBZG1pbiJdLCJhbXIiOlsicHdkIl0sImNsaWVudF9pZCI6IkFkbWluV2ViQXBwQ2xpZW50Iiwic3ViIjoiMzliMzc5NmQtODhjYi00YmQ3LWE3N2ItYmUyNzc3M2NiOGNkIiwiYXV0aF90aW1lIjoxNzI4NzQwODE3LCJpZHAiOiJsb2NhbCIsIm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiLYp9it2YXYryIsImZhbWlseV9uYW1lIjoi2YTYtNqv2LHbjCDZgdix2K8iLCJyb2xlIjpbIkFkbWluaXN0cmF0b3IiLCJPQ1IgQWRtaW4iXSwic2lkIjoiQ0QwQkRGMDk3NDEyQTc3QzQ1MDlCNEZGNDk0MDU4MzUiLCJqdGkiOiJEMTA5RjI3ODhCNjBENjM5REQ2QUFDQzY4RkQ5NkM4MiJ9.ShuP9BjY1XaeelXgDL3UhBrfNHcCnSsuhGUbzvAPfT52nnHb1oOvd28gG27xLOcm0d7_vlZnRWw5k-lnuObgMoOmx8mttRrseTiI4GybqMWCvqFydzkEW-cN6MzmLWWQlkvNk8VtmDOlnMW4-tiMuh7T6swe-OHnQ-JsbePGINv611KnSvIAU6i_RhnSrocDqfYZgH2wZyjHg4tB9_lVIIQgw6kIHEIuGFgMFAf5r1wmWguvV_7Y2IYI6ae1nTHIQqpExXVxCQEf76tx2BmNDaHcU0i6TPIWbMvRFvmTQxGVL8CtjSLZLeIeolbBzQpUD9iyl4mdt3VFpFe9qu1_ug`,
  "accept-language": "en-US",
  "Content-Type": "multipart/form-data",
  "Access-Control-Allow-Method": "GET, POST, PUT, DELETE, OPTIONS",

  "Access-Control-Allow-Headers":
    "Access-Control-Allow-Origin,Content-Type, Authorization",
  Accept: "application/json",
    },
  });
};
export const GetFiles = () => {
  return http.get(`https://public-statics.okcs.com/browse/`, {
    headers: {
      Authorization: `bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBBNDMyMzQwRDg2QzkzNkZEMUVFNUFCNkM4Mzg5MkZFIiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwczovL2F1dGgub2tjcy5jb20iLCJuYmYiOjE3MzEzOTgxNzMsImlhdCI6MTczMTM5ODE3MywiZXhwIjoxNzMxNDAxNzczLCJhdWQiOlsiT0tQb3J0YWxOZXdzQXBpIiwiT0tQb3J0YWxOb3RpY2VBcGkiLCJPS1BvcnRhbExpbmtBcGkiLCJPS1BvcnRhbEFwcHJvdmFsQXBpIiwiT0tQb3J0YWxFdmVudEFwaSIsIk9LUG9ydGFsRGVwYXJ0bWVudEFwaSIsIk9LUG9ydGFsRXhwZXJpZW5jZUFwaSIsIk9LUG9ydGFsQWdncmVnYXRvckFkbWluIl0sInNjb3BlIjpbIm9wZW5pZCIsInJvbGVzIiwicHJvZmlsZSIsIk9LUG9ydGFsTmV3c0FwaSIsIk9LUG9ydGFsTm90aWNlQXBpIiwiT0tQb3J0YWxMaW5rQXBpIiwiT0tQb3J0YWxBcHByb3ZhbEFwaSIsIk9LUG9ydGFsRXZlbnRBcGkiLCJPS1BvcnRhbERlcGFydG1lbnRBcGkiLCJPS1BvcnRhbEV4cGVyaWVuY2VBcGkiLCJPS1BvcnRhbEFnZ3JlZ2F0b3JBZG1pbiJdLCJhbXIiOlsicHdkIl0sImNsaWVudF9pZCI6IkFkbWluV2ViQXBwQ2xpZW50Iiwic3ViIjoiMzliMzc5NmQtODhjYi00YmQ3LWE3N2ItYmUyNzc3M2NiOGNkIiwiYXV0aF90aW1lIjoxNzI4NzQwODE3LCJpZHAiOiJsb2NhbCIsIm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiLYp9it2YXYryIsImZhbWlseV9uYW1lIjoi2YTYtNqv2LHbjCDZgdix2K8iLCJyb2xlIjpbIkFkbWluaXN0cmF0b3IiLCJPQ1IgQWRtaW4iXSwic2lkIjoiQ0QwQkRGMDk3NDEyQTc3QzQ1MDlCNEZGNDk0MDU4MzUiLCJqdGkiOiJEMTA5RjI3ODhCNjBENjM5REQ2QUFDQzY4RkQ5NkM4MiJ9.ShuP9BjY1XaeelXgDL3UhBrfNHcCnSsuhGUbzvAPfT52nnHb1oOvd28gG27xLOcm0d7_vlZnRWw5k-lnuObgMoOmx8mttRrseTiI4GybqMWCvqFydzkEW-cN6MzmLWWQlkvNk8VtmDOlnMW4-tiMuh7T6swe-OHnQ-JsbePGINv611KnSvIAU6i_RhnSrocDqfYZgH2wZyjHg4tB9_lVIIQgw6kIHEIuGFgMFAf5r1wmWguvV_7Y2IYI6ae1nTHIQqpExXVxCQEf76tx2BmNDaHcU0i6TPIWbMvRFvmTQxGVL8CtjSLZLeIeolbBzQpUD9iyl4mdt3VFpFe9qu1_ug`,
  "accept-language": "en-US",
  "Content-Type": "multipart/form-data",
  "Access-Control-Allow-Method": "GET, POST, PUT, DELETE, OPTIONS",

  "Access-Control-Allow-Headers":
    "Access-Control-Allow-Origin,Content-Type, Authorization",
  Accept: "application/json",
    },
  });
};
export const GetDirectoryFiles = (directoryName:string) => {
  return http.get(
    `https://public-statics.okcs.com/${directoryName}/`,

    {
      headers: {
        Authorization: `bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiOTIwMzEzODYwIiwiZ2l2ZW5fbmFtZSI6Itiz24zYryDZhdit2YXYr9ix2LbYpyDZhduM2LHZgdiq2KfYrSIsInN1YiI6IjMiLCJyb2xlX25hbWUiOiLYp9iv2YXbjNmGINm-2LHYqtin2YQiLCJyb2xlIjpbIk9LU0MuREVQIiwiQWRtaW5pc3RyYXRvciJdLCJleHAiOjE3MzE1Njk5NzAsImlhdCI6MTczMTQ4MzU3MCwibmJmIjoxNzMxNDgzNTcwfQ.gEVqO6ZIAZogT0qeXrSiaXEd1Y2zFp_9BX3dGXYzLow`,
    "accept-language": "en-US",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Method": "GET, POST, PUT, DELETE, OPTIONS",
  
    "Access-Control-Allow-Headers":
      "Access-Control-Allow-Origin,Content-Type, Authorization",
    Accept: "application/json",
      },
    }
  );
};
