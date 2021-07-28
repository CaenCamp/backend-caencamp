import SpeakerIcon from "@material-ui/icons/RecordVoiceOver";
import WebSiteIcon from "@material-ui/icons/Language";
import { Button, Link } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import SpeakerCreate from "./Create";
import SpeakerEdit from "./Edit";
import SpeakerList from "./List";

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export const AddNewWebsiteButton = ({ record }) => {
  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      variant="contained"
      component={Link}
      to={{
        pathname: "/websites/create",
        state: { record: { speakerId: record.id } },
      }}
      label="Ajouter un site"
    >
      <WebSiteIcon />
    </Button>
  );
};

const speakers = {
  icon: SpeakerIcon,
  list: SpeakerList,
  edit: SpeakerEdit,
  create: SpeakerCreate,
};

export default speakers;
