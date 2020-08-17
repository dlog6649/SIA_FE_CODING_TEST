import { connect } from "react-redux";
import CardList from "../component/CardList";
import { viewImage } from "../modules/annotator/actions";

const mapDispatchToProps = (dispatch: any) => {
  return {
    viewImage: (url: string, title: string) => {
      dispatch(viewImage({ url: url, title: title }));
    },
  };
};

export default connect(null, mapDispatchToProps)(CardList);
