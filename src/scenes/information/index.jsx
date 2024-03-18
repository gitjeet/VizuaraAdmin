import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import { useEffect, useState } from 'react';
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { database } from '../../components/firebase/firebaseConfig'
import { useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Information = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [schoolNames, setSchoolNames] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolDates, setSchoolDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false); // State to manage form submission
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [feedbackArray, setFeedbackArray] = useState([]);
  const [weeksPortionsCoveredArray, setWeeksPortionsCoveredArray] = useState([]);
  const [salesName, setSalesName] = useState([]);
  const { schoolname, datevisit } = useParams();
 
  // Decode URL-encoded schoolname
  const decodedSchoolName = decodeURIComponent(schoolname);

  useEffect(() => {
    // Fetch details based on the selected school and date after form submission
    setSchoolNames(decodedSchoolName)
    setSelectedDate(datevisit)

    const fetchDetails = async () => {
       
          console.log('hi')
            const dbRef = database.ref(`submissions/${decodedSchoolName}/${selectedDate}`);
            console.log(`submissions/${decodedSchoolName}/${selectedDate}`)
            try {
                const snapshot = await dbRef.once('value');
                console.log(snapshot.val())
                const data = snapshot.val();
                if (data) {
                    const promises = [];
                    // Loop through the list and fetch each item
                    for (let i = 0; i < data.length; i++) {
                        const itemRef = database.ref(`submissions/${decodedSchoolName}/${selectedDate}/${i}`);
                        promises.push(itemRef.once('value'));
                    }
                    const snapshots = await Promise.all(promises);
                    const details = snapshots.map(snapshot => snapshot.val());
                    console.log(snapshot.val())

                    // Process fetched details
                    const name = data.map(item => item.name).filter(names => names !== null);
                                     
                    // Process fetched details
                 const imagesArray = data.map(item => item.images).filter(images => images !== null);
const videosArray = data.map(item => item.videos).filter(videos => videos !== null);
setSalesName(prevState => [...prevState, ...name]);
setImages(prevState => [...prevState, ...imagesArray]);
setVideos(prevState => [...prevState, ...videosArray]);

const feedbackArray = details.map(item => item.feedback || '');
const weeksPortionsCoveredArray = details.map(item => item.weeksPortionsCovered || '');

// Update state with arrays
setFeedbackArray(prevState => [...prevState, ...feedbackArray]);
setWeeksPortionsCoveredArray(prevState => [...prevState, ...weeksPortionsCoveredArray]);

                }
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        }
    

    fetchDetails();
}, [ selectedSchool, selectedDate]);

  
return (
  <Box m="20px">
    {/* HEADER */}
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

      <Box>
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>
    </Box>

    {/* GRID & CHARTS */}
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="140px"
      gap="20px"
    >
      {/* ROW 1 */}

      {/* ROW 2 */}
      <Box
        gridColumn="span 12"
        gridRow="span 4"
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            mb={2}
          >
            Images
          </Typography>
        </Box>
        <Box height="400px" width={{ xs: '100%', md: '80%' }}>
          <Box textAlign="center">
            {images.length > 0 ? (
              <Carousel
                showThumbs={false}
                centerMode
                infiniteLoop
                responsive={[
                  { breakpoint: 600, settings: { centerMode: false } },
                ]}
              >
                {images.map((imageUrl, index) => (
                  <div key={index} style={{ margin: '0 10px', maxWidth: '100%' }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '10px' }}
                      />
                    ) : (
                      <p>No image added</p>
                    )}
                  </div>
                ))}
              </Carousel>
            ) : (
              <p>No images added</p>
            )}
          </Box>
        </Box>
      </Box>

      {/* ROW 3 */}
      <Box
        gridColumn="span 12"
        gridRow="span 4"
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            mb={2}
          >
            Videos
          </Typography>
        </Box>
        <Box height="400px" width={{ xs: '100%', md: '80%' }}>
          <Box textAlign="center">
            {videos.length > 0 ? (
              <Carousel
                showThumbs={false}
                centerMode
                infiniteLoop
                responsive={[
                  { breakpoint: 600, settings: { centerMode: false } },
                ]}
              >
                {videos.map((videoUrl, index) => (
                  <div key={index} style={{ margin: '0 10px', maxWidth: '100%' }}>
                    {videoUrl ? (
                      <video key={index} controls style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '10px' }}>
                        <source src={videoUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <p>No video added</p>
                    )}
                  </div>
                ))}
              </Carousel>
            ) : (
              <p>No videos added</p>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);
};

export default Information;
