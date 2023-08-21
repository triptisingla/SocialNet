import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import { setProfiles } from "state";

const SearchPage = () => {
  let { name } = useParams();
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const profiles = useSelector((state) => state.profiles);

  const getProfiles = async () => {
    console.log(name);

    const response = await fetch(`http://localhost:3001/users/search/${name}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);
    dispatch(setProfiles({ profiles: data }));
  };

  useEffect(() => {
    console.log("in serach");
    getProfiles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Navbar />

      <Box m="2rem 25%">
        <Typography
          color={palette.neutral.dark}
          variant="h2"
          fontWeight="800"
          sx={{ mb: "1.5rem" }}
        >
          Searches for {name}
        </Typography>
        {profiles.length >0 ?(
            <Box display="flex" flexDirection="column" gap="1.5rem" >
          {profiles.map((profile) => (
            <Friend
              key={profile._id}
              friendId={profile._id}
              name={`${profile.firstName} ${profile.lastName}`}
              subtitle={profile.occupation}
              userPicturePath={profile.picturePath}
            />
          ))}
        </Box>)
        :
        (<Typography
          color={palette.neutral.dark}
          variant="h5"
          fontWeight="500"
          sx={{ mb: "1.5rem" }}
        >
          No users found with this name
        </Typography>)
        }
        
      </Box>
    </Box>
  );
};

export default SearchPage;
