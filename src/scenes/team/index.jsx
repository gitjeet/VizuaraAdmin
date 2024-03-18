import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { database } from '../../components/firebase/firebaseConfig'
const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transformedData, setTransformedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = database.ref('submissions');
      const snapshot = await dbRef.once('value');
      const data = snapshot.val() || {};

      const newData = [];
      for (const schoolName in data) {
        if (data.hasOwnProperty(schoolName)) {
          const schoolSubmissions = data[schoolName];
          for (const date in schoolSubmissions) {
            if (schoolSubmissions.hasOwnProperty(date)) {
              const submissions = schoolSubmissions[date].map(submission => ({
                TeamName: submission.name || "",
                Images: submission.images || [],
                Videos: submission.videos || [],
                Feedback: submission.feedback || "",
                WeeksPortionsCovered: submission.weeksPortionsCovered || ""
              }));
              newData.push({
                SchoolName: schoolName,
                Date: date,
                Submissions: submissions
              });
            }
          }
        }
      }
      setTransformedData(newData);
    };
    fetchData();
  }, []);

  const columns = [
    { field: "SchoolName", headerName: "School Name", flex: 1 },
    { field: "Date", headerName: "Date", flex: 1 },
    { field: "TeamName", headerName: "Team Name", flex: 1 },
    { field: "Feedback", headerName: "Feedback", flex: 1 },
    { field: "WeeksPortionsCovered", headerName: "Weeks Portions Covered", flex: 1 },
  ];

  const rows = transformedData.flatMap((dataItem, index) => {
    return dataItem.Submissions.map((submission, subIndex) => ({
      id: `${index}-${subIndex}`,
      SchoolName: dataItem.SchoolName,
      Date: dataItem.Date,
      TeamName: submission.TeamName || "",
      Feedback: submission.Feedback || "",
      WeeksPortionsCovered: submission.WeeksPortionsCovered || "",
    }));
  });

  return (
<Box m="20px">
  <Header title="LIST" subtitle="Insights regarding schools" />
  {rows.length > 0 && (
    <Box
      m="40px 0 0 0"
      height="75vh"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .name-column--cell": {
          color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.greenAccent[200]} !important`,
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns.map(col => ({
          ...col,
          renderCell: (params) => {
            return (
              <Link
                to={`/information/${params.row.SchoolName}/${params.row.Date}`}
                style={{ color: 'inherit', textDecoration: 'inherit' }} // To maintain default link styles
              >
                {params.value}
              </Link>
            );
          }
        }))}
      />
    </Box>
  )}
</Box>
  );
};

export default Team;