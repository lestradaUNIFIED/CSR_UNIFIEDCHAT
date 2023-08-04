import { Box, Typography } from "@mui/material";
import PropTypes from 'prop-types';
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      {...other}
    >
      {+value === +index && (
        <Box>
          <Box>{children}</Box>
        </Box>
      )}
    </Box>
  );
};

export default TabPanel;
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}
