import { connect } from "react-redux";
import CardList from "../components/CardList";
import { viewImage } from "../modules/annotator";

const mapDispatchToProps = (dispatch: any) => {
  return {
    viewImage: (url: string, title: string) => {
      dispatch(viewImage(url, title));
    },
  };
};

export default connect(null, mapDispatchToProps)(CardList);
