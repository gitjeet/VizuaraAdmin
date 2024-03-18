import { Box, Button, TextField, MenuItem, Select, FormControl, InputLabel, Slider, Slide,Table,TableRow,TableBody,TableCell } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from 'react';

import { database } from '../../components/firebase/firebaseConfig'
import ImageGallery from "react-image-gallery";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const School = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
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
  
  

  const handleChange = (event) => {
    setSelectedSchool(event.target.value);
  };
  const handleFormSubmit = (values) => {
    console.log(values);
    setFormSubmitted(true); // Set form submission state to true
  };

  const handleChangeDate = (event) => {
    setSelectedDate(event.target.value);
  };
  useEffect(() => {
    // Fetch school names from Firebase Realtime Database
    const fetchSchoolNames = async () => {
      const dbRef = database.ref('submissions');
      try {
        const snapshot = await dbRef.once('value');
        const data = snapshot.val();
        console.log(JSON.stringify(data))
        if (data) {
          console.log(data)
          const names = Object.keys(data); // Assuming data is an object with school names
          console.log(names)
          setSchoolNames(names);

        }
      } catch (error) {
        console.error('Error fetching school names:', error);
      }
    };

    fetchSchoolNames();
  }, []);
  useEffect(() => {
    // Fetch dates for the selected school from Firebase Realtime Database
    const fetchSchoolDates = async () => {
      if (selectedSchool) {
        const dbRef = database.ref(`submissions/${selectedSchool}`);
        try {
          const snapshot = await dbRef.once('value');
          const data = snapshot.val();
          
          if (data) {
            const dates = Object.keys(data);
            setSchoolDates(dates);
          }
        } catch (error) {
          console.error('Error fetching school dates:', error);
        }
      }
    };

    fetchSchoolDates();
  }, [selectedSchool]);
  useEffect(() => {
    // Fetch details based on the selected school and date after form submission
    const fetchDetails = async () => {
        if (formSubmitted && selectedSchool && selectedDate) {
            const dbRef = database.ref(`submissions/${selectedSchool}/${selectedDate}`);
            try {
                const snapshot = await dbRef.once('value');
                const data = snapshot.val();
                if (data) {
                    const promises = [];
                    // Loop through the list and fetch each item
                    for (let i = 0; i < data.length; i++) {
                        const itemRef = database.ref(`submissions/${selectedSchool}/${selectedDate}/${i}`);
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
    };

    fetchDetails();
}, [formSubmitted, selectedSchool, selectedDate]);

  return (
    <>
      {!formSubmitted && (
        <Box m="20px">

          <Header title="SCHOOL DETAILS" subtitle="Provide following details to get schools insight" />

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,

              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns={{
                    xs: "repeat(1, minmax(0, 1fr))",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(4, minmax(0, 1fr))",
                  }}
                  sx={{ justifyContent: "center" }}
                >
                  <FormControl variant="filled">
                    <InputLabel id="demo-simple-select-filled-label">School</InputLabel>
                    <Select
                      fullWidth
                      variant="filled"
                      label="School Name"
                      value={selectedSchool}
                      onChange={handleChange}
                      InputLabelProps={{ style: { color: "white" } }}
                    >
                      <MenuItem value="">Select a School</MenuItem>
                      {schoolNames.map((schoolName, index) => (
                        <MenuItem key={index} value={schoolName}>
                          {schoolName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedSchool && (
                    <FormControl variant="filled">
                      <InputLabel id="date-label">Date</InputLabel>
                      <Select
                        fullWidth
                        variant="filled"
                        labelId="date-label"
                        value={selectedDate}
                        onChange={handleChangeDate}
                        InputLabelProps={{ style: { color: "white" } }}
                      >
                        {schoolDates.map((date, index) => (
                          <MenuItem key={index} value={date}>
                            {date}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <Box
                    display="flex"
                    justifyContent="left"
                    gridColumn={{ xs: "span 1", md: "span 4" }}
                  >
                    <Button
                      type="submit"
                      color="secondary"
                      onClick={handleFormSubmit}
                      variant="contained"
                      disabled={!selectedSchool || !selectedDate} // Disable button if either school or date is not selected
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </form>
            )}
          </Formik>

        </Box>
      )}

{formSubmitted && (
  <Box mt={4}>
    <Box textAlign="center" justifyContent="center" display="flex">
    <h1>{selectedSchool} Details</h1>
    </Box>
    <Box display="flex" flexDirection={{ base: 'column', lg: 'row', md: 'column' }} justifyContent="center" alignItems="flex-start">
  <Box textAlign="center" mr={4}>
    <h2>Images</h2>
    {images.length > 0 ? (
      <Carousel showThumbs={false} width={500}>
        {images.map((imageUrl, index) => (
          <div key={index} style={{ margin: '0 10px', maxWidth: '100%' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '10px' }}
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
  <Box textAlign="center">
    <h2>Videos</h2>
    {videos.length > 0 ? (
      <Carousel showThumbs={false} width={500}>
        {videos.map((videoUrl, index) => (
          <div key={index} style={{ margin: '0 10px', maxWidth: '100%' }}>
            {videoUrl ? (
              <video key={index} controls style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '10px' }}>
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


<Box mt={1} display="flex" flexDirection="column" justifyContent="center">
  <Box mr={4} ml={8} textAlign="left">
    <h2>Summary</h2>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontSize: '1rem' }}>Feedback</TableCell>
          <TableCell sx={{ fontSize: '1rem' }}>Weeks Portions Covered</TableCell>
          <TableCell sx={{ fontSize: '1rem' }}>Date Visit</TableCell>
          <TableCell sx={{ fontSize: '1rem' }}>Team Name</TableCell>
        </TableRow>
        {/* Render rows for each feedback and weeks portions covered */}
        {feedbackArray.map((feedback, index) => (
          <TableRow key={index}>
            <TableCell sx={{ fontSize: '1rem' }}>{feedback}</TableCell>
            <TableCell sx={{ fontSize: '1rem' }}>{weeksPortionsCoveredArray[index]}</TableCell>
                        <TableCell sx={{ fontSize: '1rem' }}>{selectedDate}</TableCell>
                        <TableCell sx={{ fontSize: '1rem' }}>{salesName[index]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
</Box>
  </Box>
)}

    </>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default School;
